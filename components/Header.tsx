import Link from "next/link";
import { useRouter } from "next/router";
import { NAV } from "./site";
import { saltOf, cssClasses, saltCss, saltTree } from "@/lib/salt";

/** 머리글에 쓰는 사이트 이름 — 지역 안내만 담고 가게이름은 담지 않는다 (설계도 5장 머리글 규칙). */
const CHROME_NAME = "전국 나이트 안내";

/* 2026-09-25 전부10 — 머리글도 쪽마다 소금을 친다(구조 지문 ④). 전역 CSS(styles/globals.css)의 머리글 규칙을
   그대로 옮겨 이 쪽 소금 이름으로 한 번 더 싣는다. 모양은 같고 클래스 이름만 쪽마다 다르다. */
const HEADER_CSS = `
.skip-link{position:absolute;top:-100px;left:12px;z-index:100;background:var(--gold);color:#111;padding:10px 16px;border-radius:8px;font-weight:700;transition:top var(--t);}
.skip-link:focus{top:12px;}
.header{position:sticky;top:0;z-index:30;background:rgba(10,10,10,0.78);backdrop-filter:saturate(160%) blur(14px);-webkit-backdrop-filter:saturate(160%) blur(14px);border-bottom:1px solid var(--border);}
.container{width:100%;max-width:var(--maxw);margin:0 auto;padding:0 20px;}
@media (min-width:720px){.container{padding:0 32px;}}
.header__inner{display:flex;align-items:center;justify-content:space-between;height:60px;gap:12px;}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;letter-spacing:-0.01em;flex-shrink:0;}
.brand__name{font-size:0.95rem;white-space:nowrap;}
@media (max-width:419px){.brand__name{font-size:0.88rem;}}
.nav{display:none;gap:24px;}
.nav a{font-size:0.93rem;color:var(--text-muted);transition:color var(--t-fast);padding:6px 2px;position:relative;}
.nav a:hover{color:var(--gold);}
.nav a::after{content:"";position:absolute;left:0;right:0;bottom:-2px;height:2px;background:var(--gold);transform:scaleX(0);transform-origin:center;transition:transform var(--t);}
.nav a:hover::after{transform:scaleX(1);}
@media (min-width:820px){.nav{display:flex;}}
`;

export default function Header() {
  const r = useRouter();
  const z = { s: saltOf("머리글" + (r?.asPath || "/").split(/[?#]/)[0]), 지역: cssClasses(HEADER_CSS) };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: saltCss(HEADER_CSS, z.s, z.지역) }} />
      {saltTree(
        <>
          <a href="#main" className="skip-link">본문 바로가기</a>
          <header className="header">
            <div className="container header__inner">
              {/* 2026-09-13 머리글 규칙(설계도 5장) — 사이트 머리글에는 특정 가게이름을 두지 않는다. */}
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
        </>,
        z,
      )}
    </>
  );
}
