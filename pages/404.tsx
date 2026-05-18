import Link from "next/link";
import SeoHead from "@/components/SeoHead";
import { SITE } from "@/components/site";

export default function NotFound() {
  return (
    <>
      <SeoHead
        title="페이지를 찾을 수 없습니다 · 창원 룰루랄라 나이트"
        description="찾으시는 페이지가 없습니다. 짱구 담당 010-3854-6887로 바로 연락 주세요."
        path="/404/"
        noindex
      />
      <section className="hero">
        <div className="container" style={{ textAlign: "center" }}>
          <span className="badge badge--gold">404</span>
          <h1 style={{ marginTop: 18 }}>여긴 비어 있는 자리입니다.</h1>
          <p className="hero__sub" style={{ margin: "12px auto 22px" }}>
            찾으시는 페이지가 없거나, 주소가 바뀌었을 수 있습니다.
            가장 빠른 길은 역시 한 통 거는 겁니다.
          </p>
          <div className="hero__actions" style={{ justifyContent: "center" }}>
            <a className="btn btn--primary btn--lg tel" href={SITE.phoneHref}>📞 {SITE.phone}</a>
            <Link className="btn btn--ghost btn--lg" href="/">홈으로</Link>
          </div>
        </div>
      </section>
    </>
  );
}
