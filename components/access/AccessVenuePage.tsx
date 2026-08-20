import { useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { SITE } from "../site";
import PageThumb from "../PageThumb";
import { ACCESS_BASE, type AccessVenue } from "./types";
import { VENUE_BY_SLUG } from "./venues";

/**
 * /access/{slug}/ — 업소별 "가는 길·귀가" 페이지.
 *
 * 색은 포레스트 그린 + 웜 그레이. 지도 라인 그래픽(점선 경로 + 노드 3개)과
 * 1-2-3 스텝 UI로 이동 순서를 그대로 보여 준다.
 *
 * 고정 전화바(.callbar)는 /night/ 와 같은 방식으로 붙인다. position:fixed 만 쓰고
 * 마운트 직후 <body> 직계 자식으로 옮겨 조상 transform 의 영향을 받지 않게 한다.
 */

export const ACCESS_CSS = `
:root{
  --acc-green:#1B4332;
  --acc-green-2:#2D6A4F;
  --acc-green-3:#40916C;
  --acc-leaf:#74C69D;
  --acc-warm:#EDE8E0;
  --acc-warm-2:#C9C2B6;
  --acc-warm-3:#8D877C;
  --acc-ink:#12100E;
  --acc-panel:#171A18;
  --acc-panel-2:#1F2421;
  --acc-line:#333B36;
}
.acc-wrap{max-width:840px;margin:0 auto;padding:0 20px;color:var(--acc-warm);}
.acc-crumb{font-size:.88rem;color:var(--acc-warm-3);margin:22px 0 12px;}
.acc-crumb a{color:var(--acc-warm-3);}
.acc-crumb a:hover{color:var(--acc-leaf);}
.acc-wrap h1{font-size:1.95rem;line-height:1.34;margin:0 0 10px;letter-spacing:-.02em;color:#fff;}
.acc-tagline{display:inline-flex;align-items:center;gap:7px;background:var(--acc-green);
  color:var(--acc-leaf);font-weight:800;font-size:.82rem;letter-spacing:-.01em;
  padding:5px 12px;border-radius:999px;margin:0 0 14px;}
.acc-intro p{margin:0 0 14px;color:var(--acc-warm-2);line-height:1.85;}

/* 지도 라인 그래픽 + 1-2-3 스텝 */
.acc-route{background:var(--acc-panel);border:1px solid var(--acc-line);border-radius:14px;
  padding:18px 18px 6px;margin:22px 0 26px;}
.acc-route h2{font-size:.95rem;margin:0 0 12px;color:var(--acc-leaf);letter-spacing:.02em;}
.acc-map{width:100%;height:56px;display:block;margin:0 0 2px;}
.acc-steps{list-style:none;margin:0;padding:0;display:grid;gap:12px;
  grid-template-columns:repeat(3,1fr);}
.acc-steps li{padding:0 0 16px;}
.acc-steps .n{display:inline-flex;align-items:center;justify-content:center;
  width:22px;height:22px;border-radius:999px;background:var(--acc-green-2);color:#fff;
  font-size:.78rem;font-weight:800;margin-bottom:6px;}
.acc-steps .lb{display:block;font-weight:800;font-size:.95rem;color:#fff;margin-bottom:3px;}
.acc-steps .dt{display:block;font-size:.86rem;color:var(--acc-warm-3);line-height:1.6;}
@media(max-width:560px){
  .acc-steps{grid-template-columns:1fr;gap:4px;}
  .acc-steps li{padding-bottom:10px;}
  .acc-map{height:44px;}
}

/* 핵심 3줄 직답 */
.acc-answer{background:var(--acc-panel-2);border:1px solid var(--acc-line);
  border-left:5px solid var(--acc-green-3);border-radius:12px;padding:16px 18px;margin:0 0 26px;}
.acc-answer h2{font-size:.95rem;margin:0 0 10px;color:var(--acc-leaf);}
.acc-answer ul{margin:0;padding-left:18px;}
.acc-answer li{margin:6px 0;line-height:1.75;color:var(--acc-warm);}

/* 본문 대표 이미지 — og:image·thumbnail 과 같은 파일 */
.acc-wrap>img{display:block;border-radius:12px;margin:0 0 26px;}

/* 사실 표 */
.acc-facts{margin:0 0 28px;}
.acc-facts table{width:100%;border-collapse:collapse;border:1px solid var(--acc-line);border-radius:12px;}
.acc-facts caption{text-align:left;font-size:.85rem;color:var(--acc-warm-3);padding:0 0 8px;}
.acc-facts th{text-align:left;font-size:.88rem;color:var(--acc-warm-3);font-weight:600;
  padding:11px 14px;width:36%;border-bottom:1px solid var(--acc-line);vertical-align:top;}
.acc-facts td{padding:11px 14px;font-weight:700;border-bottom:1px solid var(--acc-line);
  color:var(--acc-warm);vertical-align:top;}
.acc-facts tr:last-child th,.acc-facts tr:last-child td{border-bottom:0;}

.acc-wrap h2{font-size:1.28rem;line-height:1.45;margin:34px 0 10px;color:#fff;letter-spacing:-.02em;}
.acc-wrap section p{margin:0 0 14px;color:var(--acc-warm-2);line-height:1.85;}
.acc-final{border-left:5px solid var(--acc-green-3);padding-left:16px;margin-top:36px;}
.acc-final h2{margin-top:0;}

.acc-faq{margin-top:36px;}
.acc-faq h2{margin-bottom:14px;}
.acc-faq dt{font-weight:800;color:#fff;margin:16px 0 6px;}
.acc-faq dd{margin:0;color:var(--acc-warm-2);line-height:1.8;}
.acc-sum{background:var(--acc-green);border:1px solid var(--acc-green-2);border-radius:12px;
  padding:16px 18px;margin:30px 0 0;color:#EAF4EE;font-weight:700;line-height:1.75;}
.acc-src{margin:22px 0 0;font-size:.84rem;color:var(--acc-warm-3);line-height:1.7;}
.acc-src strong{display:block;color:var(--acc-warm-2);font-size:.86rem;margin-bottom:5px;}
.acc-src li{margin:3px 0;}

.acc-related{border-top:1px solid var(--acc-line);margin-top:36px;padding-top:22px;}
.acc-related h2{font-size:1.08rem;margin-top:0;}
.acc-related ul{margin:0;padding-left:18px;}
.acc-related li{margin:7px 0;color:var(--acc-warm-3);}
.acc-related a{color:var(--acc-leaf);font-weight:700;}

.acc-footer{max-width:840px;margin:0 auto;padding:0 20px;}
.acc-ad{background:var(--acc-green-2);color:#fff;font-weight:800;font-size:17px;
  padding:16px;text-align:center;border-radius:12px;margin:26px auto;max-width:740px;}
.acc-note{color:var(--acc-warm-3);font-size:.86rem;text-align:center;margin:0 0 44px;line-height:1.7;}

.callbar{
  position:fixed; left:0; right:0; bottom:0; z-index:99999;
  display:flex; align-items:center; justify-content:center; gap:12px;
  height:64px; box-sizing:content-box;
  padding-bottom:env(safe-area-inset-bottom,0px);
  background:#12241C; color:#fff; font-weight:800; font-size:18px;
  box-shadow:0 -2px 14px rgba(0,0,0,.4);
  transform:translateZ(0); backface-visibility:hidden;
}
.callbar a{color:#fff;text-decoration:none;display:flex;align-items:center;height:100%;}
.callbar b{color:#74C69D;}
body{ padding-bottom:calc(84px + env(safe-area-inset-bottom,0px)); }
body.has-sticky{ padding-bottom:calc(84px + env(safe-area-inset-bottom,0px)); }
#__next{ padding-bottom:0; }
@media(max-width:480px){
  .callbar{height:60px;font-size:16px;}
  body{ padding-bottom:calc(80px + env(safe-area-inset-bottom,0px)); }
  body.has-sticky{ padding-bottom:calc(80px + env(safe-area-inset-bottom,0px)); }
}
/* 사이트 공통 전화바와 겹치지 않게 한 개만 남긴다. */
.sticky-cta{display:none !important;}
`;

/** 출발 → 기준점 → 업소 세 노드를 잇는 점선 경로. 장식용 지도 라인. */
export function RouteLine() {
  return (
    <svg className="acc-map" viewBox="0 0 600 56" role="img" aria-label="출발지에서 업소까지 이어지는 경로 그래픽">
      <path
        d="M20 40 L150 40 Q190 40 210 24 L330 24 Q370 24 392 40 L580 40"
        fill="none"
        stroke="#2D6A4F"
        strokeWidth="3"
        strokeDasharray="9 7"
        strokeLinecap="round"
      />
      <circle cx="20" cy="40" r="7" fill="#40916C" />
      <circle cx="300" cy="24" r="7" fill="#40916C" />
      <circle cx="580" cy="40" r="9" fill="#74C69D" />
    </svg>
  );
}

function Ld({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function AccessVenuePage({ venue }: { venue: AccessVenue }) {
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

  const path = `${ACCESS_BASE}/${venue.slug}/`;
  const url = `${SITE.url}${path}`;
  // 페이지마다 다른 1:1 썸네일. 본문 <img> 와 반드시 같은 파일을 쓴다.
  const thumbPath = `/og/access-${venue.slug}-og.png`;
  const ogImage = `${SITE.url}${thumbPath}`;
  const ogAlt = `${venue.nameSpaced} 가는 길·귀가 안내`;

  const nightClub: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "NightClub",
    "@id": `${url}#venue`,
    name: venue.name,
    ...(venue.altNames ? { alternateName: venue.altNames } : {}),
    url,
    image: ogImage,
    description: venue.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: venue.addressLocality,
      addressRegion: venue.addressRegion,
      addressCountry: "KR",
      ...(venue.streetAddress ? { streetAddress: venue.streetAddress } : {}),
    },
    ...(venue.contact ? { telephone: venue.contact.phone } : {}),
    // 연령 표기는 언제나 완전문으로만 넣는다.
    ...(venue.ageLabel ? { typicalAgeRange: venue.ageLabel } : {}),
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: venue.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: `${SITE.url}/` },
      { "@type": "ListItem", position: 2, name: "가는 길", item: `${SITE.url}${ACCESS_BASE}/` },
      { "@type": "ListItem", position: 3, name: venue.name, item: url },
    ],
  };

  return (
    <>
      <Head>
        <title>{venue.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="description" content={venue.description} />
        <link rel="canonical" href={url} />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large" />
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
        <meta property="og:image:secure_url" content={ogImage} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="1200" />
        <meta property="og:image:alt" content={ogAlt} />
        <link rel="image_src" href={ogImage} />
        {/* 네이버 수집기가 따로 보는 썸네일 지정 메타 */}
        <meta name="thumbnail" content={ogImage} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={venue.title} />
        <meta name="twitter:description" content={venue.description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={ogAlt} />
        <style dangerouslySetInnerHTML={{ __html: ACCESS_CSS }} />
      </Head>

      <Ld data={nightClub} />
      <Ld data={faqPage} />
      <Ld data={breadcrumb} />

      <article className="acc-wrap">
        <p className="acc-crumb">
          <Link href="/">홈</Link> › <Link href={`${ACCESS_BASE}/`}>가는 길</Link> › {venue.name}
        </p>

        <span className="acc-tagline">가는 길 · 귀가 내비</span>
        <h1>{venue.title}</h1>

        <div className="acc-intro">
          {venue.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="acc-route">
          <h2>{venue.nameSpaced} 도착까지 세 단계</h2>
          <RouteLine />
          <ol className="acc-steps">
            {venue.steps.map((s, i) => (
              <li key={s.label}>
                <span className="n">{i + 1}</span>
                <span className="lb">{s.label}</span>
                <span className="dt">{s.detail}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="acc-answer">
          <h2>{`${venue.name} 핵심 세 줄 — 확인된 것만`}</h2>
          <ul>
            {venue.answer.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>

        <PageThumb src={thumbPath} alt={ogAlt} />

        <div className="acc-facts">
          <table>
            <caption>{venue.name} 위치·이동 확인 정보</caption>
            <tbody>
              {venue.facts.map((f) => (
                <tr key={f.label}>
                  <th scope="row">{f.label}</th>
                  <td>{f.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {venue.sections.map((s) => (
          <section key={s.h2}>
            <h2>{s.h2}</h2>
            {s.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
        ))}

        <section className="acc-final">
          <h2>{venue.finalAnswer.h2}</h2>
          {venue.finalAnswer.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>

        <section className="acc-faq">
          <h2>{venue.nameSpaced} 이동 관련 자주 묻는 것</h2>
          <dl>
            {venue.faq.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="acc-sum">{venue.summary}</p>
      </article>

      <aside className="acc-wrap acc-src" aria-label="참고 자료">
        <strong>이 페이지가 참고한 자료 (링크 없이 표기)</strong>
        <ul>
          {venue.sources.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </aside>

      <aside className="acc-wrap acc-related" aria-label="가까운 지역 가는 길">
        <h2>가는 길이 비슷한 다른 지역</h2>
        <ul>
          {venue.related.map((slug) => {
            const r = VENUE_BY_SLUG[slug];
            if (!r) return null;
            return (
              <li key={slug}>
                <Link href={`${ACCESS_BASE}/${slug}/`}>{r.name}</Link> — {r.region}
              </li>
            );
          })}
        </ul>
      </aside>

      <footer className="acc-footer">
        <div className="acc-ad">
          광고·제휴 입점 문의 &nbsp;|&nbsp; 카카오톡 ID <strong>besta12</strong>
        </div>
        <p className="acc-note">
          {`본 페이지는 ${venue.name} 이동 동선 안내 페이지입니다.`}{" "} 도보 시간·버스·막차는 확인된 자료만 실었고,
          확인되지 않은 항목은 &quot;확인 불가&quot;로 남겼습니다. 출입 연령 및 이용 규정은 각 업소 방침을 따릅니다.
          최종 갱신 <time dateTime="2026-08-17">2026년 8월 17일</time>.
        </p>
      </footer>

      {venue.group === "A" && venue.contact ? (
        <div ref={barRef} className="callbar" role="complementary" aria-label="전화 연결">
          <a href={`tel:${venue.contact.tel}`}>
            📞 {venue.name} {venue.contact.name} {venue.contact.phone}
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
