import Link from "next/link";
import SeoHead from "@/components/SeoHead";
import { Jsonld, buildBreadcrumb } from "@/components/Jsonld";
import { SITE } from "@/components/site";

export default function Location() {
  return (
    <>
      <SeoHead
        title="위치 안내 · 창원 룰루랄라 나이트 (짱구 담당이 직접 안내)"
        description="창원 룰루랄라 나이트의 위치는 전화로 정확히 안내드립니다. 짱구 담당 010-3854-6887. 만 19세 이상 합법 영업장."
        path="/location/"
      />
      <Jsonld
        data={buildBreadcrumb([
          { name: "홈", path: "/" },
          { name: "위치", path: "/location/" },
        ])}
      />

      <section className="hero">
        <div className="container">
          <span className="badge badge--gold">위치</span>
          <h1 style={{ marginTop: 18 }}>
            경상남도 <span className="accent">창원시</span>.<br />
            정확한 위치는 한 통이면 끝.
          </h1>
          <p className="hero__sub">
            지도만 보고 헤매는 게 시간 아깝습니다. 도착 직전에 짱구 담당한테
            한 번만 누르세요. 가장 빠른 동선으로 잡아 드립니다.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary btn--lg tel" href={SITE.phoneHref}>
              📞 {SITE.phone} 위치 안내
            </a>
            <Link className="btn btn--ghost btn--lg" href="/contact/">문의 방법</Link>
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
              <dd>전화로 직접 안내 (오시기 직전 한 통이면 가장 정확합니다)</dd>
            </dl>
            <dl className="kv">
              <dt>담당 전화</dt>
              <dd>
                <a className="tel" href={SITE.phoneHref} style={{ color: "var(--gold)", fontWeight: 700 }}>
                  {SITE.phone}
                </a>{" "}
                · 짱구 담당
              </dd>
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
          <span className="eyebrow">왜 전화로 안내하나</span>
          <h2>지도보다 사람이 빠릅니다.</h2>
          <p className="lead" style={{ marginTop: 14 }}>
            처음 가는 골목, 야간 조명, 모르는 일방통행. 지도만 믿고 들어오면
            돌아가는 분들이 꽤 있습니다. 도착 직전에 짱구 담당한테 전화 한 통이면,
            지금 어디 있는지 보고 가장 가까운 동선으로 정리해 드립니다.
          </p>
          <div className="grid grid-2" style={{ marginTop: 28 }}>
            <article className="card">
              <h3>차로 오실 때</h3>
              <p style={{ marginTop: 10 }}>
                창원 시내 진입 직전에 한 번, 가게 인근에서 한 번이면 됩니다.
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

      <section className="section">
        <div className="container">
          <span className="eyebrow">자주 헷갈리는 포인트</span>
          <h2>도착 전에 알아두시면 시간이 줄어요.</h2>
          <ul className="bullets" style={{ marginTop: 20 }}>
            <li>
              <strong>창원 시내라도 골목이 좁은 구간</strong>이 있어, 내비 따라
              들어가면 한 블록 돌아가는 경우가 가끔 있습니다. 도착 직전에 한 번
              걸어주시면 가장 빠른 길로 안내드립니다.
            </li>
            <li>
              <strong>주차는 인근 상황에 따라 달라집니다.</strong> 자리 비어 있는지
              실시간으로 확인해 알려드리니, 차 가져오시는 분은 미리 말씀 주세요.
            </li>
            <li>
              <strong>밤에는 간판이 잘 안 보일 수 있습니다.</strong> 근처까지 오신 뒤
              위치 묘사해 주시면 거기서부터 짧게 잡아드립니다.
            </li>
            <li>
              <strong>택시 기사님께 말씀드릴 멘트</strong>도 따로 정리해 둡니다.
              해당 동네 가본 적 없으셔도 가게 근처까지 어렵지 않게 오실 수 있어요.
            </li>
          </ul>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-elev)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <span className="eyebrow">도착 5분 전 체크리스트</span>
          <h2>이 세 가지만 챙기시면 끝.</h2>
          <ol className="steps" style={{ marginTop: 24 }}>
            <li>
              <strong>신분증</strong>
              만 19세 이상만 출입 가능합니다. 입장 시 확인하니 미리 꺼내두시면
              줄 서는 시간이 줄어요.
            </li>
            <li>
              <strong>인원 최종 확인</strong>
              일행 수 변동 있으면 도착 전에 한 번 더 알려주세요. 자리 사이즈가 그에 맞춰 정리됩니다.
            </li>
            <li>
              <strong>입구 멘트</strong>
              “짱구 담당”이라고만 말씀하시면 바로 자리로 안내드립니다.
            </li>
          </ol>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="notice">
            정확한 도로명 주소·지도 좌표는 사장님 확인 후 추가됩니다. 지금은 잘못된
            주소를 띄워서 손님이 헛걸음하지 않도록, 일부러 표시하지 않고 있습니다.
            전화로 안내 받으시는 게 가장 빠르고 정확합니다.
          </div>
        </div>
      </section>
    </>
  );
}
