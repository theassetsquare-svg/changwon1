#!/usr/bin/env node
// Google Search Console 실데이터 리포트
// - 서비스계정 JWT로 액세스 토큰 발급 → Search Console API 조회
// - 비밀 키는 저장소에 두지 않습니다. 환경변수로 주입:
//     GSC_KEY_FILE=/path/to/theasset-gsc.json   (키 파일 경로)
//   또는
//     GSC_CREDENTIALS='{...json...}'              (키 JSON 문자열, CI 시크릿용)
//
// 사용법:
//   GSC_KEY_FILE=/home/user/.config/gsc/theasset-gsc.json node scripts/gsc-report.mjs
//   ... node scripts/gsc-report.mjs --days 28 --site https://changwond.pages.dev/
//
// 출력: 콘솔 요약 + (옵션) --json 으로 원본 JSON.

import { readFile } from "node:fs/promises";
import { createSign } from "node:crypto";

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
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
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: creds.client_email,
    scope: SCOPE,
    aud: TOKEN_URI,
    iat: now,
    exp: now + 3600,
  };
  const signingInput = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claim))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  const signature = b64url(signer.sign(creds.private_key));
  const jwt = `${signingInput}.${signature}`;

  const res = await fetch(TOKEN_URI, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`토큰 발급 실패: ${res.status} ${JSON.stringify(data)}`);
  return data.access_token;
}

async function api(token, path, body) {
  const res = await fetch(`https://www.googleapis.com/webmasters/v3${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`API ${path} 실패: ${res.status} ${JSON.stringify(data)}`);
  return data;
}

function ymd(d) {
  return d.toISOString().slice(0, 10);
}

async function main() {
  const creds = await loadCreds();
  const token = await getAccessToken(creds);

  // 1) 접근 가능한 사이트 목록
  const sites = await api(token, "/sites");
  const entries = sites.siteEntry || [];
  console.log("=== 접근 가능한 GSC 속성 ===");
  if (entries.length === 0) {
    console.log("(없음) — 서비스계정이 아직 어떤 속성에도 추가되지 않았습니다.");
    console.log(`서비스계정: ${creds.client_email}`);
    console.log("→ Search Console > 설정 > 사용자 및 권한 에서 위 이메일을 '전체' 권한으로 추가하세요.");
    process.exit(3);
  }
  for (const e of entries) console.log(`  ${e.permissionLevel.padEnd(18)} ${e.siteUrl}`);

  // 2) 대상 속성 결정
  let site = arg("site");
  if (!site) {
    // 도메인이 changwond 로 바뀌었다. 옛 속성(changwon1)이 아직 남아 있는 동안은
    // 새 속성을 먼저 찾고, 없으면 옛 속성으로 떨어진다.
    site =
      entries.find((e) => e.siteUrl.includes("changwond"))?.siteUrl ||
      entries.find((e) => e.siteUrl.includes("changwon1"))?.siteUrl ||
      entries[0].siteUrl;
  }
  console.log(`\n=== 대상 속성: ${site} ===`);

  const days = Number(arg("days", "28"));
  const end = new Date(Date.now() - 2 * 86400000); // GSC 데이터는 2~3일 지연
  const start = new Date(end.getTime() - days * 86400000);
  const range = { startDate: ymd(start), endDate: ymd(end) };
  console.log(`기간: ${range.startDate} ~ ${range.endDate} (${days}일)\n`);

  const query = async (dimensions, rowLimit = 25) =>
    (await api(token, `/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
      ...range,
      dimensions,
      rowLimit,
      dataState: "all",
    })).rows || [];

  // 전체 합계
  const totalRows = await query([], 1);
  const totals = totalRows[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  console.log("── 전체 요약 ──");
  console.log(`  클릭 ${totals.clicks} · 노출 ${totals.impressions} · CTR ${(totals.ctr * 100).toFixed(2)}% · 평균순위 ${totals.position.toFixed(1)}`);

  // 키워드(쿼리)
  const queries = await query(["query"], 25);
  console.log("\n── 검색어 TOP (클릭/노출/CTR/순위) ──");
  if (queries.length === 0) console.log("  (데이터 없음 — 색인 직후이거나 노출이 아직 없음)");
  for (const r of queries) {
    console.log(
      `  ${String(r.keys[0]).slice(0, 30).padEnd(30)} 클릭${String(r.clicks).padStart(4)} 노출${String(r.impressions).padStart(5)} CTR${(r.ctr * 100).toFixed(1).padStart(5)}% 순위${r.position.toFixed(1).padStart(5)}`
    );
  }

  // 페이지별
  const pages = await query(["page"], 25);
  console.log("\n── 페이지별 성과 ──");
  if (pages.length === 0) console.log("  (데이터 없음)");
  for (const r of pages) {
    console.log(
      `  ${String(r.keys[0]).replace(site, "/").slice(0, 32).padEnd(32)} 클릭${String(r.clicks).padStart(4)} 노출${String(r.impressions).padStart(5)} 순위${r.position.toFixed(1).padStart(5)}`
    );
  }

  // 카니발리제이션 탐지: 같은 검색어를 두 페이지 이상이 동시에 노출
  const qp = await query(["query", "page"], 1000);
  const byQuery = new Map();
  for (const r of qp) {
    const q = r.keys[0];
    const p = r.keys[1];
    if (!byQuery.has(q)) byQuery.set(q, []);
    byQuery.get(q).push({ page: p, impressions: r.impressions, position: r.position });
  }
  const cannibal = [...byQuery.entries()]
    .filter(([, ps]) => ps.length >= 2)
    .map(([q, ps]) => ({ q, ps: ps.sort((a, b) => b.impressions - a.impressions) }))
    .sort((a, b) => b.ps.length - a.ps.length);
  console.log("\n── 카니발리제이션 의심 (같은 검색어에 2+ 페이지 경쟁) ──");
  if (cannibal.length === 0) console.log("  (없음)");
  for (const c of cannibal.slice(0, 15)) {
    console.log(`  "${c.q}" — ${c.ps.length}개 페이지`);
    for (const p of c.ps) {
      console.log(`      ${p.page.replace(site, "/")}  노출${p.impressions} 순위${p.position.toFixed(1)}`);
    }
  }

  if (arg("json")) {
    console.log("\n=== RAW JSON ===");
    console.log(JSON.stringify({ site, range, totals, queries, pages, cannibal }, null, 2));
  }
}

main().catch((err) => {
  console.error("오류:", err.message);
  process.exit(1);
});
