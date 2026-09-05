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

  // ★2026-08-25 — 위 판단은 옳았는데 **불광동 한 곳에만** 적용돼 있었다.
  // /access/[slug] · /night/[slug] 로 나가는 **전국 가게 페이지 52개 전부**가 같은 문제였다.
  // 실측: 부산아시아드·대전세븐·답십리미라클 등 남의 가게 페이지에 창원 룰루랄라의
  // 업소정보와 로또 번호(010-7528-4936)가 그대로 실려 있었다.
  // 네이버가 그 페이지를 창원 룰루랄라 페이지로 오인하면 "가게이름 검색 상위노출"이 깨진다.
  //
  // 가게 페이지는 자기 업소 JSON-LD(telephone 포함)를 스스로 만든다
  // (components/night/NightVenuePage.tsx · components/access/AccessVenuePage.tsx).
  // 그래서 여기서 빼도 창원 룰루랄라 자기 가게 페이지는 자기 번호를 그대로 유지한다.
  // ★2026-08-30 — /club 이 빠져 있었다. /club 가게 페이지 5쪽에 창원 룰루랄라(로또 010-7528-4936)
  //   고정 전화바가 그대로 붙어, 한 페이지에 광고주 번호가 두 개 나왔다(불광동호박·부산아시아드·
  //   청담·대전세븐·울산챔피언 페이지). 화면에서는 CSS 로 가려져 있었지만 HTML 에는 남아 검색엔진은 읽었다.
  //   광고주 규칙: 한 페이지에 두 명 이상 금지 · 남의 번호 누출 금지.
  // ★2026-09-01 — /contacta · /about 을 광고주 페이지로 바꿨는데 이 명단에 없어서
  //   부산아시아드·대전세븐 쪽에 창원 룰루랄라(로또 010-7528-4936) 고정 전화바와
  //   업소 JSON-LD 가 그대로 겹쳐 나왔다. 광고주 규칙: 한 쪽에 두 명 이상 금지.
  // ★2026-09-02 — /location 을 부산아시아드나이트 광고주 쪽으로 바꿨는데 이 명단에 없어서
  //   그 쪽에 창원 룰루랄라(로또 010-7528-4936) 고정 전화바와 업소 JSON-LD 가 겹쳐 나왔다.
  //   실측으로 확인한 뒤 넣었다. 광고주 규칙: 한 쪽에 두 명 이상 금지 · 남의 번호 금지.
  const isVenuePage = /^\/(access|access-2|night|club|contacta|about|location)(\/|$)/.test(pathname);

  /* S4(2026-09-05): /jjanggua/ 는 자기 og 와 같은 image 로 업소 JSON-LD 를 직접 싣는다 — 전역 것만 빼고 레이아웃·고정 바는 그대로 */
  const isJjanggua = /^\/jjanggua(\/|$)/.test(pathname);
  // 홈(/)은 헤더·푸터·고정 전화바 없이 글만 나가는 단독 페이지다.
  // 공용 레이아웃과 업소 JSON-LD를 모두 태우지 않는다.
  if (pathname === "/") return <Component {...pageProps} />;

  return (
    <>
      {!isBulgwang && !isVenuePage && !isJjanggua && <Jsonld data={buildLocalBusiness()} />}
      <Jsonld data={buildWebsite()} />
      <Layout sticky={!isVenuePage}>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
