#!/usr/bin/env node
// 배포 후 라이브 실측 — [18] 2·4항.
//   ① HTTP 200 ② 업소명 A형 존재 ③ "callbar" 클래스 존재
//   ④ OG 이미지 200 + 1200×1200
//   ⑤ robots.txt / sitemap.xml 도달, 리다이렉트 체인, 응답 시간
//
// 사용법: node scripts/night-live-check.mjs https://j.nolcool.com

import sharp from "sharp";
import { fileURLToPath, pathToFileURL } from "node:url";
import { join } from "node:path";
import { execSync } from "node:child_process";

const BASE = (process.argv[2] || "https://j.nolcool.com").replace(/\/$/, "");
const ROOT = fileURLToPath(new URL("..", import.meta.url));

const raw = execSync(
  `node --experimental-strip-types -e ` +
    `"import('${pathToFileURL(join(ROOT, "components/night/venues.ts")).href}').then(m=>console.log(JSON.stringify(` +
    `m.VENUES.map(v=>({slug:v.slug,name:v.name,group:v.group,age:v.ageLabel||''})))))"`,
  { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
);
const VENUES = JSON.parse(raw);

const pad = (s, n) => String(s) + " ".repeat(Math.max(0, n - String(s).length));
let fail = 0;
const rows = [];

for (const v of VENUES) {
  const url = `${BASE}/night/${v.slug}/`;
  const cb = `${url}?cb=${Date.now()}`;
  const t0 = Date.now();
  const res = await fetch(cb, { redirect: "manual" });
  let status = res.status;
  let redirects = 0;
  let final = res;
  while (final.status >= 300 && final.status < 400 && redirects < 5) {
    redirects++;
    final = await fetch(new URL(final.headers.get("location"), cb).href, { redirect: "manual" });
  }
  const html = final.status === 200 ? await final.text() : "";
  const ms = Date.now() - t0;

  const hasName = html.includes(v.name);
  const hasBar = html.includes('class="callbar"');
  const ageOk = !v.age || html.includes(v.age);

  // OG 이미지
  const ogUrl = `${BASE}/og/${v.slug}-og.png`;
  const ogRes = await fetch(ogUrl);
  let ogSize = "-";
  let ogOk = false;
  if (ogRes.status === 200) {
    const buf = Buffer.from(await ogRes.arrayBuffer());
    const m = await sharp(buf).metadata();
    ogSize = `${m.width}×${m.height}`;
    ogOk = m.width === 1200 && m.height === 1200;
  }

  const ok = final.status === 200 && hasName && hasBar && ageOk && ogOk && redirects === 0 && ms < 3000;
  if (!ok) fail++;
  rows.push({ slug: v.slug, group: v.group, url, status: final.status, redirects, ms, hasName, hasBar, ageOk, ogStatus: ogRes.status, ogSize, ok });
}

console.log("번호 업소                          HTTP 리다이렉트  응답ms  A형  callbar  연령  OG    OG크기      판정");
rows.forEach((r, i) => {
  console.log(
    `${pad(i + 1, 4)} ${pad(r.slug, 28)} ${pad(r.status, 5)} ${pad(r.redirects, 10)} ${pad(r.ms, 7)} ${pad(r.hasName ? "O" : "X", 4)} ${pad(r.hasBar ? "O" : "X", 8)} ${pad(r.ageOk ? "O" : "X", 5)} ${pad(r.ogStatus, 5)} ${pad(r.ogSize, 11)} ${r.ok ? "PASS" : "FAIL"}`
  );
});

for (const p of ["/robots.txt", "/sitemap.xml", "/llms.txt"]) {
  const r = await fetch(`${BASE}${p}?cb=${Date.now()}`);
  const t = await r.text();
  const extra =
    p === "/robots.txt"
      ? ` Yeti Allow=${/User-agent: Yeti\s*\nAllow: \//.test(t)} Sitemap줄=${t.includes("Sitemap: " + BASE + "/sitemap.xml")}`
      : p === "/sitemap.xml"
        ? ` /night/ URL ${(t.match(/\/night\/[a-z-]+\//g) || []).length}개`
        : ` /night/ 줄 ${(t.match(/\/night\//g) || []).length}개`;
  console.log(`${pad(p, 14)} ${r.status}${extra}`);
  if (r.status !== 200) fail++;
}

console.log(`\n라이브 실측 ${rows.length}건 · 실패 ${fail}건 (${BASE})`);
process.exit(fail ? 1 : 0);
