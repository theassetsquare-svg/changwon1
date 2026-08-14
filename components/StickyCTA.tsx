import { useRouter } from "next/router";
import { SITE } from "./site";
import { BULGWANG } from "./bulgwang";

/**
 * 화면 아래에 항상 붙어 있는 전화 바.
 * position: fixed 라서 스크롤해도 따라 움직이지 않고 그 자리에 고정된다.
 * 모바일·PC 모두 같은 자리에 뜬다(미디어쿼리로 숨기지 않는다).
 *
 * 불광동호박나이트 페이지에서는 그 업소 담당 번호로 바뀐다. 페이지에 적힌
 * 업소와 바에 뜨는 번호가 다르면 전화가 엉뚱한 곳으로 간다.
 */
export default function StickyCTA() {
  const { pathname } = useRouter();
  const onBulgwang = pathname === BULGWANG.path.replace(/\/$/, "");

  const label = onBulgwang ? BULGWANG.name : SITE.name;
  const name = onBulgwang ? BULGWANG.contactName : SITE.contactName;
  const phone = onBulgwang ? BULGWANG.phone : SITE.phone;
  const href = onBulgwang ? BULGWANG.phoneHref : SITE.phoneHref;

  return (
    <div className="sticky-cta" role="region" aria-label="전화 문의">
      <span className="sticky-cta__label">
        <strong>{label}</strong> 예약·문의
      </span>
      <a
        className="btn btn--primary"
        href={href}
        aria-label={`${name} 전화 ${phone}`}
      >
        📞 {name} {phone}
      </a>
    </div>
  );
}
