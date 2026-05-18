import Link from "next/link";
import { NAV, SITE } from "./site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <h4>{SITE.name}</h4>
            <p>
              창원에서 한 통이면 끝. <strong style={{ color: "var(--text)" }}>{SITE.callLabel}</strong>으로 바로 연결.
            </p>
            <p style={{ marginTop: 10 }}>
              <a className="tel" href={SITE.phoneHref} style={{ color: "var(--gold)", fontWeight: 700 }}>
                📞 {SITE.phone}
              </a>
            </p>
          </div>
          <div>
            <h4>둘러보기</h4>
            <ul>
              {NAV.map((n) => (
                <li key={n.href}><Link href={n.href}>{n.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>이용 안내</h4>
            <ul>
              <li>만 {SITE.ageLimit}세 이상 출입</li>
              <li>입장 시 신분증 확인</li>
              <li>합법 영업장 운영</li>
            </ul>
          </div>
        </div>
        <div className="footer__legal">
          <span>© {year} {SITE.name}. All rights reserved.</span>
          <span>경상남도 창원시 · 만 {SITE.ageLimit}세 이상</span>
        </div>
      </div>
    </footer>
  );
}
