import type { GetStaticPaths, GetStaticProps } from "next";
import NightVenuePage from "@/components/night/NightVenuePage";
import { VENUES, VENUE_BY_SLUG, type NightVenue } from "@/components/night/venues";

export default function NightVenueRoute({ venue }: { venue: NightVenue }) {
  return <NightVenuePage venue={venue} />;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: VENUES.map((v) => ({ params: { slug: v.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = String(params?.slug);
  return { props: { venue: VENUE_BY_SLUG[slug] } };
};
