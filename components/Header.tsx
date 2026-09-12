import Link from "next/link";
import { NAV } from "./site";

/** 머리글에 쓰는 사이트 이름 — 지역 안내만 담고 가게이름은 담지 않는다 (설계도 5장 머리글 규칙). */
const CHROME_NAME = "전국 나이트 안내";

export default function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        {/* 2026-09-13 머리글 규칙(설계도 5장) — 사이트 머리글에는 특정 가게이름을 두지 않는다.
            2026-09-13 실측: j.nolcool.com 78쪽 중 59쪽 머리글이 「창원 룰루랄라 나이트」,
            그중 56쪽은 제목이 다른 가게(안산히트·부천고래·불광동호박·부산아시아드 등)였다.
            이 사이트 쪽은 /access/ 57 · /club/ 13 로 전국 가게 안내다. 그래서 머리글은 지역 안내만 둔다.
            SITE.name 은 그대로 둔다 — 제목·본문·JSON-LD 는 건드리지 않는다. */}
        <Link href="/" className="brand" aria-label={`${CHROME_NAME} 홈으로`}>
          <span className="brand__name">{CHROME_NAME}</span>
        </Link>
        <nav className="nav" aria-label="주요 메뉴">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
