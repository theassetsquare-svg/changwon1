#!/usr/bin/env node
// 배포된 사이트에서 썸네일 조건을 실측한다. 로컬 산출물이 아니라 라이브 응답만 본다.
//
//   1) /og/*.png 전부 HTTP 200 + Content-Type: image/png + 실제 PNG 시그니처
//   2) 전 페이지 HTML 에 본문 <img> 와 메타 9종이 실제로 나가는지
//
// 사용법: node scripts/thumb-live-check.mjs

import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { loadAccessVenues } from "./access-data.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const BASE = "https://changwond.pages.dev";

const NIGHT = JSON.parse(
  execSync(
    `node --experimental-strip-types -e ` +
      `"import('${join(ROOT, "components/night/venues.ts")}').then(m=>console.log(JSON.stringify(` +
      `m.VENUES.map(v=>({slug:v.slug,name:v.name})))))"`,
    { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
  )
);
const ACCESS = loadAccessVenues();

const PAGES = [
  // 홈(/)은 썸네일 없는 단독 글 페이지 — 제외
  ["/about/", "/og/page-about-og.png"],
  ["/jjanggua/", "/og/page-jjanggua-og.png"],
  ["/location/", "/og/page-location-og.png"],
  ["/contacta/", "/og/page-contacta-og.png"],
  ["/bulgwang-hobak-2/", "/og-bulgwang.png"],
  ["/access-guide/", "/og/page-access-og.png"],
  ...NIGHT.map((v) => [`/night/${v.slug}/`, `/og/${v.slug}-og.png`]),
  ...ACCESS.map((v) => [`/access/${v.slug}/`, `/og/access-${v.slug}-og.png`]),
];

let fail = 0;
const rows = [];

// ── 1) 이미지 응답
const files = (await readdir(join(ROOT, "public", "og"))).filter((f) => f.endsWith(".png"));
const imgPaths = [
  ...files.map((f) => `/og/${f}`),
  "/og-default.png",
  "/og-bulgwang.png",
];
console.log(`▸ 이미지 ${imgPaths.length}개 실측`);
const imgStatus = new Map();
for (const p of imgPaths) {
  const res = await fetch(`${BASE}${p}`);
  const type = res.headers.get("content-type") || "";
  const buf = Buffer.from(await res.arrayBuffer());
  const sig = buf.subarray(0, 8).toString("hex") === "89504e470d0a1a0a";
  const ok = res.status === 200 && type.startsWith("image/png") && sig;
  imgStatus.set(p, { status: res.status, type, bytes: buf.length, ok });
  if (!ok) {
    console.log(`  ✗ ${p} — ${res.status} ${type} sig=${sig}`);
    fail++;
  }
}
console.log(`  ${imgPaths.length - fail}/${imgPaths.length} OK (200 · image/png · PNG 시그니처)`);

// ── 2) 페이지 HTML
console.log(`\n▸ 페이지 ${PAGES.length}개 실측`);
for (const [path, thumb] of PAGES) {
  const res = await fetch(`${BASE}${path}`);
  const html = await res.text();
  const abs = `${BASE}${thumb}`;
  const problems = [];
  if (res.status !== 200) problems.push(`HTTP ${res.status}`);
  const has = (re) => re.test(html);
  if (!has(new RegExp(`<img[^>]+src="${thumb.replace(/[/.]/g, "\\$&")}"`))) problems.push("본문 img 없음");
  for (const [label, re] of [
    ["og:image", new RegExp(`property="og:image"[^>]*content="${abs.replace(/[/.:]/g, "\\$&")}"`)],
    ["og:image:secure_url", new RegExp(`property="og:image:secure_url"[^>]*content="${abs.replace(/[/.:]/g, "\\$&")}"`)],
    ["og:image:type", /property="og:image:type"[^>]*content="image\/png"/],
    ["og:image:width", /property="og:image:width"[^>]*content="1200"/],
    ["og:image:height", /property="og:image:height"[^>]*content="1200"/],
    ["og:image:alt", /property="og:image:alt"[^>]*content="[^"]+"/],
    ["twitter:card", /name="twitter:card"[^>]*content="summary"/],
    ["twitter:image", new RegExp(`name="twitter:image"[^>]*content="${abs.replace(/[/.:]/g, "\\$&")}"`)],
    ["thumbnail", new RegExp(`name="thumbnail"[^>]*content="${abs.replace(/[/.:]/g, "\\$&")}"`)],
  ]) {
    if (!has(re)) problems.push(`${label} 없음/불일치`);
  }
  const img = imgStatus.get(thumb);
  if (!img || !img.ok) problems.push("썸네일 파일 응답 불량");
  if (problems.length) {
    console.log(`  ✗ ${path} — ${problems.join(", ")}`);
    fail++;
  }
  rows.push({
    path,
    thumb,
    live: img ? `${img.status} ${img.type.split(";")[0]}` : "-",
    kb: img ? Math.round(img.bytes / 1024) : "-",
    pass: problems.length === 0,
  });
}
console.log(`  ${rows.filter((r) => r.pass).length}/${rows.length} OK`);

// ── 결과표
console.log("\n| 페이지 | 썸네일 파일 | 본문 img | 메타 9종 | 라이브 HTTP | 용량 | 판정 |");
console.log("|---|---|---|---|---|---|---|");
for (const r of rows) {
  console.log(
    `| ${r.path} | ${r.thumb} | ${r.pass ? "O" : "X"} | ${r.pass ? "9/9" : "미달"} | ${r.live} | ${r.kb}KB | ${r.pass ? "통과" : "실패"} |`
  );
}

console.log(`\n실패 ${fail}건`);
process.exit(fail === 0 ? 0 : 1);
