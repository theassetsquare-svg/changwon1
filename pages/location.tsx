import type { GetStaticProps } from "next";
import AccessVenuePage from "@/components/access/AccessVenuePage";
import { VENUE_BY_SLUG, type AccessVenue } from "@/components/access/venues";
import { 변형쪽들 } from "@/lib/variant-pages";

/**
 * ★★ 2026-09-02 대표님 지시로 바꾼 쪽 — 부산아시아드나이트 광고주 페이지.
 *
 *  주소(/location/)는 **그대로 두고** 안에 든 내용만 바꿨다.
 *  이 주소는 네이버에 색인돼 있다. 색인된 주소는 자산이라 버리지 않고,
 *  301 리디렉션도 걸지 않는다.
 *
 *  ★ 이주소 를 넘기므로 canonical·og:url·구조화 데이터가 전부 이 주소가 된다.
 *    기본값(/access/…)으로 두면 네이버가 이 쪽을 그쪽의 사본으로 보고 밀어낸다.
 *  ★ 설명문도 이 쪽만의 것을 넘긴다 — 같은 설명문을 나눠 쓰면 그것만으로 색인이 막힌다.
 *  ★ 같은 사이트의 /contacta/ 도 부산아시아드나이트 쪽이다. 각도(귀가 ↔ 문의)와 문체를
 *    다르게 뽑아 두 쪽의 글이 겹치지 않게 했다.
 *  ★ AccessVenuePage 가 광고주 신원(이름·닉네임·번호·고정 전화바·관계 고지·JSON-LD)을
 *    쪽 단위로 넣어 준다. 남의 번호가 새지 않는다.
 */
const VENUE_SLUG = "busan-asiad-1";
const 이주소 = "/location/";
const 변형 = 변형쪽들["/location"];

export const getStaticProps: GetStaticProps<{ venue: AccessVenue }> = async () => ({
  props: { venue: VENUE_BY_SLUG[VENUE_SLUG] },
});

export default function LocationAdPage({ venue }: { venue: AccessVenue }) {
  return (
    <AccessVenuePage
      venue={venue}
      변형={변형}
      이주소={이주소}
      설명={변형.description}
    />
  );
}
