/**
 * /access/{slug}/ — "가는 길·귀가 내비" 페이지 데이터 타입.
 *
 * 원칙
 *  - 도보 시간·버스 노선·막차 시각은 웹으로 확인된 것만 쓴다.
 *    확인이 안 된 항목은 값 자리에 "확인 불가"를 그대로 적는다. 추측해서 채우지 않는다.
 *  - 출처는 링크가 아니라 본문 텍스트로 남긴다(sources 배열).
 *  - 전 페이지가 이동 축(역 도보 → 버스 → 차·주차 → 새벽 귀가)으로만 서술된다.
 */

export type Fact = { label: string; value: string };
export type Section = { h2: string; body: string[] };
export type Faq = { q: string; a: string };
export type Step = { label: string; detail: string };

export type AccessVenue = {
  slug: string;
  /** A형 — 붙여쓰기. title·h1·본문에 그대로 들어간다 */
  name: string;
  /** B형 — 띄어쓰기 */
  nameSpaced: string;
  /** 같은 업소를 가리키는 다른 표기 (예: 인천아라비아나이트) */
  altNames?: string[];
  /** C형 — 지역 + 업종 */
  cityKeyword: string;
  region: string;
  addressLocality: string;
  addressRegion: string;
  streetAddress?: string;
  jibun?: string;
  /** A = 광고주 있음(전화바), B = 광고주 없음(광고문의 바) */
  group: "A" | "B";
  contact?: { name: string; phone: string; tel: string };
  /** 썸네일 파일명 뒤에 붙일 판 번호. 그림을 바꿨을 때 캐시를 피하려고 쓴다. 없으면 기존 그대로. */
  ogV?: string;
  ageLabel?: string;
  /** 페이지별 교통 각도. 40개가 전부 다르다 */
  angle: { no: number; name: string };
  /** 20~30자, 업소명이 맨 앞 */
  title: string;
  description: string;
  /** 도입 — 답은 끝에 둔다 */
  intro: string[];
  /** 핵심 3줄 직답. 확인된 것만 */
  answer: string[];
  /** 1-2-3 스텝 UI */
  steps: [Step, Step, Step];
  facts: Fact[];
  /** 이동 소제목 4~6개 (질문형 2개 이상) */
  sections: Section[];
  /** 맨 끝, 제목이 던진 질문의 답 */
  finalAnswer: { h2: string; body: string[] };
  faq: [Faq, Faq, Faq];
  /** 한 줄 정리 */
  summary: string;
  related: string[];
  /** 비링크 텍스트 출처 */
  sources: string[];
};

/* ★ 2026-08-24 — 목록(허브) 주소와 가게 페이지 상위 경로를 **반드시 나눠 둔다.**
 *
 * 주소교체로 목록이 /access/ → /access-2/ 로 옮겨졌는데, 가게 페이지는
 * pages/access/[slug].tsx 라 여전히 /access/<슬러그>/ 다.
 * 예전에는 한 상수로 묶여 있어서 가게 링크가 전부 /access-2/<슬러그>/ 가 됐고,
 * 그 주소는 없으므로 **내부 링크 79개가 404** 였다(2026-08-24 실측).
 * 목록 주소가 또 바뀌어도 가게 경로는 따라가면 안 된다. */
export const ACCESS_BASE = "/access-2/";        // 목록(허브) 주소 — 끝에 / 가 이미 있다
export const ACCESS_VENUE_BASE = "/access/";    // 가게 페이지 상위 = pages/access/[slug].tsx

/* ★ 2026-08-26 대표님 확정 — 가게 페이지 주소는 메인주소 바로 뒤에 가게이름.
 *   네이버에 이미 나오는 슬러그만 옛 /access/ 경로를 그대로 쓴다. */
export const ACCESS_KEEP_OLD = new Set<string>(["ansan-hit-night", "dapsimni-miracle-night", "doksan-gukbingwan-night", "gangseo-hobak-night", "gumi-hobak-night", "incheon-arabian-night", "osan-hobak-night", "uijeongbu-baekakgwan-night", "yeongdeungpo-terminal-night"]);
export const ACCESS_URL_MAP: Record<string, string> = {
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
  "daegu-hobak-night": "daegu-hobak-night",
};
export const ACCESS_SLUG_BY_URL: Record<string, string> = Object.fromEntries(
  Object.entries(ACCESS_URL_MAP).map(([slug, url]) => [url, slug])
);
export const accessVenuePath = (slug: string) =>
  ACCESS_KEEP_OLD.has(slug) ? `/access/${slug}/` : `/${ACCESS_URL_MAP[slug] ?? slug}/`;
