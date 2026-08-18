import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko-KR">
      <Head>
        <meta charSet="utf-8" />
        <meta name="google-site-verification" content="HJjm7MRxykCQ7d_9L7glaTeeaWrmJIzAKY0BcNcfm88" />
        {/* 네이버 서치어드바이저 소유확인 — changwond.pages.dev 속성용 (2026-08-18 발급).
            같은 name 태그를 두 개 두면 수집기가 앞의 것만 읽으므로 옛 changwon1 속성 코드는 지웠다. */}
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
