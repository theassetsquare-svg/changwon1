/**
 * ★ 2026-08-26 대표님 확정 — 가게 페이지 주소는 메인주소 바로 뒤에 가게이름.
 *   네이버에 이미 나오는 슬러그만 옛 /access/ 경로를 그대로 쓴다.
 *
 * 이 파일은 components/access/types.ts 의 이름표를 그대로 옮겨 적은 것이다.
 * 바꿀 일이 있으면 types.ts 를 고치고  node make-j-urlmap.mjs  를 다시 돌린다.
 */
export const ACCESS_KEEP_OLD = new Set(["ansan-hit-night","dapsimni-miracle-night","doksan-gukbingwan-night","gangseo-hobak-night","gumi-hobak-night","incheon-arabian-night","osan-hobak-night","uijeongbu-baekakgwan-night","yeongdeungpo-terminal-night"]);

export const ACCESS_URL_MAP = {
  "daejeon-seven-night": "daejeon-seven-night",
  "daejeon-one-night": "daejeon-one-night-4",
  "cheonan-stardome-2": "cheonan-stardome-night",
  "cheonan-korea-night": "cheonan-korea-night-4",
  "cheongju-hobak-night": "cheongju-hobak-night",
  "seosan-hobak-night": "seosan-hobak-night-3",
  "suwon-chancedome-4": "suwon-chancedome-night-3",
  "ilsan-shampoo-4": "ilsan-shampoo-night",
  "paju-skydome-2": "paju-skydome-night-3",
  "guri-hobak-2": "guri-hobak-night-8",
  "uijeongbu-hangukgwan-night": "uijeongbu-hangukgwan-night-7",
  "suwon-korea-night": "suwon-korea-night",
  "indeogwon-gukbingwan-night": "indeogwon-gukbingwan-night-5",
  "seongnam-shampoo-night": "seongnam-shampoo-night",
  "bucheon-gorae-night": "bucheon-gorae-night-4",
  "pyeongtaek-hobak-night": "pyeongtaek-hobak-night-4",
  "gwangju-sangmu-night": "gwangju-sangmu-night-4",
  "gwangju-cheomdan-night": "gwangju-cheomdan-night-4",
  "jeju-1": "jeju-night",
  "sillim-grandprix-night": "sillim-grandprix-night",
  "sangbong-hangukgwan-3": "sangbong-hangukgwan-night-4",
  "suyu-shampoo-3": "suyu-shampoo-night-3",
  "cheongdam-night": "cheongdam-night",
  "bulgwang-hobak-2": "bulgwang-hobak-night",
  "nowon-hobak-1": "nowon-hobak-night-4",
  "gildong-chance-night": "gildong-chance-night-4",
  "busan-asiad-1": "busan-asiad-night",
  "changwon-lululala-3": "changwon-lululala-night",
  "ulsan-champion-3": "ulsan-champion-night",
  "ulsan-newworld-night": "ulsan-newworld-night-3",
  "daegu-hobak-night": "daegu-hobak-night-4"
};

export const ACCESS_URL = (slug) =>
  ACCESS_KEEP_OLD.has(slug) ? `/access/${slug}/` : `/${ACCESS_URL_MAP[slug] ?? slug}/`;
