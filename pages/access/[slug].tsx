import type { GetStaticPaths, GetStaticProps } from "next";
import AccessVenuePage from "@/components/access/AccessVenuePage";
import { ACCESS_VENUES, VENUE_BY_SLUG, type AccessVenue } from "@/components/access/venues";

export default function AccessVenueRoute({ venue }: { venue: AccessVenue }) {
  return <AccessVenuePage venue={venue} />;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: ACCESS_VENUES.map((v) => ({ params: { slug: v.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = String(params?.slug);
  return { props: { venue: VENUE_BY_SLUG[slug] } };
};
