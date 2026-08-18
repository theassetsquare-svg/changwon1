#!/usr/bin/env node
// 고정바 실측 — G05(스크롤 전후 top 좌표 동일) · G12(푸터 .ad-inquiry 가림 여부)
//   + .callbar 조상 체인에 transform/filter/perspective/backdrop-filter/will-change/contain 유무
// 라이브 URL 기준으로 돌리는 것이 원칙이다. 로컬 결과는 사전 점검용.
//
// 사용법: node scripts/night-dom-check.mjs https://changwond.pages.dev
//   CHROME_PATH 로 크롬 실행 파일 지정 가능.

import { chromium } from "playwright";

const BASE = (process.argv[2] || "http://127.0.0.1:4321").replace(/\/$/, "");
const SLUGS = [
  "bulgwang-hobak-night", "changwon-lululala-night", "ulsan-champion-night", "cheongdam-night",
  "daejeon-one-night", "sillim-grandprix-night", "sangbong-hangukgwan-night", "suyu-shampoo-night",
  "busan-asiad-night", "suwon-chance-dome-night", "ansan-hit-night", "daejeon-seven-night",
  "ilsan-shampoo-night",
];
const VIEWPORTS = [
  { name: "모바일 390×844", width: 390, height: 844 },
  { name: "PC 1920×1080", width: 1920, height: 1080 },
];

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ["--no-sandbox"],
});
const rows = [];
const notes = [];
let fail = 0;

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  for (const slug of SLUGS) {
    await page.goto(`${BASE}/night/${slug}/?cb=${Date.now()}`, { waitUntil: "networkidle" });
    const before = await page.evaluate(() => {
      const bar = document.querySelector(".callbar");
      if (!bar) return { err: true };
      const props = ["transform", "filter", "perspective", "backdrop-filter", "will-change", "contain"];
      const bad = [];
      let n = bar.parentElement;
      while (n && n !== document.documentElement) {
        const cs = getComputedStyle(n);
        for (const p of props) {
          const v = cs.getPropertyValue(p);
          if (v && !["none", "auto", "normal", "0s", ""].includes(v)) bad.push(`${n.tagName}${n.id ? "#" + n.id : ""}:${p}=${v}`);
        }
        n = n.parentElement;
      }
      return {
        scrollable: document.documentElement.scrollHeight > window.innerHeight,
        parent: bar.parentElement ? bar.parentElement.tagName : "(none)",
        ancestors: bad,
        top0: Math.round(bar.getBoundingClientRect().top * 100) / 100,
        text: bar.innerText.replace(/\s+/g, " ").trim(),
      };
    });
    // 부드러운 스크롤 애니메이션이 측정에 끼지 않도록 즉시 이동시킨다.
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, document.documentElement.scrollHeight);
    });
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => {
      const bar = document.querySelector(".callbar").getBoundingClientRect();
      const ad = document.querySelector(".ad-inquiry").getBoundingClientRect();
      return {
        top1: Math.round(bar.top * 100) / 100,
        scrollY: Math.round(window.scrollY),
        maxScroll: Math.round(document.documentElement.scrollHeight - window.innerHeight),
        overlap: !(ad.bottom <= bar.top || ad.top >= bar.bottom),
        adBottom: Math.round(ad.bottom),
        barTop: Math.round(bar.top),
        adVisible: ad.top < window.innerHeight && ad.bottom > 0,
      };
    });
    const diff = Math.round((after.top1 - before.top0) * 100) / 100;
    const scrolled = after.scrollY >= after.maxScroll - 2 && after.scrollY > 0;
    const ok =
      before.scrollable && scrolled && diff === 0 &&
      before.parent === "BODY" && before.ancestors.length === 0 && !after.overlap;
    if (!ok) {
      fail++;
      notes.push(
        `${slug} / ${vp.name}: scrollable=${before.scrollable} scrollY=${after.scrollY}/${after.maxScroll} diff=${diff} parent=${before.parent} 조상=${JSON.stringify(before.ancestors)} 가림=${after.overlap}`
      );
    }
    rows.push({ slug, vp: vp.name, ...before, ...after, diff, scrolled, ok });
  }
  await ctx.close();
}
await browser.close();

console.log(
  "페이지                        뷰포트          스크롤전  스크롤후  차이  부모  조상위험  스크롤량  푸터가림  바-푸터간격"
);
for (const r of rows) {
  console.log(
    `${r.slug.padEnd(28)} ${r.vp.padEnd(14)} ${String(r.top0).padStart(8)} ${String(r.top1).padStart(9)} ${String(r.diff).padStart(5)}  ${r.parent.padEnd(5)} ${String(r.ancestors.length).padStart(6)}  ${String(r.scrollY + "/" + r.maxScroll).padStart(9)}  ${(r.overlap ? "겹침" : "없음").padEnd(7)} ${String(r.barTop - r.adBottom).padStart(5)}px`
  );
}
console.log("\n고정바 문구 (모바일 기준)");
for (const r of rows.filter((x) => x.vp.startsWith("모바일"))) console.log(`  ${r.slug.padEnd(28)} ${r.text}`);
if (notes.length) {
  console.log("\n실패 상세");
  notes.forEach((n) => console.log("  " + n));
}
console.log(`\n총 ${rows.length}회 측정 · 실패 ${fail}건 (${BASE})`);
process.exit(fail ? 1 : 0);
