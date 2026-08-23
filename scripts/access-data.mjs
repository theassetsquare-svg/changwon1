// components/access/ 의 40곳 데이터를 스크립트에서 읽어 온다.
//
// venues.ts 는 확장자 없는 상대 임포트를 쓰기 때문에 node --experimental-strip-types 로
// 바로 못 읽는다. 데이터 파일을 순서대로 직접 읽어 합친다.
// 순서는 components/access/venues.ts 의 ACCESS_VENUES 와 같다.

import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { execSync } from "node:child_process";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

const DATA = [
  ["data-seoul.ts", "SEOUL"],
  ["data-gyeonggi.ts", "GYEONGGI"],
  ["data-chungcheong.ts", "CHUNGCHEONG"],
  ["data-yeongnam.ts", "YEONGNAM"],
  ["data-honam-jeju.ts", "HONAM_JEJU"],
];

export function loadAccessVenues() {
  return DATA.flatMap(([file, name]) => {
    const out = execSync(
      `node --experimental-strip-types -e ` +
        `"import('${join(ROOT, "components/access", file)}').then(m=>console.log(JSON.stringify(m.${name})))"`,
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 * 1024 * 1024 }
    );
    return JSON.parse(out);
  });
}
