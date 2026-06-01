export const SITE = {
  name: "창원 룰루랄라 나이트",
  shortName: "룰루랄라",
  waiter: "짱구",
  role: "웨이터",
  callLabel: "짱구 담당",
  phone: "010-3854-6887",
  phoneTel: "+82-10-3854-6887",
  phoneHref: "tel:01038546887",
  url: "https://changwon1.pages.dev",
  region: "경상남도 창원시",
  ageLimit: 19,
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
  { href: "/jjanggu/", label: "짱구 담당" },
  { href: "/location/", label: "위치" },
  { href: "/contact/", label: "문의" },
] as const;
