import fs from "node:fs";

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

const target = process.argv[2] || "organized-products/products-master.csv";
const rows = parseCsv(fs.readFileSync(target, "utf-8"));
const header = rows[0];
const idx = (n: string) => header.indexOf(n);

const wanted = /^LIP-(072|060|053|084|091|001|014)(-|$)|^EYE-(004|048|061)(-|$)|^FAC-024(-|$)/;
for (const r of rows.slice(1)) {
  if (wanted.test(r[idx("SKU")])) {
    console.log(`SKU=${r[idx("SKU")]}`);
    console.log(`  ProductName=${r[idx("ProductName")]}`);
    console.log(`  Colors=${r[idx("Colors")]}`);
    console.log(`  NeedsReview=${r[idx("NeedsReview")]}`);
    console.log(`  ShadeCode=${r[idx("ShadeCode")]}`);
  }
}
