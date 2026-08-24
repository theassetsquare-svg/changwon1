#!/usr/bin/env node
// /access/{slug}/ 40페이지 정적 게이트 검사기 (G01~G11).
//   빌드 산출물(out/access/{slug}/index.html)을 읽어 수치를 실측한다.
//
// 사용법: npm run build && node scripts/access-gate.mjs

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { loadAccessVenues } from "./access-data.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(ROOT, "out", "access");

const VENUES = loadAccessVenues();
const N = VENUES.length;

const results = [];
const add = (id, label, measured, pass) => results.push({ id, label, measured, pass });

const pages = {};
for (const v of VENUES) {
  pages[v.slug] = await readFile(join(OUT, v.slug, "index.html"), "utf8");
}
const hub = await readFile(join(OUT, "index.html"), "utf8");

const strip = (h) =>
  h.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
const textOf = (h) =>
  strip(h)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/\s+/g, " ")
    .trim();

function articleText(html) {
  const m = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
  return m ? textOf(m[1]) : "";
}

// ── G01 DOCTYPE·lang ────────────────────────────────────────────────────
{
  let ok = 0;
  for (const v of VENUES) {
    const h = pages[v.slug];
    if (/^<!DOCTYPE html>/i.test(h.trim()) && /<html[^>]*lang="ko(-KR)?"/.test(h)) ok++;
  }
  const hubOk = /^<!DOCTYPE html>/i.test(hub.trim()) && /<html[^>]*lang="ko(-KR)?"/.test(hub);
  add("G01", "DOCTYPE·lang=ko (허브 포함)", `${ok}/${N} + 허브 ${hubOk ? "OK" : "FAIL"}`, ok === N && hubOk);
}

// ── G02 title·description 중복/유사도 ───────────────────────────────────
function bigrams(s) {
  const t = s.replace(/\s+/g, "");
  const out = new Set();
  for (let i = 0; i < t.length - 1; i++) out.add(t.slice(i, i + 2));
  return out;
}
function jaccard(a, b) {
  const A = bigrams(a), B = bigrams(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}
{
  const titles = VENUES.map((v) => v.title);
  const descs = VENUES.map((v) => v.description);
  const dupT = new Set(titles).size !== N;
  const dupD = new Set(descs).size !== N;
  let maxT = 0, maxD = 0, worst = "";
  for (let i = 0; i < N; i++)
    for (let j = i + 1; j < N; j++) {
      const t = jaccard(titles[i], titles[j]);
      if (t > maxT) { maxT = t; worst = `${VENUES[i].slug} ↔ ${VENUES[j].slug}`; }
      maxD = Math.max(maxD, jaccard(descs[i], descs[j]));
    }
  add(
    "G02",
    "title·desc 완전중복 0 / 유사도 <40%",
    `중복 ${dupT || dupD ? "있음" : "0"}, title 최대 ${(maxT * 100).toFixed(1)}% (${worst}), desc 최대 ${(maxD * 100).toFixed(1)}%`,
    !dupT && !dupD && maxT < 0.4 && maxD < 0.4
  );
}

// ── G03 h1 1개 · 시맨틱 태그 ────────────────────────────────────────────
{
  const TAGS = ["article", "section", "aside", "footer", "table", "dl", "ol"];
  let ok = 0, detail = "";
  for (const v of VENUES) {
    const h = pages[v.slug];
    const art = h.match(/<article[^>]*>([\s\S]*?)<\/article>/)?.[1] ?? "";
    const h1 = (art.match(/<h1[\s>]/g) || []).length;
    const missing = TAGS.filter((t) => !new RegExp(`<${t}[\\s>]`).test(h));
    if (h1 === 1 && missing.length === 0) ok++;
    else detail += `${v.slug}(h1=${h1},없음:${missing.join(",")}) `;
  }
  add("G03", "article 내 h1 1개 · 시맨틱 7종", `${ok}/${N} ${detail}`, ok === N);
}

// ── G04 본문 5-gram 유사도 ──────────────────────────────────────────────
function grams(s, n) {
  const t = s.replace(/[\s.,·—–…!?()]/g, "");
  const out = new Set();
  for (let i = 0; i <= t.length - n; i++) out.add(t.slice(i, i + n));
  return out;
}
let simTop = [];
{
  const texts = VENUES.map((v) => grams(articleText(pages[v.slug]), 5));
  let max = 0, sum = 0, cnt = 0;
  for (let i = 0; i < N; i++)
    for (let j = i + 1; j < N; j++) {
      let inter = 0;
      for (const g of texts[i]) if (texts[j].has(g)) inter++;
      const s = inter / (texts[i].size + texts[j].size - inter);
      simTop.push({ pair: `${VENUES[i].slug} ↔ ${VENUES[j].slug}`, sim: s });
      max = Math.max(max, s);
      sum += s;
      cnt++;
    }
  simTop.sort((a, b) => b.sim - a.sim);
  add(
    "G04",
    "본문 5-gram 유사도 최대 <15%",
    `${cnt}쌍 최대 ${(max * 100).toFixed(2)}% / 평균 ${((sum / cnt) * 100).toFixed(2)}%`,
    max < 0.15
  );
}

// ── G05 title 업소명 선두 · 20~30자 ─────────────────────────────────────
const titleRows = VENUES.map((v) => ({ slug: v.slug, title: v.title, len: v.title.length }));
{
  const bad = VENUES.filter((v) => !(v.title.startsWith(v.name) && v.title.length >= 20 && v.title.length <= 30));
  add(
    "G05",
    "title 업소명 0번째 시작 · 20~30자",
    `${N - bad.length}/${N}${bad.length ? " → " + bad.map((v) => `${v.slug}(${v.title.length}자)`).join(", ") : ""}`,
    bad.length === 0
  );
}

// ── G06 이동 소제목 4~6개 · 질문형 H2 2개 이상 ──────────────────────────
{
  const Q = /(까|나|가)$/;
  let ok = 0, detail = "";
  for (const v of VENUES) {
    const heads = [...v.sections.map((s) => s.h2), v.finalAnswer.h2];
    const n = v.sections.length;
    const q = heads.filter((h) => Q.test(h.trim())).length;
    if (n >= 4 && n <= 6 && q >= 2) ok++;
    else detail += `${v.slug}(소제목 ${n}, 질문형 ${q}) `;
  }
  add("G06", "이동 소제목 4~6개 · 질문형 H2 ≥2", `${ok}/${N} ${detail}`, ok === N);
}

// ── G07 JSON-LD 3종 · FAQ 3개 · 답변 40~90자 ────────────────────────────
{
  let ok = 0, bad = "";
  for (const v of VENUES) {
    const h = pages[v.slug];
    const blocks = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    const types = [];
    let parsed = true;
    for (const b of blocks) {
      try {
        types.push(JSON.parse(b)["@type"]);
      } catch {
        parsed = false;
      }
    }
    const need = ["NightClub", "FAQPage", "BreadcrumbList"].every((t) => types.includes(t));
    const lens = v.faq.map((f) => f.a.length);
    const lenOk = v.faq.length === 3 && lens.every((l) => l >= 40 && l <= 90);
    if (parsed && need && lenOk) ok++;
    else bad += `${v.slug}(${parsed ? "" : "파싱오류 "}${need ? "" : "타입누락 "}${lenOk ? "" : "답변길이 " + lens.join("/")}) `;
  }
  add("G07", "JSON-LD 3종 · FAQ 3개 · 답변 40~90자", `${ok}/${N} ${bad}`, ok === N);
}

// ── G08 고정바 규칙 (A=광고주 전화 / B=광고문의) ────────────────────────
{
  let a = 0, b = 0, aTotal = 0, bTotal = 0;
  for (const v of VENUES) {
    const bar = pages[v.slug].match(/<div class="callbar"[\s\S]*?<\/div>/)?.[0] ?? "";
    if (v.group === "A") {
      aTotal++;
      if (!bar.includes("besta12") && bar.includes(v.contact.phone)) a++;
    } else {
      bTotal++;
      if (bar.includes("besta12")) b++;
    }
  }
  // 홈 고정바 문구 규칙: "📞 창원룰루랄라나이트 로또 010-7528-4936"
  const home = await readFile(join(ROOT, "out", "index.html"), "utf8");
  const homeBar = /창원룰루랄라나이트\s*로또\s*010-7528-4936/.test(home.replace(/<[^>]+>/g, " "));
  add(
    "G08",
    "A그룹 담당번호 · B그룹 besta12 · 홈 문구",
    `A ${a}/${aTotal}, B ${b}/${bTotal}, 홈 ${homeBar ? "OK" : "FAIL"}`,
    a === aTotal && b === bTotal && homeBar
  );
}

// ── G09 내부링크 깨짐 0 · 외부 아웃바운드 0 ─────────────────────────────
{
  const slugs = new Set(VENUES.map((v) => v.slug));
  const ext = [], broken = [];
  for (const [name, html] of [...VENUES.map((v) => [v.slug, pages[v.slug]]), ["access-hub", hub]]) {
    const hrefs = [...html.matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1]);
    for (const href of hrefs) {
      if (/^https?:\/\//.test(href) && !href.startsWith("https://j.nolcool.com")) ext.push(`${name}:${href}`);
      const m = href.match(/^\/access\/([^/]+)\//);
      if (m && !slugs.has(m[1])) broken.push(`${name}→${href}`);
    }
  }
  add(
    "G09",
    "내부링크 깨짐 0 · 외부 아웃바운드 0",
    `외부 ${ext.length}개, 깨짐 ${broken.length}개 ${[...ext, ...broken].slice(0, 3).join(" ")}`,
    ext.length === 0 && broken.length === 0
  );
}

// ── G10 허용 범위 밖 기존 파일 변경 0 ───────────────────────────────────
{
  const diff = execSync("git status --porcelain -- . ':!out' ':!.next'", { cwd: ROOT, encoding: "utf8" });
  // 이번 작업에서 손대도 되는 범위. 이 밖의 기존 파일이 바뀌면 FAIL 이다.
  // AUTOMATION.md 는 새로 추가한 스크립트를 문서에 등록하기 위해 포함한다.
  const allowed =
    /^(components\/access\/|pages\/access\/|scripts\/|public\/sitemap\.xml|public\/llms\.txt|public\/robots\.txt|public\/[0-9a-f]{32}\.txt|pages\/index\.tsx|components\/StickyCTA\.tsx|package\.json|AUTOMATION\.md)/;
  const files = diff
    .split("\n")
    .map((l) => l.slice(3).trim())
    .filter(Boolean);
  const outside = files.filter((f) => !allowed.test(f));
  add("G10", "허용 범위 밖 기존 파일 변경 0", outside.length ? outside.join(", ") : "0건", outside.length === 0);
}

// ── G11 확인 불가 표기 정합성 · 출처는 비링크 텍스트 ────────────────────
{
  let bad = [];
  for (const v of VENUES) {
    const text = articleText(pages[v.slug]);
    const unknownFacts = v.facts.filter((f) => f.value.includes("확인 불가"));
    // 표에 확인 불가가 있으면 본문 어딘가에서도 그 사실을 설명해야 한다.
    if (unknownFacts.length > 0 && !/확인 불가/.test(text)) bad.push(`${v.slug}:본문설명없음`);
    // 출처는 링크가 아니라 텍스트로만 남긴다.
    for (const s of v.sources) if (/https?:\/\//.test(s)) bad.push(`${v.slug}:출처에링크`);
    if (!v.sources.length) bad.push(`${v.slug}:출처없음`);
  }
  const srcBlock = VENUES.every((v) => /이 페이지가 참고한 자료/.test(pages[v.slug]));
  add(
    "G11",
    "확인 불가 표기 정합 · 출처 비링크 텍스트",
    bad.length ? bad.join(", ") : `0건, 출처 블록 ${srcBlock ? "40/40" : "누락"}`,
    bad.length === 0 && srcBlock
  );
}

// ── 출력 ────────────────────────────────────────────────────────────────
const pad = (s, n) => String(s) + " ".repeat(Math.max(0, n - String(s).length));
console.log("\n게이트  결과  측정값");
console.log("─".repeat(110));
for (const r of results) {
  console.log(`${pad(r.id, 6)} ${r.pass ? "PASS" : "FAIL"}  ${pad(r.label, 40)} ${r.measured}`);
}
const failed = results.filter((r) => !r.pass);
console.log("─".repeat(110));
console.log(`${results.length}종 중 PASS ${results.length - failed.length} / FAIL ${failed.length}`);

console.log("\n[유사도 상위 5쌍]");
for (const s of simTop.slice(0, 5)) console.log(`  ${(s.sim * 100).toFixed(2)}%  ${s.pair}`);
console.log("\n[title 길이]");
for (const t of titleRows) console.log(`  ${pad(t.len, 3)} ${t.title}`);

process.exit(failed.length ? 1 : 0);
