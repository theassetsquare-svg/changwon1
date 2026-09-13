export const SITE = {
  name: "창원 룰루랄라 나이트",
  shortName: "룰루랄라",
  role: "웨이터",
  // 2026-09-13 창원룰루랄라나이트 광고 해지(비광고주) — 담당 닉네임·전화 필드를 지웠다.
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
  { href: "/about/", label: "소개" },
  { href: "/jjanggua/", label: "입장 안내" },
  { href: "/location/", label: "위치" },
  { href: "/contacta/", label: "문의" },
] as const;
