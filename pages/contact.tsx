import Link from "next/link";
import SeoHead from "@/components/SeoHead";
import { Jsonld, buildBreadcrumb } from "@/components/Jsonld";
import { SITE } from "@/components/site";

export default function Contact() {
  return (
    <>
      <SeoHead
        title="예약·문의 · 카톡으로 바로 연결 (단체석 포함)"
        description="폼에 길게 적지 마세요. 카카오톡 besta12로 문의하시면 가장 빠릅니다. 시간대별 응답 속도, 6명+ 단체 가이드, 문의 전 챙길 세 가지까지 정리."
        keywords="창원 룰루랄라 예약, 창원 나이트 예약, 창원 나이트 단체 예약"
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
            <span className="accent">카톡</span>입니다.
          </h1>
          <p className="hero__sub">
            폼에 길게 적는 것보다, 카카오톡 besta12로 바로 연락하는 게 빠릅니다.
            인원·시간만 알려주시면 그 자리에서 정리됩니다.
          </p>
          <div className="hero__actions">
            <a
              className="btn btn--primary btn--lg"
              href={SITE.kakaoHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 카톡 besta12 바로 문의
            </a>
            <Link className="btn btn--ghost btn--lg" href="/jjanggu/">담당 보기</Link>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container">
          <div className="grid grid-2">
            <div className="card">
              <span className="eyebrow">카카오톡</span>
              <h2 style={{ fontSize: "1.4rem", marginTop: 6 }}>besta12</h2>
              <p style={{ marginTop: 10 }}>
                카카오톡에서 besta12를 검색하거나 아래 버튼으로 바로 연결됩니다.
                도착 전에도, 이미 근처라도, 한 번이면 정리됩니다.
              </p>
              <p style={{ marginTop: 14 }}>
                <a
                  className="btn btn--primary"
                  href={SITE.kakaoHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  💬 카톡 바로 연결
                </a>
              </p>
            </div>
            <div className="card">
              <span className="eyebrow">문의 내용</span>
              <h2 style={{ fontSize: "1.4rem", marginTop: 6 }}>세 가지면 충분합니다</h2>
              <p style={{ marginTop: 10 }}>
                이름·인원·도착 예정 시간. 이 세 가지만 적어주시면 됩니다.
              </p>
              <p style={{ marginTop: 14 }}>
                <strong>이름 · 인원 · 도착 예정 시간</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">처음 오시는 분께</span>
          <h2>문의가 이렇게 흘러갑니다.</h2>
          <ol className="steps" style={{ marginTop: 28 }}>
            <li>
              <strong>연결</strong>
              카카오톡 besta12로 "룰루랄라 나이트 문의입니다"라고 보내주시면 됩니다.
            </li>
            <li>
              <strong>확인</strong>
              이름·인원·도착 예정 시간 → 자리 상황 보고 잡아 둡니다.
            </li>
            <li>
              <strong>도착·입장</strong>
              입구에서 담당 이름만 말씀하시면 됩니다. 신분증 확인 후 자리로.
            </li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">문의 전에 정리해 두면 좋은 것</span>
          <h2>세 가지면 충분합니다.</h2>
          <p className="lead" style={{ marginTop: 14 }}>
            연락하시기 전에 잠깐 이 세 가지만 머릿속에 두시면, 문의가 빠르게 정리됩니다.
            본인은 즐길 시간 더 챙기시는 거죠.
          </p>
          <ul className="bullets" style={{ marginTop: 22 }}>
            <li>
              <strong>이름과 일행 수</strong> — 본인 이름과 함께 가는 사람 수.
              두 명·네 명·여섯 명 단위 정도면 자리 잡기 좋습니다.
            </li>
            <li>
              <strong>도착 예정 시간</strong> — "10시쯤" 같은 대략적인 시간이면 됩니다.
              정확하면 더 좋고요.
            </li>
            <li>
              <strong>특별한 요청</strong> — 조용한 좌석, 큰 테이블, 처음이라 안내 필요 등
              있으면 그때 말씀하시면 됩니다. 없어도 무방.
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
            솔직히 당일 문의로는 어려운 날이 많아요. 미리 담당한테 잡아
            두시면 그날 저녁이 훨씬 매끄럽게 흘러갑니다.
          </p>
          <ul className="bullets" style={{ marginTop: 22 }}>
            <li>
              <strong>최소 두세 시간 전, 가능하면 하루 전</strong> — 평일이면 두세
              시간 전, 주말·시즌이면 하루 전에 연락 주시는 게 안전합니다.
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
            <li>
              <strong>이동 수단 정보</strong> — 차로 오시는 분이 몇 명인지 같이
              알려주세요. 주차 공간 보는 데 영향을 줍니다.
            </li>
          </ul>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-elev)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <span className="eyebrow">시간대별 문의 가이드</span>
          <h2>언제 문의하는 게 가장 빠르게 받는가.</h2>
          <p className="lead" style={{ marginTop: 14 }}>
            담당이 응대를 보고 있어도, 그날 그 시간 가게 안 상황이 어떻게
            돌아가느냐에 따라 답 속도가 좀 달라집니다. 일반적인 패턴 정리해
            드릴게요. 결국 정답은 "미리 연락 주시는 것"입니다.
          </p>
          <div className="grid grid-3" style={{ marginTop: 28 }}>
            <article className="card">
              <h3>오픈 전 (오후 7시 이전)</h3>
              <p style={{ marginTop: 10 }}>
                응답이 가장 빠른 구간. 예약·문의 둘 다 무리 없이 받습니다. 외지에서
                미리 잡으실 거면 이 타이밍을 추천드려요.
              </p>
            </article>
            <article className="card">
              <h3>오픈~밤 11시</h3>
              <p style={{ marginTop: 10 }}>
                자리 회전이 본격적으로 시작되는 무렵. 빠르게 받지만, 길게
                질문하시면 손님 응대 중에 끊길 수 있어요. 핵심만 짧게.
              </p>
            </article>
            <article className="card">
              <h3>피크 (자정~새벽 2시)</h3>
              <p style={{ marginTop: 10 }}>
                카톡 응답이 가장 느려지는 구간. 가능한 이 무렵 전에 잡아
                두시는 게 좋습니다.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">자주 받는 문의</span>
          <h2>문의 전에 미리 답드릴 수 있는 것들.</h2>
          <ul className="bullets" style={{ marginTop: 22 }}>
            <li>
              <strong>"예약금 입금해야 해요?"</strong> — 일반 좌석은 예약금 없이
              잡아 드립니다. 단체 예약이나 특별한 자리는 그날 상황에 따라 다르니
              담당이 카톡으로 안내합니다.
            </li>
            <li>
              <strong>"노쇼하면 어떻게 되나요?"</strong> — 별다른 페널티는 없지만,
              연락 없이 안 오시면 다음 예약 잡으실 때 자리 우선순위에서 빠질 수
              있어요. 못 가시게 되면 카톡으로만 알려주세요.
            </li>
            <li>
              <strong>"다른 가게랑 같이 코스 짤 수 있나요?"</strong> — 식사 자리
              마치고 늦게 합류하는 일행도 종종 있습니다. 합류 타이밍만 미리
              알려주시면 동선 맞춰 두겠습니다.
            </li>
            <li>
              <strong>"여자 손님끼리도 받아요?"</strong> — 받습니다. 자리 배치만
              그에 맞게 다르게 잡습니다. 미리 일행 구성 말씀해 주시면 매끄럽습니다.
            </li>
            <li>
              <strong>"직접 가서 자리 잡으면 안 돼요?"</strong> — 워크인도 가능합니다.
              다만 피크 무렵엔 자리가 비어 있다는 보장이 없으니, 출발 전에 한 번
              연락 주시는 게 안전해요.
            </li>
            <li>
              <strong>"카드 한도 미리 알려야 하나요?"</strong> — 그럴 필요는 없습니다.
              결제는 마감 때 한 번에 정리되고, 한도 부족하면 그때 다른 카드나
              현금으로 마무리하시면 됩니다.
            </li>
            <li>
              <strong>"출장 손님인데 호텔 가까운지 알고 싶어요"</strong> — 어느
              호텔에 묵고 계신지 말씀해 주시면 거리 감과 이동 추천 방식을 짧게
              알려드립니다. 창원 시내 주요 호텔이면 대부분 가까운 편이에요.
            </li>
          </ul>
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
