import Link from "next/link";
import SeoHead from "@/components/SeoHead";
import { Jsonld, buildBreadcrumb } from "@/components/Jsonld";
import { SITE } from "@/components/site";

export default function About() {
  return (
    <>
      <SeoHead
        title="창원 룰루랄라 나이트 소개 · 짱구 담당이 챙기는 합법 영업장"
        description="창원 룰루랄라 나이트는 만 19세 이상만 출입하는 합법 영업장입니다. 짱구 담당이 자리부터 안내까지 직접 챙깁니다. 직통 010-3854-6887."
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
            창원 룰루랄라 나이트는 만 19세 이상 손님을 받는 합법 영업장입니다.
            처음 오는 분이 어색하지 않게, 자리부터 동선까지 짱구 담당이 직접 맞춰 드립니다.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary btn--lg tel" href={SITE.phoneHref}>
              📞 {SITE.phone} 짱구 담당
            </a>
            <Link className="btn btn--ghost btn--lg" href="/jjanggu/">짱구 담당 더 보기</Link>
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
                전화로 직접 드리고 있어, 처음 오시는 분도 헷갈리지 않게 잡힙니다.
              </p>
              <p style={{ marginTop: 12 }}>
                <Link href="/location/" style={{ color: "var(--gold)", fontWeight: 700 }}>
                  → 위치 안내 보기
                </Link>
              </p>
            </div>
            <div className="card">
              <span className="eyebrow">누가 챙기나</span>
              <h2 style={{ fontSize: "1.4rem", marginTop: 6 }}>웨이터 짱구가 담당입니다.</h2>
              <p style={{ marginTop: 12 }}>
                전화·문자 받고, 자리 잡고, 입장 안내까지. 한 사람이 끊지 않고
                챙기는 게 짱구의 일입니다. 그래서 손님은 시간만 즐기면 됩니다.
              </p>
              <p style={{ marginTop: 12 }}>
                <Link href="/jjanggu/" style={{ color: "var(--gold)", fontWeight: 700 }}>
                  → 짱구 담당 더 보기
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
          <p className="lead" style={{ marginTop: 14 }}>
            합법 영업장에서, 정상적인 절차로, 손님이 편하게.
            이 세 가지가 무너지면 나머지가 다 의미가 없어집니다.
          </p>
          <ul className="bullets" style={{ marginTop: 24 }}>
            <li>
              <strong>만 19세 이상 출입</strong> — 입장 시 신분증 확인이 원칙입니다.
              미성년자 출입은 일체 받지 않습니다.
            </li>
            <li>
              <strong>합법 영업</strong> — 등록된 사업장에서 정상적인 영업 시간 안에
              운영합니다. 손님과 가게 모두에게 안전한 방식이 결국 길게 갑니다.
            </li>
            <li>
              <strong>담당제 안내</strong> — 짱구 담당이 한 번 잡으면 끝까지 챙깁니다.
              사람 바뀌면서 말이 꼬이는 일이 없도록.
            </li>
            <li>
              <strong>전화 응대 우선</strong> — 텍스트로 길게 설명하는 것보다, 전화로
              한 번에 정리하는 게 빠릅니다. 010-3854-6887.
            </li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">손님이 자주 보는 풍경</span>
          <h2>이런 장면에서 차이가 납니다.</h2>
          <div className="grid grid-2" style={{ marginTop: 26 }}>
            <article className="card">
              <h3>입구에서</h3>
              <p style={{ marginTop: 10 }}>
                줄에서 두리번거리지 않습니다. “짱구 담당”이라고만 말씀하시면,
                신분증 확인 후 곧장 자리로. 처음이라고 어색해할 시간이 없습니다.
              </p>
            </article>
            <article className="card">
              <h3>자리에서</h3>
              <p style={{ marginTop: 10 }}>
                주문 흐름, 옆 자리 분위기 봐가며 정리해 드립니다. 호출 벨
                연타할 일 없도록, 담당이 한 번에 챙겨요.
              </p>
            </article>
            <article className="card">
              <h3>일행이 합류할 때</h3>
              <p style={{ marginTop: 10 }}>
                늦게 오는 분이 있으면 입구에서 같은 멘트로 들어오시면 됩니다.
                자리에 자연스럽게 합류해서, 노는 흐름이 끊기지 않아요.
              </p>
            </article>
            <article className="card">
              <h3>마지막에</h3>
              <p style={{ marginTop: 10 }}>
                계산도 한 사람한테 정리할 수 있어 깔끔합니다. 인원 별로 나눌
                것 있으면 미리 말씀만 주세요.
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
            궁금한 부분은 짱구 담당한테 직접 물어봐 주세요. 한 번에 정확하게 답드립니다.
          </div>
        </div>
      </section>
    </>
  );
}
