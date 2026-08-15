import { useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { SITE } from "../site";
import { NIGHT_BASE, VENUE_BY_SLUG, type NightVenue } from "./venues";

/**
 * /night/{slug}/ 업소 정보 페이지.
 *
 * 고정 전화바(.callbar)는 position:fixed 로만 붙인다. sticky·스크롤 이벤트를 쓰지 않는다.
 * 서버 렌더 HTML에는 React 트리 안에 들어가지만(크롤러가 봐야 하므로), 브라우저에서는
 * 마운트 직후 <body> 직계 자식으로 옮긴다. 조상 요소에 transform/filter 류가 생겨도
 * fixed 기준이 흔들리지 않게 하기 위해서다. 언마운트 시 원래 자리로 되돌려 React가
 * 자기 트리를 정리할 때 충돌하지 않게 한다.
 */

const CSS = `
.callbar{
  position:fixed; left:0; right:0; bottom:0; z-index:99999;
  display:flex; align-items:center; justify-content:center; gap:12px;
  height:64px; box-sizing:content-box;
  padding-bottom:env(safe-area-inset-bottom,0px);
  background:#111; color:#fff; font-weight:800; font-size:18px;
  box-shadow:0 -2px 14px rgba(0,0,0,.35);
  transform:translateZ(0); backface-visibility:hidden;
}
.callbar a{color:#fff; text-decoration:none; display:flex; align-items:center; height:100%;}
.callbar b{color:#ffd400;}
body{ padding-bottom:calc(84px + env(safe-area-inset-bottom,0px)); }
body.has-sticky{ padding-bottom:calc(84px + env(safe-area-inset-bottom,0px)); }
#__next{ padding-bottom:0; }
@media(max-width:480px){
  .callbar{height:60px; font-size:16px;}
  body{ padding-bottom:calc(80px + env(safe-area-inset-bottom,0px)); }
  body.has-sticky{ padding-bottom:calc(80px + env(safe-area-inset-bottom,0px)); }
}
/* 사이트 공통 전화바는 이 페이지의 업소와 번호가 다르다. 고정바가 두 개 겹치지 않도록 숨긴다. */
.sticky-cta{display:none !important;}

.night-wrap{max-width:820px;margin:0 auto;padding:0 20px;}
.night-crumb{font-size:.9rem;color:#9aa0ab;margin:22px 0 10px;}
.night-crumb a{color:#9aa0ab;}
.night-wrap h1{font-size:2rem;line-height:1.3;margin:0 0 6px;}
.night-badge{display:inline-block;background:#ffd400;color:#111;font-weight:900;
  font-size:.85rem;padding:4px 10px;border-radius:999px;margin-bottom:10px;}
.answer-box{background:#171922;border:1px solid #2c303c;border-left:5px solid #ffd400;
  border-radius:10px;padding:16px 18px;margin:14px 0 26px;}
.answer-box p{margin:0;font-size:1.05rem;line-height:1.75;}
.night-facts{border:1px solid #2c303c;border-radius:10px;padding:8px 18px;margin:0 0 26px;}
.night-facts dl{margin:0;}
.night-facts dt{font-size:.85rem;color:#9aa0ab;margin-top:12px;}
.night-facts dd{margin:2px 0 12px;font-weight:700;}
.night-wrap h2{font-size:1.3rem;line-height:1.45;margin:34px 0 10px;}
.night-wrap p{margin:0 0 14px;}
.night-related{border-top:1px solid #2c303c;margin-top:40px;padding-top:22px;}
.night-related h2{font-size:1.1rem;margin-top:0;}
.night-related ul{margin:0;padding-left:18px;}
.night-related li{margin:6px 0;}
.site-footer{max-width:820px;margin:0 auto;padding:0 20px;}
.ad-inquiry{background:#ffd400;color:#111;font-weight:900;font-size:18px;
  padding:16px;text-align:center;border-radius:10px;margin:24px auto;max-width:720px;}
.footer-note{color:#9aa0ab;font-size:.9rem;text-align:center;margin:0 0 40px;}
`;

function Ld({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function NightVenuePage({ venue }: { venue: NightVenue }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const parent = el.parentNode;
    const next = el.nextSibling;
    document.body.appendChild(el);
    return () => {
      if (parent) parent.insertBefore(el, next);
    };
  }, []);

  const path = `${NIGHT_BASE}/${venue.slug}/`;
  const url = `${SITE.url}${path}`;
  const ogImage = `${SITE.url}/og/${venue.slug}-og.png`;
  const faq = venue.sections.slice(0, 5);

  const nightClub: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "NightClub",
    "@id": `${url}#venue`,
    name: venue.name,
    url,
    image: ogImage,
    description: venue.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: venue.addressLocality,
      addressRegion: venue.addressRegion,
      addressCountry: "KR",
      // 확인된 주소가 있는 업소만 상세 주소를 넣는다.
      ...(venue.slug === "bulgwang-hobak-night"
        ? { streetAddress: "통일로 730 지하1층" }
        : venue.slug === "changwon-lululala-night"
          ? { streetAddress: "마디미로43번길 10 지하3층" }
          : {}),
    },
    ...(venue.contact ? { telephone: venue.contact.phone } : {}),
    ...(venue.minAge ? { typicalAgeRange: `${venue.minAge}+` } : {}),
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: faq.map((s) => ({
      "@type": "Question",
      name: s.h2,
      acceptedAnswer: { "@type": "Answer", text: s.body[0] },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: `${SITE.url}/` },
      { "@type": "ListItem", position: 2, name: "나이트", item: `${SITE.url}/#night` },
      { "@type": "ListItem", position: 3, name: venue.name, item: url },
    ],
  };

  return (
    <>
      <Head>
        <title>{venue.title}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="description" content={venue.description} />
        <link rel="canonical" href={url} />
        <meta
          name="robots"
          content="index,follow,max-snippet:-1,max-image-preview:large"
        />
        <meta name="googlebot" content="index,follow" />
        <meta name="naver-bot" content="index,follow" />
        <meta name="yeti" content="index,follow" />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:site_name" content={SITE.name} />
        <meta property="og:title" content={venue.title} />
        <meta property="og:description" content={venue.description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="1200" />
        <meta property="og:image:alt" content={venue.ogAlt} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={venue.title} />
        <meta name="twitter:description" content={venue.description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={venue.ogAlt} />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>

      <Ld data={nightClub} />
      <Ld data={faqPage} />
      <Ld data={breadcrumb} />

      <article className="night-wrap">
        <p className="night-crumb">
          <Link href="/">홈</Link> › <Link href="/#night">나이트</Link> › {venue.name}
        </p>

        <h1>{venue.name}</h1>
        {venue.minAge ? (
          <span className="night-badge">만 {venue.minAge}세 이상 출입</span>
        ) : null}

        <div className="answer-box">
          <p>{venue.lead}</p>
        </div>

        {venue.facts ? (
          <div className="night-facts">
            <dl>
              {venue.facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        {venue.sections.map((s) => (
          <section key={s.h2}>
            <h2>{s.h2}</h2>
            {s.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
        ))}

        <nav className="night-related">
          <h2>같이 보면 좋은 지역 안내</h2>
          <ul>
            {venue.related.map((slug) => {
              const r = VENUE_BY_SLUG[slug];
              return (
                <li key={slug}>
                  <Link href={`${NIGHT_BASE}/${slug}/`}>
                    {r.name} — {r.region}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </article>

      <footer className="site-footer">
        <div className="ad-inquiry">
          광고·제휴 입점 문의 &nbsp;|&nbsp; 카카오톡 ID <strong>besta12</strong>
        </div>
        <p className="footer-note">
          본 페이지는 업소 정보 제공 페이지입니다. 출입 연령 및 이용 규정은 각 업소 방침을 따릅니다.
        </p>
      </footer>

      {venue.group === "A" && venue.contact ? (
        <div ref={barRef} className="callbar" role="complementary" aria-label="전화 연결">
          <a href={`tel:${venue.contact.tel}`}>
            📞 {venue.contact.name} {venue.contact.phone}
          </a>
        </div>
      ) : (
        <div ref={barRef} className="callbar" role="complementary" aria-label="광고 제휴 문의">
          <span>
            광고·제휴 입점 문의 카톡 <b>besta12</b>
          </span>
        </div>
      )}
    </>
  );
}
