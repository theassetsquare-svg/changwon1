import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko-KR">
      <Head>
        <meta charSet="utf-8" />
        <meta name="google-site-verification" content="HJjm7MRxykCQ7d_9L7glaTeeaWrmJIzAKY0BcNcfm88" />
        <meta name="naver-site-verification" content="9b698bc377df6a03e1756b895ae445fc19cdeb41" />
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
