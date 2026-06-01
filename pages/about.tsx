import Link from "next/link";
import SeoHead from "@/components/SeoHead";
import { Jsonld, buildBreadcrumb } from "@/components/Jsonld";
import { SITE } from "@/components/site";

export default function About() {
  return (
    <>
      <SeoHead
        title="가게 소개 · 창원 시내 19+ 합법 영업장 · 담당제 운영 이유"
        description="왜 한 사람이 끝까지 챙기는 가게가 결국 손님한테 편한지. 룰루랄라 나이트가 담당제로 가는 이유와 19세 이상 합법 영업장으로 길게 가는 원칙을 정리했습니다."
        keywords="창원 룰루랄라 소개, 창원 나이트 합법, 19세 합법 영업장, 담당제 운영, 창원 야간 업소"
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
            처음 오는 분이 어색하지 않게, 자리부터 동선까지 담당 한 사람이
            끊지 않고 챙기는 가게예요.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary btn--lg tel" href={SITE.phoneHref}>
              📞 {SITE.phone} 짱구 담당
            </a>
            <Link className="btn btn--ghost btn--lg" href="/jjanggu/">담당자 소개 보기</Link>
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
              <h2 style={{ fontSize: "1.4rem", marginTop: 6 }}>웨이터 한 사람이 담당입니다.</h2>
              <p style={{ marginTop: 12 }}>
                전화·문자 받고, 자리 잡고, 입장 안내까지. 한 사람이 끊지 않고
                챙기는 게 그의 일입니다. 그래서 손님은 시간만 즐기면 됩니다.
              </p>
              <p style={{ marginTop: 12 }}>
                <Link href="/jjanggu/" style={{ color: "var(--gold)", fontWeight: 700 }}>
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
              <strong>담당제 안내</strong> — 한 사람이 처음 통화부터 마지막 인사까지
              책임지고 챙깁니다. 사람 바뀌면서 말이 꼬이는 일이 없도록.
            </li>
            <li>
              <strong>전화 응대 우선</strong> — 텍스트로 길게 설명하는 것보다, 전화로
              한 번에 정리하는 게 빠릅니다. 010-3854-6887.
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
          <h2>한 사람이 끝까지 챙기는 게 결국 빠릅니다.</h2>
          <p className="lead" style={{ marginTop: 14 }}>
            나이트 영업장은 사람이 많고, 흐름이 빠르고, 그날의 상황이 매번 다릅니다.
            전화 받은 사람, 자리 안내한 사람, 주문 받은 사람이 다 다르면 손님 입장에서
            매번 같은 설명을 반복해야 하죠. 담당제는 그 반복을 없앱니다.
          </p>
          <div className="grid grid-2" style={{ marginTop: 28 }}>
            <article className="card">
              <h3>설명을 한 번만</h3>
              <p style={{ marginTop: 10 }}>
                처음 통화 때 인원·시간·일행 분위기를 한 번만 말씀하시면 그 흐름이
                도착·자리·주문까지 그대로 이어집니다. 손님이 같은 말을 두 번 할 필요가
                없습니다.
              </p>
            </article>
            <article className="card">
              <h3>변경에 강합니다</h3>
              <p style={{ marginTop: 10 }}>
                인원이 늘거나, 도착이 늦거나, 자리만 옮기고 싶을 때. 처음 통화한
                담당이 같은 라인에서 받으니, 다시 설명할 필요 없이 변경이 정리됩니다.
              </p>
            </article>
            <article className="card">
              <h3>책임 소재가 명확합니다</h3>
              <p style={{ marginTop: 10 }}>
                자리 잡기로 한 사람과 실제 잡아 둔 사람이 같으니까, 빠지는 일이
                거의 없습니다. 만약 문제가 생겨도 한 사람한테 말씀하시면 정리됩니다.
              </p>
            </article>
            <article className="card">
              <h3>익명성이 보호됩니다</h3>
              <p style={{ marginTop: 10 }}>
                같은 담당과 통화하니, 매번 새로운 직원한테 일행 구성·인원을
                설명할 일이 없습니다. 야간 업장 특성상 익명성을 챙기는 손님께
                의외로 중요한 차이입니다.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">합법 영업장이 의미하는 것</span>
          <h2>“합법”이 손님한테 주는 실질적 차이.</h2>
          <p className="lead" style={{ marginTop: 14 }}>
            “합법 영업장”이라는 말이 사이트에 박혀 있는 가게는 많습니다. 근데
            그게 손님 입장에서 어떤 실질적인 차이를 만드는지 정리해 드릴게요.
            결론부터 말하면, 길게 다니실 거면 합법 운영하는 곳이 결국 본인한테 안전합니다.
          </p>
          <ul className="bullets" style={{ marginTop: 22 }}>
            <li>
              <strong>출입 단속 위험이 없습니다</strong> — 미성년자 출입을 받지 않고,
              정상 영업 시간 안에서 움직이기 때문에 단속 상황에서 손님이 휘말릴
              여지가 없습니다. 신분증 확인 절차도 그래서 있는 거예요.
            </li>
            <li>
              <strong>결제·세금 처리가 정상</strong> — 카드 결제, 현금 영수증, 세금계산서
              요청까지 정상적으로 진행됩니다. 회식 후 정산하실 때도 일반 영업장과
              똑같이 처리하시면 됩니다.
            </li>
            <li>
              <strong>분쟁 시 절차가 정상</strong> — 가게와 손님 사이에 문제가
              생기더라도, 정상 사업자라 정식 절차로 풀 수 있습니다. 흔한 일은
              아니지만, 그래도 그게 깔려 있는 게 손님한테 안전망입니다.
            </li>
            <li>
              <strong>야간 업소 평판 관리</strong> — 합법 운영을 길게 해온 가게는
              평판 관리가 그 자체로 자산입니다. 그래서 응대 품질·자리 관리·
              일행 응대 같은 데서 차이가 자연스럽게 납니다.
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

      <section
        className="section"
        style={{
          background: "var(--bg-elev)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container">
          <span className="eyebrow">창원이라는 지역성</span>
          <h2>창원 시내 야간 업장, 무엇이 다른가.</h2>
          <p className="lead" style={{ marginTop: 14 }}>
            서울이나 부산 도심처럼 업장이 빽빽한 동네가 아니다 보니, 창원은
            상대적으로 단골 비중이 높고 동선이 짧습니다. 그게 손님 응대에도 영향을 줘요.
            “한 번 와 본 사람”이 다시 오기 쉬운 구조라, 응대 한 번을 가볍게 못 하는 거죠.
          </p>
          <div className="grid grid-3" style={{ marginTop: 28 }}>
            <article className="card">
              <h3>단골 비중이 높습니다</h3>
              <p style={{ marginTop: 10 }}>
                창원 시내에서 일하시는 분, 살고 계신 분이 주말마다 들르는 패턴이
                일반적입니다. 그래서 응대 품질이 곧 다음 방문 여부를 결정해요.
              </p>
            </article>
            <article className="card">
              <h3>동선이 짧습니다</h3>
              <p style={{ marginTop: 10 }}>
                서울처럼 한 시간 넘게 이동하지 않아도 됩니다. 시내 어느 동에서
                출발하시든 차나 택시로 큰 부담 없이 닿는 거리예요.
              </p>
            </article>
            <article className="card">
              <h3>입소문 영향이 큽니다</h3>
              <p style={{ marginTop: 10 }}>
                작은 동네 특성상, 한 손님의 인상이 그대로 입소문으로 갑니다. 가게가
                자리 잡으려면 무리한 상술보다 길게 가는 응대가 답이에요.
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
            궁금한 부분은 담당한테 직접 물어봐 주세요. 한 번에 정확하게 답드립니다.
          </div>
        </div>
      </section>
    </>
  );
}
