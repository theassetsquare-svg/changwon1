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

export const ACCESS_BASE = "/access";
