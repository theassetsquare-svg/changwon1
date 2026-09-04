import Head from "next/head";
import { SITE } from "@/components/site";

/**
 * 홈(/) — 독립 성공스토리 단독 페이지.
 *
 * 이 페이지만 헤더·푸터·고정 전화바를 걷어내고 글만 남긴다(레이아웃 분기는 _app.tsx).
 * 본문에서 다른 페이지로 나가는 링크도 두지 않는다. 읽는 사람이 글 한 편을
 * 끝까지 읽는 것 말고 다른 선택지를 만들지 않기 위해서다.
 */

const TITLE = "무너진 자리에서 다시 시작한 사람의 기록";
const DESC =
  "바닥을 친 뒤 다시 올라온 사람의 이야기. 화려한 성공담이 아니라, 무너진 다음 날 아침에 무엇을 했는지에 대한 글입니다. 끝까지 읽고 나면 오늘 달라집니다.";

export default function Home() {
  const url = `${SITE.url}/`;
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="color-scheme" content="dark light" />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large" />
        <meta name="googlebot" content="index,follow,max-snippet:-1,max-image-preview:large" />
        <meta name="naver-bot" content="index,follow" />
        <meta name="yeti" content="index,follow" />
        <link rel="canonical" href={url} />
        <link rel="icon" type="image/png" href="https://j.nolcool.com/favicon-64.png" />
        <link rel="alternate" hrefLang="ko-KR" href={url} />
        <link rel="alternate" hrefLang="x-default" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={url} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: TITLE,
              description: DESC,
              inLanguage: "ko-KR",
              mainEntityOfPage: { "@type": "WebPage", "@id": url },
              publisher: {
                "@type": "Organization",
                name: SITE.name,
                url: `${SITE.url}/`,
              },
            }),
          }}
        />
      </Head>

      <main className="story" id="main">
        <article className="story__body">
          <p className="story__eyebrow">읽는 데 7분</p>
          <h1 className="story__title">
            무너진 자리에서<br />다시 시작한 사람의 기록
          </h1>
          <p className="story__lead">
            이건 화려한 성공담이 아닙니다. 무너진 다음 날 아침에 무엇을 했는지에 대한
            이야기입니다. 지금 바닥에 서 있는 사람이라면, 끝까지 읽어보길 권합니다.
          </p>

          <hr className="story__rule" />

          <h2>1. 무너지는 데는 하루면 충분했다</h2>
          <p>
            간판 불을 끄고 셔터를 내리는 데 걸린 시간은 3분이었습니다. 2년이 3분에
            정리됐습니다. 그는 셔터 앞에 서서 한참을 그러고 있었다고 합니다. 울지도
            않았고, 화도 나지 않았고, 그냥 아무 생각이 안 났다고요.
          </p>
          <p>
            사람들은 실패가 극적일 거라고 생각합니다. 아닙니다. 실패는 조용합니다.
            어느 날 갑자기 무너지는 게 아니라, 3개월쯤 전부터 이미 알고 있는데
            인정하기 싫어서 버티다가, 더는 버틸 돈이 없어지는 날 끝이 납니다.
            그날은 아무 일도 일어나지 않습니다. 그냥 문을 닫습니다.
          </p>
          <p>
            남은 건 통장의 십만 원대 잔액과, 매달 갚아야 할 숫자였습니다.
            서른둘이었습니다.
          </p>

          <blockquote className="story__quote">
            바닥의 진짜 문제는 돈이 없다는 게 아니라,<br />
            내일 아침에 일어날 이유가 없다는 것이다.
          </blockquote>

          <h2>2. 아무도 박수 쳐주지 않는 90일</h2>
          <p>
            그는 다음 날 새벽 다섯 시에 일어났습니다. 할 일이 있어서가 아니었습니다.
            누워 있으면 생각이 자기를 잡아먹을 것 같아서였습니다. 씻고, 옷을 입고,
            갈 데가 없어서 동네를 한 시간 걸었습니다. 그게 전부였습니다.
          </p>
          <p>
            그 한 시간이 90일 동안 이어졌습니다. 걷는 동안 그는 딱 하나만 정했다고
            합니다. <strong>“오늘 내가 통제할 수 있는 일 한 가지만 제대로 하자.”</strong>{" "}
            빚을 갚는 건 오늘 통제할 수 없습니다. 사람들의 시선도 통제할 수 없습니다.
            하지만 다섯 시에 일어나는 건 통제할 수 있습니다. 이력서 한 장 고쳐 쓰는
            것도, 전화 세 통 거는 것도 통제할 수 있습니다.
          </p>
          <p>
            이 시기에 대해 그가 남긴 말이 있습니다. “그때 나는 성공하려고 한 게 아니라,
            나를 미워하지 않으려고 움직였다.” 무너진 사람에게 가장 위험한 건 게으름이
            아니라 자기혐오입니다. 자기혐오는 아무것도 하지 않을 때 자랍니다. 그래서
            의미 없어 보이는 일이라도 매일 하나씩 해내야 합니다. 결과 때문이 아니라,
            자기를 미워할 틈을 주지 않기 위해서.
          </p>

          <h2>3. 다시 올라온 사람들에게서 반복되던 세 장면</h2>
          <p>
            바닥을 치고 다시 올라온 사람들의 이야기를 모아 보면, 이상하리만치 같은
            장면이 반복됩니다. 업종도 나이도 사는 곳도 다른데, 결정적인 순간의 모양은
            거의 똑같습니다.
          </p>
          <ol className="story__list">
            <li>
              <strong>계획을 줄였다.</strong> 무너진 사람은 대개 더 큰 계획을 세웁니다.
              한 방에 되돌리고 싶으니까요. 그런데 실제로 살아난 사람들은 반대로 갔습니다.
              1년 계획을 접고 하루 계획으로 바꿨습니다. 큰 계획은 실패를 견디지 못하지만,
              작은 계획은 오늘 한 번 실패해도 내일 다시 할 수 있습니다.
            </li>
            <li>
              <strong>혼자 있는 시간을 줄였다.</strong> 자존심 때문에 연락을 끊는 게
              보통입니다. 잘 안 됐다는 걸 설명하기 싫으니까요. 그런데 다시 일어선
              사람들은 창피를 무릅쓰고 사람을 만났습니다. 기회는 정보에서 오고, 정보는
              거의 항상 사람 입에서 나옵니다. 방 안에는 아무 정보도 없습니다.
            </li>
            <li>
              <strong>실패를 설명할 수 있게 됐다.</strong> 처음엔 다들 “운이 없었다”고
              합니다. 6개월쯤 지나면 “내가 이걸 몰랐다”로 바뀝니다. 이 전환이 일어난
              사람만 다음 판에서 같은 실수를 반복하지 않았습니다. 실패를 남 탓으로 두면
              배울 게 하나도 남지 않습니다.
            </li>
          </ol>

          <blockquote className="story__quote">
            바닥은 끝이 아니라 바닥이다.<br />
            더 내려갈 곳이 없다는 건, 밟고 설 게 생겼다는 뜻이다.
          </blockquote>

          <h2>4. 잘 되기 시작할 때가 진짜 고비였다</h2>
          <p>
            사람들이 잘 모르는 사실이 하나 있습니다. 두 번째 위기는 안 될 때가 아니라
            될 때 옵니다. 여덟 달쯤 지나 그에게 처음으로 숨통이 트였을 때, 그는 곧바로
            예전 습관으로 돌아갈 뻔했다고 합니다. 다섯 시 기상이 일곱 시가 되고,
            일곱 시가 아홉 시가 되고, 통제할 수 있는 일 한 가지가 어느새 하나도
            남지 않는 식으로요.
          </p>
          <p>
            그를 붙잡은 건 대단한 각오가 아니라 기록이었습니다. 90일 동안 매일 한 줄씩
            적어둔 수첩. 거기엔 잘한 일이 아니라 <em>그날 한 일</em>만 적혀 있었습니다.
            “전화 세 통”, “이력서 수정”, “한 시간 걸음”. 잘 풀리기 시작한 날, 그는 그
            수첩을 다시 펼쳐 봤습니다. 그리고 알았다고 합니다. 지금의 결과를 만든 건
            어떤 결정적인 한 방이 아니라, 저 시시한 줄들의 누적이라는 걸.
          </p>
          <p>
            성과가 나기 시작하면 사람은 과정을 잊습니다. 결과만 기억하고, 결과를 만든
            지루한 반복은 시시해 보이니까요. 그런데 결과를 유지시키는 건 언제나 그
            시시한 반복 쪽입니다.
          </p>

          <h2>5. 성공의 정의가 바뀐 순간</h2>
          <p>
            3년이 지나서 그에게 성공했느냐고 물으면, 그는 애매하게 웃는다고 합니다.
            빚은 다 갚았습니다. 다시 자기 일을 합니다. 예전만큼 크지는 않습니다.
            그런데 본인은 이때가 훨씬 낫다고 말합니다.
          </p>
          <p>
            무너지기 전의 그는 성공을 <strong>숫자</strong>로 정의했습니다. 얼마를 벌었나,
            몇 평인가, 남들이 뭐라고 하나. 그 정의로 살면 숫자가 흔들릴 때마다 사람이
            통째로 흔들립니다. 다시 올라온 뒤 그의 정의는 이렇게 바뀌었습니다.
          </p>
          <blockquote className="story__quote">
            성공은 무너지지 않는 상태가 아니라,<br />
            무너져도 다시 시작할 수 있다는 걸 자기가 아는 상태다.
          </blockquote>
          <p>
            이 정의에는 결정적인 장점이 하나 있습니다. 아무도 빼앗아 갈 수 없다는 것.
            돈은 잃을 수 있고, 자리도 잃을 수 있고, 사람도 떠날 수 있습니다. 그런데
            “나는 바닥에서 한 번 올라와 봤다”는 사실만은 어떤 상황에서도 남습니다.
            한 번 해봤다는 감각은 두 번째를 훨씬 덜 무섭게 만듭니다.
          </p>

          <h2>6. 지금 바닥에 있는 사람에게</h2>
          <p>
            지금 상황이 나쁘다면, 아마 이 글을 읽는 동안에도 머릿속 한쪽에서는 계속
            계산이 돌아가고 있을 겁니다. 다음 달 어떻게 하지, 이 얘기를 누구한테 하지,
            나만 이렇게 뒤처진 건 아닐까. 그 계산은 오늘 밤에 끝나지 않습니다.
            그러니 오늘은 그냥 이거 하나만 하십시오.
          </p>
          <p>
            <strong>내일 아침에 일어날 시간을 정하고, 그 시간에 일어나는 것.</strong>{" "}
            그게 전부입니다. 인생을 바꾸는 계획은 필요 없습니다. 지금 상태에서 세우는
            큰 계획은 대부분 사흘 안에 무너지고, 그 무너짐이 자기혐오를 한 겹 더
            쌓습니다. 그러니 반드시 지킬 수 있을 만큼 작게 자르십시오.
          </p>
          <p>
            그다음엔 오늘 통제할 수 있는 일 하나를 골라 끝내고, 한 줄로 적어두십시오.
            “오늘 한 일: ○○.” 시시해 보여도 상관없습니다. 그 줄이 쌓이면 어느 순간
            증거가 됩니다. 나는 멈춰 있지 않았다는 증거요. 사람은 결심으로 바뀌지 않고
            증거로 바뀝니다.
          </p>
          <p>
            그리고 하나만 더. 지금의 이 시기는 지나갑니다. 좋아져서가 아니라, 원래
            모든 시기는 지나가기 때문입니다. 문제는 그때 당신이 어떤 상태로 서 있느냐입니다.
            매일 한 칸씩 쌓아온 사람과, 멈춰서 기다린 사람은 같은 시기를 통과해도 도착하는
            자리가 다릅니다.
          </p>
          <p>
            바닥에서 보내는 시간은 낭비가 아닙니다. 대부분의 사람은 인생에서 딱 한 번,
            여기서 진짜 자기 자신을 만납니다. 여기서 배운 것은 잘 나갈 때는 절대
            배울 수 없는 것들입니다.
          </p>

          <blockquote className="story__quote story__quote--final">
            오늘 하루를 이겨내면, 내일의 당신은<br />
            어제보다 정확히 하루만큼 강해져 있습니다.<br />
            그 하루가 쌓여서 결국 사람을 바꿉니다.
          </blockquote>

          <p className="story__close">
            지금 이 글을 끝까지 읽었다면, 당신은 이미 멈춰 있는 사람이 아닙니다.
            멈춘 사람은 이런 글을 끝까지 읽지 않습니다.
          </p>

          <p className="story__note">
            ※ 이 글은 특정 인물의 인터뷰나 실제 사례 기록이 아니라, 다시 일어선
            사람들의 이야기에서 공통으로 반복되던 장면을 하나로 엮어 쓴 글입니다.
          </p>
        </article>
      </main>
      {/* area-guide-link */}
      <footer style={{ maxWidth: 760, margin: '0 auto', padding: '26px 20px 40px', borderTop: '1px solid #e5e7eb', fontSize: '.9rem', lineHeight: 1.8, color: '#6b7280' }}>
        <nav aria-label="사이트 안내">
          <a href="/area/newtown-guide/" style={{ color: '#1f5f8b', textDecoration: 'underline' }}>신도시와 구도심</a>
        </nav>
      </footer>
      {/* /area-guide-link */}
      
    </>
  );
}
