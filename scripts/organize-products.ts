import fs from "node:fs";
import path from "node:path";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const RAW_SOURCE_ROOT = "E:\\Ai\\shinywithus\\shinywithus\\Products";
const OUTPUT_ROOT = "E:\\Ai\\shinywithus\\shinywithus\\organized-products";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const BOILERPLATE_RE = /\s+brand\s+beauty\s+cosmeti+c?k?\s+makeup\s+for\s+women\s+and\s+girls\s*$/i;
const SIZE_RE = /(\d+(?:\.\d+)?)\s?(ml|g|gr|kg|l|oz)\b/gi;
const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif"]);
const CAT_CODES: Record<string, string> = { eyes: "EYE", face: "FAC", lips: "LIP", hair: "HAI" };
const BRAND_WORD = "sheglam";
const FILLER_PHRASES = ["lip combo", "brow pomade", "kohl kajal henna", "henna"];
const TRAILING_DESCRIPTORS = [
  "long-lasting lightweight powder blusher stick",
  "2-in-1 long-lasting combo liquid lipstick lip liner",
  "long-lasting lipstick smooth matte tint",
  "lip pencil lipstick to define lips smooth matte tint long lasting transfer proof smudge proof high pigment 2-in-1 combo multi-use",
  "long lasting lip care",
];
const FINISH_WORDS = new Set(["shimmer","shine","matte","gloss","satin","velvet","silk","creamy","liquid","cream","powder","gel","sheer","long","lasting","waterproof","washable","transfer","proof","smudge","high","pigment","volumizing","nourishing","hydrating","longwear","multi","function","in"]);
const COLOR_WORDS = new Set(["black","white","red","pink","blue","green","brown","beige","nude","taupe","coral","mauve","plum","berry","peach","apricot","rose","wine","burgundy","violet","lavender","mint","teal","gold","golden","silver","bronze","copper","ivory","cream","frost","honey","caramel","chocolate","espresso","almond","mocha","macchiato","cinnamon","ginger","cocoa","fudge","sangria","melon","cherry","strawberry","blueberry","raspberry","fig","papaya","mango","watermelon","peachy","cashew","taro","bubblegum","candy","sugar","vanilla","toffee","butterscotch","dulce","latte","ruby","garnet","onyx","obsidian","amethyst","emerald","sapphire","topaz","opal","pearl","crystal","dusty","blush","flame","ember","olive","charcoal","slate","ash","iron","steel","chrome","fuchsia","magenta","salmon","sienna","ochre","umber","sepia","periwinkle","cobalt","azure","navy","indigo","cyan","carmine","cerise","cerulean","maroon","crimson","scarlet","camel","sand","dune","clay","terracotta","brick","rust","lilac","orchid","pine","forest","sage","moss","jade","lime","snow","porcelain","alabaster","ecru","shadow","smoke","graphite","jet","coal","night","heart","cake","rush","glow","bloom","kiss","dream","bliss","hush","truffle","praline","macaron","glaze","mousse","butter","milk","shake","tea","coffee","bonbon","brulee","crush","cherish","beloved","passion","flirt","seduce","allure","romance","desire","fantasy","enchant","spell","magic","charm","glam","diva","queen","star","vogue","chic","noir","luxe","desert","hues","wonder","sweet","pop","snap","crackle","fizz","sparkle","radiance","luminous","ethereal","divine","heavenly","angelic","dark","bright","deep","soft","warm","cool","hot","light","pale","true","real","pure","raw","rich","intense","vivid","bold","first","last","new","old","original","classic","modern","amortentia","felix","felicis","polyjuice","draught","potion","smitten","kitten","letter","brisk","babe","express","cottage","core","garden","blushing","bouquet","enamored","private","cabana","vienna","tropez","seville","encore","energy","gotcha","stronger","type","plot","twist","rule","breaker","brownie","promise","pinky","points","bare","stack","petal","by","book","case","judgey","play","fair","slay","dream","date","involved","pinkies","winks","mocha","cream","butter","cookie","almond","toasted","papaya","fig"]);
const PRODUCT_TYPE_WORDS = new Set(["concealer","lipstick","liner","mascara","eyeshadow","palette","foundation","blush","highlighter","contour","primer","serum","powder","pencil","balm","tint","gloss","stain","crayon","remover","sharpener","curler","spray","mist","oil","plumper","polish","conditioner","shampoo","lotion","cream","brush","tool","razor","sponge","applicator","puff","stamp"]);
const TRAILING_PRODUCT_WORDS = ["lip combo","brow pomade","kohl kajal henna","henna","lip liner","lipstick","lip gloss","lip balm","lip stain","lip oil","lip pencil","lip crayon","lip tint","lip plumper","lip lacquer","lip glaze","lip mask","lip care","lip gel","eyeliner","eyebrow","eyeshadow","mascara","lash","blush","highlighter","contour","bronzer","foundation","concealer","primer","powder","liner","pencil","crayon","stain","duo","trio","set","palette","stick","pen","brush","puff","stamp"];
const STOP_WORDS = new Set(["x","and","the","of","for","in","to","a","an","is","it","with","on","at","by","or","be","as","no","not","do","so","if","up","but","how","what","all","can","her","one","our","out","are","was","been","has","had","did","get","got","let","may","new","now","old","see","way","who","boy","few","hit","hot","job","run","set","top","two","use","big","day","end","far","low","put","say","she","too"]);

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function slugify(s: string): string {
  return s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function escapeCsv(s: string): string {
  if (s.includes(",") || s.includes('"') || s.includes("\n")) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

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

function normalizeForCompare(s: string): string {
  return s.toLowerCase().replace(/[\u2122™®©]/g, "").replace(/['']/g, "'").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

interface MergePiece { norm: string; start: number; end: number; }

function normalizePieceText(text: string): string {
  return text.toLowerCase().replace(/[\u2122™®©]/g, "").replace(/[^a-z0-9&]/g, "");
}

// Split a name into comparison pieces. Each word is further split at dashes and at
// letter<->digit boundaries ("Duo-Berry" -> [Duo, Berry], "Gloss40" -> [Gloss, 40]).
// Character offsets are kept so original text can be sliced back out at any piece boundary.
function buildPieces(text: string): MergePiece[] {
  const pieces: MergePiece[] = [];
  const wordRe = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = wordRe.exec(text))) {
    const word = m[0];
    const wordStart = m.index;
    let segStart = 0;
    const flush = (end: number) => {
      if (end <= segStart) return;
      const seg = word.slice(segStart, end);
      const norm = normalizePieceText(seg);
      if (norm) pieces.push({ norm, start: wordStart + segStart, end: wordStart + end });
    };
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      const prev = i > 0 ? word[i - 1] : "";
      const isBoundary = ch === "-" || (prev !== "" && ((/[a-z]/i.test(prev) && /[0-9]/.test(ch)) || (/[0-9]/.test(prev) && /[a-z]/i.test(ch))));
      if (isBoundary) { flush(i); segStart = i + 1; }
    }
    flush(word.length);
  }
  return pieces;
}

const BASE_HINT_WORDS = new Set<string>([
  ...PRODUCT_TYPE_WORDS,
  ...TRAILING_PRODUCT_WORDS.flatMap((p) => p.split(/\s+/)),
]);

// True when the text contains a product-type word, i.e. it looks like product-name
// text rather than a shade ("Longwear ... Gel Liner" vs "Cinna-Swirl").
function hasBaseHint(text: string): boolean {
  for (const word of text.toLowerCase().split(/\s+/)) {
    for (const sub of word.split(/[^a-z0-9]+/).filter(Boolean)) {
      if (BASE_HINT_WORDS.has(sub)) return true;
    }
  }
  return false;
}

// Shade-like text: no product-type words (unless the word is also a color, e.g. "Blush Whip")
// and matching the existing color heuristics.
function isValidShade(text: string): boolean {
  const t = text.trim().replace(/^[\s-]+|[\s-]+$/g, "");
  if (!t) return false;
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length === 0 || words.length > 8) return false;
  for (const w of words) {
    for (const sub of w.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)) {
      if (PRODUCT_TYPE_WORDS.has(sub) && !COLOR_WORDS.has(sub)) return false;
    }
  }
  return isValidColorName(t);
}

type TailSplit =
  | { kind: "explicit"; groupKey: string; shade: string; baseEnd: number }
  | { kind: "plain"; shade: string }
  | null;

// Decide how a name continues after the shared product-name prefix.
// 1. A leading 3-4 digit code (incl. zero-padded) means the whole tail is the shade.
// 2. Otherwise use the first dash whose left side looks like product-name text and whose
//    right side is a valid shade, so hyphenated shades ("Cinna-Swirl") stay intact.
// 3. With no separator, the whole tail is a shade when it is shade-like.
function splitTail(core: string, tailStart: number): TailSplit {
  const raw = core.slice(tailStart);
  const leadMatch = raw.match(/^[\s-]+/);
  const lead = leadMatch ? leadMatch[0].length : 0;
  const abs = tailStart + lead;
  const tail = raw.slice(lead);
  if (!tail) return null;
  if (/^(?:\d{3,4}|0\d)[\s-]/.test(tail)) return { kind: "plain", shade: tail };
  for (let d = 1; d < tail.length; d++) {
    if (tail[d] !== "-") continue;
    const pre = tail.slice(0, d).replace(/[\s-]+$/, "");
    const shade = tail.slice(d + 1).replace(/^[\s-]+|[\s-]+$/g, "");
    if (!pre || !shade) continue;
    if (!hasBaseHint(pre)) continue;
    if (!isValidShade(shade)) continue;
    return { kind: "explicit", groupKey: normalizeForCompare(pre), shade, baseEnd: abs + d };
  }
  if (isValidShade(tail)) return { kind: "plain", shade: tail };
  return null;
}

function commonSuffixPieces(lists: MergePiece[][]): number {
  if (lists.length === 0) return 0;
  const minLen = Math.min(...lists.map((p) => p.length));
  let n = 0;
  while (n < minLen) {
    const norm = lists[0][lists[0].length - 1 - n].norm;
    if (!lists.every((p) => p[p.length - 1 - n].norm === norm)) break;
    n++;
  }
  return n;
}

function pickMostCommon(values: string[]): string {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) || 0) + 1);
  let best = values[0] ?? "";
  let bestCount = 0;
  for (const v of values) {
    const c = counts.get(v)!;
    if (c > bestCount) { best = v; bestCount = c; }
  }
  return best;
}

function stripFillerFromEnd(text: string): string {
  let result = text;
  for (const phrase of FILLER_PHRASES) {
    const re = new RegExp(`\\s+${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
    result = result.replace(re, "").trim();
  }
  return result;
}

function stripTrailingDescriptors(text: string): string {
  let result = text;
  for (const desc of TRAILING_DESCRIPTORS) {
    const re = new RegExp(`\\s+${desc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
    result = result.replace(re, "").trim();
  }
  return result;
}

function stripTrailingProductWords(text: string): string {
  let result = text;
  for (const pw of TRAILING_PRODUCT_WORDS) {
    const escaped = pw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(?:\\s*[-]?\\s*|\\s+)${escaped}$`, "i");
    result = result.replace(re, "").trim();
  }
  return result;
}

function aggressivelyStripShade(text: string): string {
  let result = text;
  result = stripFillerFromEnd(result);
  result = stripTrailingProductWords(result);
  let changed = true;
  while (changed) {
    changed = false;
    const words = result.split(/\s+/).filter(Boolean);
    if (words.length <= 1) break;
    const last = words[words.length - 1].toLowerCase().replace(/[^a-z0-9]/g, "");
    const lw = last.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
    if (COLOR_WORDS.has(lw)) break; // never strip a legitimate shade word (e.g. "Mocha Cream")
    if (PRODUCT_TYPE_WORDS.has(lw) || FINISH_WORDS.has(lw) || STOP_WORDS.has(lw) ||
        /^(?:2[-]?in[-]?1|combo|lightweight|defined|define|smooth|matte|tint|multi|use|high|pigment|transfer|proof|smudge|long|lasting|kajal|henna|kohl)$/i.test(lw)) {
      words.pop();
      result = words.join(" ").trim();
      changed = true;
    }
  }
  return result;
}

function isValidColorName(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  const cleaned = t.replace(/^[-\s]+|[-\s]+$/g, "").trim();
  if (!cleaned) return false;
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length > 8) return false;
  if (/^\d{1,4}[\s\-]/.test(cleaned)) return true;
  for (const w of words) {
    const lw = w.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
    if (COLOR_WORDS.has(lw)) return true;
  }
  if (words.length <= 2 && cleaned.length <= 25) {
    for (const w of words) {
      const lw = w.toLowerCase().replace(/[^a-z]/g, "");
      if (PRODUCT_TYPE_WORDS.has(lw)) return false;
    }
    return true;
  }
  return false;
}

function finalizeShade(raw: string): { color: string; shadeCode: string } {
  let text = raw.replace(/^[\s-]+|[\s-]+$/g, "").trim();
  text = stripFillerFromEnd(text);
  text = stripTrailingDescriptors(text);
  text = stripTrailingProductWords(text);
  let shadeCode = "";
  const sc = extractShadeCode(text);
  if (sc) { shadeCode = sc.code; text = sc.color; }
  text = aggressivelyStripShade(text);
  text = stripTrailingZero(text);
  if (text && !/[A-Z]/.test(text)) text = toTitleCase(text);
  return { color: text, shadeCode };
}

function extractSize(text: string): { size: string; cleaned: string } {
  const matches = [...text.matchAll(SIZE_RE)].filter((m) => m[2].toLowerCase() !== "pcs" && m[2].toLowerCase() !== "pc");
  if (matches.length > 0) {
    const m = matches[0];
    return { size: m[0].trim(), cleaned: text.replace(m[0], " ").replace(/\s+/g, " ").trim() };
  }
  return { size: "", cleaned: text };
}

function extractShadeCode(text: string): { code: string; color: string } | null {
  // Shade codes in this dataset are 3-4 digits (often zero-padded, e.g. "083"). A 1-2 digit
  // number without a leading zero is part of the shade name itself (e.g. "40 Winks").
  const m = text.match(/^(?:\d{3,4}|0\d)[\s\-]+(.+)/);
  if (m) return { code: m[0].match(/^\d+/)![0], color: m[1].trim() };
  return null;
}

function stripTrailingZero(s: string): string {
  return s.replace(/\s+0$/, "").trim();
}

function makeFolderNameUnique(dir: string, name: string, used: Map<string, number>): string {
  const key = path.join(dir, name).toLowerCase();
  const count = used.get(key) || 0;
  used.set(key, count + 1);
  if (count === 0) return name;
  return `${name}-${count + 1}`;
}

// ─── CORE MERGE ALGORITHM ─────────────────────────────────────────────────────

export interface MergeResult {
  merged: boolean;
  products: Array<{
    productName: string;
    fullOriginalName: string;
    colors: Array<{ color: string; colorSlug: string; shadeCode: string; itemIdx: number }>;
    needsReview: boolean;
  }>;
}

export function tryMerge(
  items: Array<{ wordsCompact: string[]; cleanedDisplay: string; cleanedCompact: string; originalName: string; idx: number }>
): MergeResult {
  const standaloneAll = (): MergeResult => ({
    merged: false,
    products: items.map((item) => ({
      productName: item.cleanedDisplay,
      fullOriginalName: item.originalName,
      colors: [{ color: "default", colorSlug: "default", shadeCode: "", itemIdx: item.idx }],
      needsReview: false,
    })),
  });

  if (items.length <= 1) return standaloneAll();

  const DEBUG = !!process.env.DEBUG_MERGE;

  // Stage A: strip filler phrases / trailing marketing descriptors from the end of every
  // name (raw folders carry long tails after the shade).
  const cores = items.map((item) => {
    let c = item.cleanedCompact;
    c = stripFillerFromEnd(c);
    c = stripTrailingDescriptors(c);
    return c.trim();
  });

  // Stage B: compute the shared product-name prefix once for the whole folder, then split
  // every item at that same point instead of re-detecting a split per item.
  const pieceLists = cores.map(buildPieces);
  const minPieces = Math.min(...pieceLists.map((p) => p.length));
  let prefixLen = 0;
  while (prefixLen < minPieces && pieceLists.every((p) => p[prefixLen].norm === pieceLists[0][prefixLen].norm)) prefixLen++;
  if (prefixLen === 0) return standaloneAll();

  interface ItemPlan {
    idx: number;
    core: string;
    baseText: string;
    shade: string;
    groupKey: string | null;
    splitKind: "explicit" | "plain" | "none";
    sepRank: number;
  }

  const plans: ItemPlan[] = items.map((item, i) => {
    const core = cores[i];
    const prefixEnd = pieceLists[i][prefixLen - 1].end;
    const baseText = core.slice(0, prefixEnd).trim();
    const rawTail = core.slice(prefixEnd);
    const leadMatch = rawTail.match(/^[\s-]+/);
    const lead = leadMatch ? leadMatch[0].length : 0;
    const sepRank = lead > 0 && rawTail[0] === "-" ? 0 : lead > 0 ? 1 : 2;
    const split = splitTail(core, prefixEnd);
    if (!split) return { idx: i, core, baseText, shade: "", groupKey: null, splitKind: "none", sepRank };
    if (split.kind === "explicit") {
      return { idx: i, core, baseText: core.slice(0, split.baseEnd).trim(), shade: split.shade, groupKey: split.groupKey, splitKind: "explicit", sepRank };
    }
    return { idx: i, core, baseText, shade: split.shade, groupKey: null, splitKind: "plain", sepRank };
  });

  if (DEBUG) {
    console.log(`  cores: ${JSON.stringify(cores)}`);
    console.log(`  prefixLen=${prefixLen}`);
    for (const p of plans) console.log(`  plan[${p.idx}] kind=${p.splitKind} group=${JSON.stringify(p.groupKey)} base=${JSON.stringify(p.baseText)} shade=${JSON.stringify(p.shade)}`);
  }

  const explicitGroups = new Map<string, ItemPlan[]>();
  const plainPlans: ItemPlan[] = [];
  const nonePlans: ItemPlan[] = [];
  for (const p of plans) {
    if (p.splitKind === "explicit" && p.groupKey) {
      if (!explicitGroups.has(p.groupKey)) explicitGroups.set(p.groupKey, []);
      explicitGroups.get(p.groupKey)!.push(p);
    } else if (p.splitKind === "plain") {
      plainPlans.push(p);
    } else {
      nonePlans.push(p);
    }
  }

  interface OutProduct {
    productName: string;
    itemIdxs: number[];
    colors: Array<{ color: string; colorSlug: string; shadeCode: string; itemIdx: number }>;
    sortKey: number;
  }
  const outProducts: OutProduct[] = [];

  const addMerged = (group: ItemPlan[], productName: string): boolean => {
    const colors = group.map((p) => {
      const f = finalizeShade(p.shade);
      return { color: f.color, colorSlug: slugify(f.color || "default"), shadeCode: f.shadeCode, itemIdx: p.idx };
    });
    if (colors.some((c) => !c.color || !isValidColorName(c.color))) return false;
    outProducts.push({ productName, itemIdxs: group.map((p) => p.idx), colors, sortKey: Math.min(...group.map((p) => p.idx)) });
    return true;
  };
  const addStandalone = (p: ItemPlan) => {
    outProducts.push({
      productName: p.core,
      itemIdxs: [p.idx],
      colors: [{ color: "default", colorSlug: "default", shadeCode: "", itemIdx: p.idx }],
      sortKey: p.idx,
    });
  };

  const clusters = [...explicitGroups.values()].filter((g) => g.length >= 2);
  const singles = [...explicitGroups.values()].filter((g) => g.length === 1).flat();

  if (explicitGroups.size === 0 && plainPlans.length >= 2) {
    // The whole folder shares one base name: every tail is a shade of the same product.
    // Explicitly separated shades come first, then ones glued to the base name.
    const ordered = [...plainPlans].sort((a, b) => a.sepRank - b.sepRank);
    let mergedBase = false;
    if (prefixLen <= 1) {
      // Degenerate prefix (names differ right after the brand) but the same trailing words
      // shared: read the differing middle as the shade, e.g. "SHEGLAM Apricot Dream Cheek
      // & Lip Cream Stack" + "SHEGLAM Very Cherry ..." -> "SHEGLAM Cheek & Lip Cream Stack".
      const suffixLen = commonSuffixPieces(ordered.map((p) => pieceLists[p.idx]));
      if (suffixLen >= 2) {
        const adjusted = ordered.map((p) => {
          const pieces = pieceLists[p.idx];
          const middleStart = pieces[prefixLen - 1].end;
          const middleEnd = pieces[pieces.length - suffixLen].start;
          const mid = cores[p.idx].slice(middleStart, middleEnd).replace(/^[\s-]+|[\s-]+$/g, "").trim();
          return { ...p, shade: mid };
        });
        if (adjusted.every((p) => isValidShade(p.shade))) {
          const first = adjusted[0].idx;
          const firstPieces = pieceLists[first];
          const namePrefix = cores[first].slice(0, firstPieces[prefixLen - 1].end).trim();
          const nameSuffix = cores[first].slice(firstPieces[firstPieces.length - suffixLen].start).trim();
          mergedBase = addMerged(adjusted, `${namePrefix} ${nameSuffix}`.trim());
        }
      }
    }
    if (!mergedBase) {
      const name = pickMostCommon(ordered.map((p) => p.baseText));
      if (!addMerged(ordered, name)) ordered.forEach(addStandalone);
    }
  } else {
    // The folder holds 2+ product lines (e.g. "Shimmer" vs "Shine"): merge each line
    // separately and keep unmergeable items as standalone products.
    for (const group of clusters) {
      const name = pickMostCommon(group.map((p) => p.baseText));
      if (!addMerged(group, name)) group.forEach(addStandalone);
    }
    singles.forEach(addStandalone);
    plainPlans.forEach(addStandalone);
  }
  nonePlans.forEach(addStandalone);

  outProducts.sort((a, b) => a.sortKey - b.sortKey);
  const products = outProducts.map((p) => ({
    productName: p.productName,
    fullOriginalName: p.itemIdxs.map((i) => items[i].originalName).join(" | "),
    colors: p.colors,
    needsReview: false,
  }));
  const merged = products.length < items.length;
  return { merged, products };
}

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface RawItem { category: string; folderNumber: string; originalName: string; imageFiles: string[]; }
interface ProductEntry {
  sku: string; category: string; productName: string; fullOriginalName: string;
  colorVariants: ColorVariant[]; needsReview: boolean; isSetOrTool: boolean;
  shadeCode: string; size: string; sourceFolderNumber: string; reviewNote?: string;
}
interface ColorVariant { color: string; colorSlug: string; shadeCode: string; images: string[]; sourceFolder: string; }
interface ReviewEntry {
  category: string; folderNumber: string; sku: string;
  items: Array<{ originalName: string; productName: string; colors: string }>;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export interface MergePassOptions {
  sourceRoot?: string;
  folderKeys?: Iterable<string>;
  quiet?: boolean;
}

// Phases 1-3: scan -> clean -> group/merge, with no file-system side effects. Exported so
// tests can run the exact same pipeline against the raw folders without copying images or
// writing CSV files (that is Phase 4, which stays in main()).
export function runMergePass(options: MergePassOptions = {}): { products: ProductEntry[]; reviewEntries: ReviewEntry[] } {
  const sourceRoot = options.sourceRoot || RAW_SOURCE_ROOT;
  const folderKeySet = options.folderKeys ? new Set(options.folderKeys) : null;
  const log = options.quiet ? () => {} : (msg: string) => console.log(msg);

  log("Phase 1: Scanning raw source...");
  const allItems: RawItem[] = [];
  const categories = fs.readdirSync(sourceRoot, { withFileTypes: true })
    .filter(d => d.isDirectory()).map(d => d.name).sort(naturalCompare);

  for (const category of categories) {
    const catDir = path.join(sourceRoot, category);
    const folderNums = fs.readdirSync(catDir, { withFileTypes: true })
      .filter(d => d.isDirectory()).map(d => d.name).sort(naturalCompare);

    for (const folderNum of folderNums) {
      if (folderKeySet && !folderKeySet.has(`${category}||${folderNum}`)) continue;
      if (!/^\d+$/.test(folderNum)) {
        log(`  ⚠ WARNING: Non-numeric FolderNumber: ${category}/${folderNum} — full path: ${catDir}\\${folderNum}`);
      }
      const numDir = path.join(catDir, folderNum);
      const productFolders = fs.readdirSync(numDir, { withFileTypes: true })
        .filter(d => d.isDirectory()).map(d => d.name).sort(naturalCompare);

      for (const prodFolder of productFolders) {
        const prodDir = path.join(numDir, prodFolder);
        const files = fs.readdirSync(prodDir, { withFileTypes: true })
          .filter(f => f.isFile() && IMAGE_EXTS.has(path.extname(f.name).toLowerCase()))
          .map(f => f.name).sort(naturalCompare);
        allItems.push({ category, folderNumber: folderNum, originalName: prodFolder, imageFiles: files });
      }
    }
  }
  log(`  Found ${allItems.length} raw product folders\n`);

  log("Phase 2: Cleaning and classifying...");
  interface CleanedItem {
    raw: RawItem; cleanedCompact: string; cleanedDisplay: string;
    hadBoilerplate: boolean; isSet: boolean; size: string; wordsCompact: string[];
  }

  function isSetOrTool(name: string, hadBoilerplate: boolean): boolean {
    if (hadBoilerplate) return false;
    const lc = name.toLowerCase();
    if (/\b\d+\s*pcs?\b/.test(lc)) return true;
    if (/\bset\b/.test(lc) && /\b(?:brush|makeup|cosmetic|tool)\b/.test(lc)) return true;
    if (/\bbrush\s+set\b/i.test(lc)) return true;
    if (/\brazer\b/i.test(name)) return true;
    if (/\btool\b/i.test(name)) return true;
    if (/\baccessori/i.test(name)) return true;
    if (/,\s*(?:including|with)\b/i.test(name)) return true;
    if (/\bhair\s+(?:dryer|brush|removal|products)\b/i.test(name)) return true;
    if (/\bsharpener\b/i.test(name) && !hadBoilerplate) return true;
    if ((name.match(/,/g) || []).length >= 2 && !hadBoilerplate) return true;
    return false;
  }

  const cleaned: CleanedItem[] = [];
  let setToolCount = 0;
  for (const item of allItems) {
    const { cleaned: c1, hadBoilerplate } = stripBoilerplate(item.originalName);
    let cleanedName = c1;
    if (isAllCaps(cleanedName)) cleanedName = toTitleCase(cleanedName);
    const { size, cleaned: c2 } = extractSize(cleanedName);
    cleanedName = stripTrailingZero(c2);
    const compact = cleanedName.replace(/\s*-\s*/g, "-");
    const isSet = isSetOrTool(cleanedName, hadBoilerplate);
    if (isSet) setToolCount++;
    cleaned.push({ raw: item, cleanedCompact: compact, cleanedDisplay: cleanedName, hadBoilerplate, isSet, size, wordsCompact: compact.split(/\s+/).filter(Boolean) });
  }
  log(`  ${allItems.length} items cleaned, ${setToolCount} classified as sets/tools\n`);

  log("Phase 3: Grouping and merging...");
  const groups = new Map<string, CleanedItem[]>();
  for (const ci of cleaned) {
    const key = `${ci.raw.category}||${ci.raw.folderNumber}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(ci);
  }

  const products: ProductEntry[] = [];
  const reviewEntries: ReviewEntry[] = [];

  const sortedKeys = [...groups.keys()].sort((a, b) => {
    const [catA, numA] = a.split("||");
    const [catB, numB] = b.split("||");
    const catCmp = naturalCompare(catA, catB);
    return catCmp !== 0 ? catCmp : naturalCompare(numA, numB);
  });

  for (const key of sortedKeys) {
    const items = groups.get(key)!;
    const [category, folderNumber] = key.split("||");
    const catCode = CAT_CODES[category.toLowerCase()] || category.slice(0, 3).toUpperCase();
    const baseSku = `${catCode}-${folderNumber.padStart(3, "0")}`;
    const p3Items = items.filter(i => i.isSet);
    const p12Items = items.filter(i => !i.isSet);

    for (const item of p3Items) {
      products.push({
        sku: baseSku, category, productName: item.cleanedDisplay.slice(0, 90),
        fullOriginalName: item.raw.originalName,
        colorVariants: [{ color: "default", colorSlug: "default", shadeCode: "", images: item.raw.imageFiles, sourceFolder: path.join(category, folderNumber, item.raw.originalName) }],
        needsReview: p12Items.length > 0, isSetOrTool: true, shadeCode: "", size: extractSize(item.cleanedDisplay).size || item.size, sourceFolderNumber: folderNumber,
      });
    }
    if (p12Items.length === 0) continue;

    if (p12Items.length === 1) {
      const item = p12Items[0];
      products.push({
        sku: baseSku, category, productName: item.cleanedDisplay, fullOriginalName: item.raw.originalName,
        colorVariants: [{ color: "default", colorSlug: "default", shadeCode: "", images: item.raw.imageFiles, sourceFolder: path.join(category, folderNumber, item.raw.originalName) }],
        needsReview: false, isSetOrTool: false, shadeCode: "", size: item.size, sourceFolderNumber: folderNumber,
      });
      continue;
    }

    const mergeInput = p12Items.map((item, i) => ({
      wordsCompact: item.wordsCompact, cleanedDisplay: item.cleanedDisplay,
      cleanedCompact: item.cleanedCompact, originalName: item.raw.originalName, idx: i,
    }));
    const result = tryMerge(mergeInput);

    if (result.merged && result.products.length === 1) {
      const prod = result.products[0];
      products.push({
        sku: baseSku, category, productName: prod.productName, fullOriginalName: prod.fullOriginalName,
        colorVariants: prod.colors.map(c => ({
          color: c.color, colorSlug: c.colorSlug, shadeCode: c.shadeCode,
          images: p12Items[c.itemIdx].raw.imageFiles,
          sourceFolder: path.join(category, folderNumber, p12Items[c.itemIdx].raw.originalName),
        })),
        needsReview: prod.needsReview, isSetOrTool: false, shadeCode: "", size: "", sourceFolderNumber: folderNumber,
      });
    } else if (result.merged && result.products.length > 1) {
      let letterIdx = 0;
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for (const prod of result.products) {
        const suffix = result.products.length > 1 ? `-${letters[letterIdx++]}` : "";
        const reviewNote = (category === "eyes" && folderNumber === "61" && prod.colors.length === 1 && prod.colors[0].color === "default" && prod.productName.toLowerCase().includes("volume"))
          ? "possible unlabeled default shade — verify manually" : undefined;
        products.push({
          sku: baseSku + suffix, category, productName: prod.productName, fullOriginalName: prod.fullOriginalName,
          colorVariants: prod.colors.map(c => ({
            color: c.color, colorSlug: c.colorSlug, shadeCode: c.shadeCode,
            images: p12Items[c.itemIdx].raw.imageFiles,
            sourceFolder: path.join(category, folderNumber, p12Items[c.itemIdx].raw.originalName),
          })),
          needsReview: prod.needsReview || result.products.length > 1, isSetOrTool: false,
          shadeCode: "", size: "", sourceFolderNumber: folderNumber, reviewNote,
        });
      }
      reviewEntries.push({
        category, folderNumber, sku: baseSku,
        items: p12Items.map(item => ({ originalName: item.raw.originalName, productName: item.cleanedDisplay, colors: "partial merge" })),
      });
    } else {
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      p12Items.forEach((item, idx) => {
        products.push({
          sku: baseSku + (p12Items.length > 1 ? `-${letters[idx]}` : ""), category, productName: item.cleanedDisplay,
          fullOriginalName: item.raw.originalName,
          colorVariants: [{ color: "default", colorSlug: "default", shadeCode: "", images: item.raw.imageFiles, sourceFolder: path.join(category, folderNumber, item.raw.originalName) }],
          needsReview: true, isSetOrTool: false, shadeCode: "", size: item.size, sourceFolderNumber: folderNumber,
        });
      });
      reviewEntries.push({
        category, folderNumber, sku: baseSku,
        items: p12Items.map(item => ({ originalName: item.raw.originalName, productName: item.cleanedDisplay, colors: "default (split - merge failed)" })),
      });
    }
  }

  return { products, reviewEntries };
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

function main() {
  console.log("=== Product Organizer v8 ===\n");

  if (fs.existsSync(OUTPUT_ROOT)) {
    fs.rmSync(OUTPUT_ROOT, { recursive: true, force: true });
    console.log(`Cleared ${OUTPUT_ROOT}`);
  }
  fs.mkdirSync(OUTPUT_ROOT, { recursive: true });

  const { products, reviewEntries } = runMergePass();

  // Phase 4: Copy images & write CSV
  console.log("\nPhase 4: Copying images and writing CSV...");
  const csvRows: string[] = ["SKU,Category,ProductName,FullOriginalName,Colors,ColorSlugs,ShadeCode,Size,IsSetOrTool,Price,ImageCountPerColor,NeedsReview,SourceFolderNumber"];
  const reviewCsvRows: string[] = ["Category,FolderNumber,SKU,RawOriginalName,AssignedProductName,Colors,ReviewNote"];
  let totalProducts = 0, totalVariants = 0, totalImages = 0, totalReview = 0, totalSetTool = 0;
  const usedFolderNames = new Map<string, number>();

  for (const prod of products) {
    totalProducts++;
    if (prod.needsReview) totalReview++;
    if (prod.isSetOrTool) totalSetTool++;
    const catSlug = slugify(prod.category);
    const prodSlug = slugify(prod.productName);
    const colors: string[] = [], colorSlugs: string[] = [], imageCounts: string[] = [], shadeCodes: string[] = [];

    for (const cv of prod.colorVariants) {
      totalVariants++; totalImages += cv.images.length;
      const uniqueSlug = makeFolderNameUnique(path.join(OUTPUT_ROOT, catSlug, prodSlug), cv.colorSlug, usedFolderNames);
      const destDir = path.join(OUTPUT_ROOT, catSlug, prodSlug, uniqueSlug);
      fs.mkdirSync(destDir, { recursive: true });
      for (let i = 0; i < cv.images.length; i++) {
        const srcFile = path.join(RAW_SOURCE_ROOT, cv.sourceFolder, cv.images[i]);
        const ext = path.extname(cv.images[i]).toLowerCase();
        fs.copyFileSync(srcFile, path.join(destDir, `${i + 1}${ext}`));
      }
      colors.push(cv.color); colorSlugs.push(uniqueSlug); imageCounts.push(String(cv.images.length)); shadeCodes.push(cv.shadeCode);
    }
    csvRows.push([escapeCsv(prod.sku), escapeCsv(prod.category), escapeCsv(prod.productName), escapeCsv(prod.fullOriginalName),
      escapeCsv(colors.join("|")), escapeCsv(colorSlugs.join("|")), escapeCsv(shadeCodes.filter(Boolean).join("|")),
      escapeCsv(prod.size), prod.isSetOrTool ? "TRUE" : "FALSE", "", escapeCsv(imageCounts.join("|")),
      prod.needsReview ? "TRUE" : "FALSE", escapeCsv(prod.sourceFolderNumber)].join(","));
  }

  for (const entry of reviewEntries) {
    for (const item of entry.items) {
      reviewCsvRows.push([escapeCsv(entry.category), escapeCsv(entry.folderNumber), escapeCsv(entry.sku),
        escapeCsv(item.originalName), escapeCsv(item.productName), escapeCsv(item.colors)].join(","));
    }
  }
  for (const prod of products) {
    if (prod.reviewNote) {
      reviewCsvRows.push([escapeCsv(prod.category), escapeCsv(prod.sourceFolderNumber), escapeCsv(prod.sku),
        escapeCsv(prod.fullOriginalName), escapeCsv(prod.productName), escapeCsv("default"), escapeCsv(prod.reviewNote)].join(","));
    }
  }

  fs.writeFileSync(path.join(OUTPUT_ROOT, "products-master.csv"), csvRows.join("\n") + "\n", "utf-8");
  fs.writeFileSync(path.join(OUTPUT_ROOT, "review-log.csv"), reviewCsvRows.join("\n") + "\n", "utf-8");

  console.log("\n=== SUMMARY ===");
  console.log(`Total products created: ${totalProducts}`);
  console.log(`Total color variants:   ${totalVariants}`);
  console.log(`Total images copied:    ${totalImages}`);
  console.log(`NeedsReview flagged:    ${totalReview}`);
  console.log(`IsSetOrTool flagged:    ${totalSetTool}`);
  console.log(`\nOutput: ${OUTPUT_ROOT}`);
}

// Node 24 exposes import.meta.main; TypeScript's ImportMeta doesn't declare it yet.
if ((import.meta as ImportMeta & { main?: boolean }).main) main();
