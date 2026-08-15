#!/usr/bin/env node
// /night/{slug}/ 페이지용 1:1 OG 썸네일 생성기.
//   출력: public/og/{slug}-og.png  (1200×1200 PNG)
// 한글 렌더에는 ~/.fonts 에 설치된 Pretendard 를 씁니다. 폰트가 없으면 글자가 깨지므로
// 생성 후 반드시 이미지를 눈으로 확인하세요.
//
// 사용법: node scripts/gen-night-og.mjs

import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { execSync } from "node:child_process";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(ROOT, "public", "og");
const FF = "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif";
const SIZE = 1200;
const MARGIN = 100; // 좌우 최소 여백
const BRAND = "창원 룰루랄라 나이트";

// venues.ts 는 TypeScript 라 node 로 직접 못 읽는다. 타입 스트리핑으로 값만 뽑아 온다.
const raw = execSync(
  `node --experimental-strip-types -e ` +
    `"import('${join(ROOT, "components/night/venues.ts")}').then(m=>console.log(JSON.stringify(` +
    `m.VENUES.map(v=>({slug:v.slug,name:v.name,og:v.og,alt:v.ogAlt})))))"`,
  { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
);
const VENUES = JSON.parse(raw);

const srgb = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
}
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

// 한 줄이 최대 폭을 넘으면 두 줄까지 자동으로 나눈다.
function fit(lines, maxWidth) {
  let out = lines.slice(0, 2);
  const longest = Math.max(...out.map((l) => l.length));
  let size = Math.min(140, Math.floor(maxWidth / longest));
  if (out.length === 1 && size < 96) {
    const s = out[0];
    const half = Math.ceil(s.length / 2);
    out = [s.slice(0, half), s.slice(half)];
    size = Math.min(140, Math.floor(maxWidth / Math.max(...out.map((l) => l.length))));
  }
  return { lines: out, size };
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

await mkdir(OUT, { recursive: true });

const seen = new Map();
let fail = 0;

for (const v of VENUES) {
  const { bg, accent, region, badge } = v.og;
  const c = contrast(bg, "#ffffff");
  if (seen.has(bg)) {
    console.log(`⚠︎ 배경색 중복: ${v.slug} ↔ ${seen.get(bg)} (${bg})`);
    fail++;
  }
  seen.set(bg, v.slug);
  if (c < 4.5) {
    console.log(`⚠︎ 명도대비 부족: ${v.slug} ${bg} vs #ffffff = ${c.toFixed(2)}:1`);
    fail++;
  }

  const { lines, size } = fit(v.og.lines, SIZE - MARGIN * 2);
  const blockTop = lines.length === 2 ? 470 : 560;
  const nameText = lines
    .map(
      (l, i) =>
        `<text x="600" y="${blockTop + i * (size + 24)}" text-anchor="middle" font-family="${FF}" font-size="${size}" font-weight="900" fill="#FFFFFF">${esc(l)}</text>`
    )
    .join("\n  ");

  const badgeSvg = badge
    ? `<rect x="${SIZE - 100 - 300}" y="86" width="300" height="86" rx="43" fill="${accent}"/>
  <text x="${SIZE - 100 - 150}" y="144" text-anchor="middle" font-family="${FF}" font-size="44" font-weight="900" fill="#111111">${esc(badge)}</text>`
    : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-label="${esc(v.alt)}">
  <rect width="${SIZE}" height="${SIZE}" fill="${bg}"/>
  <rect x="40" y="40" width="${SIZE - 80}" height="${SIZE - 80}" rx="36" fill="none" stroke="${accent}" stroke-width="3" opacity="0.5"/>
  ${badgeSvg}
  <text x="600" y="250" text-anchor="middle" font-family="${FF}" font-size="40" font-weight="700" letter-spacing="8" fill="${accent}">업소 정보 안내</text>
  ${nameText}
  <text x="600" y="880" text-anchor="middle" font-family="${FF}" font-size="62" font-weight="800" fill="${accent}">${esc(region)}</text>
  <line x1="300" y1="980" x2="900" y2="980" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="2"/>
  <text x="600" y="1062" text-anchor="middle" font-family="${FF}" font-size="44" font-weight="700" fill="#FFFFFF">${esc(BRAND)}</text>
  <text x="600" y="1122" text-anchor="middle" font-family="${FF}" font-size="30" font-weight="500" fill="#FFFFFF" fill-opacity="0.6">changwon1.pages.dev</text>
</svg>`;

  const file = join(OUT, `${v.slug}-og.png`);
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(file);
  const meta = await sharp(file).metadata();
  console.log(
    `✓ ${v.slug}-og.png  ${meta.width}×${meta.height}  bg ${bg}  대비 ${c.toFixed(1)}:1`
  );
}

console.log(fail === 0 ? "\n→ ✅ 배경색 13종 상이 · 명도대비 전부 4.5:1 이상" : `\n→ ⚠︎ 문제 ${fail}건`);
process.exit(fail === 0 ? 0 : 1);
