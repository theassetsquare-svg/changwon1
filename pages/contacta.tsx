import type { GetStaticProps } from "next";
import Head from "next/head";
import AccessVenuePage from "@/components/access/AccessVenuePage";
import { VENUE_BY_SLUG, type AccessVenue } from "@/components/access/venues";
import { SITE } from "@/components/site";
import { 변형쪽들 } from "@/lib/variant-pages";

/**
 * ★★ 2026-09-01 대표님 지시로 바꾼 쪽 — 부산아시아드나이트 광고주 페이지.
 *
 *  이 주소(/contacta)는 **주소를 그대로 두고** 안에 든 내용만 광고주 쪽으로 바꿨다.
 *  (색인된 주소는 자산이라 버리지 않는다 · 리디렉션도 걸지 않는다)
 *
 *  ★ canonical·og:url 은 반드시 이 주소여야 한다.
 *    기본값(/access/…)으로 두면 네이버가 이 쪽을 그쪽의 사본으로 보고 밀어낸다.
 *    그래서 <Head> 로 뒤에 덮어쓴다(뒤에 온 것이 이긴다).
 *  ★ AccessVenuePage 가 광고주 신원(이름·닉네임·번호·고정 전화바·관계 고지·JSON-LD)을
 *    쪽 단위로 넣어 준다. 남의 번호가 새지 않는다.
 */
const VENUE_SLUG = "busan-asiad-1";
const 이주소 = "/contacta/";

export const getStaticProps: GetStaticProps<{ venue: AccessVenue }> = async () => ({
  props: { venue: VENUE_BY_SLUG[VENUE_SLUG] },
});

export default function ContactaAdPage({ venue }: { venue: AccessVenue }) {
  const url = `${SITE.url}${이주소}`;
  return (
    <>
      <AccessVenuePage venue={venue} 변형={변형쪽들["/contacta"]} />
      <Head>
        <link key="canonical" rel="canonical" href={url} />
        <meta key="og:url" property="og:url" content={url} />
      </Head>
    </>
  );
}
