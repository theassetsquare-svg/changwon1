#!/usr/bin/env node
// /night/ 13페이지 배포 전 정적 게이트 검사.
//   G01 빌드 산출물 존재 / G02 title·description 중복 / G03 h1 1개 / G04 5-gram 유사도
//   G06 A그룹 고정바 besta12 0회 / G07 B그룹 고정바 besta12 노출 / G08 푸터 besta12+대비
//   G09 JSON-LD 파싱 / G10 링크 / G14 OG 이미지
// 스크롤 좌표(G05·G12)와 Lighthouse(G11)는 브라우저가 필요해 별도 실측 스크립트에서 다룬다.
//
// 사용법: npm run build && node scripts/night-gate.mjs

import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(ROOT, "out");

const venues = JSON.parse(
  execSync(
    `node --experimental-strip-types -e "import('${join(ROOT, "components/night/venues.ts")}')` +
      `.then(m=>console.log(JSON.stringify(m.VENUES.map(v=>({slug:v.slug,name:v.name,group:v.group,related:v.related})))))"`,
    { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
  )
);

const results = [];
const add = (gate, detail, pass) => results.push({ gate, detail, pass });

const strip = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ");
const ko = (s) => s.replace(/[^가-힣]/g, "");
const grams = (s, n = 5) => {
  const g = new Set();
  for (let i = 0; i + n <= s.length; i++) g.add(s.slice(i, i + n));
  return g;
};
const jaccard = (a, b) => {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
};
const srgb = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
};
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

// ── 페이지 로드 ────────────────────────────────────────────────
const pages = [];
for (const v of venues) {
  const file = join(OUT, "night", v.slug, "index.html");
  try {
    pages.push({ ...v, file, html: await readFile(file, "utf8") });
  } catch {
    add("G01", `HTML 없음: night/${v.slug}/index.html`, false);
  }
}
add("G01", `빌드 산출물 ${pages.length}/13개 생성`, pages.length === 13);

// ── G02 title·description 중복 ────────────────────────────────
const titles = pages.map((p) => (p.html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || "");
const descs = pages.map(
  (p) => (p.html.match(/<meta name="description" content="([^"]*)"/i) || [])[1] || ""
);
let dupExact = new Set(titles).size !== titles.length || new Set(descs).size !== descs.length;
let nearMax = 0;
for (let i = 0; i < titles.length; i++)
  for (let j = i + 1; j < titles.length; j++) {
    nearMax = Math.max(
      nearMax,
      jaccard(grams(ko(titles[i]), 3), grams(ko(titles[j]), 3)),
      jaccard(grams(ko(descs[i]), 3), grams(ko(descs[j]), 3))
    );
  }
add(
  "G02",
  `완전일치 중복 ${dupExact ? "있음" : "0건"} · 근사일치 최대 ${(nearMax * 100).toFixed(1)}%`,
  !dupExact && nearMax < 0.7
);

// ── G03 h1 개수 ────────────────────────────────────────────────
const h1bad = pages.filter((p) => (p.html.match(/<h1[\s>]/gi) || []).length !== 1);
add("G03", `h1 1개 아닌 페이지 ${h1bad.length}개`, h1bad.length === 0);

// ── G04 본문 유사도 + 분량 ────────────────────────────────────
const bodies = pages.map((p) => {
  const m = p.html.match(/<article class="night-wrap">([\s\S]*?)<\/article>/i);
  return { slug: p.slug, text: ko(strip(m ? m[1] : "")) };
});
const short = bodies.filter((b) => b.text.length < 1500);
const pairs = [];
for (let i = 0; i < bodies.length; i++)
  for (let j = i + 1; j < bodies.length; j++)
    pairs.push({
      p: `${bodies[i].slug} ↔ ${bodies[j].slug}`,
      v: jaccard(grams(bodies[i].text), grams(bodies[j].text)) * 100,
    });
pairs.sort((a, b) => b.v - a.v);
const avg = pairs.reduce((s, x) => s + x.v, 0) / pairs.length;
add(
  "G04",
  `${pairs.length}쌍 최대 ${pairs[0].v.toFixed(2)}% · 평균 ${avg.toFixed(2)}% · 본문 최소 ${Math.min(
    ...bodies.map((b) => b.text.length)
  )}자 (1500자 미만 ${short.length}개)`,
  pairs[0].v < 15 && short.length === 0
);

// ── G06 / G07 고정바 ──────────────────────────────────────────
const bar = (html) => (html.match(/<div class="callbar"[\s\S]*?<\/div>/i) || [])[0] || "";
const aBad = pages.filter((p) => p.group === "A" && bar(p.html).includes("besta12"));
const bBad = pages.filter((p) => p.group === "B" && !bar(p.html).includes("besta12"));
add("G06", `A그룹 4페이지 고정바 besta12 ${aBad.length}회`, aBad.length === 0);
add("G07", `B그룹 9페이지 고정바 besta12 노출 ${9 - bBad.length}/9`, bBad.length === 0);

// ── G08 푸터 ──────────────────────────────────────────────────
const footBad = pages.filter((p) => {
  const f = (p.html.match(/<div class="ad-inquiry">[\s\S]*?<\/div>/i) || [])[0] || "";
  return !f.includes("besta12");
});
const cr = contrast("#ffd400", "#111111");
add(
  "G08",
  `푸터 besta12 ${13 - footBad.length}/13 · #ffd400 위 #111 대비 ${cr.toFixed(1)}:1`,
  footBad.length === 0 && cr >= 4.5
);

// ── G09 JSON-LD ───────────────────────────────────────────────
let ldErr = 0;
let ldTypes = new Set();
for (const p of pages) {
  const blocks = [...p.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const mine = blocks
    .map((b) => {
      try {
        return JSON.parse(b[1]);
      } catch {
        ldErr++;
        return null;
      }
    })
    .filter(Boolean);
  for (const t of ["NightClub", "FAQPage", "BreadcrumbList"]) {
    if (!mine.some((d) => d["@type"] === t || (Array.isArray(d["@type"]) && d["@type"].includes(t))))
      ldErr++;
    else ldTypes.add(t);
  }
}
add("G09", `JSON-LD 파싱·필수 3종 누락 오류 ${ldErr}건 (${[...ldTypes].join(", ")})`, ldErr === 0);

// ── G10 링크 ──────────────────────────────────────────────────
let broken = 0;
let external = 0;
const exists = async (p) => {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
};
for (const p of pages) {
  for (const m of p.html.matchAll(/<a[^>]+href="([^"]+)"/g)) {
    const href = m[1];
    if (href.startsWith("tel:") || href.startsWith("#")) continue;
    if (/^https?:\/\//.test(href)) {
      if (!href.startsWith("https://changwon1.pages.dev")) external++;
      continue;
    }
    const clean = href.split("#")[0];
    if (!clean) continue;
    const target = clean.endsWith("/")
      ? join(OUT, clean, "index.html")
      : join(OUT, clean);
    if (!(await exists(target))) {
      broken++;
      console.log(`   깨진 링크: ${p.slug} → ${href}`);
    }
  }
}
add("G10", `깨진 링크 ${broken}건 · 외부 아웃바운드 ${external}건`, broken === 0 && external === 0);

// ── G14 OG 이미지 ────────────────────────────────────────────
const ogDir = join(OUT, "og");
let ogOk = 0;
let sizes = new Set();
try {
  const files = await readdir(ogDir);
  for (const v of venues) {
    const f = `${v.slug}-og.png`;
    if (!files.includes(f)) continue;
    const buf = await readFile(join(ogDir, f));
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    sizes.add(`${w}x${h}`);
    if (w === 1200 && h === 1200 && buf.length < 300 * 1024) ogOk++;
  }
} catch {}
add("G14", `1200×1200 PNG ${ogOk}/13 (해상도 ${[...sizes].join(",")})`, ogOk === 13);

// ── 출력 ──────────────────────────────────────────────────────
console.log("\n게이트          결과");
console.log("─".repeat(78));
for (const r of results)
  console.log(`${r.gate.padEnd(6)} ${r.pass ? "PASS" : "FAIL"}  ${r.detail}`);
console.log("\n유사도 상위 3쌍");
pairs.slice(0, 3).forEach((p) => console.log(`  ${p.v.toFixed(2)}%  ${p.p}`));
console.log("\n페이지별 본문 한글 글자수");
bodies.forEach((b) => console.log(`  ${b.slug.padEnd(28)} ${b.text.length}자`));

const failed = results.filter((r) => !r.pass);
console.log(failed.length ? `\n→ FAIL ${failed.length}건` : "\n→ 정적 게이트 전부 PASS");
process.exit(failed.length ? 1 : 0);
