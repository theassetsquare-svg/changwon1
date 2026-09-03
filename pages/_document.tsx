import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko-KR">
      <Head>
        {/* ★ 2026-08-31 — 파비콘 선언이 없어 검색 결과에 아이콘이 안 떴다(체크리스트 #58) */}
        <link rel="icon" href="https://j.nolcool.com/favicon.svg" sizes="any" />
        <meta charSet="utf-8" />
        <meta name="google-site-verification" content="HJjm7MRxykCQ7d_9L7glaTeeaWrmJIzAKY0BcNcfm88" />
        {/* ★ 네이버 소유확인 — 새 도메인(j.nolcool.com) 속성용 (2026-08-24 발급).
            같은 name 태그가 여러 개면 수집기가 앞의 것만 읽는다는 것이 이 저장소에
            기록돼 있어, 지금 확인해야 하는 새 도메인 코드를 맨 앞에 둔다. */}
        <meta name="naver-site-verification" content="37a9c1c484d8c7817822825b05e6dc3ac922b008" />
        {/* 옛 속성(changwond.pages.dev)용 (2026-08-18 발급) — 지우지 않고 뒤에 남겨 둔다. */}
        <meta name="naver-site-verification" content="a3ca4e218741434bb46e5b45581cfa69b4be7d9b" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        {/* 정적(static) 배포판은 굵기 1개당 약 800KB 원본을 통째로 받아 LCP를 망가뜨린다.
            가변(variable) + 동적 서브셋은 화면에 실제 쓰인 글자 구간만 30KB 단위로 받아온다. */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
