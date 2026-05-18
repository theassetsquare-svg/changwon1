import Link from "next/link";
import SeoHead from "@/components/SeoHead";
import { Jsonld, buildBreadcrumb } from "@/components/Jsonld";
import { SITE } from "@/components/site";

export default function Jjanggu() {
  return (
    <>
      <SeoHead
        title="짱구 담당 (웨이터) · 창원 룰루랄라 나이트 직통 010-3854-6887"
        description="창원 룰루랄라 나이트의 웨이터 짱구입니다. 전화 한 통이면 자리·인원·도착 시간까지 정리해 드립니다. 만 19세 이상."
        path="/jjanggu/"
      />
      <Jsonld
        data={buildBreadcrumb([
          { name: "홈", path: "/" },
          { name: "짱구 담당", path: "/jjanggu/" },
        ])}
      />

      <section className="hero">
        <div className="container">
          <span className="badge badge--gold">웨이터(담당)</span>
          <h1 style={{ marginTop: 18 }}>
            저장해 두면 편한 번호.<br />
            <span className="accent">짱구</span>입니다.
          </h1>
          <p className="hero__sub">
            창원 룰루랄라 나이트에서 손님 응대를 맡고 있는 웨이터 짱구입니다.
            처음 오신 분도, 자주 오시는 분도, 도착 전에 한 통이면 자리부터 안내까지
            제가 직접 챙깁니다.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary btn--lg tel" href={SITE.phoneHref}>
              📞 {SITE.phone} 바로 전화
            </a>
            <Link className="btn btn--ghost btn--lg" href="/contact/">문의 방법 보기</Link>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="card">
            <dl className="kv">
              <dt>이름</dt>
              <dd>짱구</dd>
            </dl>
            <dl className="kv">
              <dt>역할</dt>
              <dd>웨이터(담당) — 손님 응대·자리 안내·예약 조율</dd>
            </dl>
            <dl className="kv">
              <dt>소속</dt>
              <dd>창원 룰루랄라 나이트</dd>
            </dl>
            <dl className="kv">
              <dt>직통 전화</dt>
              <dd>
                <a className="tel" href={SITE.phoneHref} style={{ color: "var(--gold)", fontWeight: 700 }}>
                  {SITE.phone}
                </a>
              </dd>
            </dl>
            <dl className="kv">
              <dt>응대 언어</dt>
              <dd>한국어</dd>
            </dl>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">왜 한 사람이 챙기는 게 다른가</span>
          <h2>담당이 정해져 있으면 흐름이 안 끊깁니다.</h2>
          <p className="lead" style={{ marginTop: 14 }}>
            전화 받은 사람, 자리 잡은 사람, 입장 안내한 사람이 다 다르면
            중간에 말이 꼬입니다. 담당이 한 명이면 그럴 일이 없습니다.
          </p>
          <div className="grid grid-3" style={{ marginTop: 28 }}>
            <article className="card">
              <h3>전화 → 자리</h3>
              <p style={{ marginTop: 10 }}>
                받은 즉시 인원수·시간 보고 자리 정리. 인원이 늘거나 시간이
                늦어져도 다시 한 통이면 됩니다.
              </p>
            </article>
            <article className="card">
              <h3>입장 → 안내</h3>
              <p style={{ marginTop: 10 }}>
                입구에서 “짱구 담당”이라고만 말씀하시면 됩니다. 신분증 확인 후
                바로 자리로 모십니다.
              </p>
            </article>
            <article className="card">
              <h3>마무리까지</h3>
              <p style={{ marginTop: 10 }}>
                중간에 필요한 게 생기면 그 자리에서 정리합니다. 어색하게
                여기저기 부를 일 없습니다.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-elev)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <span className="eyebrow">통화 가이드</span>
          <h2>전화할 때 이렇게만 말씀하시면 됩니다.</h2>
          <ol className="steps" style={{ marginTop: 28 }}>
            <li>
              <strong>“짱구 담당 부탁드립니다.”</strong>
              가장 빠른 연결 방식입니다. 처음 거시는 분도 똑같이 말씀하시면 됩니다.
            </li>
            <li>
              <strong>이름·인원·도착 예정 시간</strong>
              세 가지면 충분합니다. 자세한 건 통화하면서 자연스럽게 정리됩니다.
            </li>
            <li>
              <strong>변경이 생기면 다시 전화</strong>
              인원이 늘거나, 시간이 미뤄지면 다시 한 통. 자리 다시 잡아 둡니다.
            </li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">현장에서 자주 생기는 일</span>
          <h2>이럴 땐 이렇게.</h2>
          <p className="lead" style={{ marginTop: 14 }}>
            계획대로만 흘러가는 저녁은 거의 없습니다. 늦게 도착하거나, 일행이
            한두 명 더 붙거나, 갑자기 자리만 옮기고 싶거나. 자주 생기는 상황은
            대처법도 정해져 있습니다.
          </p>
          <div className="grid grid-2" style={{ marginTop: 26 }}>
            <article className="card">
              <h3>도착이 30분 이상 늦어질 때</h3>
              <p style={{ marginTop: 10 }}>
                예정 시간 안 맞으면 그 시점에 한 통만 더 주세요. 자리 상황 다시
                보고, 가능한 한 잡아 둡니다. 연락 없이 길어지면 자리가 빠질 수 있어요.
              </p>
            </article>
            <article className="card">
              <h3>일행이 늘어났을 때</h3>
              <p style={{ marginTop: 10 }}>
                도착 전에만 알려주시면 됩니다. 인원 수 보고 자리를 다시 배치합니다.
                두 명 정도 추가는 보통 자연스럽게 해결됩니다.
              </p>
            </article>
            <article className="card">
              <h3>먼저 도착한 분이 있을 때</h3>
              <p style={{ marginTop: 10 }}>
                일행 도착 전이라도 입장 가능합니다. 입구에서 “짱구 담당”이라고
                말씀하시고, 자리에서 편하게 기다리세요. 나머지 도착하면 합석시켜 드립니다.
              </p>
            </article>
            <article className="card">
              <h3>그날 처음 오시는 분</h3>
              <p style={{ marginTop: 10 }}>
                처음이라고 말씀해 주세요. 자리·동선·메뉴 흐름 짧게 잡아드립니다.
                어색하게 이리저리 안 다니셔도 됩니다.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="notice">
            짱구의 실제 사진·경력 등 상세 정보는, 본인 확인된 자료만 올린다는 원칙
            때문에 추후 사장님 자료를 받는 대로 추가됩니다. 그 사이에는 전화로
            직접 말씀 나누시는 게 가장 정확합니다.
          </div>
        </div>
      </section>
    </>
  );
}
