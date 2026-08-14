import Link from "next/link";
import SeoHead from "@/components/SeoHead";
import { SITE } from "@/components/site";
import { Jsonld, buildBreadcrumb } from "@/components/Jsonld";

export default function About() {
  return (
    <>
      <SeoHead
        title="가게 소개 · 창원 시내 27세 이상 합법 영업장 · 담당제 운영 이유"
        description="왜 한 사람이 끝까지 챙기는 가게가 결국 손님한테 편한지. 룰루랄라 나이트가 담당제로 가는 이유와 만 27세 이상 합법 영업장으로 길게 가는 원칙을 정리했습니다. 예약·문의는 로또 010-7528-4936 전화."
        keywords="창원 룰루랄라 소개, 창원 나이트 합법, 27세 이상 합법 영업장, 담당제 운영, 창원 야간 업소"
        path="/about/"
      />
      <Jsonld
        data={buildBreadcrumb([
          { name: "홈", path: "/" },
          { name: "소개", path: "/about/" },
        ])}
      />

      <section className="hero">
        <div className="container">
          <span className="badge badge--gold">소개</span>
          <h1 style={{ marginTop: 18 }}>
            창원에서 노는 밤,<br />
            <span className="accent">덜 어색하게.</span>
          </h1>
          <p className="hero__sub">
            창원 룰루랄라 나이트는 만 {SITE.ageLimit}세 이상 손님을 받는 합법 영업장입니다.
            처음 오는 분이 어색하지 않게, 자리부터 동선까지 담당 한 사람이
            끊지 않고 챙기는 가게예요.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary btn--lg" href={SITE.phoneHref}>
              📞 {SITE.contactName} {SITE.phone} 전화
            </a>
            <Link className="btn btn--ghost btn--lg" href="/jjanggua/">담당자 소개 보기</Link>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="grid grid-2">
            <div className="card">
              <span className="eyebrow">어떤 곳</span>
              <h2 style={{ fontSize: "1.4rem", marginTop: 6 }}>창원에서 영업하는 나이트입니다.</h2>
              <p style={{ marginTop: 12 }}>
                창원 시내에서 운영되는 일반 나이트 영업장입니다. 자세한 위치 안내는
                직접 드리고 있어, 처음 오시는 분도 헷갈리지 않게 잡힙니다.
              </p>
              <p style={{ marginTop: 12 }}>
                <Link href="/location/" style={{ color: "var(--gold)", fontWeight: 700 }}>
                  → 위치 안내 보기
                </Link>
              </p>
            </div>
            <div className="card">
              <span className="eyebrow">누가 챙기나</span>
              <h2 style={{ fontSize: "1.4rem", marginTop: 6 }}>웨이터 한 명이 담당입니다.</h2>
              <p style={{ marginTop: 12 }}>
                통화·자리 잡기·입장 안내까지. 한 명이 끊지 않고
                챙기는 게 그의 일입니다. 그래서 손님은 시간만 즐기면 됩니다.
              </p>
              <p style={{ marginTop: 12 }}>
                <Link href="/jjanggua/" style={{ color: "var(--gold)", fontWeight: 700 }}>
                  → 담당자 더 보기
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">운영 원칙</span>
          <h2>지키는 건 단순합니다.</h2>
          <ul className="bullets" style={{ marginTop: 24 }}>
            <li>
              <strong>만 {SITE.ageLimit}세 이상 출입</strong> — 만 {SITE.ageLimit}세 이상부터 출입 가능하며,
              입장 시 신분증 확인이 원칙입니다. 미성년자 출입은 일체 받지 않습니다.
            </li>
            <li>
              <strong>합법 영업</strong> — 등록된 사업장에서 정상적인 영업 시간 안에
              운영합니다.
            </li>
            <li>
              <strong>담당제 안내</strong> — 한 사람이 첫 통화부터 마지막 인사까지
              책임지고 챙깁니다.
            </li>
            <li>
              <strong>전화 예약</strong> — 예약·문의는 {SITE.contactName} {SITE.phone}{" "}
              전화로만 받습니다.
            </li>
          </ul>
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
          <span className="eyebrow">왜 담당제로 운영하나</span>
          <h2>한 명이 끝까지 챙기는 게 결국 빠릅니다.</h2>
          <div className="grid grid-2" style={{ marginTop: 28 }}>
            <article className="card">
              <h3>설명을 한 번만</h3>
              <p style={{ marginTop: 10 }}>
                첫 통화 때 인원·시간·일행 분위기를 한 번만 말씀하시면 그 흐름이
                도착·자리·주문까지 그대로 이어집니다.
              </p>
            </article>
            <article className="card">
              <h3>변경에 강합니다</h3>
              <p style={{ marginTop: 10 }}>
                인원이 늘거나, 도착이 늦거나, 자리만 옮기고 싶을 때. 처음 통화한
                담당이 같은 번호로 받으니, 다시 설명할 필요 없이 변경이 정리됩니다.
              </p>
            </article>
            <article className="card">
              <h3>책임 소재가 명확합니다</h3>
              <p style={{ marginTop: 10 }}>
                자리 잡기로 한 사람과 실제 잡아 둔 사람이 같으니까, 빠지는 일이
                거의 없습니다.
              </p>
            </article>
            <article className="card">
              <h3>익명성이 보호됩니다</h3>
              <p style={{ marginTop: 10 }}>
                같은 담당과 통화하니, 매번 새로운 직원한테 일행 구성·인원을
                설명할 일이 없습니다.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="notice">
            가격표·영업 시간·내부 사진 등 페이지에 비어 있는 항목은,
            확인된 정보만 올린다는 원칙 때문에 임시로 두지 않고 비워둡니다.
          </div>
        </div>
      </section>
    </>
  );
}
