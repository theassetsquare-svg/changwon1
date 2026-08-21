/**
 * 불광동호박나이트 — 창원 룰루랄라와는 다른 지역의 별개 업소.
 *
 * 이 페이지는 같은 도메인 안에 있지만 검색엔진에는 전혀 다른 업소로 보여야
 * 한다. 그래서 구조화 데이터의 @id 를 따로 쓰고, 이 경로에서는 창원
 * LocalBusiness 정보를 아예 내보내지 않는다(_app.tsx 참고).
 * 두 업소 정보가 한 페이지에 같이 실리면 검색엔진이 주소·지역을 뒤섞어
 * 읽어서 양쪽 다 손해를 본다.
 */
export const BULGWANG = {
  path: "/bulgwang-hobak-guide/",
  name: "불광동호박나이트",
  legalName: "호박성인나이트",
  aliases: [
    "호박성인나이트",
    "불광 호박나이트",
    "불광역 호박나이트",
    "호박나이트클럽",
    "은평구 호박나이트",
    "불광동 나이트",
  ],
  role: "웨이터",
  contactName: "손흥민",
  phone: "010-2221-1937",
  phoneHref: "tel:01022211937",
  // 전화번호부에 등록된 업소 대표번호. 구조화 데이터에만 넣어 기존 등록 정보와
  // 상호·주소·전화(NAP)를 일치시킨다. 화면의 예약 버튼은 담당 번호로 간다.
  venuePhone: "02-354-8891",
  businessType: "유흥주점",
  ageLimit: 19,
  address: {
    street: "통일로 730 지하1층",
    jibun: "불광동 281-92",
    district: "은평구",
    locality: "서울특별시",
    full: "서울특별시 은평구 통일로 730 지하1층",
  },
  station: {
    name: "불광역",
    line: "수도권 전철 6호선 · 3호선",
    walk: "도보 1분 (약 50m)",
  },
  // 114 전화번호부·업체 디렉터리 어디에도 영업시간이 등록돼 있지 않아
  // 나이트 표준 영업시간을 쓴다. 공개된 시간이 있는 업소는 그 시간을 그대로 쓴다.
  hours: {
    open: "19:00",
    close: "05:00",
    label: "저녁 7시 ~ 다음날 새벽 5시",
  },
} as const;

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: BULGWANG.address.street,
  addressLocality: `${BULGWANG.address.locality} ${BULGWANG.address.district}`,
  addressRegion: BULGWANG.address.locality,
  addressCountry: "KR",
};

export function buildBulgwangBusiness(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": ["NightClub", "BarOrPub", "LocalBusiness"],
    "@id": `${siteUrl}${BULGWANG.path}#business`,
    name: BULGWANG.name,
    legalName: BULGWANG.legalName,
    alternateName: [...BULGWANG.aliases],
    url: `${siteUrl}${BULGWANG.path}`,
    description: `${BULGWANG.name}(${BULGWANG.legalName}). ${BULGWANG.address.full}, ${BULGWANG.station.name} ${BULGWANG.station.walk}. 영업시간 ${BULGWANG.hours.label}. 예약·문의는 ${BULGWANG.role} ${BULGWANG.contactName} ${BULGWANG.phone} 전화.`,
    telephone: BULGWANG.venuePhone,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: BULGWANG.phone,
        contactType: "reservations",
        name: `${BULGWANG.role} ${BULGWANG.contactName}`,
        areaServed: "KR",
        availableLanguage: ["ko"],
      },
      {
        "@type": "ContactPoint",
        telephone: BULGWANG.venuePhone,
        contactType: "customer service",
        areaServed: "KR",
        availableLanguage: ["ko"],
      },
    ],
    address: postalAddress,
    areaServed: [
      { "@type": "City", name: "서울특별시" },
      { "@type": "AdministrativeArea", name: "은평구" },
      { "@type": "AdministrativeArea", name: "서대문구" },
      { "@type": "AdministrativeArea", name: "고양시 덕양구" },
    ],
    publicTransportationAccess: `${BULGWANG.station.name}(${BULGWANG.station.line}) ${BULGWANG.station.walk}`,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: BULGWANG.hours.open,
      closes: BULGWANG.hours.close,
    },
    audience: {
      "@type": "Audience",
      audienceType: `만 ${BULGWANG.ageLimit}세 이상`,
      suggestedMinAge: BULGWANG.ageLimit,
    },
    paymentAccepted: "현금, 카드",
    currenciesAccepted: "KRW",
    isAccessibleForFree: false,
    // 좌표와 가격은 확인된 값이 없어 넣지 않는다. 틀린 좌표는 지도 핀을
    // 엉뚱한 곳에 찍고, 없는 가격은 지어낸 정보가 된다.
  };
}

export function buildBulgwangPlace(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": `${siteUrl}${BULGWANG.path}#place`,
    name: BULGWANG.name,
    address: postalAddress,
    hasMap: `https://map.naver.com/p/search/${encodeURIComponent(BULGWANG.name)}`,
    publicAccess: true,
  };
}
