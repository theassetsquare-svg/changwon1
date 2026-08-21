#!/usr/bin/env node
// /access/{slug}/ 페이지용 1:1 썸네일 생성기.
//   출력: public/og/access-{slug}-og.png  (1200×1200 PNG)
//
// 카드 내용 규칙은 scripts/gen-night-og.mjs 와 같다. 페이지 주제만 "가는 길"로 바뀐다.
//   A그룹(광고주 있음) — 하단 40%를 검은 띠로 깔고 담당 닉네임과 전화번호를 크게.
//   B그룹(광고주 없음) — 업소명 + 지역명 + 그 업소의 "지역+업종" 표기만. 전화번호·besta12 없음.
//   다른 업소 카드에는 창원 룰루랄라 브랜드를 절대 넣지 않는다. 남의 가게 썸네일이다.
//
// 배경색은 40장이 전부 다르고, 흰 글자와 명도대비 4.5:1 이상인 값만 쓴다.
// 글자는 실제 렌더 픽셀을 재서 폭 초과·미렌더(□)를 확인한 뒤 저장한다.
//
// 사용법: node scripts/gen-access-og.mjs

import sharp from "sharp";
import { mkdir, writeFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { loadAccessVenues } from "./access-data.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(ROOT, "public", "og");
const FF = "'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif";
const SIZE = 1200;
const NAME_MARGIN = 100;
const PHONE_MARGIN = 40;
const BAND_TOP = 720;
const MAX_BYTES = 300 * 1024;

const VENUES = loadAccessVenues();

const srgb = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
}
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

/** HSL(도, %, %) → #rrggbb */
function hsl(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const seg = [
    [c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x],
  ][Math.floor(h / 60)];
  return (
    "#" +
    seg
      .map((v) => Math.round((v + m) * 255).toString(16).padStart(2, "0"))
      .join("")
  );
}

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
  for (let i = 0; i < 12; i++) {
    m = await measure(text, size);
    if (m.width <= maxWidth) break;
    size -= 4;
  }
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

/** "신림 그랑프리나이트" → ["신림","그랑프리나이트"]. 공백이 없으면 한 줄. */
function nameLines(nameSpaced) {
  const parts = nameSpaced.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts;
  if (parts.length === 2) return parts;
  // 세 조각 이상이면 앞쪽을 한 줄로 묶는다.
  return [parts.slice(0, -1).join(" "), parts[parts.length - 1]];
}

await mkdir(OUT, { recursive: true });

const seen = new Map();
const report = [];
let fail = 0;

for (let i = 0; i < VENUES.length; i++) {
  const v = VENUES[i];
  // 40장 배경색을 색상환에 고르게 뿌린다. 명도를 낮게 고정해 흰 글자 대비를 확보한다.
  const hue = (i * 137 + 205) % 360;
  const bg = hsl(hue, 46, 20);
  const accent = hsl(hue, 72, 74);
  const cWhite = contrast(bg, "#ffffff");
  const cAccent = contrast(bg, accent);

  if (seen.has(bg)) {
    console.log(`⚠︎ 배경색 중복: ${v.slug} ↔ ${seen.get(bg)} (${bg})`);
    fail++;
  }
  seen.set(bg, v.slug);
  if (cWhite < 4.5) {
    console.log(`⚠︎ 명도대비 부족: ${v.slug} ${bg} vs #ffffff = ${cWhite.toFixed(2)}:1`);
    fail++;
  }
  if (cAccent < 3) {
    console.log(`⚠︎ 강조색 대비 부족: ${v.slug} ${bg} vs ${accent} = ${cAccent.toFixed(2)}:1`);
    fail++;
  }

  const isA = v.group === "A" && v.contact;
  const lines = nameLines(v.nameSpaced);
  const maxNameWidth = SIZE - NAME_MARGIN * 2;

  // 두 줄이 같은 크기로 보이도록 더 긴 줄 기준으로 폰트를 맞춘다.
  let nameSize = 150;
  for (const l of lines) {
    const f = await fitText(l, nameSize, maxNameWidth, 900);
    nameSize = Math.min(nameSize, f.size);
  }
  let blank = false;
  for (const l of lines) {
    const m = await measure(l, nameSize, 900);
    if (m.width === 0) blank = true;
  }
  if (blank) {
    console.log(`⚠︎ 업소명 미렌더(폰트 없음): ${v.slug}`);
    fail++;
  }

  const blockTop = lines.length === 2 ? 380 : 470;
  const nameSvg = lines
    .map(
      (l, k) =>
        `<text x="600" y="${blockTop + k * (nameSize + 30)}" text-anchor="middle" font-family="${FF}" font-size="${nameSize}" font-weight="900" fill="#FFFFFF">${esc(l)}</text>`
    )
    .join("\n  ");

  let bodySvg;
  let phoneInfo = null;

  if (isA) {
    const reg = await fitText(v.region, 54, SIZE - 160, 800);
    const phone = v.contact.phone;
    phoneInfo = await fitPhone(phone, SIZE - PHONE_MARGIN * 2, 105);
    const nick = await measure(v.contact.name, 96, 800);
    bodySvg = `<text x="600" y="${BAND_TOP - 38}" text-anchor="middle" font-family="${FF}" font-size="${reg.size}" font-weight="800" fill="${accent}">${esc(v.region)}</text>
  <rect x="0" y="${BAND_TOP}" width="${SIZE}" height="${SIZE - BAND_TOP}" fill="#000000"/>
  <text x="600" y="855" text-anchor="middle" font-family="${FF}" font-size="96" font-weight="800" fill="#FFFFFF">${esc(v.contact.name)}</text>
  <text x="600" y="1105" text-anchor="middle" font-family="${FF}" font-size="${phoneInfo.size}" font-weight="900" fill="#FFFFFF">${esc(phone)}</text>`;
    phoneInfo.nickHeight = nick.height;
  } else {
    // 광고주가 없는 업소 카드다. 그 업소의 지역+업종 표기만 넣고 다른 상호는 넣지 않는다.
    const reg = await fitText(v.region, 62, SIZE - 160, 800);
    const kw = await fitText(v.cityKeyword, 52, SIZE - 200, 700);
    bodySvg = `<text x="600" y="770" text-anchor="middle" font-family="${FF}" font-size="${reg.size}" font-weight="800" fill="${accent}">${esc(v.region)}</text>
  <line x1="300" y1="880" x2="900" y2="880" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="2"/>
  <text x="600" y="985" text-anchor="middle" font-family="${FF}" font-size="${kw.size}" font-weight="700" fill="#FFFFFF">${esc(v.cityKeyword)}</text>
  <text x="600" y="1070" text-anchor="middle" font-family="${FF}" font-size="34" font-weight="500" fill="#FFFFFF" fill-opacity="0.7">가는 길 안내 페이지</text>`;
  }

  const alt = `${v.nameSpaced} 가는 길·귀가 안내`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-label="${esc(alt)}">
  <rect width="${SIZE}" height="${SIZE}" fill="${bg}"/>
  <rect x="40" y="40" width="${SIZE - 80}" height="${isA ? BAND_TOP - 145 : SIZE - 80}" rx="36" fill="none" stroke="${accent}" stroke-width="3" opacity="0.5"/>
  <text x="600" y="230" text-anchor="middle" font-family="${FF}" font-size="38" font-weight="700" letter-spacing="8" fill="${accent}">가는 길 안내</text>
  ${nameSvg}
  ${bodySvg}
</svg>`;

  // 남의 가게 카드에 우리 상호가 새어 들어가지 않았는지 소스에서 직접 확인한다.
  if (/창원|룰루랄라/.test(svg) && !/^창원/.test(v.name)) {
    console.log(`⚠︎ 다른 업소 카드에 창원 브랜드 혼입: ${v.slug}`);
    fail++;
  }

  const file = join(OUT, `access-${v.slug}-og${v.ogV ?? ""}.png`);
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(file);
  const meta = await sharp(file).metadata();
  const bytes = (await stat(file)).size;

  if (meta.width !== SIZE || meta.height !== SIZE) {
    console.log(`⚠︎ 크기 불일치: ${v.slug} ${meta.width}×${meta.height}`);
    fail++;
  }
  if (bytes > MAX_BYTES) {
    console.log(`⚠︎ 용량 초과: ${v.slug} ${Math.round(bytes / 1024)}KB`);
    fail++;
  }

  // A그룹은 저장된 이미지에서 검은 띠 구간의 흰 글자 범위를 다시 재서 잘림을 확인한다.
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
    file: `access-${v.slug}-og.png`,
    group: v.group,
    size: `${meta.width}×${meta.height}`,
    bytes,
    bg,
    bgContrast: `${cWhite.toFixed(1)}:1`,
    nameSize,
    alt,
    nick: isA ? v.contact.name : "-",
    phone: isA ? v.contact.phone : "-",
    phoneGlyphH: isA ? `${phoneInfo.height}px` : "-",
    clip,
  });
  console.log(
    `✓ access-${v.slug}-og.png  ${meta.width}×${meta.height}  ${Math.round(bytes / 1024)}KB  bg ${bg} (${cWhite.toFixed(1)}:1)` +
      (isA ? `  전화 ${phoneInfo.height}px  ${clip}` : "")
  );
}

await writeFile(join(ROOT, "scripts", ".og-access-report.json"), JSON.stringify(report, null, 2));
console.log(
  fail === 0
    ? `\n→ ✅ ${VENUES.length}장 생성. 배경색 전부 상이 · 대비 4.5:1 이상 · 1200×1200 · 300KB 이하`
    : `\n→ ⚠︎ 문제 ${fail}건`
);
process.exit(fail === 0 ? 0 : 1);
