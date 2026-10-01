// Build-time asset optimizer for the product images under public/products/.
//
//   node scripts/optimize-images.ts            # resize + convert to .webp (skips existing .webp)
//   node scripts/optimize-images.ts --force    # re-encode everything, including existing .webp
//
// For every image: the longer side is capped at 1200px (nothing is upscaled), then the file is
// re-encoded as WebP (quality 80) in the same folder and the original PNG/JPEG is removed. The
// catalog generator reads extensions from disk, so re-run it afterwards:
//
//   node scripts/optimize-images.ts && node scripts/generate-products-data.ts
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");
const ROOT = path.join(repoRoot, "public", "products");

const MAX_SIDE = 1200;
const WEBP_QUALITY = 80;
const CONCURRENCY = 6;
const IMAGE_RE = /\.(png|jpe?g|webp)$/i;
const WEBP_RE = /\.webp$/i;
const FORCE = process.argv.includes("--force");

type Job = { src: string; rel: string; size: number };

function walk(dir: string, out: Job[] = []): Job[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && IMAGE_RE.test(entry.name)) {
      out.push({ src: full, rel: path.relative(repoRoot, full), size: fs.statSync(full).size });
    }
  }
  return out;
}

const mb = (bytes: number) => (bytes / 1024 / 1024).toFixed(1);

if (!fs.existsSync(ROOT)) throw new Error(`Image root not found: ${ROOT}`);

const jobs = walk(ROOT).sort((a, b) => a.rel.localeCompare(b.rel));
if (jobs.length === 0) throw new Error(`No images found under ${path.relative(repoRoot, ROOT)}`);

const beforeBytes = jobs.reduce((acc, j) => acc + j.size, 0);
const byExt = new Map<string, number>();
for (const j of jobs) {
  const ext = path.extname(j.src).toLowerCase();
  byExt.set(ext, (byExt.get(ext) ?? 0) + 1);
}

console.log(`Optimizing images under ${path.relative(repoRoot, ROOT)}/`);
console.log(`  files: ${jobs.length} (${mb(beforeBytes)} MB)`);
console.log(`  formats: ${[...byExt].map(([e, n]) => `${e}×${n}`).join(", ")}`);
console.log(`  target: longer side ≤ ${MAX_SIDE}px, WebP q${WEBP_QUALITY}${FORCE ? " (--force: re-encoding .webp too)" : ""}\n`);

const failures: { rel: string; error: string }[] = [];
const dimensions = { minW: Infinity, minH: Infinity, maxW: 0, maxH: 0, square: 0, oversize: 0 };
let processed = 0;
let skipped = 0;
let done = 0;
let afterBytes = 0;

async function convert(job: Job): Promise<void> {
  const outPath = path.join(path.dirname(job.src), path.basename(job.src).replace(IMAGE_RE, ".webp"));
  try {
    const input = sharp(job.src, { failOn: "none" });
    const meta = await input.metadata();
    const w = meta.width ?? 0;
    const h = meta.height ?? 0;
    dimensions.minW = Math.min(dimensions.minW, w);
    dimensions.minH = Math.min(dimensions.minH, h);
    dimensions.maxW = Math.max(dimensions.maxW, w);
    dimensions.maxH = Math.max(dimensions.maxH, h);
    if (w === h) dimensions.square++;
    if (Math.max(w, h) > MAX_SIDE) dimensions.oversize++;

    // `rotate()` bakes in EXIF orientation; `withoutEnlargement` keeps small images as-is.
    const buffer = await input
      .rotate()
      .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    if (outPath === job.src) {
      // Already a .webp (only reachable with --force): replace atomically.
      const tmp = `${outPath}.tmp`;
      await fs.promises.writeFile(tmp, buffer);
      await fs.promises.rename(tmp, outPath);
    } else {
      await fs.promises.writeFile(outPath, buffer);
      await fs.promises.unlink(job.src);
    }
    afterBytes += buffer.length;
    processed++;
  } catch (error) {
    failures.push({ rel: job.rel, error: error instanceof Error ? error.message : String(error) });
    afterBytes += job.size; // count the untouched original so the totals stay honest
  } finally {
    done++;
    if (done % 50 === 0 || done === jobs.length) {
      console.log(`  … ${done}/${jobs.length} (${mb(afterBytes)} MB written)`);
    }
  }
}

// Simple worker pool so we don't open hundreds of image handles at once.
let cursor = 0;
await Promise.all(
  Array.from({ length: Math.min(CONCURRENCY, jobs.length) }, async () => {
    while (cursor < jobs.length) {
      const job = jobs[cursor++];
      if (WEBP_RE.test(job.src) && !FORCE) {
        skipped++;
        afterBytes += job.size;
        done++;
        continue;
      }
      await convert(job);
    }
  })
);

// Re-walk the folder so the check reflects what is actually on disk now.
const remaining = walk(ROOT).filter((j) => !WEBP_RE.test(j.src)).length;

console.log(`\n─── Optimize summary ───────────────────────────────────────`);
console.log(`  processed: ${processed}`);
console.log(`  skipped (already .webp): ${skipped}`);
console.log(`  failed:    ${failures.length}`);
console.log(`  source geometry: ${dimensions.minW}×${dimensions.minH} … ${dimensions.maxW}×${dimensions.maxH}`);
console.log(`    square: ${dimensions.square}/${jobs.length}, longer side > ${MAX_SIDE}px: ${dimensions.oversize}`);
console.log(`  size: ${mb(beforeBytes)} MB → ${mb(afterBytes)} MB (${Math.round((1 - afterBytes / beforeBytes) * 100)}% smaller)`);
console.log(`  non-webp files left on disk: ${remaining}`);

if (failures.length > 0) {
  console.log(`\n  FAILURES:`);
  for (const f of failures.slice(0, 20)) console.log(`    ${f.rel}: ${f.error}`);
  if (failures.length > 20) console.log(`    … and ${failures.length - 20} more`);
  process.exitCode = 1;
} else if (remaining > 0) {
  console.log(`\n  ✗ ${remaining} file(s) are still not .webp — rerun without --force to finish them.`);
  process.exitCode = 1;
} else {
  console.log(`\n  ✓ Every image under public/products/ is now .webp.`);
}
