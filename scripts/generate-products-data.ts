// Build-time generator: reads organized-products/products-master.csv plus the image folders
// under public/products/ and writes data/products.ts as a plain static module (no runtime
// CSV parsing or filesystem access in the app).
//
// Re-runnable:  node scripts/generate-products-data.ts
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// Type-only import: erased at runtime by Node's type stripping, resolved by tsc via the
// bundler module resolution in tsconfig.json.
import type { Product, ProductColor } from "../types/product";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");
const CSV_PATH = path.join(repoRoot, "organized-products", "products-master.csv");
const PUBLIC_PRODUCTS_ROOT = path.join(repoRoot, "public", "products");
const OUT_PATH = path.join(repoRoot, "data", "products.ts");

const warnings: string[] = [];
const warn = (msg: string) => {
  warnings.push(msg);
  console.log(`  ⚠ WARNING: ${msg}`);
};

// ─── CSV ──────────────────────────────────────────────────────────────────────

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cur += '"'; i++; }
        else inQ = false;
      } else cur += ch;
    } else {
      if (ch === '"') inQ = true;
      else if (ch === ",") { row.push(cur); cur = ""; }
      else if (ch === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
      else if (ch !== "\r") cur += ch;
    }
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Numeric-aware filename order: 1.png, 2.jpeg, ... 10.png (not lexicographic). */
function compareImageNames(a: string, b: string): number {
  const na = Number((a.match(/^(\d+)/) || [])[1] ?? Number.NaN);
  const nb = Number((b.match(/^(\d+)/) || [])[1] ?? Number.NaN);
  if (Number.isFinite(na) && Number.isFinite(nb) && na !== nb) return na - nb;
  if (Number.isFinite(na) && !Number.isFinite(nb)) return -1;
  if (!Number.isFinite(na) && Number.isFinite(nb)) return 1;
  return a.localeCompare(b, undefined, { numeric: true });
}

/** Files to expose for a color, relative to the color folder. */
function listImages(dir: string, context: string, expectedCount: number): string[] {
  if (!fs.existsSync(dir)) {
    warn(`missing image folder ${path.relative(repoRoot, dir)} (${context})`);
    return [];
  }
  const files = fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isFile()).map((d) => d.name).sort(compareImageNames);
  if (files.length !== expectedCount) {
    warn(`image count mismatch in ${path.relative(repoRoot, dir)}: CSV says ${expectedCount}, disk has ${files.length} (${context})`);
  }
  for (const f of files) {
    if (!/^\d+\.[a-z0-9]+$/i.test(f)) warn(`unexpected image filename "${f}" in ${path.relative(repoRoot, dir)} (${context})`);
  }
  return files;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log("Generating data/products.ts");
console.log(`  CSV:    ${path.relative(repoRoot, CSV_PATH)}`);
console.log(`  Images: ${path.relative(repoRoot, PUBLIC_PRODUCTS_ROOT)}/`);

if (!fs.existsSync(CSV_PATH)) throw new Error(`CSV not found: ${CSV_PATH}`);

const table = parseCsv(fs.readFileSync(CSV_PATH, "utf-8"));
const header = table[0];
const col = (name: string): number => {
  const idx = header.indexOf(name);
  if (idx < 0) throw new Error(`CSV column not found: ${name}`);
  return idx;
};
const optionalCol = (name: string): number => header.indexOf(name);
const rows = table.slice(1).filter((r) => r[col("SKU")]?.trim());

// The Featured column is manual curation data, so a missing column only disables the homepage
// row (with a loud warning) instead of failing the whole generation.
const featuredCol = optionalCol("Featured");
if (featuredCol < 0) warn("CSV column \"Featured\" not found — all products will have featured: false");

// Product slugs: slugified ProductName, disambiguated with the SKU variant suffix when two
// rows in the same category would otherwise collide (e.g. EYE-061-B / EYE-061-C).
const slugByKey = new Map<string, string>();
const groups = new Map<string, string[][]>();
for (const r of rows) {
  const key = `${r[col("Category")].toLowerCase()}||${slugify(r[col("ProductName")])}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key)!.push(r);
}
for (const [key, group] of groups) {
  for (const r of group) {
    const base = slugify(r[col("ProductName")]);
    let slug = base;
    if (group.length > 1) {
      const variant = r[col("SKU")].match(/-([A-Z])$/);
      slug = `${base}-${variant ? variant[1].toLowerCase() : r[col("SourceFolderNumber")]}`;
    }
    if ([...slugByKey.values()].includes(slug)) warn(`duplicate product slug "${slug}" (${r[col("SKU")]}) — images will be shared`);
    slugByKey.set(r[col("SKU")], slug);
  }
}

const products: Product[] = [];
const seenCategories: string[] = [];

for (const r of rows) {
  const sku = r[col("SKU")];
  const category = r[col("Category")].toLowerCase();
  const productSlug = slugByKey.get(sku)!;
  if (!seenCategories.includes(category)) seenCategories.push(category);

  const names = r[col("Colors")].split("|");
  const slugs = r[col("ColorSlugs")].split("|");
  const codes = r[col("ShadeCode")] ? r[col("ShadeCode")].split("|") : [];
  const counts = r[col("ImageCountPerColor")].split("|").map((n) => Number(n));

  if (names.length !== slugs.length || names.length !== counts.length) {
    warn(`CSV column length mismatch for ${sku} (colors=${names.length}, slugs=${slugs.length}, counts=${counts.length})`);
  }
  if (codes.length > 0 && codes.length !== names.length) {
    warn(`CSV ShadeCode count (${codes.length}) does not match color count (${names.length}) for ${sku} — shade codes left empty`);
  }

  const colors: ProductColor[] = names.map((name, i) => {
    const colorSlug = slugs[i] ?? slugify(name);
    const dir = path.join(PUBLIC_PRODUCTS_ROOT, category, productSlug, colorSlug);
    const files = listImages(dir, `${sku} / ${name}`, Number.isFinite(counts[i]) ? counts[i] : 0);
    const color: ProductColor = {
      name,
      slug: colorSlug,
      images: files.map((f) => `/products/${category}/${productSlug}/${colorSlug}/${f}`),
    };
    if (codes.length === names.length && codes[i]) color.shadeCode = codes[i];
    return color;
  });

  const size = r[col("Size")]?.trim();
  products.push({
    id: sku,
    slug: productSlug,
    name: r[col("ProductName")],
    category,
    price: 0, // placeholder — real prices are filled in manually
    ...(size ? { size } : {}),
    isSetOrTool: r[col("IsSetOrTool")] === "TRUE",
    colors,
    defaultColor: colors[0]?.slug ?? "",
    needsReview: r[col("NeedsReview")] === "TRUE",
    featured: featuredCol >= 0 && r[featuredCol]?.toUpperCase() === "TRUE",
  });
}

const categories = seenCategories;

const banner = `// AUTO-GENERATED — do not edit by hand.
// Generated by scripts/generate-products-data.ts from organized-products/products-master.csv.
// Re-run \`node scripts/generate-products-data.ts\` after changing the CSV or the images in
// public/products/. Prices are placeholders (0) until filled in manually.
import type { Product } from "@/types/product";

`;

const contents =
  banner +
  `export const products: Product[] = ${JSON.stringify(products, null, 2)};\n\n` +
  `export const categories: string[] = ${JSON.stringify(categories)};\n`;

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, contents, "utf-8");

const colorCount = products.reduce((acc, p) => acc + p.colors.length, 0);
const imageCount = products.reduce((acc, p) => acc + p.colors.reduce((a, c) => a + c.images.length, 0), 0);
console.log(`\nWrote ${path.relative(repoRoot, OUT_PATH)}`);
console.log(`  products: ${products.length}`);
console.log(`  colors:   ${colorCount}`);
console.log(`  images:   ${imageCount}`);
console.log(`  categories: ${categories.join(", ")}`);
console.log(`  warnings: ${warnings.length}`);
