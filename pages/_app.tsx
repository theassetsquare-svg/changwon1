import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { Jsonld, buildOrganization, buildWebsite } from "@/components/Jsonld";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Jsonld data={buildOrganization()} />
      <Jsonld data={buildWebsite()} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
