#!/usr/bin/env node
// sitemap.xml 생성기 — 페이지 목록 + 오늘 날짜(lastmod)로 자동 생성.
// 자동화에서 매 배포 시 실행하면 lastmod가 항상 최신으로 유지됩니다.
// 사용법: node scripts/gen-sitemap.mjs

import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { ACCESS_URL } from "./venue-urls.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const BASE = "https://j.nolcool.com";
const today = new Date().toISOString().slice(0, 10);

const PAGES = [
  // 홈(/)은 단독 글 페이지 — 썸네일 없음
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/jjanggua/", priority: "0.95", changefreq: "weekly", thumb: "/og/page-jjanggua-og.png" },
  { path: "/contacta/", priority: "0.85", changefreq: "monthly", thumb: "/og/page-contacta-og.png" },
  { path: "/location/", priority: "0.8", changefreq: "monthly", thumb: "/og/page-location-og.png" },
  { path: "/about/", priority: "0.7", changefreq: "monthly", thumb: "/og/page-about-og.png" },
  // 다른 지역 업소(불광동호박나이트) 안내 페이지
  { path: "/bulgwang-hobak-4/", priority: "0.9", changefreq: "weekly", thumb: "/og-bulgwang.png" },
  // /night/{slug}/ 지역별 업소 정보 페이지 13개 (append)
  { path: "/bulgwang-hobak-night-1/", priority: "0.8", changefreq: "weekly", thumb: "/og/bulgwang-hobak-night-og.png" },
  { path: "/changwon-lululala-night-1/", priority: "0.8", changefreq: "weekly", thumb: "/og/changwon-lululala-night-og.png" },
  { path: "/ulsan-champion-night-1/", priority: "0.8", changefreq: "weekly", thumb: "/og/ulsan-champion-4-og.png" },
  { path: "/cheongdam-night-1/", priority: "0.8", changefreq: "weekly", thumb: "/og/cheongdam-4-og.png" },
  { path: "/night/daejeon-one-night/", priority: "0.8", changefreq: "weekly", thumb: "/og/daejeon-one-night-og.png" },
  { path: "/sillim-grandprix-night-1/", priority: "0.8", changefreq: "weekly", thumb: "/og/sillim-grandprix-4-og.png" },
  { path: "/sangbong-hangukgwan-night-1/", priority: "0.8", changefreq: "weekly", thumb: "/og/sangbong-hangukgwan-4-og.png" },
  { path: "/suyu-shampoo-night-1/", priority: "0.8", changefreq: "weekly", thumb: "/og/suyu-shampoo-4-og.png" },
  { path: "/busan-asiad-night-1/", priority: "0.8", changefreq: "weekly", thumb: "/og/busan-asiad-1-og.png" },
  { path: "/suwon-chancedome-night-1/", priority: "0.8", changefreq: "weekly", thumb: "/og/suwon-chancedome-4-og.png" },
  { path: "/ansan-hit-night/", priority: "0.8", changefreq: "weekly", thumb: "/og/ansan-hit-4-og.png" },
  { path: "/daejeon-seven-night-1/", priority: "0.8", changefreq: "weekly", thumb: "/og/daejeon-seven-4-og.png" },
  { path: "/ilsan-shampoo-night-1/", priority: "0.8", changefreq: "weekly", thumb: "/og/ilsan-shampoo-4-og.png" },
  // /access/ 허브 — 전국 나이트 가는 길 40
  { path: "/access-2/", priority: "0.9", changefreq: "weekly", thumb: "/og/page-access-og.png" },
];

// /access/{slug}/ 40개는 데이터 파일에서 슬러그를 읽어 자동으로 붙인다.
// 업소를 추가·삭제해도 사이트맵이 따라간다.
const ACCESS_DIR = join(ROOT, "components", "access");
for (const file of (await readdir(ACCESS_DIR)).filter((f) => f.startsWith("data-")).sort()) {
  const src = await readFile(join(ACCESS_DIR, file), "utf8");
  for (const m of src.matchAll(/^\s{4}slug: "([a-z0-9-]+)",$/gm)) {
    PAGES.push({
      path: ACCESS_URL(m[1]),
      priority: "0.8",
      changefreq: "weekly",
      thumb: `/og/access-${m[1]}-og.png`,
    });
  }
}

const urls = PAGES.map((p) => {
  // 페이지마다 자기 1:1 썸네일을 이미지 사이트맵으로도 같이 알린다.
  // og:image·본문 <img> 와 같은 파일이어야 한다.
  const own = p.thumb
    ? `
    <image:image>
      <image:loc>${BASE}${p.thumb}</image:loc>
    </image:image>`
    : "";
  const img = p.image
    ? `
    <image:image>
      <image:loc>${BASE}/og-default.png</image:loc>
      <image:title>창원 룰루랄라 나이트 · 로또 010-7528-4936</image:title>
      <image:caption>창원 시내 만 27세 이상 합법 영업장. 예약·문의는 웨이터 로또 010-7528-4936 전화.</image:caption>
    </image:image>
    <image:image>
      <image:loc>${BASE}/og-cover.png</image:loc>
      <image:title>창원 룰루랄라 나이트 전화 예약 · 로또 010-7528-4936</image:title>
      <image:caption>창원 룰루랄라 나이트 전화 예약 안내 이미지.</image:caption>
    </image:image>`
    : "";
  return `  <url>
    <loc>${BASE}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    <xhtml:link rel="alternate" hreflang="ko-KR" href="${BASE}${p.path}" />${p.image ? img : own}
  </url>`;
}).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

await writeFile(join(ROOT, "public", "sitemap.xml"), xml);
console.log(`✓ sitemap.xml 생성 (lastmod=${today}, ${PAGES.length} URL)`);
