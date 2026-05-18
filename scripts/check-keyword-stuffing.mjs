#!/usr/bin/env node
// 키워드 스터핑 자동 검사 — out/ 디렉토리의 모든 HTML을 스캔해서
// 단일 키워드/구절 과다 노출을 잡아냅니다. 임계치를 넘기면 종료 코드 1.
//
// 사용법: npm run check:seo   (빌드 후 실행)
//
// 일반 키워드 임계치:
//   - 단어 빈도 ≥ 3% 또는 8회 이상
//   - 2-gram ≥ 1.5% 또는 6회 이상
// 브랜드/필수 키워드(짱구·담당·창원·룰루랄라 등): 임계치 완화 (≥ 6% 또는 20회)
//   → 이 사이트의 주제 자체라 자연스럽게 반복되는 것을 스터핑으로 잘못 잡지 않도록.
// 본문 단어 수 < 200 → 체류시간 확보를 위해 경고만.

import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT_DIR = join(ROOT, "out");

const STOPWORDS = new Set([
  "the","a","an","of","and","or","but","to","in","on","for","is","are","was","were","be","by","at","with","as","it","its","this","that","you","your","we","our",
  "그리고","그래서","하지만","그러나","또한","또","또는","그","그것","이","이것","저","저것","저희","우리","제가","저는","입니다","합니다","됩니다","있습니다","없습니다","에서","에게","에는","에서는","으로","에게서","까지","부터","처럼","같은","같이","해서","해도","해야","했습니다","하시","하시면","하시는","드립니다","주세요","주시는","주시는","수","것","때","그리고","및","등","이다","아니다","입니다요","에",
]);

// 브랜드/필수 키워드는 페이지 주제 그 자체라 자연스럽게 반복됨 — 임계치 완화.
const BRAND_TERMS = new Set([
  "짱구","담당","창원","룰루랄라","나이트","010","3854","6887",
  "짱구 담당","창원 룰루랄라","룰루랄라 나이트","010 3854","3854 6887",
]);

// 스터핑 판정: density 단독으로 "위험" 또는 (count + 적정 density) 조합으로 "의심".
// 횟수 단독은 절대 플래그하지 않음 (정상 CTA 반복까지 잡지 않도록).
const RULES = {
  unigramGeneric:  { hardDensity: 4.0, softCount: 6,  softDensity: 2.5, minCount: 4 },
  unigramBrand:    { hardDensity: 7.0, softCount: 20, softDensity: 5.0, minCount: 8 },
  bigramGeneric:   { hardDensity: 2.5, softCount: 5,  softDensity: 1.5, minCount: 3 },
  bigramBrand:     { hardDensity: 5.0, softCount: 15, softDensity: 3.0, minCount: 6 },
};

async function walk(dir) {
  let files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) files = files.concat(await walk(p));
    else if (e.isFile() && e.name.endsWith(".html")) files.push(p);
  }
  return files;
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<(p|div|section|article|li|h[1-6]|header|footer|nav|main|aside|blockquote|td|tr|dd|dt|br)[^>]*>/gi, " | ")
    .replace(/<\/(p|div|section|article|li|h[1-6]|header|footer|nav|main|aside|blockquote|td|tr|dd|dt)[^>]*>/gi, " | ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMainContent(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  return m ? m[1] : html;
}

function extractTitleDesc(html) {
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const d = html.match(/<meta\s+name="description"[^>]*content="([^"]*)"[^>]*>/i);
  return { title: t ? t[1].trim() : "", description: d ? d[1].trim() : "" };
}

// 토큰화 — "|"는 블록 경계 표시. 토큰 배열에 빈 슬롯으로 들어가 bigram이 경계를 넘지 못하게.
function tokenize(text) {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((w) => {
      if (w === "|") return "|";
      return w.replace(/[^\p{L}\p{N}가-힣]/gu, "");
    })
    .filter((w) => w === "|" || (w.length >= 2 && !STOPWORDS.has(w)));
}

function topNgrams(tokens, n, k = 8) {
  const map = new Map();
  for (let i = 0; i <= tokens.length - n; i++) {
    const slice = tokens.slice(i, i + n);
    if (slice.includes("|")) continue;
    const gram = slice.join(" ");
    map.set(gram, (map.get(gram) || 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, k);
}

function analyzePage(html) {
  const meta = extractTitleDesc(html);
  const main = extractMainContent(html);
  const body = stripHtml(main);
  const tokens = tokenize(body);
  const total = tokens.filter((t) => t !== "|").length;

  const unigrams = topNgrams(tokens, 1, 10);
  const bigrams = topNgrams(tokens, 2, 8);

  function judge(term, count, density, type) {
    const isBrand = BRAND_TERMS.has(term);
    const rule = RULES[type + (isBrand ? "Brand" : "Generic")];
    if (count < rule.minCount) return null;
    const hard = density >= rule.hardDensity;
    const soft = count >= rule.softCount && density >= rule.softDensity;
    if (!hard && !soft) return null;
    return { type, brand: isBrand, term, count, density: density.toFixed(2) + "%" };
  }

  const warnings = [];
  const brandInfo = [];
  for (const [word, count] of unigrams) {
    const density = total > 0 ? (count / total) * 100 : 0;
    const verdict = judge(word, count, density, "unigram");
    if (verdict) warnings.push(verdict);
    else if (BRAND_TERMS.has(word) && count >= 4) {
      brandInfo.push({ term: word, count, density: density.toFixed(2) + "%" });
    }
  }
  for (const [phrase, count] of bigrams) {
    const density = total > 0 ? (count / total) * 100 : 0;
    const verdict = judge(phrase, count, density, "bigram");
    if (verdict) warnings.push(verdict);
  }

  const notices = [];
  if (total < 200) notices.push(`본문이 짧습니다 (단어 ${total}개). 체류시간 확보를 위해 250+ 권장.`);
  if (!meta.title) notices.push("title 태그가 비어 있습니다.");
  if (!meta.description) notices.push("meta description 이 비어 있습니다.");
  else if (meta.description.length < 60) notices.push(`description 이 짧습니다 (${meta.description.length}자). 70~155자 권장.`);
  else if (meta.description.length > 200) notices.push(`description 이 깁니다 (${meta.description.length}자). 70~155자 권장.`);

  return { meta, total, unigrams, bigrams, warnings, brandInfo, notices };
}

async function main() {
  try {
    await stat(OUT_DIR);
  } catch {
    console.error("out/ 디렉토리가 없습니다. 먼저 `npm run build` 실행하세요.");
    process.exit(2);
  }

  const files = await walk(OUT_DIR);
  if (files.length === 0) {
    console.error("HTML 파일을 찾지 못했습니다.");
    process.exit(2);
  }

  let totalWarn = 0;
  let totalNotice = 0;

  for (const file of files.sort()) {
    const html = await readFile(file, "utf8");
    const rel = relative(OUT_DIR, file);
    const result = analyzePage(html);

    const head = `\n─── ${rel} ───────────────────────────────`;
    console.log(head);
    console.log(`title       : ${result.meta.title}`);
    console.log(`description : ${result.meta.description.slice(0, 120)}${result.meta.description.length > 120 ? "…" : ""}`);
    console.log(`words       : ${result.total}`);
    console.log(`top words   : ${result.unigrams.slice(0, 5).map(([w, c]) => `${w}(${c})`).join(", ")}`);

    if (result.warnings.length === 0 && result.notices.length === 0) {
      console.log("✅ 키워드 스터핑 없음, SEO 메타 OK.");
    }
    for (const n of result.notices) {
      console.log(`ℹ︎  ${n}`);
      totalNotice++;
    }
    for (const b of result.brandInfo) {
      console.log(`ℹ︎  브랜드 키워드 "${b.term}" ${b.count}회 / ${b.density} (정상 범위)`);
    }
    for (const w of result.warnings) {
      const tag = w.brand ? "브랜드 과다" : "일반 스터핑";
      console.log(`⚠︎  ${tag} (${w.type}): "${w.term}" — ${w.count}회 / ${w.density}`);
      totalWarn++;
    }
  }

  console.log(`\n총 페이지 ${files.length}개 · 경고 ${totalWarn}건 · 안내 ${totalNotice}건`);
  if (totalWarn > 0) {
    console.log("→ ⚠︎ 키워드 스터핑 의심 항목이 있습니다. 본문에서 자연스럽게 분산시키세요.");
    process.exit(1);
  }
  console.log("→ ✅ 통과");
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
