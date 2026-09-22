export const SITE = {
  name: "창원 룰루랄라 나이트",
  shortName: "룰루랄라",
  role: "웨이터",
  /* ★ 2026-09-22 대표님 지시 — 창원룰루랄라나이트가 다시 광고주가 됐다.
     동의 기록 naver-watch/data/consents/changwon-lululala.json (동의일 2026-07-01 · 재개 2026-09-22).
     ★ 이 세 칸을 지우면 pages/jjanggua.tsx 의 {SITE.contactName} 이 타입 오류를 내 **빌드가 통째로 깨진다**
       (2026-09-13 해지 때 지워져 그날부터 Cloudflare 빌드가 실패하고 있었다 — 2026-09-22 빌드 로그로 확인). */
  contactName: "로또" as string | null,
  phone: "010-7528-4936" as string | null,
  phoneHref: "tel:01075284936" as string | null,
  kakaoId: "besta12",
  adInquiry: "광고문의 카카오톡 besta12",
  url: "https://j.nolcool.com",
  region: "경상남도 창원시",
  // 사업장 정식 상호 — 지도·검색에 등록된 이름과 맞춘다.
  legalName: "창원 룰루랄라나이트클럽",
  address: {
    street: "마디미로43번길 10 지하3층",
    district: "성산구",
    locality: "창원시",
    region: "경상남도",
    full: "경상남도 창원시 성산구 마디미로43번길 10 지하3층",
  },
  ageLimit: 27,
  hours: {
    open: "19:00",
    close: "05:00",
    label: "오후 7시 ~ 다음날 새벽 5시",
    labelShort: "19:00 ~ 05:00",
  },
} as const;

export const NAV = [
  { href: "/", label: "홈" },
  { href: "/about-2/", label: "소개" },
  { href: "/jjanggua/", label: "담당" },
  { href: "/location/", label: "위치" },
  { href: "/contacta/", label: "문의" },
] as const;
