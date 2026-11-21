import Head from "next/head";
import 카드표 from "@/lib/thumb-map.json";
import Link from "next/link";
import PageThumb from "@/components/PageThumb";
import { SITE } from "@/components/site";
import { BULGWANG as B } from "@/components/bulgwang";
import { 장부찾기 } from "@/lib/ledger";
import { saltOf, cssClasses, saltTree, SaltContext } from "@/lib/salt";

/**
 * /bulgwang-hobak-4/ — 불광동호박나이트 광고주(담당 손흥민) 쪽.
 *
 * 2026-09-25 전부10 다시 씀 — 옛 판에는 확인되지 않은 영업시간(「나이트 표준 영업시간」으로 채움)·단체석 안내·
 * 업소 대표번호(JSON-LD)·네이버 지도 바깥 링크가 있었다. 장부(data/shops verified) 값만 사실로 쓰고,
 * 확인 안 된 것(영업시간·가까운 역 거리·주차·가격)은 뺐다. 화면 아래 전화바는 사이트 공통 StickyCTA(이 쪽 전용 번호)가 맡는다.
 */
const 이름 = B.name;
const 이주소 = B.path;
const 그림: string = (카드표 as { 쪽: Record<string, { file: string }> }).쪽[이주소]?.file ?? "/og/t-j-bulgwang-hobak-4-c0a68cd2.png";   /* [전부10] lib/thumb-map.json 에서 읽는다 — 박아 두면 카드를 새로 고칠 때 본문(PageThumb)과 og 가 갈린다 */

const CSS = `
.bh-wrap{max-width:800px;margin:0 auto;padding:22px 20px 40px;color:#E8EEF3;}
.bh-crumb{font-size:.86rem;color:#98A7B3;margin:0 0 12px;}
.bh-crumb a{color:#98A7B3;}
.bh-wrap h1{font-size:1.85rem;line-height:1.35;margin:6px 0 14px;color:#fff;}
.bh-answer{background:#14202B;border:1px solid #2B3E4F;border-radius:12px;padding:16px 18px;margin:0 0 24px;}
.bh-answer p{margin:0;line-height:1.8;}
.bh-wrap>img{display:block;border-radius:12px;margin:0 0 24px;}
.bh-facts table{width:100%;border-collapse:collapse;margin:0 0 26px;}
.bh-facts th{width:30%;text-align:left;color:#9FB6C8;font-weight:600;padding:11px 12px;border-bottom:1px solid #2B3E4F;}
.bh-facts td{padding:11px 12px;font-weight:700;border-bottom:1px solid #2B3E4F;}
.bh-wrap h2{font-size:1.25rem;line-height:1.45;margin:32px 0 10px;color:#9BD3FF;}
.bh-wrap section p{line-height:1.85;margin:0 0 14px;color:#D5DEE6;}
.bh-faq dt{font-weight:800;margin:16px 0 6px;color:#fff;}
.bh-faq dd{margin:0;line-height:1.8;color:#D5DEE6;}
.bh-sum{border-left:4px solid #9BD3FF;padding:6px 0 6px 14px;margin:30px 0 0;}
.bh-sum h2{margin:0 0 6px;font-size:1.05rem;}
.bh-note{font-size:.88rem;color:#98A7B3;margin:18px 0 0;line-height:1.7;}
`;

export default function BulgwangHobak() {
  const L = 장부찾기(이름);
  const 주소 = L?.address ?? "";
  const 번호 = L?.telephone ?? "";
  const 담당 = L?.nickname ?? "";
  const url = `${SITE.url}${이주소}`;
  const z = { s: saltOf(이주소), 지역: cssClasses(CSS) };
  const 제목 = `${이름} 예약 문의, 통일로 730 지하 담당 손흥민`;
  const 설명 = `${이름} 광고 쪽. 주소는 은평구 통일로 730 지하(불광동 281-92)이고 예약 문의는 담당 손흥민이 받습니다. 전화 전에 정할 것을 정리했습니다.`;

  const 문답 = [
    { q: "불광동호박나이트 주소가 어디인가요?", a: "서울 은평구 통일로 730 지하입니다. 지번으로는 불광동 281-92입니다." },
    { q: "예약 문의는 누구에게 하나요?", a: `담당 ${담당}에게 전화로 합니다. 번호는 위 표와 화면 아래 전화 버튼에 있는 번호입니다.` },
    { q: "영업시간은 어떻게 되나요?", a: "공개 자료로 교차 확인된 영업시간이 없어 이 쪽에는 적지 않았습니다. 그날 몇 시까지 여는지는 통화로 묻는 편이 정확합니다." },
    { q: "호박성인나이트와 같은 곳인가요?", a: `정식 상호가 ${B.legalName}으로 알려져 있고, 주소가 같은 통일로 730 지하를 가리킵니다.` },
  ];

  const 트리 = (
    <>
      <Head>
        <title>{제목}</title>
        <meta name="description" content={설명} />
        <link rel="canonical" href={url} />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large" />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:title" content={제목} />
        <meta property="og:description" content={설명} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${SITE.url}${그림}`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="1200" />
        <meta property="og:image:alt" content={`광고 · ${이름} · ${담당} · ${번호}`} />
        <meta name="thumbnail" content={`${SITE.url}${그림}`} />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "NightClub", "@id": `${url}#venue`, name: 이름, alternateName: B.legalName, url, image: `${SITE.url}${그림}`,
        address: { "@type": "PostalAddress", streetAddress: 주소, addressLocality: "서울특별시 은평구", addressRegion: "서울특별시", addressCountry: "KR" },
        telephone: 번호,
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage", mainEntity: 문답.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "무너진 자리에서 다시 시작한 사람의 기록", item: `${SITE.url}/` },
          { "@type": "ListItem", position: 2, name: `${이름} 예약 문의`, item: url },
        ],
      }) }} />

      <article className="bh-wrap">
        <nav className="bh-crumb" aria-label="현재 위치"><Link href="/">홈</Link> › 은평구 가게 안내</nav>
        <p className="ad-label" style={{ display: "inline-block", margin: "0 0 10px", padding: "3px 10px", border: "1px solid #c9a227", borderRadius: 4, fontSize: 12, color: "#c9a227", letterSpacing: ".04em" }}>광고</p>
        <h1>{이름}, 통일로 730 지하로 찾아가기 전에</h1>
        <div className="bh-answer" data-r="lead">
          <p>{이름}는 서울 은평구 통일로 730 지하(지번 불광동 281-92)에 있습니다. 예약 문의는 담당 {담당} {번호}가 받습니다.</p>
        </div>
        <PageThumb src={그림} alt={`광고 · ${이름} · ${담당} · ${번호}`} />

        <div className="bh-facts">
          <table data-r="facts">
            <tbody>
              <tr><th scope="row">가게</th><td>{이름}</td></tr>
              <tr><th scope="row">주소</th><td>{주소}</td></tr>
              <tr><th scope="row">전화</th><td>{번호}</td></tr>
              <tr><th scope="row">담당</th><td>{담당}</td></tr>
            </tbody>
          </table>
        </div>

        <section>
          <h2>여기 적은 것과 적지 않은 것</h2>
          <p>이 쪽은 담당 연락처를 싣는 광고 쪽이라, 사실로 적는 칸을 일부러 좁게 잡았습니다. 주소와 담당 번호는 공개 자료와 광고 동의 기록으로 확인된 값입니다. 영업시간, 가까운 역에서 걸리는 시간, 주차, 가격은 교차 확인된 자료가 없어 적지 않았습니다.</p>
          <p>빈칸을 짐작으로 채우면 도착하는 사람이 헛걸음을 합니다. 그래서 모르는 것은 통화로 묻도록 남겨 두었습니다.</p>
        </section>

        <section>
          <h2>통일로 대로변 주소를 찾는 요령</h2>
          <p>통일로는 은평구를 남북으로 가로지르는 큰길이고, 번지는 길을 따라 차례로 붙습니다. 지도 앱에 통일로 730을 넣으면 대로변 건물이 나오고, 가게는 그 건물의 지하에 있습니다. 지상 간판만 보고 지나치기 쉬우니 건물 입구에서 지하로 내려가는 계단을 찾는 편이 빠릅니다.</p>
          <p>옛 지번인 불광동 281-92로 검색해도 같은 자리가 나옵니다. 택시 기사에게는 상호보다 도로명과 번지를 함께 말하는 편이 잘 통합니다.</p>
        </section>

        <section>
          <h2>담당에게 전화할 때 준비할 말</h2>
          <p>처음 거는 전화라면 인원, 도착 예정 시각, 연락받을 번호 이 세 가지를 먼저 말하면 됩니다. 인원이 아직 정해지지 않았다면 확정된 수와 늘 수 있는 수를 나눠서 알려 두는 편이 서로 편합니다.</p>
          <p>도착이 늦어지거나 인원이 바뀌면 같은 번호로 다시 알리면 됩니다. 그날 몇 시까지 여는지, 자리 사정이 어떤지도 이때 함께 물어보면 이 쪽에 적지 못한 빈칸이 채워집니다.</p>
        </section>

        <section>
          <h2>같은 「호박」 이름이 여러 지역에 있다는 점</h2>
          <p>호박나이트라는 이름은 서울과 경기, 지방 여러 곳에서 쓰입니다. 그래서 지도 앱에 「호박나이트」만 넣으면 은평구가 아닌 다른 지역 가게가 먼저 뜨기도 합니다. 은평구 통일로의 가게를 찾는다면 이름 앞에 불광동을 붙이거나, 아예 통일로 730을 넣는 편이 정확합니다.</p>
          <p>전화로 물을 때도 첫마디에 은평구 통일로라고 짚어 주면 어느 가게 이야기인지 바로 통합니다. 이름이 비슷한 가게가 많은 곳일수록 주소 한 줄이 가장 믿을 만한 표지입니다.</p>
        </section>

        <section>
          <h2>돌아가는 길은 들어가기 전에 정하기</h2>
          <p>늦은 시간에 나오면 대중교통이 끊기거나 배차가 길어지는 구간이 생깁니다. 막차 시각은 타는 역과 방향에 따라 다르니, 출발하기 전에 운영기관 시각표에서 내가 탈 역을 한 번 찾아 두면 좋습니다. 막차를 넘길 계획이라면 택시를 부를 지점을 미리 정해 두는 편이 덜 헤맵니다.</p>
          <p>일행이 여럿이면 누구와 같은 방향으로 가는지도 들어가기 전에 나눠 두십시오. 술자리가 이어지는 날에는 차를 두고 오는 것이 기본입니다.</p>
        </section>

        <section>
          <h2>처음 가는 사람이 통화에서 물어볼 것</h2>
          <p>이 쪽에 적지 못한 빈칸은 통화 한 번으로 채울 수 있습니다. 그날 몇 시까지 여는지, 도착 예정 시각에 자리가 있는지, 일행이 나눠 도착해도 괜찮은지 정도를 물어 두면 현장에서 머뭇거릴 일이 줄어듭니다.</p>
          <p>성인 업소라 입장할 때 나이를 확인할 수 있으니 신분증은 챙겨 가는 편이 안전합니다. 물어본 답은 일행과 한 번 나눠 두면 도착해서 같은 질문을 되풀이하지 않아도 됩니다.</p>
        </section>

        <section>
          <h2>일행이 여럿일 때 정해 둘 것</h2>
          <p>여럿이 함께 간다면 담당과 연락하는 사람을 한 명으로 정해 두십시오. 각자 따로 전화하면 인원이 겹쳐 전달되거나 빠질 수 있습니다. 연락을 맡은 사람은 전체 인원과 도착 순서를 정리해 한 번에 알리면 됩니다.</p>
          <p>늦게 오는 사람에게는 통일로 730 지하라는 주소를 미리 보내 두고, 도착하면 먼저 온 사람에게 연락하도록 정해 두면 건물 앞에서 서로 찾는 시간이 줄어듭니다. 나올 때도 같은 방향 사람끼리 짝을 지어 두면 새벽길이 한결 편합니다.</p>
        </section>

        <section className="bh-faq" data-r="qa">
          <h2>자주 묻는 것</h2>
          <dl>
            {문답.map((f) => (
              <div key={f.q}>
                <dt data-r="q">{f.q}</dt>
                <dd data-r="a">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="bh-sum" data-r="closewrap">
          <h2>한 줄 정리</h2>
          <p data-r="close">주소는 통일로 730 지하, 예약 문의는 담당 {담당}. 영업시간처럼 적지 않은 것은 전화로 그날 기준을 확인하면 됩니다.</p>
        </section>
        <p className="bh-note">광고 · 담당자 연락처는 광고로 실린 것입니다. 마지막 정리 <time dateTime="2026-09-25">2026년 9월 25일</time>. 운영 사정에 따라 바뀔 수 있으니 방문 전에 확인하십시오. 만 19세 이상 성인 대상이며 청소년 출입·고용은 금지입니다.</p>
      </article>
    </>
  );
  return <SaltContext.Provider value={z}>{saltTree(트리, z)}</SaltContext.Provider>;
}
