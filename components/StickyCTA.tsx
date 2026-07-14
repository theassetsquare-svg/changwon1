import Link from "next/link";
import { SITE } from "./site";

export default function StickyCTA() {
  return (
    <div className="sticky-cta" role="region" aria-label="광고 문의">
      <a
        className="btn btn--primary"
        href={SITE.kakaoHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="광고 문의 카카오톡 besta12"
      >
        💬 광고문의 카톡 besta12
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
