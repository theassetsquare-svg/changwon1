#!/usr/bin/env node
// 고정 페이지(소개·담당·위치·문의·가는 길 허브)용 1:1 썸네일 생성기.
//   출력: public/og/page-{key}-og.png  (1200×1200 PNG)
//
// 내용 규칙은 public/og-default.png(scripts/gen-og.mjs)와 같다.
//   상단 라벨 → 브랜드명 → 페이지 주제 → 골드 패널(전화 예약·문의 · 웨이터 로또 · 전화번호)
//   → 연령·신분증 표기 → 도메인.
// 페이지마다 다른 건 상단 라벨과 주제 한 줄뿐이다. 전화번호·연령은 site.ts 값 그대로 쓴다.
//
// 사용법: node scripts/gen-page-og.mjs

import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(ROOT, "public", "og");
const FF = "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', system-ui, sans-serif";
const SIZE = 1200;
const MAX_BYTES = 300 * 1024;

const BRAND = "창원 룰루랄라 나이트";
const NICK = "로또";
const PHONE = "010-7528-4936";
const AGE = "만 27세 이상";
const DOMAIN = "j.nolcool.com";

/** 페이지별 상단 라벨과 주제 한 줄. 나머지 구성은 전부 같다. */
const PAGES = [
  { key: "about", label: "창원시 · 합법 영업장", topic: "가게 소개" },
  { key: "jjanggua", label: `웨이터 · ${NICK}`, topic: "담당 웨이터" },
  { key: "location", label: "성산구 마디미로43번길 10", topic: "찾아오는 길" },
  { key: "contacta", label: "전화로만 접수", topic: "전화 예약·문의" },
  { key: "access", label: "전국 나이트 가는 길", topic: "가는 길 40곳" },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const PHONE_PATH =
  "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z";
const phoneIcon = (x, y, size, fill) =>
  `<path d="${PHONE_PATH}" fill="${fill}" transform="translate(${x},${y}) scale(${size / 24})"/>`;

const DEFS = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#000000"/>
      <stop offset="55%" stop-color="#111315"/>
      <stop offset="100%" stop-color="#1f2937"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="50%" stop-color="#FCD34D"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
    <linearGradient id="goldPanel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="45%" stop-color="#FCD34D"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.82" cy="0.14" r="0.65">
      <stop offset="0%" stop-color="rgba(252,211,77,0.34)"/>
      <stop offset="60%" stop-color="rgba(252,211,77,0.07)"/>
      <stop offset="100%" stop-color="rgba(252,211,77,0)"/>
    </radialGradient>
  </defs>`;

/** 흰 글자를 검은 캔버스에 그려 실제 렌더 폭을 픽셀로 잰다. */
async function measure(text, fontSize, weight = 900) {
  const w = 2400;
  const h = Math.ceil(fontSize * 2.4);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="#000000"/>
  <text x="${w / 2}" y="${Math.round(h * 0.7)}" text-anchor="middle" font-family="${FF}" font-size="${fontSize}" font-weight="${weight}" fill="#FFFFFF">${esc(text)}</text>
</svg>`;
  const { data, info } = await sharp(Buffer.from(svg))
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let minX = info.width, maxX = -1, minY = info.height, maxY = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[y * info.width + x] > 128) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return { width: 0, height: 0 };
  return { width: maxX - minX + 1, height: maxY - minY + 1 };
}

async function fit(text, startSize, maxWidth, weight) {
  let size = startSize;
  let m = await measure(text, size, weight);
  for (let i = 0; i < 40 && m.width > maxWidth; i++) {
    size -= 3;
    m = await measure(text, size, weight);
  }
  return { size, ...m };
}

await mkdir(OUT, { recursive: true });

let fail = 0;
for (const p of PAGES) {
  const brandFit = await fit(BRAND, 86, 1000, 800);
  const topicFit = await fit(p.topic, 128, 1020, 900);
  const labelFit = await fit(p.label, 38, 1000, 700);
  if (brandFit.width === 0 || topicFit.width === 0 || labelFit.width === 0) {
    console.log(`⚠︎ 글자 미렌더(폰트 없음): ${p.key}`);
    fail++;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}" role="img" aria-label="${esc(`${BRAND} ${p.topic}`)}">
  ${DEFS}
  <rect width="1200" height="1200" fill="url(#bg)"/>
  <rect width="1200" height="1200" fill="url(#glow)"/>
  <rect x="34" y="34" width="1132" height="1132" rx="34" fill="none" stroke="url(#gold)" stroke-width="3" opacity="0.55"/>

  <text x="600" y="150" text-anchor="middle" font-family="${FF}" font-size="${labelFit.size}" font-weight="700" letter-spacing="9" fill="#FCD34D">${esc(p.label)}</text>
  <text x="600" y="272" text-anchor="middle" font-family="${FF}" font-size="${brandFit.size}" font-weight="800" fill="#FFFFFF">${esc(BRAND)}</text>
  <text x="600" y="420" text-anchor="middle" font-family="${FF}" font-size="${topicFit.size}" font-weight="900" fill="url(#gold)">${esc(p.topic)}</text>

  <rect x="70" y="500" width="1060" height="480" rx="40" fill="url(#goldPanel)"/>
  ${phoneIcon(388, 548, 58, "#0a0a0a")}
  <text x="462" y="597" font-family="${FF}" font-size="58" font-weight="800" fill="#0a0a0a">전화 예약·문의</text>
  <text x="600" y="738" text-anchor="middle" font-family="${FF}" font-size="94" font-weight="900" fill="#0a0a0a">웨이터 ${NICK}</text>
  <text x="600" y="898" text-anchor="middle" font-family="${FF}" font-size="118" font-weight="900" fill="#0a0a0a">${PHONE}</text>

  <text x="600" y="1068" text-anchor="middle" font-family="${FF}" font-size="46" font-weight="800" fill="#FCD34D">${AGE} 출입 · 신분증 확인</text>
  <text x="600" y="1128" text-anchor="middle" font-family="${FF}" font-size="30" font-weight="500" fill="#8b909b">${DOMAIN}</text>
</svg>`;

  const file = join(OUT, `page-${p.key}-og.png`);
  await sharp(Buffer.from(svg), { density: 96 })
    .resize(SIZE, SIZE)
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(file);

  const meta = await sharp(file).metadata();
  const bytes = (await stat(file)).size;
  if (meta.width !== SIZE || meta.height !== SIZE) {
    console.log(`⚠︎ 크기 불일치: ${p.key} ${meta.width}×${meta.height}`);
    fail++;
  }
  if (bytes > MAX_BYTES) {
    console.log(`⚠︎ 용량 초과: ${p.key} ${Math.round(bytes / 1024)}KB`);
    fail++;
  }
  console.log(
    `✓ page-${p.key}-og.png  ${meta.width}×${meta.height}  ${Math.round(bytes / 1024)}KB  주제 "${p.topic}"`
  );
}

console.log(fail === 0 ? `\n→ ✅ ${PAGES.length}장 생성` : `\n→ ⚠︎ 문제 ${fail}건`);
process.exit(fail === 0 ? 0 : 1);
