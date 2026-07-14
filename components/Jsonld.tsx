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
    alternateName: ["룰루랄라 나이트", "창원 룰루랄라", "창원 나이트 룰루랄라"],
    url: SITE.url,
    description: `${SITE.name}. 만 ${SITE.ageLimit}세 이상만 출입 가능한 합법 영업장.`,
    image: `${SITE.url}/og-default.svg`,
    logo: `${SITE.url}/favicon.svg`,
    priceRange: "₩₩~₩₩₩",
    address: {
      "@type": "PostalAddress",
      addressLocality: "창원시",
      addressRegion: "경상남도",
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
    sameAs: [],
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
      addressLocality: "창원시",
      addressRegion: "경상남도",
      addressCountry: "KR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 35.2280,
      longitude: 128.6817,
    },
    hasMap: "https://map.naver.com/p/search/창원%20룰루랄라%20나이트",
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
