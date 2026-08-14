#!/usr/bin/env node
// sitemap.xml 생성기 — 페이지 목록 + 오늘 날짜(lastmod)로 자동 생성.
// 자동화에서 매 배포 시 실행하면 lastmod가 항상 최신으로 유지됩니다.
// 사용법: node scripts/gen-sitemap.mjs

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const BASE = "https://changwon1.pages.dev";
const today = new Date().toISOString().slice(0, 10);

const PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly", image: true },
  { path: "/jjanggua/", priority: "0.95", changefreq: "weekly" },
  { path: "/contacta/", priority: "0.85", changefreq: "monthly" },
  { path: "/location/", priority: "0.8", changefreq: "monthly" },
  { path: "/about/", priority: "0.7", changefreq: "monthly" },
  // 다른 지역 업소(불광동호박나이트) 안내 페이지
  { path: "/bulgwang-hobak/", priority: "0.9", changefreq: "weekly" },
];

const urls = PAGES.map((p) => {
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
    <xhtml:link rel="alternate" hreflang="ko-KR" href="${BASE}${p.path}" />${img}
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
