import { useThumb } from "@/lib/thumb";
import { useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { SITE } from "../site";
import PageThumb from "../PageThumb";
import { NIGHT_BASE, VENUE_BY_SLUG, nightVenuePath, type NightVenue } from "./venues";
import GuideExtra from "@/components/GuideExtra";
import { 장부찾기 } from "@/lib/ledger";
import { saltOf, cssClasses, saltTree, SaltContext } from "@/lib/salt";
import { 이름줄이개, 번호줄이개, 도로꼴고치개 } from "@/lib/namecap";
import { 사실표정리 } from "../access/AccessVenuePage";
import { 마디고르기, 글자 } from "@/lib/pagelen";

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


/**
 * /night/{slug}/ 업소 안내 페이지.
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
/* 본문 대표 그림 — 미리보기 표와 같은 파일 */
.night-wrap>img{display:block;border-radius:12px;margin:0 0 26px;}
.night-facts{margin:0 0 26px;}
.night-facts table{width:100%;border-collapse:collapse;border:1px solid #2c303c;border-radius:10px;}
.night-facts caption{text-align:left;font-size:.85rem;color:#9aa0ab;padding:0 0 8px;}
.night-facts th{text-align:left;font-size:.9rem;color:#9aa0ab;font-weight:600;
  padding:10px 14px;width:34%;border-bottom:1px solid #2c303c;vertical-align:top;}
.night-facts td{padding:10px 14px;font-weight:700;border-bottom:1px solid #2c303c;}
.night-facts tr:last-child th,.night-facts tr:last-child td{border-bottom:0;}
.night-wrap h2{font-size:1.3rem;line-height:1.45;margin:34px 0 10px;}
.night-wrap p{margin:0 0 14px;}
.night-sum{background:#171922;border:1px solid #2c303c;border-radius:10px;
  padding:14px 18px;margin:34px 0 0;}
.night-sum h2{font-size:1.05rem;margin:0 0 8px;}
.night-sum ul{margin:0;padding-left:18px;}
.night-sum li{margin:4px 0;}
.night-related{border-top:1px solid #2c303c;margin-top:34px;padding-top:22px;}
.night-related h2{font-size:1.1rem;margin-top:0;}
.night-related ul{margin:0;padding-left:18px;}
.night-related li{margin:6px 0;}
.site-footer{max-width:820px;margin:0 auto;padding:0 20px;}
.ad-inquiry{background:#ffd400;color:#111;font-weight:900;font-size:18px;
  padding:16px;text-align:center;border-radius:10px;margin:24px auto;max-width:720px;}
.footer-note{color:#9aa0ab;font-size:.9rem;text-align:center;margin:0 0 40px;}
.night-faq{margin-top:34px;}
.night-faq h3{font-size:1.05rem;margin:18px 0 6px;}
.night-checked{font-size:.9rem;color:#9aa0ab;margin:22px 0 0;line-height:1.7;}
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

  const path = nightVenuePath(venue.slug);
  const url = `${SITE.url}${path}`;
  const 표 = useThumb();   /* 2026-09-24 쪽마다 고유 카드 */
  const thumbFile = 표 ? 표.file : `/og/${venue.slug}-og${venue.ogV ?? ""}.png`;
  const thumbAlt = 표 ? 표.alt : venue.ogAlt;
  const ogImage = `${SITE.url}${thumbFile}`;

  /* 2026-09-25 전부10 — 장부 값 · 광고 쪽 · 가게이름 횟수 · 쪽 소금 */
  const L = 장부찾기(venue.name);
  const 광고쪽 = venue.group === "A" && !!venue.contact && !!L?.isAdvertiser;
  const z = { s: saltOf(path), 지역: cssClasses(CSS) };
  const 이름줄 = 이름줄이개(venue.name, 5, path);
  const 번호줄 = 번호줄이개([L?.telephone ?? "", venue.contact?.phone ?? ""], 1);
  const 도로줄 = 도로꼴고치개(L?.address);
  const 줄 = (t: string) => 도로줄(번호줄(이름줄(t)));
  const h1글 = 줄(venue.title);
  const 답글 = 줄(`${venue.name}는 ${venue.region}에 있는 나이트클럽입니다. ${venue.answer.second}`);
  const 사실 = 사실표정리(venue.facts ?? [], venue.name, 광고쪽);
  /* 본문 목표 1,800~2,500자 — 고정 칸(제목·직답·표·문답·요약·고지)을 뺀 나머지 안에서 마디를 싣는다 */
  const 고정 = [venue.title, `${venue.name}는 ${venue.region}에 있는 나이트클럽입니다. ${venue.answer.second}`, ...사실.flatMap((f) => [f.label, f.value]), ...venue.faq.flatMap((f) => [f.q, f.a]), ...venue.summary, `${venue.name} 요약`, "확인된 기본 정보 자주 묻는 질문 이 쪽의 담당자 연락처는 광고로 실린 것입니다. 마지막 정리 2026년 9월 25일. 운영 사정에 따라 바뀔 수 있으니 방문 전에 확인하는 편이 안전합니다. 광고"]
    .reduce((a, t) => a + 글자(t), 0);
  const 마디들 = 마디고르기(venue.sections, 2430 - 고정).map((s) => ({ h2: 줄(s.h2), body: s.body.map(줄) }));
  const 더할글 = (() => { const n = 고정 + 마디들.reduce((a, s) => a + 글자(s.h2) + s.body.reduce((b, p) => b + 글자(p), 0), 0); return n < 1850 ? 1960 - n : 0; })();   /* 안내 문단(guide-extra)은 다른 사이트와 문장이 겹쳐 모자랄 때만 조금 */
  const 문답 = venue.faq.map((f) => ({ q: 줄(f.q), a: 줄(f.a) }));
  const 요약h2 = 줄(`${venue.name} 요약`);
  const 요약 = venue.summary.map(줄);

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
      ...(L?.address ? { streetAddress: L.address } : {}),
    },
    ...(광고쪽 && L?.telephone ? { telephone: L.telephone } : {}),
    ...(L?.openingHours ? { openingHours: L.openingHours } : {}),
    ...(venue.ageLabel ? { typicalAgeRange: venue.ageLabel } : {}),
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: 문답.map((f) => ({
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
      { "@type": "ListItem", position: 2, name: "나이트", item: `${SITE.url}/#night` },
      { "@type": "ListItem", position: 3, name: venue.name, item: url },
    ],
  };

  const 트리 = (
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
        <meta property="og:image:secure_url" content={ogImage} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="1200" />
        <meta property="og:image:alt" content={thumbAlt} />
        <link rel="image_src" href={ogImage} />
        <meta name="thumbnail" content={ogImage} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={venue.title} />
        <meta name="twitter:description" content={venue.description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={thumbAlt} />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>

      <Ld data={nightClub} />
      <Ld data={faqPage} />
      <Ld data={breadcrumb} />

      <article className="night-wrap">
        <nav className="night-crumb" aria-label="현재 위치">
          <Link href="/">홈</Link> › <Link href="/#night">나이트</Link> › {venue.name}
        </nav>

        {광고쪽 ? <p className="ad-label" style={{ display: "inline-block", margin: "0 0 10px", padding: "3px 10px", border: "1px solid #c9a227", borderRadius: 4, fontSize: 12, color: "#c9a227", letterSpacing: ".04em" }}>광고</p> : null}
        <h1>{h1글}</h1>
        {venue.ageLabel ? (
          <span className="night-badge">{venue.ageLabel} 출입 가능</span>
        ) : null}

        <div className="answer-box" data-r="lead">
          <p>{답글}</p>
        </div>

        <PageThumb src={thumbFile} alt={thumbAlt} />

        <div className="night-facts">
          <table data-r="facts">
            <caption>확인된 기본 정보</caption>
            <tbody>
              {사실.map((f) => (
                <tr key={f.label}>
                  <th scope="row">{f.label}</th>
                  <td>{f.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {마디들.map((s) => (
          <section key={s.h2}>
            <h2>{s.h2}</h2>
            {s.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
        ))}

        <section className="night-faq" data-r="qa">
          <h2>자주 묻는 질문</h2>
          {문답.map((f) => (
            <div key={f.q}>
              <h3 data-r="q">{f.q}</h3>
              <p data-r="a">{f.a}</p>
            </div>
          ))}
        </section>

        <GuideExtra pathname={path} 글바꾸기={줄} 예산={더할글} />

        <section className="night-sum" data-r="closewrap">
          <h2>{요약h2}</h2>
          <ul data-r="close">
            {요약.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
        <p className="night-checked">
          {광고쪽 ? "이 쪽의 담당자 연락처는 광고로 실린 것입니다. " : "업소와 제휴 관계가 없는 안내입니다. "}
          마지막 정리 2026년 9월 25일. 운영 사정에 따라 바뀔 수 있으니 방문 전에 확인하는 편이 안전합니다.
        </p>
      </article>

      <nav className="night-wrap night-related" aria-label="같이 보면 좋은 업소">
        <h2>{`${venue.name} 페이지와 같이 보면 좋은 업소 안내`}</h2>
        <ul>
          {venue.related.map((slug) => {
            const r = VENUE_BY_SLUG[slug];
            return (
              <li key={slug}>
                <Link href={nightVenuePath(slug)}>{r.name}</Link> — {r.region}
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className="site-footer">
        <div className="ad-inquiry">
          광고문의 카톡 <strong>besta12</strong>
        </div>
        <p className="footer-note">
          {`본 페이지는 ${venue.name} 업소 안내 페이지입니다.`}{" "} 출입 연령 및 이용 규정은 각 업소 방침을 따릅니다.
          최종 갱신 <time dateTime="2026-09-25">2026년 9월 25일</time>.
        </p>
        {광고쪽 ? null : (
          <p className="footer-note">업소와 제휴 관계가 없는 정보 페이지입니다(미제휴). 만 19세 이상 성인 대상입니다.</p>
        )}
      </footer>

      {광고쪽 && venue.contact ? (
        <div ref={barRef} className="callbar" role="complementary" aria-label="전화 연결">
          <a href={`tel:${(L?.telephone ?? venue.contact.phone).replace(/\D/g, "")}`}>
            📞 {venue.name} {L?.nickname ?? venue.contact.name} {L?.telephone ?? venue.contact.phone}
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
  return <SaltContext.Provider value={z}>{saltTree(트리, z)}</SaltContext.Provider>;
}
