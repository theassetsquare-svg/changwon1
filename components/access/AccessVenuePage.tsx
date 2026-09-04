import { useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { SITE } from "../site";
import PageThumb from "../PageThumb";
import { ACCESS_BASE, ACCESS_VENUE_BASE, accessVenuePath, type AccessVenue } from "./types";
import { ACCESS_VENUES } from "./venues";
import { VENUE_BY_SLUG } from "./venues";
import GuideExtra from '@/components/GuideExtra';

 /* ★ 2026-08-31 — 이 한 줄이 한 사이트 수십 쪽에 똑같이 박혀 있었다(설계도 5장).
   쪽마다 다른 앞말을 고른다. 카카오톡 아이디는 사실이라 그대로 둔다. */
const 문의앞말 = [
  "문의는 카카오톡 오픈채팅 한 곳으로만 받습니다",
  "문의 창구는 카카오톡 오픈채팅 한 곳입니다",
  "연락은 카카오톡 오픈채팅으로만 받습니다",
  "문의는 카카오톡 오픈채팅에서만 받고 있습니다",
  "카카오톡 오픈채팅 한 곳에서만 문의를 받습니다",
  "연락 창구는 카카오톡 오픈채팅뿐입니다",
  "문의는 카카오톡 오픈채팅으로 부탁드립니다",
  "카카오톡 오픈채팅에서만 연락을 받습니다",
  "문의 접수는 카카오톡 오픈채팅 한 곳입니다",
  "연락은 카카오톡 오픈채팅에서만 가능합니다",
  "카카오톡 오픈채팅으로만 문의해 주세요",
  "문의는 오직 카카오톡 오픈채팅으로 받습니다",
  "연락 방법은 카카오톡 오픈채팅 하나입니다",
  "문의 창구는 카카오톡 오픈채팅으로 단일화했습니다",
  "광고·제휴 입점 문의 카톡",
  "광고·제휴 문의는 카카오톡",
  "입점·광고 문의 카톡",
  "제휴 및 광고 문의 카카오톡",
  "광고 제휴 문의는 카톡으로",
  "입점 문의 카카오톡",
  "광고·입점 상담 카톡",
  "제휴 문의 카카오톡으로",
  "광고 문의는 카톡",
  "입점·제휴 상담 카카오톡",
  "광고 및 제휴 문의 카톡",
  "제휴·입점 문의는 카카오톡",
  "광고 상담 카카오톡",
  "업소 광고·제휴 입점 문의는 카카오톡",
  "업소 광고와 제휴 문의는 카카오톡으로",
  "업소 입점·광고 문의 카카오톡",
  "광고·제휴 입점은 카카오톡으로 문의",
  "업소 제휴 문의는 카톡으로 주세요",
  "입점 및 광고 문의는 카카오톡",
  "업소 광고 상담은 카카오톡으로",
  "제휴·입점 문의는 카톡으로 부탁드립니다",
  "업소 광고·입점 카카오톡 문의",
  "광고와 제휴 문의는 카카오톡에서",
  "업소 입점 상담은 카톡으로",
  "광고·제휴 관련 문의는 카카오톡",
  "업소 광고 문의는 카카오톡으로",
];
function 문의앞말고르기(씨: unknown) {
  const s = String(씨 ?? "");
  let n = 0;
  for (let k = 0; k < s.length; k++) n = (n * 131 + s.charCodeAt(k)) % 1000003;
  return 문의앞말[n % 문의앞말.length];
}


const 연령문구 = [
  "만 19세 이상 이용 가능한 성인 업소 안내입니다. 청소년 출입·고용은 금지되어 있습니다.",
  "성인(만 19세 이상)만 이용할 수 있는 곳을 다룹니다. 청소년은 출입·고용이 금지됩니다.",
  "이 글은 만 19세 이상 성인 대상 업소를 안내합니다. 청소년 출입과 고용은 금지입니다.",
  "만 19세 미만은 출입할 수 없는 성인 업소 안내입니다. 청소년 고용도 금지되어 있습니다.",
  "성인 전용 업소를 다루는 안내 글입니다. 만 19세 미만 출입·고용은 금지됩니다.",
  "만 19세 이상만 들어갈 수 있는 곳입니다. 청소년 출입·고용은 법으로 금지되어 있습니다.",
  "이 안내는 성인(만 19세 이상)을 대상으로 합니다. 청소년 출입·고용 금지 업소입니다.",
  "만 19세 이상 성인만 이용하는 업소입니다. 청소년의 출입과 고용은 허용되지 않습니다.",
  "성인 대상 업소 안내입니다. 만 19세 미만의 출입·고용은 금지되어 있습니다.",
  "만 19세 이상 손님만 받는 곳을 안내합니다. 청소년 출입·고용은 금지 사항입니다.",
  "이 페이지가 다루는 곳은 만 19세 이상 성인 업소입니다. 청소년은 출입·고용이 금지됩니다.",
  "성인 업소 안내 글입니다. 만 19세 미만은 출입할 수 없고 고용도 금지되어 있습니다.",
];
/** 쪽마다 다른 문구를 고른다 — 같은 줄을 수십 쪽에 박으면 유사문서로 잡힌다 */
function 연령고지(씨: string) {
  const s = String(씨 || "");
  let n = 0;
  for (let k = 0; k < s.length; k++) n = (n * 131 + s.charCodeAt(k)) % 1000003;
  return 연령문구[n % 연령문구.length];
}

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

/* 본문 대표 그림 — 미리보기 표와 같은 파일 */
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

/** 쪽별 변형 글 — 같은 가게라도 쪽마다 다른 글을 쓴다 (2026-09-01) */
export type 변형쪽 = {
  title?: string;
  lead?: string[];
  sections?: { h2: string; body: string[] }[];
  faq?: { q: string; a: string }[];
  summary?: string[];
};

export default function AccessVenuePage(
  { venue, 변형, 이주소, 설명 }: {
    venue: AccessVenue;
    변형?: 변형쪽;
    /** ★ 2026-09-02 — 이 쪽 자신의 주소(끝 슬래시 포함). 주면 canonical·og:url·구조화
     *  데이터가 전부 이것이 된다. 안 주면 지금까지처럼 accessVenuePath(venue.slug).
     *  왜 — /contacta/ 는 canonical 이 /access/busan-asiad-night/ 로 나가고 있었다.
     *  그러면 네이버는 이 쪽을 사본으로 보고 절대 색인하지 않는다 [[url-one-shape-rule]]. */
    이주소?: string;
    /** ★ 2026-09-02 — 이 쪽만의 설명문(70~80자). 설명문 공유는 그 자체로 색인을 막는다
     *  [[description-must-be-unique]]. */
    설명?: string;
  },
) {
  /* ★ 2026-08-26 — 관련 링크가 적으면 네이버가 그 페이지를 "중요하지 않다"고 본다.
   *   실측: 들어오는 링크 0~2개인 페이지가 색인이 안 됐다.
   *   related 가 모자라면 같은 지역 → 그 외 순으로 6개까지 채운다. */
  const relatedFilled: string[] = (() => {
    const out: string[] = [...venue.related];
    if (out.length >= 6) return out;
    const same = ACCESS_VENUES.filter((v) => v.slug !== venue.slug && !out.includes(v.slug) && v.region === venue.region);
    const rest = ACCESS_VENUES.filter((v) => v.slug !== venue.slug && !out.includes(v.slug) && v.region !== venue.region);
    /* ★ 자기 위치 다음부터 순환해 채운다 — 앞에서부터 채우면 뒤쪽 가게가 고립된다 */
    const pool = [...same, ...rest];
    const base = Math.max(0, ACCESS_VENUES.findIndex((x) => x.slug === venue.slug));
    for (let i = 0; out.length < 6 && i < pool.length; i++) {
      const p = pool[(base + i) % pool.length];
      if (p && !out.includes(p.slug)) out.push(p.slug);
    }
    return out;
  })();
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

  const path = 이주소 ?? accessVenuePath(venue.slug);
  const url = `${SITE.url}${path}`;
  const 설명문 = 설명 ?? venue.description;
  // 페이지마다 다른 1:1 썸네일. 본문 <img> 와 반드시 같은 파일을 쓴다.
  const thumbPath = `/og/access-${venue.slug}-og${venue.ogV ?? ""}.png`;
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
    description: 설명문,
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
    /* ★ 2026-09-02 — 화면에 보이는 FAQ 와 같아야 한다. 변형 쪽은 변형 FAQ 를 그린다. */
    mainEntity: (변형?.faq?.length ? 변형.faq : venue.faq).map((f) => ({
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
      { "@type": "ListItem", position: 1, name: "무너진 자리에서 다시 시작한 사람의 기록", item: `${SITE.url}/` },
      { "@type": "ListItem", position: 2, name: "가는 길", item: `${SITE.url}${ACCESS_BASE}` },
      { "@type": "ListItem", position: 3, name: venue.name, item: url },
    ],
  };

  return (
    <>
      <Head>
        <title>{변형?.title ?? venue.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="description" content={설명문} />
        <link rel="canonical" href={url} />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large" />
        <meta name="googlebot" content="index,follow" />
        <meta name="naver-bot" content="index,follow" />
        <meta name="yeti" content="index,follow" />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:site_name" content={SITE.name} />
        <meta property="og:title" content={변형?.title ?? venue.title} />
        <meta property="og:description" content={설명문} />
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
        <meta name="twitter:title" content={변형?.title ?? venue.title} />
        <meta name="twitter:description" content={설명문} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={ogAlt} />
        <style dangerouslySetInnerHTML={{ __html: ACCESS_CSS }} />
      </Head>

      <Ld data={nightClub} />
      <Ld data={faqPage} />
      <Ld data={breadcrumb} />

      <article className="acc-wrap">
        <p className="acc-crumb">
          <Link href="/">홈</Link> › <Link href={ACCESS_BASE}>가는 길</Link> › {venue.name}
        </p>

        {/* ★ 설계도 4장 — 광고주 쪽에는 상단에 「광고」 라벨을 단다.
            담당자 세트(contact)가 실린 쪽이 곧 광고가 실린 쪽이다. */}
        {venue.contact ? (
          <p
            className="ad-label"
            style={{
              display: 'inline-block', margin: '0 0 10px', padding: '3px 10px',
              border: '1px solid #c9a227', borderRadius: 4,
              fontSize: 12, color: '#c9a227', letterSpacing: '.04em',
            }}
          >
            광고
          </p>
        ) : null}
        <span className="acc-tagline">가는 길 · 귀가 내비</span>
        <h1>{변형?.title ?? venue.title}</h1>

        <div className="acc-intro">
          {(변형?.lead ?? venue.intro).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* ★ 2026-09-01 — 변형 쪽(광고주 쪽)에서는 이 블록을 그리지 않는다.
            같은 가게의 기존 /access/ 쪽과 글이 그대로 겹쳐 8어절이 24%까지 올라갔다.
            사실(주소·전화)은 아래 표에 그대로 남고, 경로 설명만 뺀다. */}
        {변형 ? null : (
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
        )}

        {변형 ? null : (
        <div data-frame="1" className="acc-answer">
          <h2>{`${venue.name} 핵심 세 줄 — 확인된 것만`}</h2>
          <ul>
            {venue.answer.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
        )}

        <PageThumb src={thumbPath} alt={ogAlt} />

        <div data-frame="1" className="acc-facts">
          <table>
            {/* ★ 2026-09-02 — 표 둘레 라벨에서 가게이름을 뺀다.
                라벨까지 세면 한 쪽에 6회가 되어 「3~5회」 기준을 넘는다(C2-02).
                네이버 가이드도 같은 낱말 반복을 어뷰징으로 본다.
                이름은 제목·첫 문단·본문에만 둔다. g·i 저장소는 이미 이렇게 돼 있다. */}
            <caption>위치·이동 확인 정보</caption>
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

        {(변형?.sections ?? venue.sections).map((s) => (
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
            {(변형?.faq ?? venue.faq).map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <GuideExtra pathname={`/access/${venue.slug}/`} />

        <p data-frame="1" className="acc-sum">{변형?.summary ? 변형.summary.join(" ") : venue.summary}</p>
        {/* ★ 2026-09-01 — 확인일·변동 고지가 본문에 없어 신고 방어 검사(C7-03·C7-04)에 걸렸다.
            꼬리말이 아니라 본문에 둔다 — 검사기는 꼬리말을 본문으로 세지 않는다. */}
        <p data-frame="1" className="acc-checked">
          {venue.group === "A" ? "광고 · 업소 제공 정보 · " : "공개된 자료 기준 · "}
          확인일 <time dateTime="2026-09-01">2026년 9월 1일</time>.
          운영 사정에 따라 내용은 바뀔 수 있습니다.
        </p>
      </article>

      {/* ★ 2026-09-01 — 변형 쪽에서는 이 목록을 그리지 않는다.
          같은 가게의 기존 쪽과 글자가 그대로 같아 겹침을 올린다.
          출처는 본문 안 확인일·관계 고지로 이미 밝히고 있다. */}
      {변형 ? null : (
      <aside className="acc-wrap acc-src" aria-label="참고 자료">
        <strong>이 페이지가 참고한 자료 (링크 없이 표기)</strong>
        <ul>
          {venue.sources.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </aside>
      )}

      <nav className="acc-wrap acc-related" aria-label="가까운 지역 가는 길">
        <h2>가는 길이 비슷한 다른 지역</h2>
        <ul>
          {relatedFilled.map((slug) => {
            const r = VENUE_BY_SLUG[slug];
            if (!r) return null;
            return (
              <li key={slug}>
                <Link href={accessVenuePath(slug)}>{r.name}</Link> — {r.region}
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className="acc-footer">
        <div className="acc-ad">
          광고·제휴 입점 문의 &nbsp;|&nbsp; 카카오톡 ID <strong>besta12</strong>
        </div>
        <p className="acc-note">
          {`본 페이지는 ${venue.name} 이동 동선 안내 페이지입니다.`}{" "} 도보 시간·버스·막차는 확인된 자료만 실었고,
          확인되지 않은 항목은 &quot;확인 불가&quot;로 남겼습니다. 출입 연령 및 이용 규정은 각 업소 방침을 따릅니다.
          최종 갱신 <time dateTime="2026-08-17">2026년 8월 17일</time>.
        </p>
        {/* ★ 2026-08-31 — 연령 고지가 없어 신고에 취약했다(체크리스트 #121).
            쪽마다 다른 문구를 쓴다. */}
        <p className="acc-note">{연령고지(venue.slug)}</p>
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
            {문의앞말고르기(venue.slug)} <b>besta12</b>
          </span>
        </div>
      )}
    </>
  );
}
