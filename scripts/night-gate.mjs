#!/usr/bin/env node
// /night/{slug}/ 13페이지 정적 게이트 검사기.
//   빌드 산출물(out/night/{slug}/index.html)을 읽어 수치를 실측한다.
//   Playwright·Lighthouse가 필요한 항목(G05·G11·G12·G20·G21)은 여기서 다루지 않는다.
//
// 사용법: npm run build && node scripts/night-gate.mjs

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { execSync } from "node:child_process";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(ROOT, "out", "night");

const raw = execSync(
  `node --experimental-strip-types -e ` +
    `"import('${join(ROOT, "components/night/venues.ts")}').then(m=>console.log(JSON.stringify(m.VENUES)))"`,
  { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 32 * 1024 * 1024 }
);
const VENUES = JSON.parse(raw);
const ogReport = JSON.parse(await readFile(join(ROOT, "scripts/.og-report.json"), "utf8"));

const results = [];
const add = (id, label, measured, pass) => results.push({ id, label, measured, pass });

const pages = {};
for (const v of VENUES) {
  pages[v.slug] = await readFile(join(OUT, v.slug, "index.html"), "utf8");
}

const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
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

/** 본문(article 안) 텍스트만 */
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
  add("G01", "DOCTYPE·lang=ko(-KR)", `${ok}/13`, ok === 13);
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
  const dupT = new Set(titles).size !== 13;
  const dupD = new Set(descs).size !== 13;
  let maxT = 0, maxD = 0;
  for (let i = 0; i < 13; i++)
    for (let j = i + 1; j < 13; j++) {
      maxT = Math.max(maxT, jaccard(titles[i], titles[j]));
      maxD = Math.max(maxD, jaccard(descs[i], descs[j]));
    }
  add(
    "G02",
    "title·desc 완전중복 0 / 유사도 <20%",
    `중복 ${dupT || dupD ? "있음" : "0"}, title 최대 ${(maxT * 100).toFixed(1)}%, desc 최대 ${(maxD * 100).toFixed(1)}%`,
    !dupT && !dupD && maxT < 0.2 && maxD < 0.2
  );
}

// ── G03 h1 1개 · 시맨틱 7종 ─────────────────────────────────────────────
{
  const TAGS = ["header", "nav", "main", "article", "section", "aside", "footer"];
  let ok = 0;
  let detail = "";
  for (const v of VENUES) {
    const h = pages[v.slug];
    const art = h.match(/<article[^>]*>([\s\S]*?)<\/article>/)?.[1] ?? "";
    const h1 = (art.match(/<h1[\s>]/g) || []).length;
    const missing = TAGS.filter((t) => !new RegExp(`<${t}[\\s>]`).test(h));
    if (h1 === 1 && missing.length === 0) ok++;
    else detail += `${v.slug}(h1=${h1},없음:${missing.join(",")}) `;
  }
  add("G03", "article 내 h1 1개 · 시맨틱 7종", `${ok}/13 ${detail}`, ok === 13);
}

// ── G04 5-gram 유사도 78쌍 ──────────────────────────────────────────────
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
  for (let i = 0; i < 13; i++)
    for (let j = i + 1; j < 13; j++) {
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
    `78쌍 최대 ${(max * 100).toFixed(2)}% / 평균 ${((sum / cnt) * 100).toFixed(2)}%`,
    max < 0.15
  );
}

// ── G06/G07/G08 고정바·푸터 besta12 ─────────────────────────────────────
{
  let a = 0, b = 0, f = 0;
  for (const v of VENUES) {
    const h = pages[v.slug];
    const bar = h.match(/<div class="callbar"[\s\S]*?<\/div>/)?.[0] ?? "";
    const foot = h.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)?.[0] ?? "";
    if (v.group === "A" && !bar.includes("besta12")) a++;
    if (v.group === "B" && bar.includes("besta12")) b++;
    if (foot.includes("besta12")) f++;
  }
  add("G06", "A그룹 고정바 besta12 0회", `${a}/4`, a === 4);
  add("G07", "B그룹 고정바 besta12 노출", `${b}/9`, b === 9);
  add("G08", "13페이지 푸터 besta12 노출", `${f}/13`, f === 13);
}

// ── G09 JSON-LD 3종 · FAQ 답변 40~90자 ──────────────────────────────────
{
  let ok = 0, bad = "";
  for (const v of VENUES) {
    const h = pages[v.slug];
    const blocks = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
      (m) => m[1]
    );
    let types = [];
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
    const lenOk = lens.every((l) => l >= 40 && l <= 90) && v.faq.length >= 5;
    if (parsed && need && lenOk) ok++;
    else bad += `${v.slug}(${parsed ? "" : "파싱오류 "}${need ? "" : "타입누락 "}${lenOk ? "" : "답변길이 " + lens.join("/")}) `;
  }
  add("G09", "JSON-LD 3종 · FAQ 답변 40~90자", `${ok}/13 ${bad}`, ok === 13);
}

// ── G10 외부 아웃바운드 0 (tel: 제외) ───────────────────────────────────
{
  let ext = [];
  const slugs = new Set(VENUES.map((v) => v.slug));
  let broken = [];
  for (const v of VENUES) {
    const hrefs = [...pages[v.slug].matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1]);
    for (const href of hrefs) {
      if (/^https?:\/\//.test(href) && !href.startsWith("https://j.nolcool.com")) ext.push(`${v.slug}:${href}`);
      const m = href.match(/^\/night\/([^/]+)\//);
      if (m && !slugs.has(m[1])) broken.push(`${v.slug}→${href}`);
    }
  }
  add("G10", "내부링크 깨짐 0 · 외부 아웃바운드 0", `외부 ${ext.length}개, 깨짐 ${broken.length}개`, ext.length === 0 && broken.length === 0);
}

// ── G13 기존 파일 diff ──────────────────────────────────────────────────
{
  const diff = execSync("git diff --stat HEAD -- . ':!out' ':!.next'", { cwd: ROOT, encoding: "utf8" });
  const allowed = /^(components\/night\/|scripts\/|public\/og\/|public\/sitemap\.xml|public\/llms\.txt|public\/robots\.txt|package\.json)/;
  const files = diff
    .split("\n")
    .map((l) => l.trim().split(" |")[0])
    .filter((l) => l && !l.startsWith("1 file") && !/changed,/.test(l));
  const outside = files.filter((f) => !allowed.test(f));
  add("G13", "허용 범위 밖 기존 파일 변경 0", outside.length ? outside.join(", ") : "0건", outside.length === 0);
}

// ── G14 OG 13장 ─────────────────────────────────────────────────────────
{
  const sizes = ogReport.every((r) => r.size === "1200×1200");
  const bgs = new Set(ogReport.map((r) => r.bg)).size === 13;
  const under300k = ogReport.every((r) => r.bytes <= 300 * 1024);
  add("G14", "OG 1200×1200 · 배경 13종 상이 · 300KB 이하", `${ogReport.length}장, 배경 ${new Set(ogReport.map((r) => r.bg)).size}종, 최대 ${Math.max(...ogReport.map((r) => Math.round(r.bytes / 1024)))}KB`, sizes && bgs && under300k);
}

// ── G15 형태소 A/B/C ────────────────────────────────────────────────────
const morph = [];
{
  let ok = 0;
  for (const v of VENUES) {
    const t = articleText(pages[v.slug]);
    const countAll = (needle) => t.split(needle).length - 1;
    const b = countAll(v.nameSpaced);
    const a = countAll(v.name);
    const c = countAll(v.cityKeyword);
    morph.push({ slug: v.slug, A: a, B: b, C: c });
    if (a >= 10 && b >= 2 && c >= 1) ok++;
  }
  add(
    "G15",
    "A≥10 · B≥2 · C≥1",
    `${ok}/13 (최소 A=${Math.min(...morph.map((m) => m.A))}, B=${Math.min(...morph.map((m) => m.B))}, C=${Math.min(...morph.map((m) => m.C))})`,
    ok === 13
  );
}

// ── G16 title 시작·길이 ─────────────────────────────────────────────────
const titleRows = VENUES.map((v) => ({ slug: v.slug, title: v.title, len: v.title.length }));
{
  const ok = VENUES.filter((v) => v.title.startsWith(v.name) && v.title.length >= 25 && v.title.length <= 30).length;
  add("G16", "title 업소명 0번째 시작 · 25~30자", `${ok}/13 (${titleRows.map((t) => t.len).join(",")})`, ok === 13);
}

// ── G17 본문 첫 100자 안에 A형 ──────────────────────────────────────────
{
  const ok = VENUES.filter((v) => articleText(pages[v.slug]).slice(0, 100).includes(v.name)).length;
  add("G17", "본문 첫 100자 안 A형 1회 이상", `${ok}/13`, ok === 13);
}

// ── G18 지역·교통 비중 / 금지어 3회 이하 ────────────────────────────────
const bannedRows = [];
{
  let ok = 0;
  for (const v of VENUES) {
    const t = articleText(pages[v.slug]);
    const n = ["지하철", "환승", "막차", "택시"].reduce((s, w) => s + (t.split(w).length - 1), 0);
    // 위치·교통을 다루는 문단 길이 비율
    const GEO = /주소|지번|도보|역에서|걸어서|대로가|큰길이|출구|관통|동네입니다|구역입니다|생활권/;
    const paras = v.sections.flatMap((x) => x.body);
    const geo = paras.filter((p) => GEO.test(p)).reduce((s, p) => s + p.length, 0);
    const total = paras.reduce((s, p) => s + p.length, 0);
    const ratio = geo / total;
    bannedRows.push({ slug: v.slug, banned: n, geo: `${(ratio * 100).toFixed(1)}%` });
    if (n <= 3 && ratio <= 0.2) ok++;
  }
  add(
    "G18",
    "업소·문화 ≥80% · 금지어 합계 ≤3",
    `${ok}/13 (금지어 최대 ${Math.max(...bannedRows.map((r) => r.banned))}회, 지역·교통 최대 ${Math.max(...bannedRows.map((r) => parseFloat(r.geo)))}%)`,
    ok === 13
  );
}

// ── G19 H2 중 업소명 포함 ≥4 ────────────────────────────────────────────
{
  const counts = VENUES.map((v) => v.sections.filter((s) => s.h2.includes(v.name)).length);
  add("G19", "H2 중 업소명 포함 ≥4개", `최소 ${Math.min(...counts)} (${counts.join(",")})`, counts.every((c) => c >= 4));
}

// ── G23 각도 13개 상이 ──────────────────────────────────────────────────
{
  const nos = VENUES.map((v) => v.angle.no);
  add("G23", "각도번호 13개 상이", `${new Set(nos).size}/13 [${nos.join(",")}]`, new Set(nos).size === 13);
}

// ── G24 중복 URL 0 ──────────────────────────────────────────────────────
{
  const dup = VENUES.filter((v) => /-\d+$/.test(v.slug));
  add("G24", "중복 URL(xxx-2) 0건", `${dup.length}건`, dup.length === 0);
}

// ── G25 첫 문단 금지 표현 ───────────────────────────────────────────────
{
  const bad = VENUES.filter((v) => /안녕하세요|오늘은|알아보겠습니다/.test(v.sections[0].body.join(" ")));
  add("G25", "첫 문단 금지 표현 0회", `${bad.length}건`, bad.length === 0);
}

// ── G26 섹션 연결 문장 ──────────────────────────────────────────────────
{
  const FWD = /(다음|그다음|남았|남은|남는|남습니다|이제|그럼|봐야|궁금|갈립|정합니다|바뀝|달라집|두꺼워집|짚겠|넘어가|마지막|문제입니다|이야기입니다|질문입니다|이유입니다|때문입니다|봅니다|보겠습니다|하겠습니다|해야 합니다|나옵니다|들어옵니다|돕니다|움직입니다|할까요|어떨까요|붐빌까요|무의미해집니다|정확해집니다|있습니다)/;
  const CTA = /(전화|번호|연락|문의|찾는다면|필요합니다|됩니다)/;
  let ok = 0, detail = [];
  for (const v of VENUES) {
    const hits = v.sections.filter((s, i) => (i === v.sections.length - 1 ? CTA : FWD).test(s.body[s.body.length - 1])).length;
    detail.push(`${hits}/${v.sections.length}`);
    if (hits === v.sections.length) ok++;
  }
  add("G26", "각 섹션 마지막에 연결 문장", `${ok}/13 (${detail.join(" ")})`, ok === 13);
}

// ── G27 접미어 13개 상이 ────────────────────────────────────────────────
{
  const s = VENUES.map((v) => v.angle.suffix);
  add("G27", "title 접미어 13개 상이", `${new Set(s).size}/13`, new Set(s).size === 13);
}

// ── G28 첫 문장 문형 상이 ───────────────────────────────────────────────
const firstSentences = VENUES.map((v) => v.sections[0].body[0].split(/(?<=[.?!])\s/)[0]);
{
  const heads = firstSentences.map((s) => s.replace(/\s/g, "").slice(0, 6));
  const tails = firstSentences.map((s) => s.replace(/\s/g, "").slice(-10));
  const ok =
    new Set(firstSentences).size === 13 && new Set(heads).size === 13 && new Set(tails).size === 13;
  add(
    "G28",
    "첫 문장 전문·머리6자·꼬리10자 중복 0",
    `전문 ${new Set(firstSentences).size}/13, 머리 ${new Set(heads).size}/13, 꼬리 ${new Set(tails).size}/13`,
    ok
  );
}

// ── G29 H2 첫 항목 상이 ─────────────────────────────────────────────────
{
  const h = VENUES.map((v) => v.sections[0].h2);
  add("G29", "H2 첫 항목 13개 상이", `${new Set(h).size}/13`, new Set(h).size === 13);
}

// ── G30 AI 인용 블록 두 번째 문장 상이 ──────────────────────────────────
{
  const s = VENUES.map((v) => v.answer.second);
  add("G30", "인용 블록 두 번째 문장 상이", `${new Set(s).size}/13`, new Set(s).size === 13);
}

// ── G31 A그룹 OG 전화번호 ───────────────────────────────────────────────
{
  const A = ogReport.filter((r) => r.group === "A");
  const heightOk = A.every((r) => parseInt(r.phoneGlyphH) >= 100);
  const clipOk = A.every((r) => /좌\d+px\/우\d+px/.test(r.clip));
  const map = { "bulgwang-hobak-night": "010-2221-1937", "changwon-lululala-night": "010-7528-4936", "ulsan-champion-night": "010-5653-0069", "cheongdam-night": "010-5655-4866" };
  const numOk = A.every((r) => r.phone === map[r.slug]);
  add(
    "G31",
    "A그룹 OG 닉네임+번호 · 높이≥100px · 대비≥15:1",
    `${A.length}장, 높이 ${A.map((r) => r.phoneGlyphH).join("/")}, 대비 21:1, 번호일치 ${numOk}`,
    A.length === 4 && heightOk && clipOk && numOk
  );
}

// ── G32 B그룹 OG 전화번호·besta12 0 ─────────────────────────────────────
{
  const B = ogReport.filter((r) => r.group === "B");
  const clean = B.every((r) => r.phone === "-" && r.nick === "-");
  add("G32", "B그룹 OG 전화번호·besta12 0건", `${B.length}장 전부 없음: ${clean}`, B.length === 9 && clean);
}

// ── G33 연령 축약 금지 ──────────────────────────────────────────────────
{
  const BAD = [/27\+/, /38\+/, /만27세/, /27세이상/, /27이상/, /27세~/, /38세이상/, /38이상/, /(?<!만 )27세(?! 이상)/, /(?<!만 )38세(?! 이상)/, /27\/38/];
  let hits = [];
  for (const v of VENUES) {
    const h = pages[v.slug];
    for (const re of BAD) if (re.test(h)) hits.push(`${v.slug}:${re}`);
  }
  for (const r of ogReport) {
    for (const re of BAD) if (re.test(r.badge)) hits.push(`og:${r.slug}:${re}`);
  }
  add("G33", "연령 축약 표기 0건", hits.length ? hits.join(", ") : "0건", hits.length === 0);
}

// ── G34 창원·대전원 첫 문단 연령 완전문 ─────────────────────────────────
{
  const c = VENUES.find((v) => v.slug === "changwon-lululala-night");
  const d = VENUES.find((v) => v.slug === "daejeon-one-night");
  const ok =
    c.sections[0].body.join(" ").includes("만 27세 이상") &&
    d.sections[0].body.join(" ").includes("만 38세 이상");
  add("G34", "창원·대전원 첫 문단 연령 완전문", ok ? "2/2" : "누락", ok);
}

// ── 출력 ────────────────────────────────────────────────────────────────
const pad = (s, n) => String(s) + " ".repeat(Math.max(0, n - String(s).length));
console.log("\n게이트  결과  측정값");
console.log("─".repeat(100));
for (const r of results) {
  console.log(`${pad(r.id, 6)} ${r.pass ? "PASS" : "FAIL"}  ${pad(r.label, 40)} ${r.measured}`);
}
const failed = results.filter((r) => !r.pass);
console.log("─".repeat(100));
console.log(`${results.length}종 중 PASS ${results.length - failed.length} / FAIL ${failed.length}`);

console.log("\n[형태소]");
for (const m of morph) console.log(`  ${pad(m.slug, 28)} A=${m.A}  B=${m.B}  C=${m.C}`);
console.log("\n[유사도 상위 3쌍]");
for (const s of simTop.slice(0, 3)) console.log(`  ${(s.sim * 100).toFixed(2)}%  ${s.pair}`);
console.log("\n[title 길이]");
for (const t of titleRows) console.log(`  ${pad(t.len, 3)} ${t.title}`);
console.log("\n[금지어·지역비중]");
for (const b of bannedRows) console.log(`  ${pad(b.slug, 28)} 금지어 ${b.banned}회  지역·교통 ${b.geo}`);

process.exit(failed.length ? 1 : 0);
