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
  "daejeon-one-night": "daejeon-one-night",
  "cheonan-stardome-2": "cheonan-stardome-night",
  "cheonan-korea-night": "cheonan-korea-night",
  "cheongju-hobak-night": "cheongju-hobak-night",
  "seosan-hobak-night": "seosan-hobak-night",
  "suwon-chancedome-4": "suwon-chancedome-night",
  "ilsan-shampoo-4": "ilsan-shampoo-night",
  "paju-skydome-2": "paju-skydome-night",
  "guri-hobak-2": "guri-hobak-night",
  "uijeongbu-hangukgwan-night": "uijeongbu-hangukgwan-night",
  "suwon-korea-night": "suwon-korea-night",
  "indeogwon-gukbingwan-night": "indeogwon-gukbingwan-night",
  "seongnam-shampoo-night": "seongnam-shampoo-night",
  "bucheon-gorae-night": "bucheon-gorae-night",
  "pyeongtaek-hobak-night": "pyeongtaek-hobak-night",
  "gwangju-sangmu-night": "gwangju-sangmu-night",
  "gwangju-cheomdan-night": "gwangju-cheomdan-night",
  "jeju-1": "jeju-night",
  "sillim-grandprix-night": "sillim-grandprix-night",
  "sangbong-hangukgwan-3": "sangbong-hangukgwan-night",
  "suyu-shampoo-3": "suyu-shampoo-night",
  "cheongdam-night": "cheongdam-night",
  "bulgwang-hobak-2": "bulgwang-hobak-night",
  "nowon-hobak-1": "nowon-hobak-night",
  "gildong-chance-night": "gildong-chance-night",
  "busan-asiad-1": "busan-asiad-night",
  "changwon-lululala-3": "changwon-lululala-night",
  "ulsan-champion-3": "ulsan-champion-night",
  "ulsan-newworld-night": "ulsan-newworld-night",
  "daegu-hobak-night": "daegu-hobak-night"
};

export const ACCESS_URL = (slug) =>
  ACCESS_KEEP_OLD.has(slug) ? `/access/${slug}/` : `/${ACCESS_URL_MAP[slug] ?? slug}/`;
