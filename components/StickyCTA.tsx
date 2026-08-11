import { SITE } from "./site";

export default function StickyCTA() {
  return (
    <div className="sticky-cta" role="region" aria-label="전화 문의">
      <a
        className="btn btn--primary"
        href={SITE.phoneHref}
        aria-label={`${SITE.contactName} 전화 ${SITE.phone}`}
      >
        📞 {SITE.contactName} {SITE.phone}
      </a>
    </div>
  );
}
