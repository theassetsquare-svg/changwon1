import Link from "next/link";
import { SITE } from "./site";

export default function StickyCTA() {
  return (
    <div className="sticky-cta" role="region" aria-label="빠른 연결">
      <a
        className="btn btn--primary"
        href={SITE.phoneHref}
        aria-label={`${SITE.callLabel} 직통 전화 ${SITE.phone}`}
      >
        📞 {SITE.callLabel} {SITE.phone}
      </a>
      <Link
        className="btn btn--ghost"
        href="/contact/"
        aria-label="문의 방법 보기"
      >
        문의
      </Link>
    </div>
  );
}
