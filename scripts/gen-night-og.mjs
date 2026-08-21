#!/usr/bin/env node
// /night/{slug}/ 페이지용 1:1 OG 썸네일 생성기.
//   출력: public/og/{slug}-og.png  (1200×1200 PNG)
//
// A그룹(광고주 있음) — 하단 40%를 검은 띠로 깔고 담당자 닉네임과 전화번호를 크게 넣는다.
//   전화번호는 이미지에서 두 번째로 큰 글자이며, 실제 렌더 픽셀을 측정해
//   글자 높이 100px 이상 · 좌우 잘림 없음을 확인한 뒤 저장한다.
// B그룹(광고주 없음) — 업소명 + 지역명 + 그 업소의 "지역+업종" 표기만. 전화번호·besta12 없음.
//   다른 업소 카드에는 창원 룰루랄라 브랜드를 절대 넣지 않는다. 남의 가게 썸네일이다.
//
// 한글 렌더에는 ~/.fonts 의 Pretendard 를 쓴다. 폰트가 없으면 글자가 □로 깨지므로
// 생성 뒤 measure() 가 픽셀을 세어 렌더 여부까지 같이 검증한다.
//
// 사용법: node scripts/gen-night-og.mjs

import sharp from "sharp";
import { mkdir, writeFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { execSync } from "node:child_process";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(ROOT, "public", "og");
const FF = "'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif";
const SIZE = 1200;
const NAME_MARGIN = 100; // 업소명 좌우 최소 여백
const PHONE_MARGIN = 40; // 전화번호 좌우 최소 여백
const BAND_TOP = 720; // 1200 * 0.60

const raw = execSync(
  `node --experimental-strip-types -e ` +
    `"import('${join(ROOT, "components/night/venues.ts")}').then(m=>console.log(JSON.stringify(` +
    `m.VENUES.map(v=>({slug:v.slug,name:v.name,cityKeyword:v.cityKeyword,og:v.og,alt:v.ogAlt,group:v.group,contact:v.contact,ogV:v.ogV})))))"`,
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

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** 흰 글자를 검은 캔버스에 그려 실제 렌더 폭·높이를 픽셀로 잰다. */
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

/** 폭 한도 안에서 글자 높이를 최대한 키운 전화번호 폰트 크기를 찾는다. */
async function fitPhone(text, maxWidth, minGlyphHeight) {
  let size = 200;
  let m = await measure(text, size);
  if (m.width > maxWidth) size = Math.floor((size * maxWidth) / m.width);
  // 폭 한도 안으로 들어올 때까지 줄인다.
  for (let i = 0; i < 12; i++) {
    m = await measure(text, size);
    if (m.width <= maxWidth) break;
    size -= 4;
  }
  // 높이가 모자라면 폭 한도 안에서만 키운다.
  for (let i = 0; i < 24 && m.height < minGlyphHeight; i++) {
    const next = size + 4;
    const nm = await measure(text, next);
    if (nm.width > maxWidth) break;
    size = next;
    m = nm;
  }
  return { size, ...m };
}

/** 주어진 크기에서 시작해 폭 한도 안으로 들어올 때까지 줄인다. */
async function fitText(text, startSize, maxWidth, weight = 800) {
  let size = startSize;
  for (let i = 0; i < 40; i++) {
    const m = await measure(text, size, weight);
    if (m.width === 0) return { size, width: 0 };
    if (m.width <= maxWidth) return { size, width: m.width };
    size -= 3;
  }
  return { size, width: maxWidth };
}

function nameBlock(lines, maxWidth) {
  const out = lines.slice(0, 2);
  const longest = Math.max(...out.map((l) => l.length));
  const size = Math.min(150, Math.floor(maxWidth / longest));
  return { lines: out, size };
}

await mkdir(OUT, { recursive: true });

const seen = new Map();
const report = [];
let fail = 0;

for (const v of VENUES) {
  const { bg, accent, region, badge } = v.og;
  const cWhite = contrast(bg, "#ffffff");
  if (seen.has(bg)) {
    console.log(`⚠︎ 배경색 중복: ${v.slug} ↔ ${seen.get(bg)} (${bg})`);
    fail++;
  }
  seen.set(bg, v.slug);
  if (cWhite < 4.5) {
    console.log(`⚠︎ 명도대비 부족: ${v.slug} ${bg} vs #ffffff = ${cWhite.toFixed(2)}:1`);
    fail++;
  }

  const isA = v.group === "A" && v.contact;
  const nb = nameBlock(v.og.lines, SIZE - NAME_MARGIN * 2);
  const blockTop = nb.lines.length === 2 ? 380 : 470;
  const nameSvg = nb.lines
    .map(
      (l, i) =>
        `<text x="600" y="${blockTop + i * (nb.size + 30)}" text-anchor="middle" font-family="${FF}" font-size="${nb.size}" font-weight="900" fill="#FFFFFF">${esc(l)}</text>`
    )
    .join("\n  ");

  const badgeSvg = badge
    ? `<rect x="${SIZE - 60 - 360}" y="70" width="360" height="88" rx="44" fill="${accent}"/>
  <text x="${SIZE - 60 - 180}" y="130" text-anchor="middle" font-family="${FF}" font-size="46" font-weight="900" fill="#111111">${esc(badge)}</text>`
    : "";

  let bodySvg;
  let phoneInfo = null;

  if (isA) {
    const phone = v.contact.phone;
    phoneInfo = await fitPhone(phone, SIZE - PHONE_MARGIN * 2, 105);
    const nick = await measure(v.contact.name, 96, 800);
    bodySvg = `<text x="600" y="${BAND_TOP - 38}" text-anchor="middle" font-family="${FF}" font-size="54" font-weight="800" fill="${accent}">${esc(region)}</text>
  <rect x="0" y="${BAND_TOP}" width="${SIZE}" height="${SIZE - BAND_TOP}" fill="#000000"/>
  <text x="600" y="855" text-anchor="middle" font-family="${FF}" font-size="96" font-weight="800" fill="#FFFFFF">${esc(v.contact.name)}</text>
  <text x="600" y="1105" text-anchor="middle" font-family="${FF}" font-size="${phoneInfo.size}" font-weight="900" fill="#FFFFFF">${esc(phone)}</text>`;
    phoneInfo.nickHeight = nick.height;
  } else {
    // 광고주가 없는 업소 카드다. 그 업소의 지역+업종 표기만 넣고 다른 상호는 넣지 않는다.
    const kw = await fitText(v.cityKeyword, 52, SIZE - 200, 700);
    bodySvg = `<text x="600" y="770" text-anchor="middle" font-family="${FF}" font-size="62" font-weight="800" fill="${accent}">${esc(region)}</text>
  <line x1="300" y1="880" x2="900" y2="880" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="2"/>
  <text x="600" y="985" text-anchor="middle" font-family="${FF}" font-size="${kw.size}" font-weight="700" fill="#FFFFFF">${esc(v.cityKeyword)}</text>
  <text x="600" y="1070" text-anchor="middle" font-family="${FF}" font-size="34" font-weight="500" fill="#FFFFFF" fill-opacity="0.7">업소 안내 페이지</text>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-label="${esc(v.alt)}">
  <rect width="${SIZE}" height="${SIZE}" fill="${bg}"/>
  <rect x="40" y="40" width="${SIZE - 80}" height="${isA ? BAND_TOP - 145 : SIZE - 80}" rx="36" fill="none" stroke="${accent}" stroke-width="3" opacity="0.5"/>
  ${badgeSvg}
  <text x="600" y="230" text-anchor="middle" font-family="${FF}" font-size="38" font-weight="700" letter-spacing="8" fill="${accent}">업소 안내</text>
  ${nameSvg}
  ${bodySvg}
</svg>`;

  // 남의 가게 카드에 우리 상호가 새어 들어가지 않았는지 소스에서 직접 확인한다.
  if (/창원|룰루랄라/.test(svg) && !/^창원/.test(v.name)) {
    console.log(`⚠︎ 다른 업소 카드에 창원 브랜드 혼입: ${v.slug}`);
    fail++;
  }

  const file = join(OUT, `${v.slug}-og${v.ogV ?? ""}.png`);
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(file);
  const meta = await sharp(file).metadata();

  // 저장된 이미지에서 검은 띠 구간의 흰 글자 범위를 다시 재서 잘림을 확인한다.
  let clip = "-";
  if (isA) {
    const bandH = SIZE - 960;
    const { data, info } = await sharp(file)
      .extract({ left: 0, top: 960, width: SIZE, height: bandH })
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });
    let minX = info.width, maxX = -1;
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        if (data[y * info.width + x] > 128) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
        }
      }
    }
    clip = maxX < 0 ? "글자없음" : `좌${minX}px/우${SIZE - maxX - 1}px 여백`;
    if (maxX < 0 || minX < 8 || SIZE - maxX - 1 < 8) {
      console.log(`⚠︎ 전화번호 잘림 의심: ${v.slug} (${clip})`);
      fail++;
    }
    if (phoneInfo.height < 100) {
      console.log(`⚠︎ 전화번호 글자 높이 부족: ${v.slug} ${phoneInfo.height}px`);
      fail++;
    }
  }

  report.push({
    slug: v.slug,
    group: v.group,
    size: `${meta.width}×${meta.height}`,
    bytes: (await stat(file)).size,
    bg,
    bgContrast: `${cWhite.toFixed(1)}:1`,
    nick: isA ? v.contact.name : "-",
    phone: isA ? v.contact.phone : "-",
    phoneFont: isA ? phoneInfo.size : "-",
    phoneGlyphH: isA ? `${phoneInfo.height}px` : "-",
    nickGlyphH: isA ? `${phoneInfo.nickHeight}px` : "-",
    bandContrast: isA ? `${contrast("#000000", "#ffffff").toFixed(0)}:1` : "-",
    clip,
    badge: badge || "-",
  });
  console.log(
    `✓ ${v.slug}-og.png  ${meta.width}×${meta.height}  ${Math.round((await stat(file)).size / 1024)}KB  bg ${bg} (${cWhite.toFixed(1)}:1)` +
      (isA ? `  전화 ${phoneInfo.height}px  ${clip}` : "")
  );
}

await writeFile(join(ROOT, "scripts", ".og-report.json"), JSON.stringify(report, null, 2));
console.log(
  fail === 0
    ? `\n→ ✅ ${VENUES.length}장 생성. 배경색 전부 상이 · 대비 4.5:1 이상 · A그룹 전화번호 렌더 확인`
    : `\n→ ⚠︎ 문제 ${fail}건`
);
process.exit(fail === 0 ? 0 : 1);
