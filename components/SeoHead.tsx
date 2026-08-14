import Head from "next/head";
import { SITE } from "./site";

type Props = {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noindex?: boolean;
};

export default function SeoHead({
  title,
  description,
  path = "/",
  ogImage = "/og-cover.png",
  noindex = false,
}: Props) {
  const url = `${SITE.url}${path}`;
  const fullTitle = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
      <meta name="theme-color" content="#FCD34D" media="(prefers-color-scheme: light)" />
      <meta name="color-scheme" content="dark light" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="author" content={SITE.name} />
      <meta name="publisher" content={SITE.name} />
      <meta name="geo.region" content="KR-48" />
      <meta name="geo.placename" content="창원시" />
      <meta name="geo.position" content="35.2280;128.6817" />
      <meta name="ICBM" content="35.2280, 128.6817" />
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
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {/* 1:1 정사각 — 네이버 검색 썸네일 기준 이미지 */}
      <meta property="og:image" content={`${SITE.url}/og-default.png`} />
      <meta property="og:image:secure_url" content={`${SITE.url}/og-default.png`} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="1200" />
      <meta
        property="og:image:alt"
        content={`${SITE.name} · ${SITE.contactName} ${SITE.phone} · 만 ${SITE.ageLimit}세 이상`}
      />
      {/* 와이드 보조 이미지 (링크 미리보기 표준 1200×630) */}
      <meta property="og:image" content={`${SITE.url}${ogImage}`} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <link rel="image_src" href={`${SITE.url}/og-default.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE.url}${ogImage}`} />
      <meta name="twitter:image:alt" content={`${SITE.name} · 창원시 합법 영업장`} />
    </Head>
  );
}
