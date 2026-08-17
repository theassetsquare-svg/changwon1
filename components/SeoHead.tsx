import Head from "next/head";
import { SITE } from "./site";

type Props = {
  title: string;
  description: string;
  path?: string;
  /** 1:1 정사각 썸네일 — 네이버 검색 썸네일 기준 이미지 */
  ogSquare?: string;
  /** 썸네일 대체 텍스트. 가게 이름 + 페이지 주제로 쓴다. */
  ogAlt?: string;
  /**
   * 이 페이지가 대표하는 업소 이름. 다른 지역 업소를 소개하는 페이지에서
   * 창원 브랜드가 제목·썸네일에 섞여 들어가지 않도록 갈아끼운다.
   */
  brand?: string;
  /** 지역 메타. 다른 지역 업소 페이지에서는 그 지역 값으로 갈아끼운다. */
  geo?: { region: string; place: string; position?: string };
  noindex?: boolean;
};

export default function SeoHead({
  title,
  description,
  path = "/",
  ogSquare = "/og-default.png",
  ogAlt,
  brand = SITE.name,
  geo = { region: "KR-48", place: "창원시", position: "35.2280;128.6817" },
  noindex = false,
}: Props) {
  const url = `${SITE.url}${path}`;
  // 제목에 이미 상호가 들어갔는지 볼 때 띄어쓰기는 무시한다.
  // "창원룰루랄라나이트"(검색어 표기)로 시작하는 제목 뒤에
  // "| 창원 룰루랄라 나이트"가 또 붙어 길어지는 걸 막는다.
  const squash = (s: string) => s.replace(/\s+/g, "");
  const fullTitle = squash(title).includes(squash(brand)) ? title : `${title} | ${brand}`;
  // 썸네일 alt 는 언제나 가게 이름으로 시작한다. 따로 안 넘기면 제목을 그대로 쓴다.
  const alt = ogAlt ?? (squash(fullTitle).includes(squash(brand)) ? fullTitle : `${brand} ${fullTitle}`);
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
      <meta name="theme-color" content="#FCD34D" media="(prefers-color-scheme: light)" />
      <meta name="color-scheme" content="dark light" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="author" content={brand} />
      <meta name="publisher" content={brand} />
      <meta name="geo.region" content={geo.region} />
      <meta name="geo.placename" content={geo.place} />
      {geo.position && (
        <>
          <meta name="geo.position" content={geo.position} />
          <meta name="ICBM" content={geo.position.replace(";", ", ")} />
        </>
      )}
      {/* rating=adult / age 메타는 세이프서치·성인 필터에 걸려 일반 검색 노출을 막으므로 두지 않는다.
          만 27세 이상 출입 기준은 본문과 JSON-LD(suggestedMinAge)로만 알린다. */}
      {noindex &&<meta name="robots" content="noindex,nofollow" />}
      {!noindex && (
        <>
          <meta
            name="robots"
            content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"
          />
          <meta
            name="googlebot"
            content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"
          />
          <meta name="naver-bot" content="index,follow" />
          <meta name="yeti" content="index,follow" />
        </>
      )}

      <link rel="canonical" href={url} />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="alternate icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
      <link rel="mask-icon" href="/favicon.svg" color="#FCD34D" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="alternate" hrefLang="ko-KR" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ko_KR" />
      <meta property="og:site_name" content={brand} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {/* 1:1 정사각 한 장만 내보낸다. 와이드(1200×630)를 두 번째 og:image 로 같이 걸면
          수집기마다 다른 장을 골라 가서 검색 썸네일이 정사각으로 고정되지 않는다. */}
      <meta property="og:image" content={`${SITE.url}${ogSquare}`} />
      <meta property="og:image:secure_url" content={`${SITE.url}${ogSquare}`} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="1200" />
      <meta property="og:image:alt" content={alt} />
      <link rel="image_src" href={`${SITE.url}${ogSquare}`} />
      {/* 네이버 수집기가 따로 보는 썸네일 지정 메타 */}
      <meta name="thumbnail" content={`${SITE.url}${ogSquare}`} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE.url}${ogSquare}`} />
      <meta name="twitter:image:alt" content={alt} />
    </Head>
  );
}
