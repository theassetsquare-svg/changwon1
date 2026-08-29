import type { GetStaticPaths, GetStaticProps } from "next";
import NightVenuePage from "@/components/night/NightVenuePage";
import { VENUES, VENUE_BY_SLUG, NIGHT_URL_MAP, NIGHT_SLUG_BY_URL, type NightVenue } from "@/components/night/venues";

export default function NightVenueRoute({ venue }: { venue: NightVenue }) {
  return <NightVenuePage venue={venue} />;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: VENUES.map((v) => ({ params: { slug: NIGHT_URL_MAP[v.slug] ?? v.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = String(params?.slug);
  return { props: { venue: VENUE_BY_SLUG[NIGHT_SLUG_BY_URL[slug] ?? slug] } };
};
