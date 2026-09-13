import { useRouter } from "next/router";
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

  /* 2026-09-13 창원룰루랄라 광고 해지 — 불광동호박 쪽이 아니면 광고 입점 문의 바 */
  if (!onBulgwang) {
    return (
      <div className="sticky-cta" role="region" aria-label="광고 제휴 문의">
        <span className="sticky-cta__label">
          <strong>광고·제휴 입점 문의</strong> 카톡 besta12
        </span>
      </div>
    );
  }
  const label = BULGWANG.name;
  const name = BULGWANG.contactName;
  const phone = BULGWANG.phone;
  const href = BULGWANG.phoneHref;
  const btnText = `📞 ${name} ${phone}`;

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
        {btnText}
      </a>
    </div>
  );
}
