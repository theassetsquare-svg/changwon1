import { SITE } from "./site";

type JsonldProps = { data: Record<string, unknown> };

export function Jsonld({ data }: JsonldProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function buildLocalBusiness() {
  return {
    "@context": "https://schema.org",
    "@type": ["NightClub", "LocalBusiness"],
    "@id": `${SITE.url}/#business`,
    name: SITE.name,
    legalName: SITE.legalName,
    alternateName: [
      SITE.legalName,
      "룰루랄라 나이트",
      "창원 룰루랄라",
      "창원 나이트 룰루랄라",
      "룰루랄라나이트클럽",
    ],
    url: SITE.url,
    description: `${SITE.name}. 만 ${SITE.ageLimit}세 이상만 출입 가능한 합법 영업장. 예약·문의는 ${SITE.contactName} ${SITE.phone} 전화.`,
    image: [`${SITE.url}/og-default.png`, `${SITE.url}/og-cover.png`],
    logo: `${SITE.url}/favicon.svg`,
    telephone: SITE.phone,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phone,
      contactType: "reservations",
      name: `웨이터 ${SITE.contactName}`,
      areaServed: "KR",
      availableLanguage: ["ko"],
    },
    audience: {
      "@type": "Audience",
      audienceType: `만 ${SITE.ageLimit}세 이상`,
      suggestedMinAge: SITE.ageLimit,
    },
    priceRange: "₩₩~₩₩₩",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: `${SITE.address.locality} ${SITE.address.district}`,
      addressRegion: SITE.address.region,
      addressCountry: "KR",
    },
    areaServed: [
      { "@type": "City", name: "창원시" },
      { "@type": "AdministrativeArea", name: "경상남도" },
    ],
    paymentAccepted: "현금, 카드",
    currenciesAccepted: "KRW",
    publicAccess: true,
    smokingAllowed: false,
    isAccessibleForFree: false,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: SITE.hours.open,
      closes: SITE.hours.close,
    },
  };
}

export function buildWebsite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    inLanguage: "ko-KR",
    publisher: { "@type": "Organization", name: SITE.name },
  };
}

export function buildBreadcrumb(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path}`,
    })),
  };
}

export function buildPlace() {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": `${SITE.url}/location/#place`,
    name: SITE.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: `${SITE.address.locality} ${SITE.address.district}`,
      addressRegion: SITE.address.region,
      addressCountry: "KR",
    },
    // 좌표는 별도 확인 전까지 넣지 않는다. 주소가 정확하면 검색엔진이 직접
    // 지오코딩하며, 어긋난 좌표를 주면 지도 핀이 엉뚱한 곳에 찍힌다.
    hasMap: `https://map.naver.com/p/search/${encodeURIComponent(SITE.legalName)}`,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: SITE.hours.open,
      closes: SITE.hours.close,
    },
    isAccessibleForFree: false,
  };
}

export function buildFaq(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}
