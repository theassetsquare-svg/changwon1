import Link from "next/link";
import { NAV, SITE } from "./site";

export default function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <Link href="/" className="brand" aria-label={`${SITE.name} 홈으로`}>
          <span className="brand__mark" aria-hidden>짱</span>
          <span className="brand__name">
            창원 <span>룰루랄라</span> 나이트
          </span>
        </Link>
        <nav className="nav" aria-label="주요 메뉴">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>
        <a className="btn btn--primary header__cta" href={SITE.phoneHref} aria-label={`${SITE.callLabel} 직통 전화 ${SITE.phone}`}>
          📞 {SITE.callLabel} {SITE.phone}
        </a>
      </div>
    </header>
  );
}
