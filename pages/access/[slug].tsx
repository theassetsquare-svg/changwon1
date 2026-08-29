import type { GetStaticPaths, GetStaticProps } from "next";
import AccessVenuePage from "@/components/access/AccessVenuePage";
import { ACCESS_URL_MAP, ACCESS_SLUG_BY_URL } from "@/components/access/types";
import { ACCESS_VENUES, VENUE_BY_SLUG, type AccessVenue } from "@/components/access/venues";

export default function AccessVenueRoute({ venue }: { venue: AccessVenue }) {
  return <AccessVenuePage venue={venue} />;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: ACCESS_VENUES.map((v) => ({ params: { slug: ACCESS_URL_MAP[v.slug] ?? v.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = String(params?.slug);
  return { props: { venue: VENUE_BY_SLUG[ACCESS_SLUG_BY_URL[slug] ?? slug] } };
};
