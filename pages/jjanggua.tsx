import SeoHead from "@/components/SeoHead";
import PageThumb from "@/components/PageThumb";
import { SITE } from "@/components/site";
import { Jsonld, buildBreadcrumb } from "@/components/Jsonld";

/* 2026-09-14 C0 (naver-watch-11) — 이 쪽은 창원룰루랄라나이트 담당 웨이터(로또) 광고 쪽이었다.
   2026-09-13 광고가 끝나 담당자 이름·번호·전화 안내를 전부 내렸다. 주소(/jjanggua/)는 바꾸지 않는다.
   남긴 사실은 components/site.ts 에 이미 있던 값(출입 연령·영업 시간·주소)뿐이다. */
export default function Jjanggu() {
  return (
    <>
      <SeoHead
        title="창원룰루랄라나이트 담당 안내 종료 — 입구에서 확인할 네 가지"
        description="이 페이지에 실렸던 창원 룰루랄라 나이트 담당자 연락처는 광고 게재가 끝나 내렸습니다. 출입 연령·영업 시간·위치·자리 확인 방법만 정리했습니다."
        path="/jjanggua/"
        ogSquare="/og/page-jjanggua-og-v2.png"
        ogAlt="창원룰루랄라나이트 · 광고문의 · 카톡 besta12"
      />
      <Jsonld
        data={buildBreadcrumb([
          { name: "무너진 자리에서 다시 시작한 사람의 기록", path: "/" },
          { name: "입장 안내", path: "/jjanggua/" },
        ])}
      />

      <section className="hero">
        <div className="container">
          <span className="badge badge--gold">입장 안내 · 미제휴</span>
          <h1 style={{ marginTop: 18 }}>담당 연락처 안내는 끝났습니다.</h1>
          <PageThumb src="/og/page-jjanggua-og-v2.png" alt="창원룰루랄라나이트 · 광고문의 · 카톡 besta12" />
          <p className="hero__sub">
            이 페이지에 실렸던 {SITE.name} 담당자 연락처는 광고 게재가 끝나 내렸습니다.
            이 사이트는 업소와 제휴 관계가 없어 예약이나 문의를 대신 받지 않습니다.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">입구에서 확인할 것</span>
          <h2>들어가기 전에 네 가지만 보면 됩니다.</h2>
          <ul className="bullets" style={{ marginTop: 22 }}>
            <li>
              <strong>출입 연령</strong> — 만 {SITE.ageLimit}세 이상입니다. 입장할 때 신분증을 확인합니다.
            </li>
            <li>
              <strong>영업 시간</strong> — {SITE.hours.label}. 당일 사정에 따라 달라질 수 있습니다.
            </li>
            <li>
              <strong>위치</strong> — {SITE.address.full}.
            </li>
            <li>
              <strong>자리와 금액</strong> — 인원과 시간에 따라 달라지므로 도착해서 현장 직원에게 직접 확인하세요.
            </li>
          </ul>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="notice">
            광고·제휴 입점 문의는 카톡 besta12 입니다. 업소 사장님 대상 창구라 손님 예약은 받지 않습니다.
            만 {SITE.ageLimit}세 이상 출입 · 입장 시 신분증 확인.
          </div>
        </div>
      </section>
    </>
  );
}
