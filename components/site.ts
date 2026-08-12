export const SITE = {
  name: "창원 룰루랄라 나이트",
  shortName: "룰루랄라",
  role: "웨이터",
  contactName: "로또",
  phone: "010-7528-4936",
  phoneHref: "tel:01075284936",
  url: "https://changwon1.pages.dev",
  region: "경상남도 창원시",
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
  { href: "/jjanggu/", label: "담당" },
  { href: "/location/", label: "위치" },
  { href: "/contact/", label: "문의" },
] as const;
