import Link from "next/link";
import SeoHead from "@/components/SeoHead";
import { Jsonld, buildBreadcrumb, buildFaq } from "@/components/Jsonld";
import { SITE } from "@/components/site";

const FAQ = [
  {
    q: "처음 가는데 어떻게 해야 해요?",
    a: "전화 한 통이면 됩니다. 짱구 담당 로 연락 주시고, 인원과 도착 예정 시간만 알려주세요. 자리 잡는 것부터 안내까지 짱구가 직접 챙깁니다.",
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
  {
    q: "혼자 가도 되나요?",
    a: "가능합니다. 다만 자리 배치상 일행과 함께 오시는 게 일반적이라, 혼자 오실 거면 도착 전에 한 통 주시면 그날 상황에 맞게 짱구 담당이 잡아드립니다.",
  },
  {
    q: "단체로 가도 받아주나요?",
    a: "받습니다. 인원이 6명 이상이면 자리 배치에 시간이 걸리니, 가능하면 두세 시간 전에는 미리 알려주세요. 단체석 흐름은 짱구 담당이 따로 정리해 둡니다.",
  },
  {
    q: "영업 시간이 어떻게 되나요?",
    a: "오후 7시에 오픈해서 다음날 새벽 5시까지 영업합니다. 매일 운영하며, 자리 회전 피크는 보통 자정~새벽 2시 무렵이에요. 그날 그 시간 자리 상황은 통화로 확인하시는 게 가장 정확합니다.",
  },
  {
    q: "복장 규정이 있나요?",
    a: "지나치게 캐주얼한 슬리퍼·트레이닝 차림은 입구에서 제한될 수 있습니다. 무난한 외출 복장이면 충분합니다. 헷갈리면 통화로 짧게 물어봐 주세요.",
  },
];

export default function Home() {
  return (
    <>
      <SeoHead
        title="창원 룰루랄라 나이트 · 짱구 담당  · 자리 잡는 가장 빠른 방법"
        description="창원에서 노는 밤, 입구에서 두리번거리지 마세요. 룰루랄라 나이트 웨이터 짱구한테 한 통이면 자리·인원·도착 시간까지 정리됩니다. 19세 이상 합법 영업장 · 신분증 확인."
        keywords="창원 룰루랄라 나이트, 창원룰루랄라나이트, 창원 나이트, 창원나이트, 짱구 담당, 짱구 웨이터, 룰루랄라 짱구, 창원 나이트 예약, 창원 시내 나이트"
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
              <dt>영업시간</dt>
              <dd>오후 7시 ~ 다음날 새벽 5시 (매일)</dd>
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
              . 이름·인원·도착 예정 시간만 말씀해 주세요. 길게 설명 안
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
          <span className="eyebrow">처음 거시는 분께</span>
          <h2>전화 한 통이 이렇게 흘러갑니다.</h2>
          <p className="lead" style={{ marginTop: 14 }}>
            솔직히 처음 거는 사람은 무슨 말을 어떻게 시작해야 할지부터 막막합니다.
            근데 그럴 필요 없어요. 통화는 30초 안에 끝납니다. 아래 흐름 한 번만 보고
            누르시면 됩니다.
          </p>
          <div className="grid grid-2" style={{ marginTop: 26 }}>
            <article className="card">
              <h3>받자마자 할 말</h3>
              <p style={{ marginTop: 10 }}>
                “짱구 담당 부탁드립니다.” 이 한 줄이면 바로 연결됩니다. 다른 직원이
                받아도 같은 멘트로 짱구한테 넘어가요. 길게 설명하실 필요가 진짜로
                없습니다.
              </p>
            </article>
            <article className="card">
              <h3>그다음에 정리할 세 가지</h3>
              <p style={{ marginTop: 10 }}>
                이름, 일행 수, 도착 예정 시간. 셋만 말씀하시면 됩니다. 예를 들면
                “김 아무개고요, 네 명이고, 11시쯤 도착할 것 같습니다.” 정도면 짱구가
                자리를 잡아 둡니다.
              </p>
            </article>
            <article className="card">
              <h3>변경 사항이 생기면</h3>
              <p style={{ marginTop: 10 }}>
                인원이 늘거나, 시간이 늦어지거나, 일행 한 명이 빠지거나. 어느 쪽이든
                같은 번호로 다시 한 통이면 충분합니다. 자리 다시 배치해 둡니다.
              </p>
            </article>
            <article className="card">
              <h3>처음이라 어색하면</h3>
              <p style={{ marginTop: 10 }}>
                통화 시작할 때 “처음 가는 사람입니다”라고 한마디만 더 붙여주세요.
                그 한마디에 짱구가 입구 동선·자리 배치·주문 흐름까지 조금 다르게
                챙겨드립니다.
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
          <span className="eyebrow">시간대별 흐름</span>
          <h2>오후 7시와 새벽 2시는 분위기가 다릅니다.</h2>
          <p className="lead" style={{ marginTop: 14 }}>
            창원 룰루랄라 나이트는 오후 7시에 오픈해 다음날 새벽 5시까지 영업합니다.
            한 가게 안에서도 시간대별로 자리 회전·분위기·통화 응답 속도가 확연히
            달라져요. 본인 일정에 맞춰 어느 무렵에 오는 게 좋을지 감 잡으시는 데
            도움이 되실 겁니다.
          </p>
          <div className="grid grid-3" style={{ marginTop: 28 }}>
            <article className="card">
              <h3>이른 시간 (오후 7시~밤 11시)</h3>
              <p style={{ marginTop: 10 }}>
                오픈 직후~밤 11시는 자리 여유가 가장 많은 구간입니다. 처음 오시는
                분이나 조용한 분위기를 선호하시는 분께 추천. 짱구 담당 응대도
                가장 빠른 시간대예요.
              </p>
            </article>
            <article className="card">
              <h3>피크 (자정~새벽 2시)</h3>
              <p style={{ marginTop: 10 }}>
                자리가 가장 빨리 회전하는 구간. 미리 예약 안 하면 입구에서 대기할
                가능성이 있어요. 이 시간대에 오실 거면 최소 두 시간 전엔 한 통 주세요.
              </p>
            </article>
            <article className="card">
              <h3>마감 즈음 (새벽 2시~5시)</h3>
              <p style={{ marginTop: 10 }}>
                새벽 2시 이후 자리 회전이 다시 풀리는 시간대입니다. 짧게 한두 시간만
                놀다 가실 분께 의외로 잘 맞는 구간이에요. 짱구한테 미리 말씀해
                두시면 자리 잡힙니다.
              </p>
            </article>
          </div>
          <p className="lead" style={{ marginTop: 22 }}>
            ※ 위 시간대 구분은 일반적인 흐름이며, 실제 그날의 혼잡도는 통화로
            짱구한테 직접 확인하시는 게 가장 정확합니다.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">단골이 굳이 담당을 찾는 이유</span>
          <h2>한 번 잡으면 다음부터가 빠릅니다.</h2>
          <p className="lead" style={{ marginTop: 14 }}>
            창원에서 나이트 다니는 분들이 굳이 짱구한테 거는 이유는 단순합니다.
            한 번 통화한 사람은 다음부터 “나 누구입니다” 한마디로 끝나거든요.
            매번 처음부터 설명할 필요가 없어요.
          </p>
          <ul className="bullets" style={{ marginTop: 22 }}>
            <li>
              <strong>두 번째부터는 이름만</strong> — 한 번 자리 잡았던 분은 다음 통화
              때 인원·시간만 말씀하시면 됩니다. 자주 가는 자리·주문 패턴도 짱구가
              기억해 두니까요.
            </li>
            <li>
              <strong>일행 새 멤버가 와도 OK</strong> — 본인이 단골이면, 같이 가는
              일행이 처음이라도 입구에서 본인 이름만 대면 동일하게 안내됩니다.
            </li>
            <li>
              <strong>자리 우선권 같은 건 없습니다</strong> — 솔직히 말씀드리면, 단골이라고
              없는 자리를 만들어 드리는 건 아니에요. 다만 같은 자리가 있을 때 잡기
              쉬워지는 차이가 있을 뿐.
            </li>
            <li>
              <strong>연락 한 번이면 흐름이 끊기지 않습니다</strong> — 처음 거든 열 번째 거든,
              담당이 한 명이라 매번 같은 흐름으로 진행됩니다.
            </li>
          </ul>
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
