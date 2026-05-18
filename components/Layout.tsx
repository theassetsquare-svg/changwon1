import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import StickyCTA from "./StickyCTA";

type Props = { children: React.ReactNode };

export default function Layout({ children }: Props) {
  useEffect(() => {
    document.body.classList.add("has-sticky");
    return () => document.body.classList.remove("has-sticky");
  }, []);
  return (
    <>
      <a href="#main" className="skip-link">본문 바로가기</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <StickyCTA />
    </>
  );
}
