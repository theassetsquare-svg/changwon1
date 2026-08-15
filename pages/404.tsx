import Link from "next/link";
import SeoHead from "@/components/SeoHead";
import { SITE } from "@/components/site";

export default function NotFound() {
  return (
    <>
      <SeoHead
        title="창원룰루랄라나이트 404 · 여긴 비어 있는 자리입니다"
        description="찾으시는 페이지가 없거나 주소가 바뀌었습니다. 홈으로 돌아가거나 자주 찾는 페이지로 바로 이동하세요."
        path="/404/"
        noindex
      />
      <section className="hero">
        <div className="container" style={{ textAlign: "center" }}>
          <span className="badge badge--gold">404 · Not Found</span>
          <h1 style={{ marginTop: 18 }}>여긴 비어 있는 자리입니다.</h1>
          <p className="hero__sub" style={{ margin: "12px auto 22px" }}>
            찾으시는 페이지가 없거나, 주소가 바뀌었을 수 있습니다.
            아래에서 바로 가실 수 있는 페이지를 골라 주세요.
          </p>
          <div className="hero__actions" style={{ justifyContent: "center" }}>
            <Link className="btn btn--primary btn--lg" href="/">홈으로</Link>
            <a className="btn btn--ghost btn--lg" href={SITE.phoneHref}>
              📞 {SITE.contactName} {SITE.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="grid grid-3">
            <Link className="card card--link" href="/jjanggua/">
              <span className="eyebrow">담당</span>
              <h3 style={{ marginTop: 6 }}>담당 보기</h3>
              <p style={{ marginTop: 10 }}>
                전화 문의 가이드와 자주 받는 질문을 한 번에 확인할 수 있습니다.
              </p>
            </Link>
            <Link className="card card--link" href="/location/">
              <span className="eyebrow">위치</span>
              <h3 style={{ marginTop: 6 }}>찾아오는 길</h3>
              <p style={{ marginTop: 10 }}>
                창원 시내 출발지별 동선과 도착 5분 전 체크리스트가 있어요.
              </p>
            </Link>
            <Link className="card card--link" href="/contacta/">
              <span className="eyebrow">예약·문의</span>
              <h3 style={{ marginTop: 6 }}>예약 가이드</h3>
              <p style={{ marginTop: 10 }}>
                전화 예약 흐름과 단체석 가이드까지 모두 있습니다.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="notice" style={{ textAlign: "left" }}>
            본 사이트는 창원 룰루랄라 나이트 공식 안내 페이지입니다.
            만 {SITE.ageLimit}세 이상만 출입 가능하며, 입장 시 신분증 확인이 원칙입니다.
            합법 영업장에서 운영되며, 불법·미성년 출입은 일체 금지됩니다.
          </div>
        </div>
      </section>
    </>
  );
}
