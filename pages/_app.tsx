import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { Jsonld, buildLocalBusiness, buildWebsite } from "@/components/Jsonld";
import { BULGWANG } from "@/components/bulgwang";

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  // 불광동호박나이트는 창원 룰루랄라와 다른 지역의 별개 업소다. 그 페이지에
  // 창원 LocalBusiness 정보까지 실리면 검색엔진이 두 업소의 주소·지역을
  // 뒤섞어 읽어서 양쪽 다 손해를 본다. 그래서 그 경로에서만 빼 둔다.
  const isBulgwang = pathname === BULGWANG.path.replace(/\/$/, "");

  // 홈(/)은 헤더·푸터·고정 전화바 없이 글만 나가는 단독 페이지다.
  // 공용 레이아웃과 업소 JSON-LD를 모두 태우지 않는다.
  if (pathname === "/") return <Component {...pageProps} />;

  return (
    <>
      {!isBulgwang && <Jsonld data={buildLocalBusiness()} />}
      <Jsonld data={buildWebsite()} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
