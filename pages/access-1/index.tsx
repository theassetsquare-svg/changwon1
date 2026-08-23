import { useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { SITE } from "@/components/site";
import PageThumb from "@/components/PageThumb";
import { ACCESS_CSS, RouteLine } from "@/components/access/AccessVenuePage";
import { ACCESS_GROUPS, ACCESS_VENUES } from "@/components/access/venues";

/**
 * /access/ — "전국 나이트 가는 길 40" 허브.
 * 40개 페이지를 지역별로 묶고, 각 줄에 확인된 기준점(역·도로명)만 짧게 붙인다.
 */

const HUB_CSS = `
.hub-grid{display:grid;gap:10px;margin:0 0 8px;padding:0;list-style:none;}
.hub-grid li{border:1px solid var(--acc-line);border-radius:10px;padding:12px 14px;
  background:var(--acc-panel);}
.hub-grid a{color:#fff;font-weight:800;}
.hub-grid a:hover{color:var(--acc-leaf);}
.hub-grid .meta{display:block;font-size:.86rem;color:var(--acc-warm-3);margin-top:3px;line-height:1.6;}
.hub-region{margin:30px 0 12px;font-size:1.15rem;color:var(--acc-leaf);}
.hub-count{font-size:.85rem;color:var(--acc-warm-3);font-weight:600;margin-left:8px;}
@media(min-width:620px){.hub-grid{grid-template-columns:1fr 1fr;}}
`;

/** 목록 한 줄에 붙일 기준점 — 확인된 항목만 고른다. */
function anchorOf(v: (typeof ACCESS_VENUES)[number]) {
  const station = v.facts.find((f) => f.label.startsWith("가까운 역") && !f.value.startsWith("확인 불가"));
  if (station) return station.value.replace(/\s*\(확인됨\)/, "");
  const exit = v.facts.find((f) => f.label.includes("출구") && !f.value.startsWith("확인 불가"));
  if (exit) return exit.value.replace(/\s*\(확인됨\)/, "");
  if (v.streetAddress) return `${v.addressLocality} ${v.streetAddress}`;
  return "주소 확인 불가 — 방문 전 확인 필요";
}

export default function AccessHub() {
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

  const path = "/access-1/";
  const url = `${SITE.url}${path}`;
  const thumbPath = "/og/page-access-og.png";
  const ogImage = `${SITE.url}${thumbPath}`;
  const ogAlt = "창원 룰루랄라 나이트 · 전국 나이트 가는 길 40";
  const title = "전국 나이트 가는 길 40 — 역·도보·주차·새벽 귀가 정리";
  const description =
    "전국 나이트클럽 40곳의 가는 길을 역 도보, 버스, 주차, 새벽 귀가 순으로 정리했습니다. 도보 시간과 출구는 확인된 것만 적고 나머지는 확인 불가로 남겼습니다.";

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${url}#list`,
    name: "전국 나이트 가는 길 40",
    numberOfItems: ACCESS_VENUES.length,
    itemListElement: ACCESS_VENUES.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: v.name,
      url: `${SITE.url}/access/${v.slug}/`,
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: `${SITE.url}/` },
      { "@type": "ListItem", position: 2, name: "가는 길", item: url },
    ],
  };

  const confirmed = ACCESS_VENUES.filter((v) => v.streetAddress || v.jibun).length;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large" />
        <meta name="googlebot" content="index,follow" />
        <meta name="naver-bot" content="index,follow" />
        <meta name="yeti" content="index,follow" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:site_name" content={SITE.name} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
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
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={ogAlt} />
        <style dangerouslySetInnerHTML={{ __html: ACCESS_CSS + HUB_CSS }} />
      </Head>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <article className="acc-wrap">
        <p className="acc-crumb">
          <Link href="/">홈</Link> › 가는 길
        </p>

        <span className="acc-tagline">가는 길 · 귀가 내비</span>
        <h1>전국 나이트 가는 길 40</h1>

        <PageThumb src={thumbPath} alt={ogAlt} />

        <div className="acc-intro">
          <p>
            업소 안내는 많은데 정작 &quot;어디서 내려서 몇 분 걷나&quot;를 적어 둔 곳은 드뭅니다. 그래서
            40곳을 이동 하나만 놓고 다시 정리했습니다. 역과 출구, 도보 시간, 주차, 그리고 새벽에 돌아가는 방법
            순서입니다.
          </p>
          <p>
            도보 분수와 버스 노선, 막차 시각은 웹에서 확인된 것만 적었습니다. 확인되지 않은 항목은 그럴듯하게 채우는
            대신 &quot;확인 불가&quot;로 남겼습니다. 40곳 가운데 도로명이나 지번이 확인된 곳은 {confirmed}곳입니다.
          </p>
        </div>

        <div className="acc-route">
          <h2>이 사이트가 40곳을 정리한 순서</h2>
          <RouteLine />
          <ol className="acc-steps">
            <li>
              <span className="n">1</span>
              <span className="lb">주소 확인</span>
              <span className="dt">도로명·지번·건물·층까지 공개 자료에서 확인되는 것만 적었습니다.</span>
            </li>
            <li>
              <span className="n">2</span>
              <span className="lb">기준점 잡기</span>
              <span className="dt">역과 출구가 확인되면 역 기준, 아니면 도로명 기준으로 동선을 씁니다.</span>
            </li>
            <li>
              <span className="n">3</span>
              <span className="lb">귀가 계산</span>
              <span className="dt">막차는 노선이 아니라 역·방향별로 다릅니다. 확인처만 표기했습니다.</span>
            </li>
          </ol>
        </div>

        <div className="acc-answer">
          <h2>핵심 세 줄</h2>
          <ul>
            <li>40곳 전부 이동 축(역 도보 → 버스 → 차·주차 → 새벽 귀가)으로만 정리했습니다.</li>
            <li>도보 시간·버스 노선·막차 시각은 확인된 것만 적고 나머지는 확인 불가로 남겼습니다.</li>
            <li>창원 룰루랄라 나이트 예약·문의는 웨이터 {SITE.contactName} {SITE.phone} 전화입니다.</li>
          </ul>
        </div>

        {ACCESS_GROUPS.map((g) => (
          <section key={g.key}>
            <h2 className="hub-region">
              {g.label}
              <span className="hub-count">{g.venues.length}곳</span>
            </h2>
            <ul className="hub-grid">
              {g.venues.map((v) => (
                <li key={v.slug}>
                  <Link href={`/access/${v.slug}/`}>{v.name}</Link>
                  <span className="meta">
                    {v.region} · {anchorOf(v)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section>
          <h2>왜 &quot;확인 불가&quot;를 그대로 두었나</h2>
          <p>
            도보 시간이나 버스 번호는 지어내기 쉬운 정보입니다. 그럴듯하게 적어 두면 페이지는 완성돼 보이지만,
            그 숫자를 믿고 움직인 사람은 엉뚱한 곳에서 시간을 씁니다.
          </p>
          <p>
            그래서 이 40개 페이지는 확인되지 않은 항목을 채우지 않았습니다. 대신 무엇을 어디서 확인하면 되는지를
            페이지마다 적어 두었습니다. 막차는 서울교통공사·부산교통공사 같은 운영기관의 역별 시각표에서, 주소는
            방문 전 업소 확인이 가장 정확합니다.
          </p>
        </section>

        <p className="acc-sum">
          한 줄로 — 전국 40곳의 가는 길을 역·도보·주차·새벽 귀가 순으로 정리했고, 확인되지 않은 숫자는 적지
          않았습니다. 창원 룰루랄라 나이트 문의는 {SITE.contactName} {SITE.phone}입니다.
        </p>
      </article>

      <footer className="acc-footer">
        <p className="acc-note">
          본 목록은 이동 동선 안내 페이지 모음입니다. 각 업소의 운영 주체는 서로 다르며, 주소·연락처를 섞어
          안내하지 않습니다. 최종 갱신 <time dateTime="2026-08-17">2026년 8월 17일</time>.
        </p>
      </footer>

      <div ref={barRef} className="callbar" role="complementary" aria-label="전화 연결">
        <a href={SITE.phoneHref}>
          📞 창원룰루랄라나이트 {SITE.contactName} {SITE.phone}
        </a>
      </div>
    </>
  );
}
