import type { GetStaticPaths, GetStaticProps } from "next";
import NightVenuePage from "@/components/night/NightVenuePage";
import { VENUES, VENUE_BY_SLUG, NIGHT_KEEP_OLD, type NightVenue } from "@/components/night/venues";

export default function NightVenueRoute({ venue }: { venue: NightVenue }) {
  return <NightVenuePage venue={venue} />;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: VENUES.filter((v) => NIGHT_KEEP_OLD.has(v.slug)).map((v) => ({ params: { slug: v.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = String(params?.slug);
  return { props: { venue: VENUE_BY_SLUG[slug] } };
};
