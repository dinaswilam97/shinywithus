// One-off (but re-runnable) data migration: adds a `Featured` column to
// organized-products/products-master.csv so products can be curated onto the homepage.
//
//   node scripts/add-featured-column.ts
//
// Every existing row gets FALSE; flip individual rows to TRUE by hand afterwards. The script is
// idempotent: if the column already exists it prints the current TRUE count and does nothing.
//
// NOTE: re-running `node scripts/organize-products.ts` rewrites products-master.csv from scratch
// and would drop this column — run this script again afterwards.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.resolve(here, "..", "organized-products", "products-master.csv");
const COLUMN = "Featured";

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

function escapeCsv(s: string): string {
  if (s.includes(",") || s.includes('"') || s.includes("\n")) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

const table = parseCsv(fs.readFileSync(CSV_PATH, "utf-8"));
const header = table[0];
const existing = header.indexOf(COLUMN);

if (existing >= 0) {
  const trueCount = table.slice(1).filter((r) => r[existing]?.toUpperCase() === "TRUE").length;
  console.log(`"${COLUMN}" column already present in ${path.relative(process.cwd(), CSV_PATH)} — ${trueCount} product(s) featured. Nothing to do.`);
} else {
  header.push(COLUMN);
  const rows = table.slice(1).filter((r) => r.some((c) => c.trim() !== ""));
  for (const row of rows) row.push("FALSE");
  const out = [header, ...rows].map((r) => r.map(escapeCsv).join(",")).join("\n") + "\n";
  fs.writeFileSync(CSV_PATH, out, "utf-8");
  console.log(`Added "${COLUMN}" column (FALSE) to ${rows.length} rows in ${path.relative(process.cwd(), CSV_PATH)}.`);
  console.log(`Flip rows to TRUE to curate the homepage, then re-run: node scripts/generate-products-data.ts`);
}
