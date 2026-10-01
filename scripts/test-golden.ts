// Golden-file regression test for the product merge pipeline.
//
// Runs the exact production pipeline (Phases 1-3 in organize-products.ts) against the raw
// folders and asserts every manually verified SKU family still produces the same products.
// On mismatch it prints expected vs actual per differing field.
//
// Usage: node scripts/test-golden.ts   (or: npm run test:golden)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
// @ts-expect-error — Node 24 strips types and needs the .ts extension; TS wants allowImportingTsExtensions for it.
import { runMergePass } from "./organize-products.ts";

interface GoldenProduct {
  sku: string;
  productName: string;
  colors: string[];
  shadeCodes: string[];
  needsReview: boolean;
  reviewNote?: string;
}

interface GoldenCase {
  id: string;
  category: string;
  folderNumber: string;
  products: GoldenProduct[];
}

interface ActualProduct {
  sku: string;
  productName: string;
  colors: string[];
  shadeCodes: string[];
  needsReview: boolean;
  reviewNote?: string;
}

const here = path.dirname(fileURLToPath(import.meta.url));
const cases: GoldenCase[] = JSON.parse(fs.readFileSync(path.join(here, "golden-cases.json"), "utf-8"));

// Only run the folders the golden file covers; merge behaviour is per-folder, so the
// result is identical to a full run but much faster.
const folderKeys = [...new Set(cases.map((c) => `${c.category}||${c.folderNumber}`))];
const { products } = runMergePass({ folderKeys, quiet: true });

const actualByFolder = new Map<string, ActualProduct[]>();
for (const p of products) {
  const key = `${p.category}||${p.sourceFolderNumber}`;
  const view: ActualProduct = {
    sku: p.sku,
    productName: p.productName,
    colors: p.colorVariants.map((cv) => cv.color),
    shadeCodes: p.colorVariants.map((cv) => cv.shadeCode).filter(Boolean),
    needsReview: p.needsReview,
    reviewNote: p.reviewNote,
  };
  const list = actualByFolder.get(key) || [];
  list.push(view);
  actualByFolder.set(key, list);
}

const fmt = (v: unknown) => JSON.stringify(v);

let failures = 0;
let checkedProducts = 0;

for (const c of cases) {
  const key = `${c.category}||${c.folderNumber}`;
  const expected = c.products;
  const actual = actualByFolder.get(key) || [];
  const problems: string[] = [];

  if (actual.length !== expected.length) {
    problems.push(`  product count: expected ${expected.length}, got ${actual.length}`);
  }
  const n = Math.max(actual.length, expected.length);
  for (let i = 0; i < n; i++) {
    const e = expected[i];
    const a = actual[i];
    if (!e) { problems.push(`  extra product [${i}]: ${a.sku} "${a.productName}"`); continue; }
    if (!a) { problems.push(`  missing product [${i}]: ${e.sku} "${e.productName}"`); continue; }
    checkedProducts++;
    for (const field of ["sku", "productName", "needsReview"] as const) {
      if (e[field] !== a[field]) problems.push(`  [${i}] ${field}:\n      expected: ${fmt(e[field])}\n      actual:   ${fmt(a[field])}`);
    }
    if (e.colors.join(" | ") !== a.colors.join(" | ")) {
      problems.push(`  [${i}] ${e.sku} colors:\n      expected: ${e.colors.join(" | ")}\n      actual:   ${a.colors.join(" | ")}`);
    }
    if (e.shadeCodes.join(" | ") !== a.shadeCodes.join(" | ")) {
      problems.push(`  [${i}] ${e.sku} shadeCodes:\n      expected: ${e.shadeCodes.join(" | ")}\n      actual:   ${a.shadeCodes.join(" | ")}`);
    }
    if ((e.reviewNote ?? null) !== (a.reviewNote ?? null)) {
      problems.push(`  [${i}] ${e.sku} reviewNote:\n      expected: ${fmt(e.reviewNote ?? null)}\n      actual:   ${fmt(a.reviewNote ?? null)}`);
    }
  }

  if (problems.length === 0) {
    const colorCount = expected.reduce((acc, p) => acc + p.colors.length, 0);
    console.log(`✓ ${c.id} (${expected.length} product${expected.length === 1 ? "" : "s"}, ${colorCount} colors)`);
  } else {
    failures++;
    console.log(`✗ ${c.id} (${c.category}/${c.folderNumber})`);
    for (const p of problems) console.log(p);
  }
}

console.log();
if (failures === 0) {
  console.log(`All ${cases.length} golden cases passed (${checkedProducts} products checked).`);
} else {
  console.log(`${failures} of ${cases.length} golden cases FAILED.`);
  process.exitCode = 1;
}
