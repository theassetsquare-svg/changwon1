#!/usr/bin/env node
// 썸네일 노출 게이트 (G9+). 빌드 산출물 out/ 과 public/og/ 실물을 같이 실측한다.
//
// 페이지 한 장마다 여섯 항목을 본다.
//   ① 본문 <img> 존재
//   ② og:image 와 본문 <img> 가 같은 파일
//   ③ 메타 9종 완비 — og:image / og:image:secure_url / og:image:width=1200 /
//      og:image:height=1200 / og:image:type=image/png / og:image:alt /
//      twitter:card=summary / twitter:image / meta name=thumbnail
//   ④ PNG 1200×1200 실측
//   ⑤ 300KB 이하
//   ⑥ alt 에 가게 이름 포함
//   추가로 og:image·thumbnail 이 절대 URL인지, 메타가 중복 삽입되지 않았는지도 본다.
//
// 사용법: npm run build && node scripts/thumb-gate.mjs

import { readFile, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import sharp from "sharp";
import { loadAccessVenues } from "./access-data.mjs";
import { execSync } from "node:child_process";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(ROOT, "out");
const PUB = join(ROOT, "public");
const BASE = "https://changwond.pages.dev";
const MAX_BYTES = 300 * 1024;

const NIGHT = JSON.parse(
  execSync(
    `node --experimental-strip-types -e ` +
      `"import('${join(ROOT, "components/night/venues.ts")}').then(m=>console.log(JSON.stringify(` +
      `m.VENUES.map(v=>({slug:v.slug,name:v.name})))))"`,
    { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
  )
);
const ACCESS = loadAccessVenues();

/** 검사 대상: [경로, out 안의 html, 기대 썸네일, 상호(alt 포함 여부 확인용)] */
const PAGES = [
  // 홈(/)은 헤더·푸터·썸네일 없이 글만 나가는 단독 페이지라 검사 대상이 아니다.
  ["/about/", "about/index.html", "/og/page-about-og.png", "창원 룰루랄라 나이트"],
  ["/jjanggua/", "jjanggua/index.html", "/og/page-jjanggua-og.png", "창원 룰루랄라 나이트"],
  ["/location/", "location/index.html", "/og/page-location-og.png", "창원 룰루랄라 나이트"],
  ["/contacta/", "contacta/index.html", "/og/page-contacta-og.png", "창원 룰루랄라 나이트"],
  ["/bulgwang-hobak-4/", "bulgwang-hobak/index.html", "/og-bulgwang.png", "불광동호박나이트"],
  ["/access-2/", "access/index.html", "/og/page-access-og.png", "창원 룰루랄라 나이트"],
  ["/404/", "404/index.html", "/og-default.png", "창원 룰루랄라 나이트"],
  ...NIGHT.map((v) => [
    `/night/${v.slug}/`,
    `night/${v.slug}/index.html`,
    `/og/${v.slug}-og.png`,
    v.name,
  ]),
  ...ACCESS.map((v) => [
    `/access/${v.slug}/`,
    `access/${v.slug}/index.html`,
    `/og/access-${v.slug}-og.png`,
    v.nameSpaced,
  ]),
];

const rows = [];
let fail = 0;
const note = (msg) => {
  console.log(`  ✗ ${msg}`);
  fail++;
};

/** 이미지 캐시 — 같은 파일을 여러 페이지가 쓰면 한 번만 잰다. */
const imgCache = new Map();
async function imageInfo(rel) {
  if (imgCache.has(rel)) return imgCache.get(rel);
  const file = join(PUB, rel.replace(/^\//, ""));
  let info;
  try {
    const meta = await sharp(file).metadata();
    const { size } = await stat(file);
    info = { ok: true, width: meta.width, height: meta.height, bytes: size, format: meta.format };
  } catch (err) {
    info = { ok: false, err: err.message };
  }
  imgCache.set(rel, info);
  return info;
}

const attr = (html, re) => [...html.matchAll(re)].map((m) => m[1]);

for (const [path, htmlPath, expected, brand] of PAGES) {
  const html = await readFile(join(OUT, htmlPath), "utf8");
  console.log(`\n▸ ${path}`);
  const before = fail;

  // ── 메타 수집 (property / name 순서가 뒤바뀐 경우도 잡는다)
  const metaVals = (key) => {
    const esc = key.replace(/[:]/g, "\\:");
    const a = attr(html, new RegExp(`<meta[^>]+(?:property|name)="${esc}"[^>]*content="([^"]*)"`, "g"));
    const b = attr(html, new RegExp(`<meta[^>]+content="([^"]*)"[^>]*(?:property|name)="${esc}"`, "g"));
    return [...a, ...b];
  };

  const ogImage = metaVals("og:image");
  const secure = metaVals("og:image:secure_url");
  const type = metaVals("og:image:type");
  const width = metaVals("og:image:width");
  const height = metaVals("og:image:height");
  const ogAlt = metaVals("og:image:alt");
  const tCard = metaVals("twitter:card");
  const tImage = metaVals("twitter:image");
  const thumb = metaVals("thumbnail");

  const absExpected = `${BASE}${expected}`;

  // ③ 메타 9종 — 값·개수 동시 확인
  const checks = [
    ["og:image", ogImage, absExpected],
    ["og:image:secure_url", secure, absExpected],
    ["og:image:type", type, "image/png"],
    ["og:image:width", width, "1200"],
    ["og:image:height", height, "1200"],
    ["twitter:card", tCard, "summary"],
    ["twitter:image", tImage, absExpected],
    ["thumbnail", thumb, absExpected],
  ];
  for (const [label, vals, want] of checks) {
    if (vals.length === 0) note(`${label} 없음`);
    else if (vals.length > 1) note(`${label} 중복 ${vals.length}개: ${vals.join(" / ")}`);
    else if (vals[0] !== want) note(`${label} 값 불일치: ${vals[0]} (기대 ${want})`);
  }
  if (ogAlt.length === 0) note("og:image:alt 없음");
  else if (ogAlt.length > 1) note(`og:image:alt 중복 ${ogAlt.length}개`);
  else if (!ogAlt[0].replace(/\s+/g, "").includes(brand.replace(/\s+/g, "")))
    note(`og:image:alt 에 상호 없음: "${ogAlt[0]}"`);

  // ① 본문 <img>
  const body = html.replace(/^[\s\S]*?<body[^>]*>/, "");
  const imgs = [...body.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const thumbImgs = imgs.filter((t) => t.includes(`src="${expected}"`));
  if (thumbImgs.length === 0) {
    note(`본문 <img src="${expected}"> 없음 (본문 img ${imgs.length}개)`);
  } else if (thumbImgs.length > 1) {
    note(`본문 썸네일 img 중복 ${thumbImgs.length}개`);
  } else {
    const tag = thumbImgs[0];
    const imgAlt = /alt="([^"]*)"/.exec(tag)?.[1] ?? "";
    // ⑥ alt 에 상호 포함
    if (!imgAlt.replace(/\s+/g, "").includes(brand.replace(/\s+/g, "")))
      note(`본문 img alt 에 상호 없음: "${imgAlt}"`);
    if (!/width="1200"/.test(tag)) note("본문 img width=1200 없음");
    if (!/height="1200"/.test(tag)) note("본문 img height=1200 없음");
    if (!/loading="eager"/.test(tag)) note("본문 img loading=eager 없음");
  }

  // ② og:image == 본문 img (둘 다 expected 를 가리키는지로 확인)
  if (ogImage[0] !== absExpected || thumbImgs.length !== 1)
    note("og:image 와 본문 img 가 같은 파일이라고 확정할 수 없음");

  // noimageindex 계열이 걸려 있으면 썸네일이 통째로 막힌다.
  if (/noimageindex/i.test(html)) note("noimageindex 메타 있음");
  if (/max-image-preview:none/i.test(html)) note("max-image-preview:none 있음");

  // ④⑤ 실물 PNG
  const info = await imageInfo(expected);
  if (!info.ok) note(`PNG 없음/열기 실패: ${expected} (${info.err})`);
  else {
    if (info.width !== 1200 || info.height !== 1200)
      note(`PNG 크기 ${info.width}×${info.height} (기대 1200×1200)`);
    if (info.format !== "png") note(`PNG 아님: ${info.format}`);
    if (info.bytes > MAX_BYTES) note(`용량 ${Math.round(info.bytes / 1024)}KB > 300KB`);
  }

  const pass = fail === before;
  rows.push({
    path,
    file: expected,
    img: thumbImgs.length === 1 ? "O" : "X",
    meta9: "확인",
    size: info.ok ? `${info.width}×${info.height}` : "-",
    kb: info.ok ? Math.round(info.bytes / 1024) : "-",
    pass,
  });
  if (pass) console.log("  ✓ 통과");
}

// ── robots.txt / _headers 점검
const robots = await readFile(join(PUB, "robots.txt"), "utf8");
console.log("\n▸ robots.txt");
if (/Disallow:\s*\S/.test(robots)) {
  const bad = robots.match(/Disallow:\s*\S+/g);
  note(`Disallow 규칙 있음: ${bad.join(", ")}`);
} else console.log("  ✓ Disallow 0건 — /og/ 차단 없음");
if (/noimageindex/i.test(robots)) note("robots.txt 에 noimageindex");

const headers = await readFile(join(PUB, "_headers"), "utf8");
if (/noimageindex/i.test(headers)) note("_headers 에 noimageindex");
else console.log("  ✓ _headers 에 noimageindex 없음");

// ── /og/ 안의 PNG 전수 실측
console.log("\n▸ public/og/*.png 전수 실측");
const files = (await readdir(join(PUB, "og"))).filter((f) => f.endsWith(".png"));
let over = 0;
for (const f of files) {
  const info = await imageInfo(`/og/${f}`);
  if (!info.ok || info.width !== 1200 || info.height !== 1200) {
    note(`${f} 크기 ${info.width}×${info.height}`);
  }
  if (info.bytes > MAX_BYTES) {
    note(`${f} ${Math.round(info.bytes / 1024)}KB > 300KB`);
    over++;
  }
}
console.log(`  파일 ${files.length}장 · 300KB 초과 ${over}장`);

console.log("\n" + "─".repeat(72));
console.log(`검사 페이지 ${rows.length}장 · 실패 항목 ${fail}건`);
console.log(fail === 0 ? "✅ G9+ 전 항목 통과 — 배포 가능" : "⛔ 실패 있음 — 배포 금지");
process.exit(fail === 0 ? 0 : 1);
