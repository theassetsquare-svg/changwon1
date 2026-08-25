import type { GetStaticPaths, GetStaticProps } from "next";
import AccessVenuePage from "@/components/access/AccessVenuePage";
import NightVenuePage from "@/components/night/NightVenuePage";
import {
  ACCESS_KEEP_OLD,
  ACCESS_URL_MAP,
  ACCESS_SLUG_BY_URL,
} from "@/components/access/types";
import {
  ACCESS_VENUES,
  VENUE_BY_SLUG as ACCESS_BY_SLUG,
  type AccessVenue,
} from "@/components/access/venues";
import {
  VENUES as NIGHT_VENUES,
  VENUE_BY_SLUG as NIGHT_BY_SLUG,
  NIGHT_KEEP_OLD,
  NIGHT_URL_MAP,
  NIGHT_SLUG_BY_URL,
  type NightVenue,
} from "@/components/night/venues";

/**
 * ★ 2026-08-26 대표님 확정 — 가게 페이지 주소는 메인주소 바로 뒤에 가게이름.
 *   중간에 /access/ · /night/ 같은 단어를 넣지 않는다.
 *   네이버에 이미 나오는 주소만 옛 경로에 그대로 남는다.
 *
 * 두 종류(안내 페이지 · 나이트 페이지)를 한 라우트가 맡으므로
 * 주소 이름표로 어느 쪽인지 가려낸다.
 *
 * 주의: Next.js 는 고정 라우트(/about, /location …)를 먼저 찾으므로 부딪히지 않는다.
 */

type Props =
  | { kind: "access"; venue: AccessVenue }
  | { kind: "night"; venue: NightVenue };

export default function VenueRoute(props: Props) {
  if (props.kind === "night") return <NightVenuePage venue={props.venue} />;
  return <AccessVenuePage venue={props.venue} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { slug: string } }[] = [];
  for (const v of ACCESS_VENUES) {
    if (ACCESS_KEEP_OLD.has(v.slug)) continue;
    paths.push({ params: { slug: ACCESS_URL_MAP[v.slug] ?? v.slug } });
  }
  for (const v of NIGHT_VENUES) {
    if (NIGHT_KEEP_OLD.has(v.slug)) continue;
    paths.push({ params: { slug: NIGHT_URL_MAP[v.slug] ?? v.slug } });
  }
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const url = String(params?.slug);

  const nightSlug = NIGHT_SLUG_BY_URL[url];
  if (nightSlug && NIGHT_BY_SLUG[nightSlug]) {
    return { props: { kind: "night", venue: NIGHT_BY_SLUG[nightSlug] } };
  }

  const accessSlug = ACCESS_SLUG_BY_URL[url] ?? url;
  const venue = ACCESS_BY_SLUG[accessSlug];
  if (!venue) return { notFound: true };
  return { props: { kind: "access", venue } };
};
