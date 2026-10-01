// Sanity check: every image path emitted in data/products.ts must exist under public/.
//
//   node scripts/verify-product-images.ts
//
// Exits 1 (and prints the offenders) when a path is missing, a non-.webp image is still
// referenced, or a path is listed twice. Run after scripts/generate-products-data.ts.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");
const DATA_PATH = path.join(repoRoot, "data", "products.ts");

const text = fs.readFileSync(DATA_PATH, "utf-8");
const paths = [...text.matchAll(/"(\/products\/[^"]+)"/g)].map((m) => m[1]);
const unique = new Set(paths);

const missing: string[] = [];
const notWebp: string[] = [];
const duplicates: string[] = [];
const seen = new Set<string>();
for (const p of paths) {
  if (seen.has(p)) duplicates.push(p);
  seen.add(p);
  if (!p.toLowerCase().endsWith(".webp")) notWebp.push(p);
  if (!fs.existsSync(path.join(repoRoot, "public", p.replace(/^\/+/, "")))) missing.push(p);
}

console.log(`Image references in ${path.relative(repoRoot, DATA_PATH)}: ${paths.length} (${unique.size} unique)`);
console.log(`  missing on disk: ${missing.length}`);
console.log(`  non-webp:        ${notWebp.length}`);
console.log(`  duplicates:      ${duplicates.length}`);

for (const label of ["missing on disk", "non-webp", "duplicate"] as const) {
  const list = label === "missing on disk" ? missing : label === "non-webp" ? notWebp : duplicates;
  for (const p of list.slice(0, 10)) console.log(`    ✗ ${label}: ${p}`);
}

if (missing.length || notWebp.length || duplicates.length) process.exitCode = 1;
else console.log(`  ✓ every referenced image exists and is .webp`);
