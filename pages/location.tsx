import Link from "next/link";
import SeoHead from "@/components/SeoHead";
import { Jsonld, buildBreadcrumb } from "@/components/Jsonld";
import { SITE } from "@/components/site";

export default function Location() {
  return (
    <>
      <SeoHead
        title="찾아오는 길 · 창원 시내 출발지별 동선 + 도착 5분 전 체크리스트"
        description="내비만 믿고 골목에서 돌지 마세요. 의창·성산·마산·진해 어디서 오시든 가장 빠른 길, 신분증·인원·입구 멘트까지 짱구 담당이 도착 직전 통화로 잡아드립니다."
        keywords="창원 룰루랄라 위치, 창원 나이트 위치, 창원 시내 나이트, 의창구 나이트, 성산구 나이트, 창원 야간 업소 위치"
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
          <p className="lead" style={{ marginTop: 14 }}>
            창원은 광역시급 도시지만 동선이 도심권 한 덩어리라, 시내 어느 동에서
            출발하시든 부담스러운 이동 거리는 아닙니다. 출발지별로 어떻게 오시면
            편한지 대략 적어 둘게요. 정확한 진입 경로는 도착 직전에 짱구 담당이
            잡아드립니다.
          </p>
          <div className="grid grid-3" style={{ marginTop: 28 }}>
            <article className="card">
              <h3>의창구·성산구 도심권</h3>
              <p style={{ marginTop: 10 }}>
                시내 중심에서는 차로 짧은 거리. 큰길 따라 오시면서 가게 가까이에서
                전화 한 번이면 바로 진입 동선이 잡힙니다.
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
                창원IC·창원역 도착 후 택시 잡으시는 게 보통입니다. 어떻게 말씀해야
                기사님이 빠르게 알아듣는지, 그 멘트도 통화로 알려드립니다.
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
            <li>
              <strong>주말 밤 도심권은 차가 막힙니다.</strong> 금·토 밤 11시 이후로는
              평소보다 10~20분 더 잡고 출발하시는 게 안전해요. 늦어질 것 같으면
              짱구한테 미리 한 통 주시면 자리 잡아 둡니다.
            </li>
            <li>
              <strong>대리운전 부르실 거면 미리</strong> 잡아 두시는 게 깔끔합니다.
              마감 직전 대리는 잡기 어려워질 때가 있어서, 도착 전에 정리해 두시면
              마무리가 편해요.
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

      <section className="section">
        <div className="container">
          <span className="eyebrow">교통 수단별 추천</span>
          <h2>본인한테 맞는 방법이 따로 있습니다.</h2>
          <p className="lead" style={{ marginTop: 14 }}>
            창원 시내에서 야간 업장에 들르실 때, 어떻게 오느냐에 따라 그날 저녁
            마무리가 꽤 달라집니다. 짱구가 손님들 응대하면서 본 일반적인 패턴
            정리해 드릴게요.
          </p>
          <div className="grid grid-2" style={{ marginTop: 26 }}>
            <article className="card">
              <h3>자차 + 대리</h3>
              <p style={{ marginTop: 10 }}>
                창원 분들이 가장 많이 쓰는 방식. 자차로 와서 마감 즈음 대리 부르는
                패턴이에요. 차 가져오시면 미리 말씀 주세요. 주차 자리 봐드립니다.
              </p>
            </article>
            <article className="card">
              <h3>택시 (왕복)</h3>
              <p style={{ marginTop: 10 }}>
                가장 신경 안 쓰는 방법. 가게 근처에서 택시 잡기도 어렵지 않습니다.
                기사님께 어떻게 말씀하시면 좋을지 도착 전 통화로 알려드릴게요.
              </p>
            </article>
            <article className="card">
              <h3>도보 (인근 거주·숙박)</h3>
              <p style={{ marginTop: 10 }}>
                창원 시내 호텔·게스트하우스에 묵으시는 외지 손님은 도보로도 충분히
                오실 수 있는 거리예요. 정확한 동선은 그날 짱구 담당이 챙겨드립니다.
              </p>
            </article>
            <article className="card">
              <h3>일행 픽업</h3>
              <p style={{ marginTop: 10 }}>
                일행이 차로 오는 데 본인은 따로 합류해야 한다면, 가게 근처 약속
                포인트를 미리 잡아 두시면 좋아요. 그 포인트도 통화로 정해드립니다.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">도착 후 입장 흐름</span>
          <h2>가게 앞에서 짧게 끝나는 절차.</h2>
          <p className="lead" style={{ marginTop: 14 }}>
            창원 룰루랄라 나이트 입구에서 손님이 흔히 헤매시는 구간이 몇 군데
            있는데, 미리 알고 오시면 줄 서는 시간이 줄어듭니다. 입장 절차 자체는
            아주 단순하니까 부담 갖지 마세요.
          </p>
          <ol className="steps" style={{ marginTop: 24 }}>
            <li>
              <strong>입구 직원한테 “짱구 담당”</strong>
              이 한 줄이면 바로 안쪽으로 연결됩니다. 다른 멘트는 필요 없어요.
              짱구가 안에 있으면 그쪽에서 받고, 응대 중이면 다른 직원이 자리로
              먼저 안내합니다.
            </li>
            <li>
              <strong>신분증 확인</strong>
              만 19세 이상 합법 영업장이라 신분증은 100% 확인합니다. 일행이 여러
              명이면 다 같이 꺼내 두시는 게 줄 안 끌립니다.
            </li>
            <li>
              <strong>자리 안내</strong>
              미리 잡아둔 자리로 바로 모십니다. 처음 오시는 분께는 동선·주문
              흐름을 짧게 설명드리고, 단골이시면 그날 컨디션 보고 자리만 안내합니다.
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
