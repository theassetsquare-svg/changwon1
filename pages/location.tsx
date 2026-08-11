import Link from "next/link";
import SeoHead from "@/components/SeoHead";
import { SITE } from "@/components/site";
import { Jsonld, buildBreadcrumb, buildPlace } from "@/components/Jsonld";

export default function Location() {
  return (
    <>
      <SeoHead
        title="찾아오는 길 · 창원 시내 출발지별 동선 + 도착 5분 전 체크리스트"
        description="내비만 믿고 골목에서 돌지 마세요. 의창·성산·마산·진해 어디서 오시든 가장 빠른 길, 신분증·인원·입구 멘트까지 담당이 도착 직전 전화로 안내해 드립니다. 로또 010-7528-4936 · 만 27세 이상."
        keywords="창원 룰루랄라 위치, 창원 나이트 위치, 창원 시내 나이트, 의창구 나이트, 성산구 나이트"
        path="/location/"
      />
      <Jsonld
        data={buildBreadcrumb([
          { name: "홈", path: "/" },
          { name: "위치", path: "/location/" },
        ])}
      />
      <Jsonld data={buildPlace()} />

      <section className="hero">
        <div className="container">
          <span className="badge badge--gold">위치</span>
          <h1 style={{ marginTop: 18 }}>
            경상남도 <span className="accent">창원시</span>.<br />
            정확한 위치는 통화 한 번이면 끝.
          </h1>
          <p className="hero__sub">
            지도만 보고 헤매는 게 시간 아깝습니다. 도착 직전에 담당한테
            한 통만 주세요. 가장 빠른 동선으로 잡아 드립니다.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary btn--lg" href={SITE.phoneHref}>
              📞 {SITE.contactName} {SITE.phone} 전화
            </a>
            <Link className="btn btn--ghost btn--lg" href="/contact/">예약 안내</Link>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="card">
            <dl className="kv">
              <dt>지역</dt>
              <dd>경상남도 창원시</dd>
            </dl>
            <dl className="kv">
              <dt>상세 위치</dt>
              <dd>전화 안내 (오시기 직전에 여쭤보시는 게 가장 정확합니다)</dd>
            </dl>
            <dl className="kv">
              <dt>예약·문의</dt>
              <dd>
                <a href={SITE.phoneHref} style={{ color: "var(--gold)", fontWeight: 800 }}>
                  {SITE.phone}
                </a>{" "}
                ({SITE.contactName} · 전화 문의)
              </dd>
            </dl>
            <dl className="kv">
              <dt>영업시간</dt>
              <dd>오후 7시 ~ 다음날 새벽 5시 (매일)</dd>
            </dl>
            <dl className="kv">
              <dt>출입 기준</dt>
              <dd>만 {SITE.ageLimit}세 이상 · 신분증 확인</dd>
            </dl>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">왜 직접 안내하나</span>
          <h2>지도보다 사람이 빠릅니다.</h2>
          <p className="lead" style={{ marginTop: 14 }}>
            처음 가는 골목, 야간 조명, 모르는 일방통행. 지도만 믿고 들어오면
            돌아가는 분들이 꽤 있습니다. 도착 직전에 담당한테 물어보시면,
            지금 어디 있는지 보고 가장 가까운 동선으로 정리해 드립니다.
          </p>
          <div className="grid grid-2" style={{ marginTop: 28 }}>
            <article className="card">
              <h3>차로 오실 때</h3>
              <p style={{ marginTop: 10 }}>
                창원 시내 진입 직전에 한 번, 가게 인근에서 한 번 주시면 됩니다.
                주차 가능 여부·인근 주차장도 함께 안내드립니다.
              </p>
            </article>
            <article className="card">
              <h3>택시·도보로 오실 때</h3>
              <p style={{ marginTop: 10 }}>
                택시 기사님께 어떻게 말씀드릴지부터 알려드립니다.
                내리신 위치에서 보이는 간판 기준으로 짧게 안내합니다.
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
          <span className="eyebrow">출발지별 가이드</span>
          <h2>창원 시내 어디서 오시든 큰 차이 없습니다.</h2>
          <div className="grid grid-3" style={{ marginTop: 28 }}>
            <article className="card">
              <h3>의창구·성산구 도심권</h3>
              <p style={{ marginTop: 10 }}>
                시내 중심에서는 차로 짧은 거리. 큰길 따라 오시면서 가게 가까이에서
                한 번 주시면 바로 진입 동선이 잡힙니다.
              </p>
            </article>
            <article className="card">
              <h3>마산·진해 방면</h3>
              <p style={{ marginTop: 10 }}>
                창원터널이나 큰 도로 거쳐 들어오시는 경우입니다. 시내 진입 직전에
                한 통, 가게 근처에서 한 통이면 좁은 골목 헤맬 일 없어요.
              </p>
            </article>
            <article className="card">
              <h3>외지에서 오시는 분</h3>
              <p style={{ marginTop: 10 }}>
                창원IC·창원역 도착 후 택시 잡으시는 게 보통입니다. 기사님께 어떻게
                말씀해야 빠른지, 그 멘트도 안내드립니다.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-elev)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <span className="eyebrow">도착 5분 전 체크리스트</span>
          <h2>이 세 가지만 챙기시면 끝.</h2>
          <ol className="steps" style={{ marginTop: 24 }}>
            <li>
              <strong>신분증</strong>
              만 {SITE.ageLimit}세 이상만 출입 가능합니다. 입장 시 확인하니 미리 꺼내두시면
              줄 서는 시간이 줄어요.
            </li>
            <li>
              <strong>인원 최종 확인</strong>
              일행 수 변동 있으면 도착 전에 한 번 더 알려주세요.
            </li>
            <li>
              <strong>입구 멘트</strong>
              담당이라고만 말씀하시면 바로 자리로 안내드립니다.
            </li>
          </ol>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="notice">
            정확한 도로명 주소·지도 좌표는 사장님 확인 후 추가됩니다. 지금은 잘못된
            주소를 띄워서 손님이 헛걸음하지 않도록, 일부러 표시하지 않고 있습니다.
            담당({SITE.contactName} {SITE.phone})한테 전화로 안내 받으시는 게 가장 빠르고 정확합니다.
          </div>
        </div>
      </section>
    </>
  );
}
