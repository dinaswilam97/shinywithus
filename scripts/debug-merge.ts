// Debug harness: replicate Phase 2 cleaning for a given folder, run tryMerge, dump internals.
import fs from "node:fs";
import path from "node:path";
// @ts-expect-error — Node 24 strips types and needs the .ts extension; TS wants allowImportingTsExtensions for it.
import { tryMerge } from "./organize-products.ts";

const RAW_SOURCE_ROOT = "E:\\Ai\\shinywithus\\shinywithus\\Products";

// -- copied cleaning helpers (keep in sync with organize-products.ts) --
const BOILERPLATE_RE = /\s+brand\s+beauty\s+cosmeti+c?k?\s+makeup\s+for\s+women\s+and\s+girls\s*$/i;
const SIZE_RE = /(\d+(?:\.\d+)?)\s?(ml|g|gr|kg|l|oz)\b/gi;

function isAllCaps(s: string): boolean {
  let upper = 0, lower = 0;
  for (const ch of s) { if (/[A-Z]/.test(ch)) upper++; else if (/[a-z]/.test(ch)) lower++; }
  return upper > 0 && lower === 0;
}
function toTitleCase(s: string): string {
  return s.replace(/\S+/g, (w) => /^\d/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}
function stripBoilerplate(raw: string): { cleaned: string; hadBoilerplate: boolean } {
  const match = raw.match(BOILERPLATE_RE);
  const hadBoilerplate = !!match;
  let cleaned = hadBoilerplate ? raw.slice(0, match!.index!).trim() : raw.trim();
  cleaned = cleaned.replace(/[-\s]+$/, "").trim();
  return { cleaned, hadBoilerplate };
}
function extractSize(text: string): { size: string; cleaned: string } {
  const matches = [...text.matchAll(SIZE_RE)].filter((m) => m[2].toLowerCase() !== "pcs" && m[2].toLowerCase() !== "pc");
  if (matches.length > 0) {
    const m = matches[0];
    return { size: m[0].trim(), cleaned: text.replace(m[0], " ").replace(/\s+/g, " ").trim() };
  }
  return { size: "", cleaned: text };
}
function stripTrailingZero(s: string): string {
  return s.replace(/\s+0$/, "").trim();
}

const category = process.argv[2] || "lips";
const folderNumber = process.argv[3] || "1";

const catDir = path.join(RAW_SOURCE_ROOT, category);
const numDir = path.join(catDir, folderNumber);
const productFolders = fs.readdirSync(numDir, { withFileTypes: true })
  .filter(d => d.isDirectory()).map(d => d.name);

const items = productFolders.map((name) => {
  const { cleaned: c1 } = stripBoilerplate(name);
  let cleanedName = c1;
  if (isAllCaps(cleanedName)) cleanedName = toTitleCase(cleanedName);
  const { cleaned: c2 } = extractSize(cleanedName);
  cleanedName = stripTrailingZero(c2);
  const compact = cleanedName.replace(/\s*-\s*/g, "-");
  return {
    wordsCompact: compact.split(/\s+/).filter(Boolean),
    cleanedDisplay: cleanedName,
    cleanedCompact: compact,
    originalName: name,
    idx: 0,
  };
});
items.forEach((it, i) => { it.idx = i; });

console.log(`--- ${category}/${folderNumber}: ${items.length} items ---`);
for (const it of items) {
  console.log(`  [${it.idx}] display: ${it.cleanedDisplay}`);
  console.log(`       compact: ${it.cleanedCompact}`);
  console.log(`       words:   ${JSON.stringify(it.wordsCompact)}`);
}

const result = tryMerge(items);
console.log(`\nmerged=${result.merged}, products=${result.products.length}`);
for (const p of result.products) {
  console.log(`  * ProductName: ${p.productName}`);
  console.log(`    colors: ${p.colors.map(c => c.color).join("|")}`);
  console.log(`    needsReview: ${p.needsReview}`);
}
