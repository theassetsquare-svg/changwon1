import Head from "next/head";
import Link from "next/link";
import PageThumb from "@/components/PageThumb";
import { SITE } from "@/components/site";
import { 장부찾기 } from "@/lib/ledger";
import { saltOf, cssClasses, saltTree, SaltContext } from "@/lib/salt";

/**
 * /jjanggua/ — 창원룰루랄라나이트 광고주(담당 로또) 쪽.
 *
 * 2026-09-25 전부10 다시 씀 — 옛 판은 가게이름이 본문에 한 번도 없었고(띄어 쓴 이름만),
 * 제목이 「광고·제휴 문의는 로또」라 사실과 달랐다(광고문의 창구는 카톡 besta12 · 로또는 가게 예약 담당).
 * 확인되지 않은 말(카드 결제·담당제 운영 방식 등)도 빼고, 장부(data/shops verified) 값만 사실로 쓴다.
 */
const 이름 = "창원룰루랄라나이트";
const 이주소 = "/jjanggua/";
const 그림 = "/og/t-j-jjanggua-b5698e03.png";   /* lib/thumb-map.json 의 이 쪽 카드(본문 첫 그림과 같은 파일) */

const CSS = `
.jg-wrap{max-width:780px;margin:0 auto;padding:22px 20px 40px;color:#ECE7DF;}
.jg-crumb{font-size:.86rem;color:#A59F95;margin:0 0 12px;}
.jg-crumb a{color:#A59F95;}
.jg-wrap h1{font-size:1.9rem;line-height:1.35;margin:6px 0 14px;color:#fff;letter-spacing:-.02em;}
.jg-lead{background:#1D1A16;border:1px solid #3A342C;border-left:5px solid #D9A441;border-radius:12px;padding:16px 18px;margin:0 0 24px;}
.jg-lead p{margin:0;line-height:1.8;}
.jg-wrap>img{display:block;border-radius:12px;margin:0 0 24px;}
.jg-facts table{width:100%;border-collapse:collapse;border:1px solid #3A342C;margin:0 0 26px;}
.jg-facts th{width:30%;text-align:left;color:#C9C1B4;font-weight:600;padding:11px 14px;border-bottom:1px solid #3A342C;}
.jg-facts td{padding:11px 14px;font-weight:700;border-bottom:1px solid #3A342C;}
.jg-wrap h2{font-size:1.25rem;line-height:1.45;margin:32px 0 10px;color:#fff;}
.jg-wrap section p{line-height:1.85;margin:0 0 14px;color:#DAD3C8;}
.jg-qa h3{font-size:1.02rem;margin:18px 0 6px;color:#F2D38B;}
.jg-close{background:#2A2218;border:1px solid #D9A441;border-radius:12px;padding:16px 18px;margin:30px 0 0;}
.jg-close h2{margin:0 0 8px;font-size:1.05rem;}
.jg-note{font-size:.88rem;color:#A59F95;margin:18px 0 0;line-height:1.7;}
.jg-bar{position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#111;border-top:1px solid #c9a227;padding:14px 16px;text-align:center;}
.jg-bar a{color:#fff;text-decoration:none;font-weight:800;}
`;

export default function Jjanggu() {
  const L = 장부찾기(이름);
  const 주소 = L?.address ?? "";
  const 시간 = L?.openingHours ?? "";
  const 번호 = L?.telephone ?? "";
  const 담당 = L?.nickname ?? "";
  const url = `${SITE.url}${이주소}`;
  const z = { s: saltOf(이주소), 지역: cssClasses(CSS) };
  const 제목 = `${이름} 예약 문의, 담당 로또 번호와 영업시간`;
  const 설명 = `${이름} 예약 문의 담당 로또 안내. 상남동 22-4에서 매일 오후 7시부터 새벽 5시까지 열고, 전화 전에 정해 둘 것을 적었습니다.`;

  const 문답 = [
    { q: "예약 문의는 어디로 하나요?", a: `담당 ${담당}에게 전화로 합니다. 번호는 이 쪽 위 표와 화면 아래 전화바에 있는 번호 하나입니다.` },
    { q: "영업시간은 어떻게 되나요?", a: `${시간}로 확인됩니다. 날짜에 따라 사정이 달라질 수 있으니 늦게 도착할 계획이면 전화로 먼저 확인하는 편이 안전합니다.` },
    { q: "주소를 지도 앱에 뭐라고 넣나요?", a: "도로명 마디미로43번길 10이나 지번 상남동 22-4 가운데 하나를 넣으면 같은 자리가 나옵니다." },
    { q: "광고나 제휴 문의도 같은 번호로 하나요?", a: "아닙니다. 담당 번호는 가게 예약 문의용이고, 이 사이트의 광고문의는 카카오톡 besta12 로 따로 받습니다." },
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
        "@context": "https://schema.org", "@type": "NightClub", "@id": `${url}#venue`, name: 이름, url, image: `${SITE.url}${그림}`,
        address: { "@type": "PostalAddress", streetAddress: 주소, addressLocality: "경상남도 창원시 성산구", addressRegion: "경상남도", addressCountry: "KR" },
        telephone: 번호, openingHours: 시간,
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "FAQPage", mainEntity: 문답.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "무너진 자리에서 다시 시작한 사람의 기록", item: `${SITE.url}/` },
          { "@type": "ListItem", position: 2, name: `${이름} 담당 로또`, item: url },
        ],
      }) }} />

      <article className="jg-wrap">
        <nav className="jg-crumb" aria-label="현재 위치"><Link href="/">홈</Link> › 담당 안내</nav>
        <p className="ad-label" style={{ display: "inline-block", margin: "0 0 10px", padding: "3px 10px", border: "1px solid #c9a227", borderRadius: 4, fontSize: 12, color: "#c9a227", letterSpacing: ".04em" }}>광고</p>
        <h1>{이름} 담당 로또, 전화하기 전에 볼 것</h1>
        <div className="jg-lead" data-r="lead">
          <p>{이름} 예약 문의는 담당 {담당} {번호}로 받습니다. 가게는 창원시 성산구 상남동 22-4(마디미로43번길 10)에 있고, 영업시간은 {시간}입니다.</p>
        </div>
        <PageThumb src={그림} alt={`광고 · ${이름} · ${담당} · ${번호}`} />

        <div className="jg-facts">
          <table data-r="facts">
            <tbody>
              <tr><th scope="row">가게</th><td>{이름}</td></tr>
              <tr><th scope="row">주소</th><td>{주소}</td></tr>
              <tr><th scope="row">영업시간</th><td>{시간}</td></tr>
              <tr><th scope="row">전화</th><td>{번호}</td></tr>
              <tr><th scope="row">담당</th><td>{담당}</td></tr>
            </tbody>
          </table>
        </div>

        <section>
          <h2>이 쪽은 어떤 쪽인가</h2>
          <p>이 쪽은 {이름}의 예약 문의 담당 연락처를 싣는 광고 쪽입니다. 담당 닉네임과 번호는 광고로 실린 것이고, 주소와 영업시간은 공개 자료로 교차 확인된 값만 옮겼습니다. 가격이나 자리 배치처럼 날마다 달라지는 내용은 확인된 자료가 없어 적지 않았습니다.</p>
          <p>그래서 이 쪽에서 얻을 수 있는 것은 세 가지로 좁습니다. 어디에 있는지, 몇 시에 여는지, 누구에게 물어보면 되는지입니다. 그 밖의 궁금한 점은 통화로 그날 기준을 듣는 편이 가장 정확합니다.</p>
        </section>

        <section>
          <h2>전화 걸기 전에 정해 둘 세 가지</h2>
          <p>통화가 길어지는 이유는 대개 정하지 않은 것이 많아서입니다. 몇 명이 가는지, 대략 몇 시쯤 도착하는지, 늦어질 때 누구 번호로 연락을 받을지. 이 세 가지를 미리 정해 두면 한 통으로 끝나는 경우가 많습니다.</p>
          <p>인원이 아직 확정되지 않았다면 그렇다고 말하면 됩니다. 확정된 숫자와 늘어날 수 있는 숫자를 나눠 말해 두면, 도착했을 때 서로 헷갈릴 일이 줄어듭니다. 도착 시각이 바뀌면 같은 번호로 다시 알리면 됩니다.</p>
        </section>

        <section>
          <h2>상남동 주소로 찾아가는 순서</h2>
          <p>주소는 두 가지 표기로 적힙니다. 지번은 상남동 22-4, 도로명은 마디미로43번길 10입니다. 둘은 같은 건물을 가리키니 지도 앱에는 어느 쪽을 넣어도 됩니다. 택시를 탈 때는 상호보다 주소를 먼저 말하는 편이 빨리 통합니다.</p>
          <p>가까운 정류장 이름이나 걸어서 걸리는 시간은 확인된 자료가 없어 이 쪽에 숫자로 적지 않았습니다. 처음 가는 길이라면 도착 직전에 지도 앱을 한 번 더 켜 두는 편이 좋습니다.</p>
        </section>

        <section>
          <h2>영업시간 안에서 도착 시각 잡기</h2>
          <p>문을 여는 시각은 오후 7시, 닫는 시각은 새벽 5시로 확인됩니다. 늦게 도착할수록 남은 시간이 짧아지니, 몇 시에 들어가서 몇 시쯤 나올지를 대략 정해 두면 귀가 방법을 고르기 쉽습니다. 새벽에는 대중교통이 끊기는 시간이 있으니 돌아갈 방법도 함께 정해 두는 편이 안전합니다.</p>
        </section>

        <section>
          <h2>검색할 때 이름이 헷갈리는 경우</h2>
          <p>가게 이름은 붙여 쓰기도 하고 띄어 쓰기도 합니다. 창원 룰루랄라, 룰루랄라 나이트처럼 여러 모양으로 불리다 보니, 지도 앱에서 이름만 넣으면 다른 결과가 섞여 나올 수 있습니다. 이럴 때는 이름보다 주소를 기준으로 삼는 편이 확실합니다. 상남동 22-4라는 지번과 마디미로43번길 10이라는 도로명 가운데 하나만 맞으면 같은 건물입니다.</p>
          <p>전화로 물어볼 때도 마찬가지입니다. 어느 가게를 말하는지 처음에 주소나 동네 이름을 한 번 짚어 주면, 통화하는 쪽도 헷갈리지 않고 바로 본론으로 넘어갈 수 있습니다.</p>
        </section>

        <section>
          <h2>새벽에 나올 때를 먼저 생각해 두기</h2>
          <p>마감이 새벽 5시라 늦게까지 머무를수록 돌아가는 길이 어려워집니다. 택시를 부를지, 첫차를 기다릴지, 일행 가운데 누가 운전하지 않고 함께 움직일지를 들어가기 전에 정해 두면 마지막 한 시간이 한결 편해집니다. 술자리가 이어진다면 차는 두고 오는 것이 기본입니다.</p>
        </section>

        <section>
          <h2>통화 기록을 남겨 두면 좋은 이유</h2>
          <p>담당과 통화한 날짜와 들은 내용을 두세 줄로 적어 두면, 당일에 무엇을 약속했는지 헷갈리지 않습니다. 일행 가운데 다른 사람이 대신 연락해야 하는 상황이 생겨도 그 메모를 보고 이어서 말할 수 있습니다.</p>
          <p>특히 인원과 도착 시각은 자주 바뀝니다. 바뀔 때마다 메모도 함께 고쳐 두면, 마지막으로 알린 내용이 무엇인지 바로 확인할 수 있습니다. 문자로 주고받았다면 그 문자를 지우지 말고 두십시오.</p>
        </section>

        <section className="jg-qa" data-r="qa">
          <h2>자주 묻는 질문</h2>
          {문답.map((f) => (
            <div key={f.q}>
              <h3 data-r="q">{f.q}</h3>
              <p data-r="a">{f.a}</p>
            </div>
          ))}
        </section>

        <section className="jg-close" data-r="closewrap">
          <h2>한 줄 정리</h2>
          <p data-r="close">{이름}는 상남동 22-4에서 오후 7시부터 새벽 5시까지 문을 열고, 예약 문의는 담당 {담당}에게 전화로 하면 됩니다.</p>
        </section>
        <p className="jg-note">광고 · 담당자 연락처는 광고로 실린 것입니다. 마지막 정리 <time dateTime="2026-09-25">2026년 9월 25일</time>. 운영 사정에 따라 바뀔 수 있으니 방문 전에 확인하십시오. 만 19세 이상 성인 대상이며 청소년 출입·고용은 금지입니다.</p>
      </article>

      <div className="jg-bar" role="complementary" aria-label="전화 연결">
        <a href={`tel:${번호.replace(/\D/g, "")}`}>📞 {이름} {담당} {번호}</a>
      </div>
    </>
  );
  return <SaltContext.Provider value={z}>{saltTree(트리, z)}</SaltContext.Provider>;
}
