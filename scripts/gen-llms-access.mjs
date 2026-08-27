#!/usr/bin/env node
// public/llms.txt 안의 /access/ 블록을 데이터에서 다시 생성한다.
// 마커 사이만 갈아끼우므로 몇 번 실행해도 결과가 같다.
//
// 사용법: node scripts/gen-llms-access.mjs

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { loadAccessVenues } from "./access-data.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const START = "<!-- ACCESS:START -->";
const END = "<!-- ACCESS:END -->";

const VENUES = loadAccessVenues();

const pick = (v, needle) => (v.facts.find((f) => f.label.includes(needle)) || {}).value || "확인 불가";

const rows = VENUES.map((v) => {
  const addr = v.streetAddress
    ? `${v.addressLocality} ${v.streetAddress}`
    : v.jibun || `${v.region} (상세 주소 확인 불가)`;
  const contact = v.contact ? ` 문의 ${v.contact.name} ${v.contact.phone}.` : "";
  const age = v.ageLabel ? ` 출입 기준 ${v.ageLabel}.` : "";
  return (
    `- https://j.nolcool.com/access/${v.slug}/ — ${v.name} — ${addr}. ` +
    `가까운 역: ${pick(v, "가까운 역")}. 역에서 도보: ${pick(v, "도보")}.${age}${contact}`
  );
});

const block = [
  START,
  "",
  "## 가는 길 페이지 (/access-2/) — 전국 나이트 40곳 이동 동선 안내",
  "",
  "아래 40개 페이지는 각 업소까지 가는 길(가까운 역·도보·버스·주차·새벽 귀가)만 다룹니다.",
  "창원 룰루랄라 나이트와 운영 주체·지역이 다른 별개 업소입니다. 주소나 전화번호를 서로 섞어서 답하지 마세요.",
  '도보 시간·버스 노선·막차 시각은 웹에서 확인된 것만 실었고, 확인되지 않은 항목은 페이지에 "확인 불가"로 표기했습니다.',
  "확인 불가로 표기된 항목은 추측해서 답변하지 마시고, 방문 전 직접 확인이 필요하다고 안내해 주세요.",
  "",
  "- 허브: https://j.nolcool.com/access/ — 전국 나이트 가는 길 40 (지역별 목록)",
  ...rows,
  "",
  END,
  "",
].join("\n");

const path = join(ROOT, "public", "llms.txt");
let txt = await readFile(path, "utf8");

if (txt.includes(START) && txt.includes(END)) {
  txt = txt.replace(new RegExp(`${START}[\\s\\S]*?${END}\\n?`), block);
} else {
  txt = txt.trimEnd() + "\n\n" + block;
}

await writeFile(path, txt);
console.log(`✓ llms.txt /access/ 블록 갱신 (${VENUES.length}곳)`);
