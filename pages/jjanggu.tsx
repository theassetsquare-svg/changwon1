import Link from "next/link";
import SeoHead from "@/components/SeoHead";
import { SITE } from "@/components/site";
import { Jsonld, buildBreadcrumb } from "@/components/Jsonld";

export default function Jjanggu() {
  return (
    <>
      <SeoHead
        title="담당 웨이터 로또 010-7528-4936 · 창원 룰루랄라 나이트"
        description="창원 룰루랄라 나이트 손님 응대 담당 웨이터 로또. 예약·문의는 010-7528-4936 전화 한 통. 처음이든 단골이든 같은 흐름, 같은 사람. 만 27세 이상 출입."
        keywords="창원 룰루랄라 나이트 담당, 창원 나이트 예약, 창원 나이트 전화번호, 룰루랄라 담당 웨이터 로또"
        path="/jjanggu/"
      />
      <Jsonld
        data={buildBreadcrumb([
          { name: "홈", path: "/" },
          { name: "담당", path: "/jjanggu/" },
        ])}
      />

      <section className="hero">
        <div className="container">
          <span className="badge badge--gold">웨이터(담당) · {SITE.contactName}</span>
          <h1 style={{ marginTop: 18 }}>
            저장해 두면 편한 번호.<br />
            <span className="accent">{SITE.contactName} {SITE.phone}</span>
          </h1>
          <p className="hero__sub">
            창원 룰루랄라 나이트에서 손님 응대를 맡고 있는 웨이터입니다.
            처음 오신 분도, 자주 오시는 분도, 도착 전에 전화 한 통이면 자리부터 안내까지
            직접 챙깁니다. 예약·문의는 전화로만 받습니다.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary btn--lg" href={SITE.phoneHref}>
              📞 {SITE.contactName} {SITE.phone} 전화
            </a>
            <Link className="btn btn--ghost btn--lg" href="/contacta/">예약 안내 보기</Link>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="card">
            <dl className="kv">
              <dt>닉네임</dt>
              <dd>{SITE.contactName}</dd>
            </dl>
            <dl className="kv">
              <dt>역할</dt>
              <dd>웨이터(담당) — 손님 응대·자리 안내·예약 조율</dd>
            </dl>
            <dl className="kv">
              <dt>예약·문의</dt>
              <dd>
                <a href={SITE.phoneHref} style={{ color: "var(--gold)", fontWeight: 800 }}>
                  {SITE.phone}
                </a>{" "}
                (전화 문의)
              </dd>
            </dl>
            <dl className="kv">
              <dt>소속</dt>
              <dd>창원 룰루랄라 나이트</dd>
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
            연락 받은 사람, 자리 잡은 사람, 입장 안내한 사람이 다 다르면
            중간에 말이 꼬입니다. 담당이 한 명이면 그럴 일이 없습니다.
          </p>
          <div className="grid grid-3" style={{ marginTop: 28 }}>
            <article className="card">
              <h3>연락 → 자리</h3>
              <p style={{ marginTop: 10 }}>
                받은 즉시 인원수·시간 보고 자리 정리. 인원이 늘거나 시간이
                늦어져도 다시 한 번이면 됩니다.
              </p>
            </article>
            <article className="card">
              <h3>입장 → 안내</h3>
              <p style={{ marginTop: 10 }}>
                입구에서 담당이라고만 말씀하시면 됩니다. 신분증 확인 후
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
          <span className="eyebrow">전화 문의 가이드</span>
          <h2>이렇게만 말씀하시면 됩니다.</h2>
          <ol className="steps" style={{ marginTop: 28 }}>
            <li>
              <strong>{SITE.phone}으로 전화 → "룰루랄라 나이트 예약 문의입니다."</strong>
              가장 빠른 연결 방식입니다. 처음 전화하시는 분도 똑같이 말씀하시면 됩니다.
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
          <span className="eyebrow">담당이 하루 동안 챙기는 일</span>
          <h2>저녁 한 타임 동안 이런 흐름이 돌아갑니다.</h2>
          <ul className="bullets" style={{ marginTop: 22 }}>
            <li>
              <strong>오픈 한 시간 전 (오후 6시쯤)</strong> — 그날 자리 배치 확인,
              미리 예약된 인원 체크.
            </li>
            <li>
              <strong>오픈~밤 11시 (7시~11시)</strong> — 첫 손님 응대. 이 시간대는
              응대도 빠르게 받을 수 있는 구간이에요.
            </li>
            <li>
              <strong>피크 (자정~새벽 2시)</strong> — 자리 회전이 가장 빠른 시간.
              답이 살짝 늦어질 수 있는 구간이라, 이 시간대 예약은 미리 잡아 두시는 게 안전합니다.
            </li>
            <li>
              <strong>후반 (새벽 2시~5시)</strong> — 새벽 2시 이후 자리 회전이
              다시 풀리는 시간. 새벽 5시 마감 직전까지 영업.
            </li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">자주 받는 질문</span>
          <h2>문의 전에 미리 답드릴 수 있는 것들.</h2>
          <ul className="bullets" style={{ marginTop: 22 }}>
            <li>
              <strong>"담당만 따로 부를 수 있어요?"</strong> — 네, 그래서 담당제로
              운영합니다. 들어오실 때 같은 멘트만 말씀하시면 바로 연결됩니다.
            </li>
            <li>
              <strong>"혼자 가도 어색하지 않아요?"</strong> — 가능합니다. 혼자 오실 거면 도착
              전에 한 통 주시면 그날 상황에 맞게 담당이 잡아 둡니다.
            </li>
            <li>
              <strong>"가격이 어느 정도예요?"</strong> — 시간대·자리·인원에 따라
              달라지는 부분이라, 직접 안내드리는 게 정확합니다.
            </li>
            <li>
              <strong>"카드 결제 되나요?"</strong> — 카드 결제, 현금 영수증 정상 처리됩니다.
            </li>
          </ul>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="notice">
            예약·문의는 {SITE.contactName} {SITE.phone} 전화로만 받습니다.
            만 {SITE.ageLimit}세 이상 출입 · 입장 시 신분증 확인.
          </div>
        </div>
      </section>
    </>
  );
}
