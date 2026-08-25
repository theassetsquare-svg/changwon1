import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import StickyCTA from "./StickyCTA";

type Props = {
  children: React.ReactNode;
  /**
   * 화면 아래 고정 전화바(창원 룰루랄라 · 로또 010-7528-4936)를 붙일지.
   *
   * ★2026-08-25 — 가게 페이지(/access·/night)는 자기 전화바를 스스로 만든다.
   *   광고주 가게면 그 가게 번호, 아니면 "광고문의 카톡 besta12".
   *   그런데 이 바까지 같이 붙어서 **남의 가게 페이지에 로또 번호가 겹쳐 나왔다.**
   *   광고주 규칙: 한 페이지에 두 명 이상 금지 · 남의 번호 누출 금지.
   *   그래서 가게 페이지에서는 false 로 받아 붙이지 않는다.
   */
  sticky?: boolean;
};

export default function Layout({ children, sticky = true }: Props) {
  useEffect(() => {
    if (!sticky) return;
    document.body.classList.add("has-sticky");
    return () => document.body.classList.remove("has-sticky");
  }, [sticky]);
  return (
    <>
      <a href="#main" className="skip-link">본문 바로가기</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      {sticky ? <StickyCTA /> : null}
    </>
  );
}
