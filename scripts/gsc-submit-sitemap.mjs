#!/usr/bin/env node
// Search Console 사이트맵 제출/조회
// - 주소가 바뀐 뒤에는 사이트맵을 다시 제출해야 구글이 새 URL을 빨리 가져갑니다.
// - 비밀 키는 저장소에 두지 않습니다. gsc-report.mjs 와 같은 방식으로 주입:
//     GSC_KEY_FILE=/home/user/.config/gsc/theasset-gsc.json node scripts/gsc-submit-sitemap.mjs
//
// 옵션:
//   --site  <속성 URL>   기본값 https://changwon1.pages.dev/
//   --list               제출만 하지 않고 현재 등록된 사이트맵 상태만 봅니다

import { readFile } from "node:fs/promises";
import { createSign } from "node:crypto";

const SCOPE = "https://www.googleapis.com/auth/webmasters"; // 쓰기 권한 필요
const TOKEN_URI = "https://oauth2.googleapis.com/token";

function arg(name, def = null) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = process.argv[i + 1];
  return v && !v.startsWith("--") ? v : true;
}

function b64url(buf) {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function loadCreds() {
  if (process.env.GSC_CREDENTIALS) return JSON.parse(process.env.GSC_CREDENTIALS);
  const file = process.env.GSC_KEY_FILE || arg("key");
  if (!file) throw new Error("GSC_KEY_FILE 환경변수 또는 --key 경로가 필요합니다.");
  return JSON.parse(await readFile(file, "utf8"));
}

async function getAccessToken(creds) {
  const now = Math.floor(Date.now() / 1000);
  const claim = { iss: creds.client_email, scope: SCOPE, aud: TOKEN_URI, iat: now, exp: now + 3600 };
  const signingInput = `${b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${b64url(JSON.stringify(claim))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  const jwt = `${signingInput}.${b64url(signer.sign(creds.private_key))}`;

  const res = await fetch(TOKEN_URI, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`토큰 발급 실패: ${res.status} ${JSON.stringify(data)}`);
  return data.access_token;
}

const site = String(arg("site", "https://changwon1.pages.dev/"));
const sitemap = `${site.replace(/\/$/, "")}/sitemap.xml`;
const enc = (s) => encodeURIComponent(s);

const token = await getAccessToken(await loadCreds());
const base = `https://www.googleapis.com/webmasters/v3/sites/${enc(site)}/sitemaps`;
const auth = { Authorization: `Bearer ${token}` };

if (!arg("list")) {
  const res = await fetch(`${base}/${enc(sitemap)}`, { method: "PUT", headers: auth });
  if (!res.ok) {
    console.error(`✗ 제출 실패: ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  console.log(`✓ 사이트맵 제출 완료 → ${sitemap}`);
}

const res = await fetch(base, { headers: auth });
const data = await res.json();
if (!res.ok) {
  console.error(`✗ 조회 실패: ${res.status} ${JSON.stringify(data)}`);
  process.exit(1);
}
console.log(`\n=== ${site} 등록된 사이트맵 ===`);
for (const s of data.sitemap ?? []) {
  const submitted = s.lastSubmitted ? s.lastSubmitted.slice(0, 10) : "-";
  const downloaded = s.lastDownloaded ? s.lastDownloaded.slice(0, 10) : "미수집";
  const urls = s.contents?.[0]?.submitted ?? "-";
  console.log(`  ${s.path}`);
  console.log(`    제출 ${submitted} · 구글이 가져간 날 ${downloaded} · URL ${urls}개 · 오류 ${s.errors ?? 0} · 경고 ${s.warnings ?? 0}`);
}
if (!data.sitemap?.length) console.log("  (등록된 사이트맵 없음)");
