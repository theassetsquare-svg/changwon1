#!/usr/bin/env node
// 썸네일/OG 이미지 생성기 — SVG 디자인을 PNG로 래스터화.
// 검색엔진·SNS는 SVG 미리보기를 렌더하지 않으므로 PNG 필수.
// 한글 렌더를 위해 Pretendard TTF가 fontconfig 경로(~/.fonts)에 설치돼 있어야 합니다.
//
// 출력:
//   public/og-default.png   1200×1200 (1:1 — 네이버 검색 썸네일 기준 이미지)
//   public/og-cover.png     1200×630  (링크 미리보기 표준 1.91:1)
//
// 사용법: node scripts/gen-og.mjs

import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PUB = join(ROOT, "public");
const FF = "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', system-ui, sans-serif";

const NAME = "창원 룰루랄라";
const NICK = "로또";
const PHONE = "010-7528-4936";
const AGE = "만 27세 이상";

// 이모지 폰트가 없는 환경에서도 깨지지 않도록 전화 아이콘은 벡터 path로 그립니다.
const PHONE_PATH = "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z";
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

// 1:1 정사각 1200×1200 — 네이버 검색 썸네일.
// 작게 축소돼도 닉네임(로또)과 전화번호가 읽히도록 골드 패널 + 검정 글자로 대비 최대화.
const square = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" role="img" aria-label="창원 룰루랄라 나이트 웨이터 로또 010-7528-4936 만 27세 이상">
  ${DEFS}
  <rect width="1200" height="1200" fill="url(#bg)"/>
  <rect width="1200" height="1200" fill="url(#glow)"/>
  <rect x="34" y="34" width="1132" height="1132" rx="34" fill="none" stroke="url(#gold)" stroke-width="3" opacity="0.55"/>

  <text x="600" y="150" text-anchor="middle" font-family="${FF}" font-size="36" font-weight="700" letter-spacing="9" fill="#FCD34D">창원시 · 합법 영업장</text>

  <text x="600" y="300" text-anchor="middle" font-family="${FF}" font-size="122" font-weight="900" fill="#FFFFFF">${NAME}</text>
  <text x="600" y="424" text-anchor="middle" font-family="${FF}" font-size="122" font-weight="900" fill="url(#gold)">나이트</text>

  <rect x="70" y="500" width="1060" height="480" rx="40" fill="url(#goldPanel)"/>
  ${phoneIcon(388, 548, 58, "#0a0a0a")}
  <text x="462" y="597" font-family="${FF}" font-size="58" font-weight="800" fill="#0a0a0a">전화 예약·문의</text>
  <text x="600" y="738" text-anchor="middle" font-family="${FF}" font-size="94" font-weight="900" fill="#0a0a0a">웨이터 ${NICK}</text>
  <text x="600" y="898" text-anchor="middle" font-family="${FF}" font-size="118" font-weight="900" fill="#0a0a0a">${PHONE}</text>

  <text x="600" y="1068" text-anchor="middle" font-family="${FF}" font-size="46" font-weight="800" fill="#FCD34D">${AGE} 출입 · 신분증 확인</text>
  <text x="600" y="1128" text-anchor="middle" font-family="${FF}" font-size="30" font-weight="500" fill="#8b909b">changwon1.pages.dev</text>
</svg>`;

// 와이드 1200×630 (링크 미리보기 표준)
const cover = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-label="창원 룰루랄라 나이트 웨이터 로또 010-7528-4936 만 27세 이상">
  ${DEFS}
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="28" y="28" width="1144" height="574" rx="30" fill="none" stroke="url(#gold)" stroke-width="3" opacity="0.55"/>

  <text x="80" y="120" font-family="${FF}" font-size="30" font-weight="700" letter-spacing="7" fill="#FCD34D">창원시 · 합법 영업장 · ${AGE}</text>
  <text x="80" y="228" font-family="${FF}" font-size="82" font-weight="900" fill="#FFFFFF">${NAME} <tspan fill="url(#gold)">나이트</tspan></text>

  <rect x="70" y="290" width="1060" height="270" rx="32" fill="url(#goldPanel)"/>
  ${phoneIcon(112, 328, 44, "#0a0a0a")}
  <text x="172" y="368" font-family="${FF}" font-size="44" font-weight="800" fill="#0a0a0a">전화 예약·문의 · 웨이터 ${NICK}</text>
  <text x="600" y="512" text-anchor="middle" font-family="${FF}" font-size="112" font-weight="900" fill="#0a0a0a">${PHONE}</text>

  <text x="80" y="600" font-family="${FF}" font-size="26" font-weight="500" fill="#8b909b">changwon1.pages.dev · 신분증 확인</text>
</svg>`;

async function render(svg, w, h, out) {
  await sharp(Buffer.from(svg), { density: 96 })
    .resize(w, h)
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(join(PUB, out));
  console.log(`✓ ${out} (${w}×${h})`);
}

await render(square, 1200, 1200, "og-default.png");
await render(cover, 1200, 630, "og-cover.png");
console.log("완료. SeoHead의 og:image가 1:1 PNG를 먼저 가리키는지 확인하세요.");
