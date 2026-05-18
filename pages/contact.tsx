import Link from "next/link";
import SeoHead from "@/components/SeoHead";
import { Jsonld, buildBreadcrumb } from "@/components/Jsonld";
import { SITE } from "@/components/site";

export default function Contact() {
  return (
    <>
      <SeoHead
        title="문의·예약 · 창원 룰루랄라 나이트 짱구 담당 010-3854-6887"
        description="창원 룰루랄라 나이트 문의·예약은 짱구 담당 010-3854-6887로 바로 전화 주세요. 만 19세 이상 합법 영업장, 신분증 확인."
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
          <span className="badge badge--gold">문의·예약</span>
          <h1 style={{ marginTop: 18 }}>
            가장 빠른 답은<br />
            <span className="accent">전화</span>입니다.
          </h1>
          <p className="hero__sub">
            상담 폼에 길게 적는 것보다, 짱구 담당한테 바로 거는 게 빠릅니다.
            인원·시간만 말씀해 주시면 그 자리에서 정리됩니다.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary btn--lg tel" href={SITE.phoneHref}>
              📞 {SITE.phone} 짱구 담당
            </a>
            <Link className="btn btn--ghost btn--lg" href="/jjanggu/">담당 보기</Link>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="grid grid-2">
            <div className="card">
              <span className="eyebrow">통화</span>
              <h2 style={{ fontSize: "1.4rem", marginTop: 6 }}>{SITE.phone}</h2>
              <p style={{ marginTop: 10 }}>
                받으면 “<strong>짱구 담당 부탁드립니다</strong>”라고 말씀하시면 됩니다.
                도착 전에도, 이미 근처라도, 한 통이면 정리됩니다.
              </p>
              <p style={{ marginTop: 14 }}>
                <a className="btn btn--primary tel" href={SITE.phoneHref}>📞 바로 연결</a>
              </p>
            </div>
            <div className="card">
              <span className="eyebrow">문자</span>
              <h2 style={{ fontSize: "1.4rem", marginTop: 6 }}>통화 어려우실 때</h2>
              <p style={{ marginTop: 10 }}>
                바쁘신 시간이면 같은 번호로 문자 주세요. <br />
                <strong>이름 · 인원 · 도착 예정 시간</strong> 세 가지만 적어주시면 됩니다.
              </p>
              <p style={{ marginTop: 14 }}>
                <a className="btn btn--ghost tel" href={`sms:${SITE.phoneHref.replace("tel:", "")}`}>💬 문자 보내기</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">처음 거시는 분께</span>
          <h2>한 통이 이렇게 흘러갑니다.</h2>
          <ol className="steps" style={{ marginTop: 28 }}>
            <li>
              <strong>연결</strong>
              “짱구 담당 부탁드립니다.” 가장 빠른 멘트입니다.
            </li>
            <li>
              <strong>확인</strong>
              이름·인원·도착 예정 시간 → 자리 상황 보고 잡아 둡니다.
            </li>
            <li>
              <strong>도착·입장</strong>
              입구에서 같은 멘트만 말씀하시면 됩니다. 신분증 확인 후 자리로.
            </li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">통화 전에 정리해 두면 좋은 것</span>
          <h2>세 가지면 충분합니다.</h2>
          <p className="lead" style={{ marginTop: 14 }}>
            거시기 전에 잠깐 이 세 가지만 머릿속에 두시면, 통화가 30초 안에 정리됩니다.
            본인은 즐길 시간 더 챙기시는 거죠.
          </p>
          <ul className="bullets" style={{ marginTop: 22 }}>
            <li>
              <strong>이름과 일행 수</strong> — 본인 이름과 함께 가는 사람 수.
              두 명·네 명·여섯 명 단위 정도면 자리 잡기 좋습니다.
            </li>
            <li>
              <strong>도착 예정 시간</strong> — “10시쯤” 같은 대략적인 시간이면 됩니다.
              정확하면 더 좋고요.
            </li>
            <li>
              <strong>특별한 요청</strong> — 조용한 자리, 큰 자리, 처음이라 안내 필요 등
              있으면 그때 말씀하시면 됩니다. 없어도 무방.
            </li>
          </ul>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-elev)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <span className="eyebrow">방법별 차이</span>
          <h2>어떤 게 더 빠른가요?</h2>
          <div className="grid grid-2" style={{ marginTop: 26 }}>
            <article className="card">
              <h3>통화</h3>
              <p style={{ marginTop: 10 }}>
                가장 빠릅니다. 자리 상황 그 자리에서 확인되고, 변동 사항도
                바로 정리됩니다. 처음 오시는 분은 통화 추천.
              </p>
            </article>
            <article className="card">
              <h3>문자</h3>
              <p style={{ marginTop: 10 }}>
                답이 좀 늦을 수 있습니다. 다른 손님 응대 중이면 회신이
                밀려요. 시간 여유 있으실 때 또는 단순 문의에 추천.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="notice">
            만 19세 이상만 출입 가능한 합법 영업장입니다. 입장 시 신분증 확인이
            원칙이며, 미성년자 출입·불법 영업은 일체 진행하지 않습니다.
          </div>
        </div>
      </section>
    </>
  );
}
