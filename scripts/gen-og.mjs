#!/usr/bin/env node
// OG 이미지 생성기 — SVG 디자인을 PNG로 래스터화.
// 카카오톡·트위터·페이스북은 SVG og:image 미리보기를 렌더하지 않으므로 PNG 필수.
// 한글 렌더를 위해 Pretendard TTF가 fontconfig 경로에 설치돼 있어야 합니다.
//   (없으면 scripts/setup-fonts.sh 참고)
//
// 출력:
//   public/og-default.png   1200×1200 (정사각 — 카카오/인스타)
//   public/og-cover.png     1200×630  (링크 미리보기 표준 — 트위터/페북/오픈그래프)
//
// 사용법: node scripts/gen-og.mjs

import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PUB = join(ROOT, "public");
const FF = "'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', system-ui, sans-serif";

// 이모지 폰트가 없는 환경에서도 깨지지 않도록 전화 아이콘은 벡터 path로 그립니다.
const PHONE = "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z";
const phoneIcon = (x, y, size) =>
  `<path d="${PHONE}" fill="url(#gold)" transform="translate(${x},${y}) scale(${size / 24})"/>`;

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
    <radialGradient id="glow" cx="0.82" cy="0.14" r="0.65">
      <stop offset="0%" stop-color="rgba(252,211,77,0.34)"/>
      <stop offset="60%" stop-color="rgba(252,211,77,0.07)"/>
      <stop offset="100%" stop-color="rgba(252,211,77,0)"/>
    </radialGradient>
  </defs>`;

// 정사각 1200×1200
const square = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" role="img" aria-label="창원 룰루랄라 나이트 짱구 담당 010-3854-6887">
  ${DEFS}
  <rect width="1200" height="1200" fill="url(#bg)"/>
  <rect width="1200" height="1200" fill="url(#glow)"/>
  <rect x="40" y="40" width="1120" height="1120" rx="32" fill="none" stroke="url(#gold)" stroke-width="2" opacity="0.5"/>
  <text x="100" y="175" font-family="${FF}" font-size="34" font-weight="700" letter-spacing="8" fill="#FCD34D">CHANGWON · 창원시</text>
  <text x="100" y="315" font-family="${FF}" font-size="94" font-weight="900" fill="#FFFFFF">창원 룰루랄라</text>
  <text x="100" y="425" font-family="${FF}" font-size="94" font-weight="900" fill="url(#gold)">나이트</text>
  <line x1="104" y1="485" x2="320" y2="485" stroke="url(#gold)" stroke-width="4"/>
  <text x="100" y="600" font-family="${FF}" font-size="54" font-weight="700" fill="#E5E7EB">웨이터 · 짱구 담당</text>
  ${phoneIcon(100, 770, 56)}
  <text x="172" y="815" font-family="${FF}" font-size="52" font-weight="600" fill="#FFFFFF">직통 전화 · 24시 안내</text>
  <text x="100" y="945" font-family="${FF}" font-size="128" font-weight="900" fill="url(#gold)" letter-spacing="-1" textLength="1000" lengthAdjust="spacingAndGlyphs">010-3854-6887</text>
  <text x="100" y="1075" font-family="${FF}" font-size="31" font-weight="600" fill="#9CA3AF">만 19세 이상 · 신분증 확인 · 합법 영업장</text>
  <text x="100" y="1128" font-family="${FF}" font-size="27" font-weight="500" fill="#7a7f8a">changwon1.pages.dev</text>
</svg>`;

// 와이드 1200×630 (링크 미리보기 표준)
const cover = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-label="창원 룰루랄라 나이트 짱구 담당 010-3854-6887">
  ${DEFS}
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="32" y="32" width="1136" height="566" rx="28" fill="none" stroke="url(#gold)" stroke-width="2" opacity="0.5"/>
  <text x="80" y="120" font-family="${FF}" font-size="28" font-weight="700" letter-spacing="7" fill="#FCD34D">CHANGWON · 창원시 · 만 19세 이상 합법 영업장</text>
  <text x="80" y="230" font-family="${FF}" font-size="78" font-weight="900" fill="#FFFFFF">창원 룰루랄라 <tspan fill="url(#gold)">나이트</tspan></text>
  <text x="80" y="310" font-family="${FF}" font-size="46" font-weight="700" fill="#E5E7EB">웨이터 · 짱구 담당</text>
  ${phoneIcon(80, 408, 46)}
  <text x="140" y="445" font-family="${FF}" font-size="40" font-weight="600" fill="#FFFFFF">직통 전화</text>
  <text x="80" y="555" font-family="${FF}" font-size="118" font-weight="900" fill="url(#gold)" letter-spacing="-1" textLength="1040" lengthAdjust="spacingAndGlyphs">010-3854-6887</text>
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
console.log("완료. SeoHead의 og:image가 PNG를 가리키는지 확인하세요.");
