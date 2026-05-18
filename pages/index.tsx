import Link from "next/link";
import SeoHead from "@/components/SeoHead";
import { Jsonld, buildBreadcrumb, buildFaq } from "@/components/Jsonld";
import { SITE } from "@/components/site";

const FAQ = [
  {
    q: "처음 가는데 어떻게 해야 해요?",
    a: "전화 한 통이면 됩니다. 짱구 담당 010-3854-6887로 연락 주시고, 인원과 도착 예정 시간만 알려주세요. 자리 잡는 것부터 안내까지 짱구가 직접 챙깁니다.",
  },
  {
    q: "예약은 필수인가요?",
    a: "필수는 아니지만, 주말이나 늦은 시간엔 미리 전화 주시는 게 안전합니다. 자리 상황·인원수에 맞춰 짱구 담당이 조율해 드립니다.",
  },
  {
    q: "신분증을 꼭 챙겨야 하나요?",
    a: "네. 만 19세 이상만 출입 가능한 합법 영업장이라, 입장 시 신분증 확인이 원칙입니다. 미성년자는 출입이 제한됩니다.",
  },
  {
    q: "가격이 어떻게 되나요?",
    a: "가격·테이블·주대 안내는 시간대와 자리에 따라 달라집니다. 정확한 안내는 짱구 담당이 통화로 바로 알려드립니다.",
  },
];

export default function Home() {
  return (
    <>
      <SeoHead
        title="창원 룰루랄라 나이트 · 짱구 담당 010-3854-6887 직통"
        description="전화 한 통이면 끝. 창원에서 자리 잡고 싶을 땐 짱구 담당부터 저장하세요. 만 19세 이상 합법 영업장, 신분증 확인."
        path="/"
      />
      <Jsonld data={buildBreadcrumb([{ name: "홈", path: "/" }])} />
      <Jsonld data={buildFaq(FAQ)} />

      <section className="hero">
        <div className="container">
          <span className="badge badge--gold">창원시 · 합법 영업장 · 만 19세 이상</span>
          <h1 style={{ marginTop: 18 }}>
            창원에서 자리 잡는 가장 빠른 방법.<br />
            <span className="accent">짱구 담당</span> 전화 한 통.
          </h1>
          <p className="hero__sub">
            번호만 저장해 두세요. 처음이든 단골이든, 도착 전에 한 번 누르면 자리·시간·인원까지
            짱구가 직접 챙깁니다. 어색하게 입구에서 두리번거릴 일 없습니다.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary btn--lg tel" href={SITE.phoneHref}>
              📞 {SITE.phone} 바로 전화
            </a>
            <Link className="btn btn--ghost btn--lg" href="/jjanggu/">
              짱구 담당이 누구?
            </Link>
          </div>
          <div className="hero__meta">
            <span className="badge">19세 이상 출입</span>
            <span className="badge">신분증 확인</span>
            <span className="badge">합법 영업</span>
            <span className="badge">창원시</span>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="card" style={{ display: "grid", gap: 14 }}>
            <dl className="kv">
              <dt>업소</dt>
              <dd>창원 룰루랄라 나이트</dd>
            </dl>
            <dl className="kv">
              <dt>웨이터(담당)</dt>
              <dd><strong>짱구</strong> — 한 통이면 자리부터 안내까지 정리됩니다.</dd>
            </dl>
            <dl className="kv">
              <dt>전화</dt>
              <dd>
                <a className="tel" href={SITE.phoneHref} style={{ color: "var(--gold)", fontWeight: 700 }}>
                  {SITE.phone}
                </a>
              </dd>
            </dl>
            <dl className="kv">
              <dt>위치</dt>
              <dd>경상남도 창원시 (정확한 위치 안내는 전화로)</dd>
            </dl>
            <dl className="kv">
              <dt>출입 기준</dt>
              <dd>만 19세 이상 · 신분증 확인</dd>
            </dl>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">왜 짱구한테 전화하나</span>
          <h2>그날 저녁이 매끄럽게 풀리니까.</h2>
          <p className="lead" style={{ marginTop: 14, marginBottom: 28 }}>
            나이트는 처음 가는 사람한테 진입 장벽이 의외로 큽니다. 어디로 들어가야 하는지,
            자리는 어떻게 잡는지, 인원이 갑자기 늘면 어떻게 되는지. 그 모든 어색함을
            줄이려고 담당이 있는 겁니다.
          </p>
          <div className="grid grid-3">
            <article className="card">
              <h3>응대가 빠릅니다</h3>
              <p style={{ marginTop: 10 }}>
                연락 받으면 자리부터 잡습니다. 통화·문자 둘 다 가능하고, 도착 전에
                인원·시간만 공유해 주시면 정리해 둡니다.
              </p>
            </article>
            <article className="card">
              <h3>자리·동선 정리</h3>
              <p style={{ marginTop: 10 }}>
                일행 규모에 맞춰 자리를 안내합니다. 입장부터 좌석, 주문 흐름까지
                담당이 끊지 않고 챙기니까 본인은 시간만 즐기면 됩니다.
              </p>
            </article>
            <article className="card">
              <h3>합법, 그래서 깔끔</h3>
              <p style={{ marginTop: 10 }}>
                만 19세 이상 출입, 신분증 확인이 원칙인 합법 영업장입니다.
                불필요한 문제 없이, 정상적인 영업 안에서 편하게 노세요.
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
          <span className="eyebrow">처음이라도 어렵지 않게</span>
          <h2>전화 → 자리 → 입장. 3단계면 끝.</h2>
          <ol className="steps" style={{ marginTop: 28 }}>
            <li>
              <strong>전화 한 통</strong>
              010-3854-6887. 이름·인원·도착 예정 시간만 말씀해 주세요. 길게 설명 안
              해도 짱구가 알아서 받습니다.
            </li>
            <li>
              <strong>자리 확보</strong>
              상황 보고 자리를 잡아 둡니다. 변경되면 다시 한 번 걸어주시면 충분합니다.
            </li>
            <li>
              <strong>도착 후 입장</strong>
              입구에서 “짱구 담당”이라고만 말씀하세요. 신분증 확인 후 바로 자리로 안내드립니다.
            </li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">자주 묻는 질문</span>
          <h2>가기 전에 다들 물어보는 것들.</h2>
          <div style={{ marginTop: 24 }}>
            {FAQ.map((f) => (
              <div key={f.q} className="faq-item">
                <h3>Q. {f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section--tight" aria-label="빠른 연결">
        <div className="container">
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "32px 24px",
              background:
                "linear-gradient(180deg, rgba(252,211,77,0.05), rgba(217,119,6,0.06))",
              borderColor: "rgba(252,211,77,0.35)",
            }}
          >
            <span className="eyebrow">번호부터 저장</span>
            <h2 style={{ marginTop: 6 }}>고민될 때는 그냥 한 번 누르세요.</h2>
            <p className="lead" style={{ margin: "12px auto 22px" }}>
              물어볼 게 많아도 괜찮습니다. 가격이든 자리든, 한 통이면 다 정리됩니다.
            </p>
            <a className="btn btn--primary btn--lg tel" href={SITE.phoneHref}>
              📞 짱구 담당 {SITE.phone}
            </a>
            <div className="notice" style={{ marginTop: 22, textAlign: "left" }}>
              본 사이트는 창원 룰루랄라 나이트의 공식 안내 페이지입니다. 만 19세 이상만
              출입 가능하며, 입장 시 신분증 확인이 원칙입니다. 합법 영업장에서 운영되며,
              불법·미성년 출입은 일체 금지됩니다.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
