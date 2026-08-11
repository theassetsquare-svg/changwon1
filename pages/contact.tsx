import Link from "next/link";
import SeoHead from "@/components/SeoHead";
import { SITE } from "@/components/site";
import { Jsonld, buildBreadcrumb } from "@/components/Jsonld";

export default function Contact() {
  return (
    <>
      <SeoHead
        title="전화 예약·문의 · 로또 010-7528-4936 · 창원 룰루랄라 나이트"
        description="창원 룰루랄라 나이트 예약·문의는 전화로만 받습니다. 로또 010-7528-4936으로 인원과 도착 시간만 말씀하시면 담당이 자리부터 입장까지 정리해 드립니다. 만 27세 이상 · 6명 이상 단체석 가이드 포함."
        keywords="창원 룰루랄라 예약, 창원 나이트 예약, 창원 나이트 전화번호, 창원 나이트 단체 예약"
        path="/contact/"
      />
      <Jsonld
        data={buildBreadcrumb([
          { name: "홈", path: "/" },
          { name: "문의", path: "/contact/" },
        ])}
      />

      <section className="hero">
        <div className="container">
          <span className="badge badge--gold">전화 예약·문의</span>
          <h1 style={{ marginTop: 18 }}>
            예약·문의는<br />
            <span className="accent">전화</span>로 받습니다.
          </h1>
          <p className="hero__sub">
            {SITE.contactName} {SITE.phone}. 인원·시간만 말씀하시면 그 자리에서
            정리됩니다. 만 {SITE.ageLimit}세 이상 출입.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary btn--lg" href={SITE.phoneHref}>
              📞 {SITE.contactName} {SITE.phone} 전화
            </a>
            <Link className="btn btn--ghost btn--lg" href="/jjanggu/">담당 보기</Link>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="card">
            <dl className="kv">
              <dt>예약 방법</dt>
              <dd>통화로만 접수 (메신저 접수 없음)</dd>
            </dl>
            <dl className="kv">
              <dt>담당</dt>
              <dd>웨이터 {SITE.contactName}</dd>
            </dl>
            <dl className="kv">
              <dt>전화번호</dt>
              <dd>
                <a href={SITE.phoneHref} style={{ color: "var(--gold)", fontWeight: 800 }}>
                  {SITE.phone}
                </a>
              </dd>
            </dl>
            <dl className="kv">
              <dt>통화 가능 시간</dt>
              <dd>{SITE.hours.label}</dd>
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
          <span className="eyebrow">처음 오시는 분께</span>
          <h2>통화가 이렇게 흘러갑니다.</h2>
          <ol className="steps" style={{ marginTop: 28 }}>
            <li>
              <strong>전화 ({SITE.phone})</strong>
              "룰루랄라 나이트 예약 문의입니다"라고 말씀하시면 됩니다.
            </li>
            <li>
              <strong>확인</strong>
              이름·인원·도착 예정 시간 → 자리 상황 보고 잡아 둡니다.
            </li>
            <li>
              <strong>도착·입장</strong>
              입구에서 담당이라고만 말씀하시면 됩니다. 신분증 확인 후 자리로.
            </li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">통화 전에 정리해 두면 좋은 것</span>
          <h2>세 가지면 충분합니다.</h2>
          <ul className="bullets" style={{ marginTop: 22 }}>
            <li>
              <strong>이름과 일행 수</strong> — 본인 이름과 함께 가는 사람 수.
              두 명·네 명·여섯 명 단위 정도면 자리 잡기 좋습니다.
            </li>
            <li>
              <strong>도착 예정 시간</strong> — "10시쯤" 같은 대략적인 시간이면 됩니다.
            </li>
            <li>
              <strong>특별한 요청</strong> — 조용한 좌석, 큰 테이블, 처음이라 안내 필요 등
              있으면 그때 말씀하시면 됩니다.
            </li>
          </ul>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-elev)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <span className="eyebrow">단체 예약 가이드</span>
          <h2>6명 이상이면 이렇게 준비해 주세요.</h2>
          <p className="lead" style={{ marginTop: 14 }}>
            단체 손님은 자리 사이즈·동선 잡는 데 일반 그룹보다 시간이 더 걸립니다.
            미리 담당한테 통화로 잡아 두시면 그날 저녁이 훨씬 매끄럽게 흘러갑니다.
          </p>
          <ul className="bullets" style={{ marginTop: 22 }}>
            <li>
              <strong>최소 두세 시간 전, 가능하면 하루 전</strong> — 평일이면 두세
              시간 전, 주말·시즌이면 하루 전에 미리 주시는 게 안전합니다.
            </li>
            <li>
              <strong>인원 변동 가능성도 같이</strong> — "10명 정도, 변동 있으면
              ±2명" 식으로 말씀해 주시면 자리 잡는 폭이 넓어집니다.
            </li>
            <li>
              <strong>회식·생일·송년 같은 목적</strong> — 모임 성격을 알려주시면
              자리·분위기·진행 흐름까지 담당이 맞춰드릴 수 있습니다.
            </li>
            <li>
              <strong>계산 방식 미리</strong> — 한 사람이 전체 결제할지, 인원별로
              나눌지 미리 말씀해 두시면 마감 때 시간 안 끌립니다.
            </li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">자주 받는 문의</span>
          <h2>통화 전에 미리 답드릴 수 있는 것들.</h2>
          <ul className="bullets" style={{ marginTop: 22 }}>
            <li>
              <strong>"몇 살부터 들어갈 수 있어요?"</strong> — 만 {SITE.ageLimit}세
              이상부터 출입 가능합니다. 입장 시 신분증으로 확인합니다.
            </li>
            <li>
              <strong>"예약은 어떻게 하나요?"</strong> — 예약·문의는 통화로만
              받습니다. {SITE.contactName} {SITE.phone}으로 걸어 주세요.
            </li>
            <li>
              <strong>"예약금 입금해야 해요?"</strong> — 일반 좌석은 예약금 없이
              잡아 드립니다.
            </li>
            <li>
              <strong>"노쇼하면 어떻게 되나요?"</strong> — 별다른 페널티는 없지만,
              연락 없이 안 오시면 다음 예약 잡으실 때 자리 우선순위에서 빠질 수
              있어요.
            </li>
            <li>
              <strong>"여자 손님끼리도 받아요?"</strong> — 받습니다. 자리 배치만
              그에 맞게 다르게 잡습니다.
            </li>
            <li>
              <strong>"직접 가서 자리 잡으면 안 돼요?"</strong> — 워크인도 가능합니다.
              다만 피크 무렵엔 자리가 비어 있다는 보장이 없으니, 출발 전에 한 통
              주시는 게 안전해요.
            </li>
            <li>
              <strong>"카드 결제 되나요?"</strong> — 카드 결제, 현금 영수증 정상
              처리됩니다.
            </li>
          </ul>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="notice">
            만 {SITE.ageLimit}세 이상만 출입 가능한 합법 영업장입니다. 입장 시 신분증 확인이
            원칙이며, 미성년자 출입·불법 영업은 일체 진행하지 않습니다.
            예약·문의는 {SITE.contactName} {SITE.phone} 전화로만 받습니다.
          </div>
        </div>
      </section>
    </>
  );
}
