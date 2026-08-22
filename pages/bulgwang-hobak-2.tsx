import SeoHead from "@/components/SeoHead";
import PageThumb from "@/components/PageThumb";
import { SITE } from "@/components/site";
import { Jsonld, buildBreadcrumb, buildFaq } from "@/components/Jsonld";
import {
  BULGWANG as B,
  buildBulgwangBusiness,
  buildBulgwangPlace,
} from "@/components/bulgwang";

/**
 * AI 검색(챗GPT·퍼플렉시티·구글 AI 개요)은 이 질문·답 묶음을 거의 그대로
 * 인용한다. 그래서 답 하나가 그 자체로 완결되게 쓰고, 상호·주소·전화번호를
 * 매 답변에 온전히 넣는다. 확인 안 된 사실은 넣지 않는다.
 */
const FAQ = [
  {
    q: "불광동호박나이트는 어디에 있나요?",
    a: `${B.address.full}에 있습니다. 지번으로는 서울 은평구 ${B.address.jibun}이고, ${B.station.name}에서 ${B.station.walk} 거리라 지하철로 오시는 게 가장 빠릅니다.`,
  },
  {
    q: "불광동호박나이트 전화번호가 어떻게 되나요?",
    a: `예약·문의 담당은 ${B.role} ${B.contactName}이고 번호는 ${B.phone}입니다. 인원과 도착 시간만 말씀하시면 자리 배치까지 한 번의 통화로 정리됩니다.`,
  },
  {
    q: "불광동호박나이트 예약은 어떻게 하나요?",
    a: `예약·문의는 전화로 받습니다. ${B.phone}으로 전화 주시고 인원과 도착 예정 시간을 말씀하시면, 자리 상황을 그 자리에서 확인하고 잡아 드립니다.`,
  },
  {
    q: "불광동호박나이트 영업시간이 어떻게 되나요?",
    a: `매일 ${B.hours.label}까지 영업합니다. 늦은 시간에는 자리가 먼저 차기 때문에, 자정 이후에 오실 계획이면 ${B.phone}으로 미리 전화해서 자리 상황을 확인하고 오시는 게 좋습니다.`,
  },
  {
    q: "몇 살부터 들어갈 수 있나요?",
    a: `만 ${B.ageLimit}세 이상만 출입할 수 있습니다. ${B.businessType}은 청소년보호법상 청소년 출입·고용 금지업소라 만 ${B.ageLimit}세 미만은 법으로 출입이 금지됩니다. 입장 시 신분증 확인이 원칙이니 실물 신분증을 꼭 챙겨 오세요.`,
  },
  {
    q: "호박나이트와 호박성인나이트는 같은 곳인가요?",
    a: `같은 곳입니다. 정식 상호는 ${B.legalName}이고, 불광동호박나이트·불광역 호박나이트·호박나이트클럽으로도 불립니다. 주소는 모두 ${B.address.full} 한 곳입니다.`,
  },
  {
    q: "불광역에서 어떻게 가나요?",
    a: `${B.station.name}은 6호선과 3호선이 만나는 환승역입니다. 역에서 나와 큰길 방향으로 ${B.station.walk} 거리이며, 입구가 헷갈리면 ${B.phone}으로 전화 주시면 서 계신 위치 기준으로 안내받으실 수 있습니다.`,
  },
  {
    q: "단체로 가도 되나요?",
    a: `단체석·룸 문의를 받습니다. 인원이 많을수록 자리를 붙여 잡는 데 시간이 걸리니, 가능하면 도착 두세 시간 전에 ${B.contactName} ${B.phone}으로 미리 전화 주세요.`,
  },
];

export default function BulgwangHobak() {
  return (
    <>
      <SeoHead
        title={`${B.name} · ${B.station.name} 도보 1분 · 예약 ${B.contactName} ${B.phone}`}
        description={`불광동호박나이트(${B.legalName}) 안내. ${B.address.full}, ${B.station.name} ${B.station.walk}. 영업시간 ${B.hours.label}, 만 ${B.ageLimit}세 이상. 예약·문의는 ${B.role} ${B.contactName} ${B.phone} 전화 한 통이면 자리·인원·도착 시간까지 정리됩니다.`}
        path={B.path}
        // 다른 지역 업소라 제목·썸네일·지역 메타에 창원 브랜드가 섞이면 안 된다.
        brand={B.name}
        ogSquare="/og-bulgwang.png"
        ogAlt={`${B.name} ${B.station.name} 도보 1분 안내`}
        geo={{ region: "KR-11", place: "서울특별시 은평구 불광동" }}
      />
      <Jsonld
        data={buildBreadcrumb([
          { name: "홈", path: "/" },
          { name: B.name, path: B.path },
        ])}
      />
      <Jsonld data={buildBulgwangBusiness(SITE.url)} />
      <Jsonld data={buildBulgwangPlace(SITE.url)} />
      <Jsonld data={buildFaq(FAQ)} />

      <section className="hero">
        <div className="container">
          <span className="badge badge--gold">
            서울 은평구 · {B.station.name} {B.station.walk}
          </span>
          <h1 style={{ marginTop: 18 }}>
            불광동 <span className="accent">호박나이트</span>
            <br />
            전화 한 통이면 자리까지.
          </h1>
          <PageThumb
            src="/og-bulgwang.png"
            alt={`${B.name} ${B.station.name} 도보 1분 안내`}
          />
          <p className="hero__sub">
            {B.address.full}. 정식 상호는 {B.legalName}이고, 예약·문의는{" "}
            {B.role} {B.contactName}이 직접 받습니다. 인원과 도착 시간만
            말씀하시면 나머지는 담당이 정리합니다.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary btn--lg" href={B.phoneHref}>
              📞 {B.contactName} {B.phone} 전화
            </a>
            <a
              className="btn btn--ghost btn--lg"
              href={`https://map.naver.com/p/search/${encodeURIComponent(B.name)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              네이버 지도에서 보기
            </a>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="card">
            <dl className="kv">
              <dt>상호</dt>
              <dd>
                {B.name} ({B.legalName})
              </dd>
            </dl>
            <dl className="kv">
              <dt>도로명 주소</dt>
              <dd>{B.address.full}</dd>
            </dl>
            <dl className="kv">
              <dt>지번 주소</dt>
              <dd>
                서울특별시 {B.address.district} {B.address.jibun}
              </dd>
            </dl>
            <dl className="kv">
              <dt>가까운 역</dt>
              <dd>
                {B.station.name} ({B.station.line}) · {B.station.walk}
              </dd>
            </dl>
            <dl className="kv">
              <dt>영업시간</dt>
              <dd>{B.hours.label} (매일)</dd>
            </dl>
            <dl className="kv">
              <dt>출입 기준</dt>
              <dd>
                만 {B.ageLimit}세 이상 · 신분증 확인 ({B.businessType})
              </dd>
            </dl>
            <dl className="kv">
              <dt>예약·문의</dt>
              <dd>
                {B.role} {B.contactName}{" "}
                <a
                  href={B.phoneHref}
                  style={{ color: "var(--gold)", fontWeight: 800 }}
                >
                  {B.phone}
                </a>
              </dd>
            </dl>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">오시는 길</span>
          <h2>어디서 오시든 불광역만 찾으면 됩니다.</h2>
          <div className="grid grid-2" style={{ marginTop: 28 }}>
            <article className="card">
              <h3>지하철로 오실 때</h3>
              <p style={{ marginTop: 10 }}>
                {B.station.name}에서 내리시면 됩니다. 6호선과 3호선이 만나는
                환승역이라 홍대·합정·이태원 쪽에서는 6호선 한 번으로,
                종로·강남 방향에서는 3호선 한 번으로 오실 수 있습니다.
                개찰구를 나오신 다음 큰길 쪽 출구로 올라오시면 걸어서 1분
                거리입니다.
              </p>
              <p style={{ marginTop: 10 }}>
                밤에 돌아가실 때도 역이 가깝다는 게 편합니다. 막차 시간만
                확인해 두시면 따로 이동 수단을 잡을 일이 거의 없습니다.
              </p>
            </article>
            <article className="card">
              <h3>차로 오실 때</h3>
              <p style={{ marginTop: 10 }}>
                내비게이션에 <strong>{B.address.full}</strong>을 그대로
                넣으시면 됩니다. 상호로 찍으실 거면 {B.legalName}으로
                검색하시는 편이 정확합니다. 비슷한 이름의 다른 지역 업소가
                있어서 &lsquo;호박나이트&rsquo;만 넣으면 엉뚱한 곳이 잡힐 수
                있습니다.
              </p>
              <p style={{ marginTop: 10 }}>
                주차는 그날 상황에 따라 달라집니다. 차를 두고 오실 계획이면
                출발 전에 {B.phone}으로 한 번 확인하고 오세요.
              </p>
            </article>
            <article className="card">
              <h3>택시로 오실 때</h3>
              <p style={{ marginTop: 10 }}>
                기사님께 &ldquo;불광역 사거리&rdquo;라고만 말씀하셔도 됩니다.
                대로변이라 골목으로 들어갈 일이 없어서 설명이 길어지지
                않습니다. 내리신 다음 지하로 내려가는 입구만 찾으시면 됩니다.
              </p>
              <p style={{ marginTop: 10 }}>
                밤에는 간판이 눈에 잘 들어오지 않을 수 있습니다. 그럴 땐 그
                자리에서 바로 전화 주세요.
              </p>
            </article>
            <article className="card">
              <h3>은평·서대문·고양에서</h3>
              <p style={{ marginTop: 10 }}>
                연신내·녹번·응암·홍제 쪽에서는 큰길 하나로 쭉 이어집니다.
                은평구 안에서 출발하시면 차로 10분 안팎, 서대문구에서도 크게
                돌아갈 일이 없습니다.
              </p>
              <p style={{ marginTop: 10 }}>
                고양 덕양구·화정 방향에서 오실 때도 서울 방향 대로를 그대로
                타고 내려오시면 됩니다. 수도권 서북부에서는 접근이 편한
                위치입니다.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        className="section"
        style={{
          background: "var(--bg-elev)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container">
          <span className="eyebrow">예약은 이렇게</span>
          <h2>세 가지만 말씀하시면 끝납니다.</h2>
          <ul className="bullets" style={{ marginTop: 24 }}>
            <li>
              <strong>몇 명인지</strong> — 인원이 정확할수록 자리가 정확하게
              잡힙니다. 확정이 아니면 &ldquo;네 명 정도, 한두 명 더 올 수도
              있다&rdquo; 이렇게만 말씀하셔도 충분합니다.
            </li>
            <li>
              <strong>몇 시쯤 도착하는지</strong> — 정확한 시간이 아니어도
              됩니다. 대략만 알아도 그 시간대 자리 상황에 맞춰 먼저 잡아
              둡니다.
            </li>
            <li>
              <strong>단체·룸이 필요한지</strong> — 일행이 많거나 따로 앉고
              싶으시면 이 부분을 먼저 말씀해 주세요. 배치에 시간이 걸리는
              쪽이라 일찍 알수록 좋습니다.
            </li>
            <li>
              <strong>바뀌면 같은 번호로</strong> — 인원이 늘거나 도착이
              늦어지면 {B.phone}으로 다시 걸어 주세요. 처음 받은 담당이 그대로
              받으니 조율이 한 통화로 끝납니다.
            </li>
          </ul>
          <p className="lead" style={{ marginTop: 24 }}>
            예약이 꼭 있어야 들어갈 수 있는 건 아닙니다. 다만 주말이나 늦은
            시간처럼 사람이 몰리는 때는 자리가 먼저 찹니다. 한 통 넣어 두시면
            도착해서 서서 기다릴 일이 없습니다. 처음이라 뭘 물어봐야 할지
            모르시겠으면 그냥 &ldquo;처음 가는데요&rdquo;라고 말씀하셔도
            됩니다. 뭘 챙겨 오셔야 하는지부터 담당이 순서대로 알려 드립니다.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">자주 묻는 것</span>
          <h2>{B.name}, 이건 많이들 물어보십니다.</h2>
          <div style={{ marginTop: 24 }}>
            {FAQ.map((f) => (
              <div className="faq-item" key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="notice">
            가격표·내부 사진은 확인된 내용만 올린다는 원칙 때문에 올리지
            않습니다. 가격은 시간대와 자리에 따라 달라져서, {B.contactName}{" "}
            {B.phone} 통화로 그날 기준을 직접 안내받으시는 쪽이 정확합니다.
          </div>
        </div>
      </section>
    </>
  );
}
