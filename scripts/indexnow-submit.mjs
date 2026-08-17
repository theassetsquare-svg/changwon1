#!/usr/bin/env node
// IndexNow 색인 요청 — 새로 올린 URL을 검색엔진에 알린다.
//
//  - 키 파일은 public/{key}.txt 에 있고, 배포 후 https://changwon1.pages.dev/{key}.txt 로
//    접근돼야 요청이 받아들여진다. 그래서 반드시 "푸시 → 배포 완료 확인" 다음에 실행한다.
//  - IndexNow를 받는 곳은 Bing·Yandex·Seznam 계열이다. 네이버·구글은 IndexNow를 쓰지 않으므로
//    이 스크립트로 네이버 노출이 앞당겨지지는 않는다. (네이버는 서치어드바이저, 구글은 GSC 사이트맵)
//
// 사용법:
//   node scripts/indexnow-submit.mjs            # /access/ 41개(허브+40) 제출
//   node scripts/indexnow-submit.mjs --all      # 사이트맵의 모든 URL 제출

import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const HOST = "changwon1.pages.dev";
const BASE = `https://${HOST}`;

// public/ 안의 32자리 hex 파일명이 IndexNow 키다.
const keyFile = (await readdir(join(ROOT, "public"))).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error("public/ 에 IndexNow 키 파일이 없습니다.");
  process.exit(2);
}
const key = keyFile.replace(/\.txt$/, "");

let urlList;
if (process.argv.includes("--all")) {
  const xml = await readFile(join(ROOT, "public", "sitemap.xml"), "utf8");
  urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
} else {
  const xml = await readFile(join(ROOT, "public", "sitemap.xml"), "utf8");
  urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => u.includes("/access/"));
  urlList.unshift(`${BASE}/`);
}

// 키 파일이 실제로 서비스되는지 먼저 확인한다. 안 되면 IndexNow가 전부 거절한다.
const keyUrl = `${BASE}/${keyFile}`;
const keyRes = await fetch(keyUrl);
const keyBody = keyRes.ok ? (await keyRes.text()).trim() : "";
if (!keyRes.ok || keyBody !== key) {
  console.error(`키 파일 확인 실패: ${keyUrl} (status ${keyRes.status}). 배포 완료 후 다시 실행하세요.`);
  process.exit(1);
}
console.log(`✓ 키 파일 확인: ${keyUrl}`);

const body = { host: HOST, key, keyLocation: keyUrl, urlList };
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

console.log(`IndexNow 응답: ${res.status} ${res.statusText}`);
console.log(`제출 URL ${urlList.length}개`);
// 200 = 접수, 202 = 접수(키 검증 대기). 그 외는 실패로 본다.
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
