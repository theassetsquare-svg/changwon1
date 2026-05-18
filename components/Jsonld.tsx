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

export function buildOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "NightClub",
    name: SITE.name,
    url: SITE.url,
    telephone: SITE.phoneTel,
    description: `${SITE.name} 공식 사이트. ${SITE.callLabel}(${SITE.role}) 직통 ${SITE.phone}. 만 ${SITE.ageLimit}세 이상 합법 영업장.`,
    image: `${SITE.url}/og-default.svg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "창원시",
      addressRegion: "경상남도",
      addressCountry: "KR",
    },
    areaServed: {
      "@type": "City",
      name: "창원시",
    },
    employee: {
      "@type": "Person",
      name: SITE.waiter,
      jobTitle: SITE.role,
      worksFor: { "@type": "NightClub", name: SITE.name },
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phoneTel,
      contactType: "reservations",
      areaServed: "KR",
      availableLanguage: ["Korean"],
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
