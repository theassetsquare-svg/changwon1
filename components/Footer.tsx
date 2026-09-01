import Link from "next/link";
import { NAV, SITE } from "./site";
import { BULGWANG } from "./bulgwang";

/* ★ 2026-08-31 — 연령·관계 고지가 없어 신고에 취약했다(점검표 #121 · #122).
   홈은 이 Footer 를 쓰지 않으므로 홈 순수성(홈은 글만)에는 영향이 없다. */
/* ★ 2026-08-31 고침 — 광고 쪽에 "제휴 없음" 을 적으면 사실과 다른 고지가 된다.
   광고(담당자 연락처)를 싣는 쪽인지 받아서 문구를 고른다. */
const 광고고지 = [
  "이 페이지에는 해당 업소 담당자의 광고가 실려 있습니다. 만 19세 이상 성인 대상입니다.",
  "아래 담당자 연락처는 광고로 실린 것입니다. 만 19세 이상만 이용할 수 있습니다.",
  "이 글에는 업소 담당자가 의뢰한 광고가 포함되어 있습니다. 만 19세 이상 대상이며 청소년 출입·고용은 금지입니다.",
  "담당자 연락처 안내는 광고입니다. 만 19세 이상 성인 업소를 다룹니다.",
  "이 쪽의 연락처는 광고로 게재된 것입니다. 만 19세 이상만 출입할 수 있습니다.",
  "업소 담당자의 요청으로 광고를 싣고 있습니다. 성인(만 19세 이상) 대상입니다.",
];
const 비광고고지 = [
  "만 19세 이상 이용 가능한 성인 업소 안내입니다. 업소와 제휴 관계가 없는 정보 페이지입니다.",
  "성인(만 19세 이상)만 이용할 수 있는 곳을 다룹니다. 업소와 광고·제휴 관계가 없습니다.",
  "이 글은 만 19세 이상 성인 대상 업소 안내이며, 업소와 아무런 관계가 없습니다.",
  "만 19세 미만은 출입할 수 없습니다. 공개 자료만 정리한 제3자 안내 페이지입니다.",
  "성인 전용 업소를 다루는 안내입니다. 업소로부터 대가를 받지 않았습니다.",
  "만 19세 이상만 들어갈 수 있는 곳입니다. 업소와 제휴하지 않은 정보 페이지입니다.",
  "성인 대상 업소 안내이며 청소년 출입·고용은 금지입니다. 공개 자료 기준입니다.",
  "만 19세 이상 성인만 이용하는 업소를 안내합니다. 업소의 공식 채널이 아닙니다.",
];
function 고지고르기(씨: unknown, 광고쪽?: boolean) {
  const 곳간 = 광고쪽 ? 광고고지 : 비광고고지;
  const s = String(씨 ?? "");
  let n = 0;
  for (let k = 0; k < s.length; k++) n = (n * 131 + s.charCodeAt(k)) % 1000003;
  return 곳간[n % 곳간.length];
}


export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <h3>{SITE.name}</h3>
            <p>창원시 · 합법 영업장 · 만 {SITE.ageLimit}세 이상</p>
          </div>
          <div>
            <h3>둘러보기</h3>
            <ul>
              {NAV.map((n) => (
                <li key={n.href}><Link href={n.href}>{n.label}</Link></li>
              ))}
              {/* 다른 지역 업소 안내. 상단 메뉴가 아니라 푸터에 두어
                  창원 관련 내부 링크 흐름을 흐리지 않게 한다. */}
              <li>
                <Link href={BULGWANG.path}>{BULGWANG.name}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>이용 안내</h3>
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
          <p style={{ margin: "10px 0 0", fontSize: 13, lineHeight: 1.7, color: "#9aa0a6" }}>{고지고르기(SITE.url, true)}</p>
</footer>
  );
}
