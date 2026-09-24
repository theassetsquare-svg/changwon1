import { useThumb } from "@/lib/thumb";
import { useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { SITE } from "../site";
import PageThumb from "../PageThumb";
import { ACCESS_BASE, ACCESS_VENUE_BASE, accessVenuePath, type AccessVenue } from "./types";
import { ACCESS_VENUES } from "./venues";
import { VENUE_BY_SLUG } from "./venues";
import GuideExtra from '@/components/GuideExtra';
import { 장부찾기 } from "@/lib/ledger";
import { saltOf, cssClasses, saltTree, SaltContext } from "@/lib/salt";
import { 이름줄이개, 번호줄이개, 도로꼴고치개 } from "@/lib/namecap";
import { 마디고르기 } from "@/lib/pagelen";
import { 덧마디들 } from "./extra";
import type { Fact } from "./types";

 /* ★ 2026-08-31 — 이 한 줄이 한 사이트 수십 쪽에 똑같이 박혀 있었다(설계도 5장).
   쪽마다 다른 앞말을 고른다. 카카오톡 아이디는 사실이라 그대로 둔다. */
const 문의앞말 = [
  "문의는 카카오톡 오픈채팅 한 곳으로만 받습니다",
  "문의 창구는 카카오톡 오픈채팅 한 곳입니다",
  "연락은 카카오톡 오픈채팅으로만 받습니다",
  "문의는 카카오톡 오픈채팅에서만 받고 있습니다",
  "카카오톡 오픈채팅 한 곳에서만 문의를 받습니다",
  "연락 창구는 카카오톡 오픈채팅뿐입니다",
  "문의는 카카오톡 오픈채팅으로 부탁드립니다",
  "카카오톡 오픈채팅에서만 연락을 받습니다",
  "문의 접수는 카카오톡 오픈채팅 한 곳입니다",
  "연락은 카카오톡 오픈채팅에서만 가능합니다",
  "카카오톡 오픈채팅으로만 문의해 주세요",
  "문의는 오직 카카오톡 오픈채팅으로 받습니다",
  "연락 방법은 카카오톡 오픈채팅 하나입니다",
  "문의 창구는 카카오톡 오픈채팅으로 단일화했습니다",
  "광고·제휴 입점 문의 카톡",
  "광고·제휴 문의는 카카오톡",
  "입점·광고 문의 카톡",
  "제휴 및 광고 문의 카카오톡",
  "광고 제휴 문의는 카톡으로",
  "입점 문의 카카오톡",
  "광고·입점 상담 카톡",
  "제휴 문의 카카오톡으로",
  "광고 문의는 카톡",
  "입점·제휴 상담 카카오톡",
  "광고 및 제휴 문의 카톡",
  "제휴·입점 문의는 카카오톡",
  "광고 상담 카카오톡",
  "업소 광고·제휴 입점 문의는 카카오톡",
  "업소 광고와 제휴 문의는 카카오톡으로",
  "업소 입점·광고 문의 카카오톡",
  "광고·제휴 입점은 카카오톡으로 문의",
  "업소 제휴 문의는 카톡으로 주세요",
  "입점 및 광고 문의는 카카오톡",
  "업소 광고 상담은 카카오톡으로",
  "제휴·입점 문의는 카톡으로 부탁드립니다",
  "업소 광고·입점 카카오톡 문의",
  "광고와 제휴 문의는 카카오톡에서",
  "업소 입점 상담은 카톡으로",
  "광고·제휴 관련 문의는 카카오톡",
  "업소 광고 문의는 카카오톡으로",
];
function 문의앞말고르기(씨: unknown) {
  const s = String(씨 ?? "");
  let n = 0;
  for (let k = 0; k < s.length; k++) n = (n * 131 + s.charCodeAt(k)) % 1000003;
  return 문의앞말[n % 문의앞말.length];
}


const 연령문구 = [
  "만 19세 이상 이용 가능한 성인 업소 안내입니다. 청소년 출입·고용은 금지되어 있습니다.",
  "성인(만 19세 이상)만 이용할 수 있는 곳을 다룹니다. 청소년은 출입·고용이 금지됩니다.",
  "이 글은 만 19세 이상 성인 대상 업소를 안내합니다. 청소년 출입과 고용은 금지입니다.",
  "만 19세 미만은 출입할 수 없는 성인 업소 안내입니다. 청소년 고용도 금지되어 있습니다.",
  "성인 전용 업소를 다루는 안내 글입니다. 만 19세 미만 출입·고용은 금지됩니다.",
  "만 19세 이상만 들어갈 수 있는 곳입니다. 청소년 출입·고용은 법으로 금지되어 있습니다.",
  "이 안내는 성인(만 19세 이상)을 대상으로 합니다. 청소년 출입·고용 금지 업소입니다.",
  "만 19세 이상 성인만 이용하는 업소입니다. 청소년의 출입과 고용은 허용되지 않습니다.",
  "성인 대상 업소 안내입니다. 만 19세 미만의 출입·고용은 금지되어 있습니다.",
  "만 19세 이상 손님만 받는 곳을 안내합니다. 청소년 출입·고용은 금지 사항입니다.",
  "이 페이지가 다루는 곳은 만 19세 이상 성인 업소입니다. 청소년은 출입·고용이 금지됩니다.",
  "성인 업소 안내 글입니다. 만 19세 미만은 출입할 수 없고 고용도 금지되어 있습니다.",
];
/** 쪽마다 다른 문구를 고른다 — 같은 줄을 수십 쪽에 박으면 유사문서로 잡힌다 */
function 연령고지(씨: string) {
  const s = String(씨 || "");
  let n = 0;
  for (let k = 0; k < s.length; k++) n = (n * 131 + s.charCodeAt(k)) % 1000003;
  return 연령문구[n % 연령문구.length];
}

/**
 * /access/{slug}/ — 업소별 "가는 길·귀가" 페이지.
 *
 * 색은 포레스트 그린 + 웜 그레이. 지도 라인 그래픽(점선 경로 + 노드 3개)과
 * 1-2-3 스텝 UI로 이동 순서를 그대로 보여 준다.
 *
 * 고정 전화바(.callbar)는 /night/ 와 같은 방식으로 붙인다. position:fixed 만 쓰고
 * 마운트 직후 <body> 직계 자식으로 옮겨 조상 transform 의 영향을 받지 않게 한다.
 */

export const ACCESS_CSS = `
:root{
  --acc-green:#1B4332;
  --acc-green-2:#2D6A4F;
  --acc-green-3:#40916C;
  --acc-leaf:#74C69D;
  --acc-warm:#EDE8E0;
  --acc-warm-2:#C9C2B6;
  --acc-warm-3:#8D877C;
  --acc-ink:#12100E;
  --acc-panel:#171A18;
  --acc-panel-2:#1F2421;
  --acc-line:#333B36;
}
.acc-wrap{max-width:840px;margin:0 auto;padding:0 20px;color:var(--acc-warm);}
.acc-crumb{font-size:.88rem;color:var(--acc-warm-3);margin:22px 0 12px;}
.acc-crumb a{color:var(--acc-warm-3);}
.acc-crumb a:hover{color:var(--acc-leaf);}
.acc-wrap h1{font-size:1.95rem;line-height:1.34;margin:0 0 10px;letter-spacing:-.02em;color:#fff;}
.acc-tagline{display:inline-flex;align-items:center;gap:7px;background:var(--acc-green);
  color:var(--acc-leaf);font-weight:800;font-size:.82rem;letter-spacing:-.01em;
  padding:5px 12px;border-radius:999px;margin:0 0 14px;}
.acc-intro p{margin:0 0 14px;color:var(--acc-warm-2);line-height:1.85;}

/* 지도 라인 그래픽 + 1-2-3 스텝 */
.acc-route{background:var(--acc-panel);border:1px solid var(--acc-line);border-radius:14px;
  padding:18px 18px 6px;margin:22px 0 26px;}
.acc-route h2{font-size:.95rem;margin:0 0 12px;color:var(--acc-leaf);letter-spacing:.02em;}
.acc-map{width:100%;height:56px;display:block;margin:0 0 2px;}
.acc-steps{list-style:none;margin:0;padding:0;display:grid;gap:12px;
  grid-template-columns:repeat(3,1fr);}
.acc-steps li{padding:0 0 16px;}
.acc-steps .n{display:inline-flex;align-items:center;justify-content:center;
  width:22px;height:22px;border-radius:999px;background:var(--acc-green-2);color:#fff;
  font-size:.78rem;font-weight:800;margin-bottom:6px;}
.acc-steps .lb{display:block;font-weight:800;font-size:.95rem;color:#fff;margin-bottom:3px;}
.acc-steps .dt{display:block;font-size:.86rem;color:var(--acc-warm-3);line-height:1.6;}
@media(max-width:560px){
  .acc-steps{grid-template-columns:1fr;gap:4px;}
  .acc-steps li{padding-bottom:10px;}
  .acc-map{height:44px;}
}

/* 핵심 3줄 직답 */
.acc-answer{background:var(--acc-panel-2);border:1px solid var(--acc-line);
  border-left:5px solid var(--acc-green-3);border-radius:12px;padding:16px 18px;margin:0 0 26px;}
.acc-answer h2{font-size:.95rem;margin:0 0 10px;color:var(--acc-leaf);}
.acc-answer ul{margin:0;padding-left:18px;}
.acc-answer li{margin:6px 0;line-height:1.75;color:var(--acc-warm);}

/* 본문 대표 그림 — 미리보기 표와 같은 파일 */
.acc-wrap>img{display:block;border-radius:12px;margin:0 0 26px;}

/* 사실 표 */
.acc-facts{margin:0 0 28px;}
.acc-facts table{width:100%;border-collapse:collapse;border:1px solid var(--acc-line);border-radius:12px;}
.acc-facts caption{text-align:left;font-size:.85rem;color:var(--acc-warm-3);padding:0 0 8px;}
.acc-facts th{text-align:left;font-size:.88rem;color:var(--acc-warm-3);font-weight:600;
  padding:11px 14px;width:36%;border-bottom:1px solid var(--acc-line);vertical-align:top;}
.acc-facts td{padding:11px 14px;font-weight:700;border-bottom:1px solid var(--acc-line);
  color:var(--acc-warm);vertical-align:top;}
.acc-facts tr:last-child th,.acc-facts tr:last-child td{border-bottom:0;}

.acc-wrap h2{font-size:1.28rem;line-height:1.45;margin:34px 0 10px;color:#fff;letter-spacing:-.02em;}
.acc-wrap section p{margin:0 0 14px;color:var(--acc-warm-2);line-height:1.85;}
.acc-final{border-left:5px solid var(--acc-green-3);padding-left:16px;margin-top:36px;}
.acc-final h2{margin-top:0;}

.acc-faq{margin-top:36px;}
.acc-faq h2{margin-bottom:14px;}
.acc-faq dt{font-weight:800;color:#fff;margin:16px 0 6px;}
.acc-faq dd{margin:0;color:var(--acc-warm-2);line-height:1.8;}
.acc-close{margin-top:30px;}
.acc-checked{font-size:.9rem;line-height:1.7;}
.acc-close h2{margin-bottom:8px;}
.acc-sum{background:var(--acc-green);border:1px solid var(--acc-green-2);border-radius:12px;
  padding:16px 18px;margin:30px 0 0;color:#EAF4EE;font-weight:700;line-height:1.75;}
.acc-src{margin:22px 0 0;font-size:.84rem;color:var(--acc-warm-3);line-height:1.7;}
.acc-src strong{display:block;color:var(--acc-warm-2);font-size:.86rem;margin-bottom:5px;}
.acc-src li{margin:3px 0;}

.acc-related{border-top:1px solid var(--acc-line);margin-top:36px;padding-top:22px;}
.acc-related h2{font-size:1.08rem;margin-top:0;}
.acc-related ul{margin:0;padding-left:18px;}
.acc-related li{margin:7px 0;color:var(--acc-warm-3);}
.acc-related a{color:var(--acc-leaf);font-weight:700;}

.acc-footer{max-width:840px;margin:0 auto;padding:0 20px;}
.acc-ad{background:var(--acc-green-2);color:#fff;font-weight:800;font-size:17px;
  padding:16px;text-align:center;border-radius:12px;margin:26px auto;max-width:740px;}
.acc-note{color:var(--acc-warm-3);font-size:.86rem;text-align:center;margin:0 0 44px;line-height:1.7;}

.callbar{
  position:fixed; left:0; right:0; bottom:0; z-index:99999;
  display:flex; align-items:center; justify-content:center; gap:12px;
  height:64px; box-sizing:content-box;
  padding-bottom:env(safe-area-inset-bottom,0px);
  background:#12241C; color:#fff; font-weight:800; font-size:18px;
  box-shadow:0 -2px 14px rgba(0,0,0,.4);
  transform:translateZ(0); backface-visibility:hidden;
}
.callbar a{color:#fff;text-decoration:none;display:flex;align-items:center;height:100%;}
.callbar b{color:#74C69D;}
body{ padding-bottom:calc(84px + env(safe-area-inset-bottom,0px)); }
body.has-sticky{ padding-bottom:calc(84px + env(safe-area-inset-bottom,0px)); }
#__next{ padding-bottom:0; }
@media(max-width:480px){
  .callbar{height:60px;font-size:16px;}
  body{ padding-bottom:calc(80px + env(safe-area-inset-bottom,0px)); }
  body.has-sticky{ padding-bottom:calc(80px + env(safe-area-inset-bottom,0px)); }
}
/* 사이트 공통 전화바와 겹치지 않게 한 개만 남긴다. */
.sticky-cta{display:none !important;}
`;

/** 출발 → 기준점 → 업소 세 노드를 잇는 점선 경로. 장식용 지도 라인. */
export function RouteLine() {
  return (
    <svg className="acc-map" viewBox="0 0 600 56" role="img" aria-label="출발지에서 업소까지 이어지는 경로 그래픽">
      <path
        d="M20 40 L150 40 Q190 40 210 24 L330 24 Q370 24 392 40 L580 40"
        fill="none"
        stroke="#2D6A4F"
        strokeWidth="3"
        strokeDasharray="9 7"
        strokeLinecap="round"
      />
      <circle cx="20" cy="40" r="7" fill="#40916C" />
      <circle cx="300" cy="24" r="7" fill="#40916C" />
      <circle cx="580" cy="40" r="9" fill="#74C69D" />
    </svg>
  );
}

function Ld({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** 쪽별 변형 글 — 같은 가게라도 쪽마다 다른 글을 쓴다 (2026-09-01) */
export type 변형쪽 = {
  title?: string;
  lead?: string[];
  sections?: { h2: string; body: string[] }[];
  faq?: { q: string; a: string }[];
  summary?: string[];
  closing?: { h2: string; body: string[] };
};

/* 2026-09-25 전부10 — 여러 쪽에 똑같이 붙는 교통 출처 줄(3쪽 이상)은 싣지 않는다 — 같은 문장이 쪽마다 반복되면 서로 닮은 쪽이 된다(측정 ③) */
const 흔한출처 = (() => { const c = new Map<string, number>(); for (const v of ACCESS_VENUES) for (const s of v.sources) c.set(s, (c.get(s) || 0) + 1); return new Set([...c].filter(([, n]) => n >= 3).map(([s]) => s)); })();
/* 2026-09-25 전부10 — 사실 표 줄 정리: 장부(data/shops verified)에 있는 칸만 장부 값으로, 없는 칸·「확인 불가」 줄은 뺀다 */
const 값없음꼴 = /(확인\s*불가|확인되지\s*않|미확인|알\s*수\s*없|해당\s*없|찾지\s*못|자료에\s*없|없음|미공개|등록\s*전)/;
export function 사실표정리(facts: Fact[], 이름: string, 광고쪽: boolean): Fact[] {
  const L = 장부찾기(이름);
  const out: Fact[] = [];
  const 넣기 = (label: string, value?: string) => { if (value && !out.some((f) => f.label === label)) out.push({ label, value }); };
  for (const f of facts) {
    const lb = f.label.replace(/\s/g, "");
    if (/^(도로명주소|주소|위치|소재지|찾아가는주소)$/.test(lb)) { 넣기("주소", L?.address); continue; }
    if (/(영업|운영)시간|^시간$/.test(lb)) { 넣기("영업시간", L?.openingHours); continue; }
    if (/전화|연락처|예약|문의|상담/.test(lb)) { if (광고쪽 && L?.isAdvertiser) { 넣기("전화", L.telephone); 넣기("담당", L.nickname); } continue; }
    if (/^지번$/.test(lb)) { const 번 = (f.value.match(/\d+(-\d+)?/g) || []).pop(); if (L?.address && 번 && L.address.includes(번)) 넣기("지번", f.value); continue; }
    /* 가까운 역·도보·버스·주차·요금·업종 — 장부에 없는 값이라 표에서 뺀다(본문 설명은 그대로) */
  }
  if (!out.length) 넣기("주소", L?.address);
  if (!out.some((f) => f.label === "가게")) out.unshift({ label: "가게", value: 이름 });
  if (광고쪽 && L?.isAdvertiser) { 넣기("전화", L.telephone); 넣기("담당", L.nickname); }
  if (L?.openingHours) 넣기("영업시간", L.openingHours);
  return out.filter((f) => !값없음꼴.test(f.value));
}

export default function AccessVenuePage(
  { venue, 변형, 이주소, 설명 }: {
    venue: AccessVenue;
    변형?: 변형쪽;
    /** ★ 2026-09-02 — 이 쪽 자신의 주소(끝 슬래시 포함). 주면 canonical·og:url·구조화
     *  데이터가 전부 이것이 된다. 안 주면 지금까지처럼 accessVenuePath(venue.slug). */
    이주소?: string;
    /** ★ 2026-09-02 — 이 쪽만의 설명문(70~80자). */
    설명?: string;
  },
) {
  /* ★ 2026-08-26 — 관련 링크가 모자라면 같은 지역 → 그 외 순으로 6개까지 채운다. */
  const relatedFilled: string[] = (() => {
    const out: string[] = [...venue.related];
    if (out.length >= 6) return out;
    const same = ACCESS_VENUES.filter((v) => v.slug !== venue.slug && !out.includes(v.slug) && v.region === venue.region);
    const rest = ACCESS_VENUES.filter((v) => v.slug !== venue.slug && !out.includes(v.slug) && v.region !== venue.region);
    const pool = [...same, ...rest];
    const base = Math.max(0, ACCESS_VENUES.findIndex((x) => x.slug === venue.slug));
    for (let i = 0; out.length < 6 && i < pool.length; i++) {
      const p = pool[(base + i) % pool.length];
      if (p && !out.includes(p.slug)) out.push(p.slug);
    }
    return out;
  })();
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const parent = el.parentNode;
    const next = el.nextSibling;
    document.body.appendChild(el);
    return () => {
      if (parent) parent.insertBefore(el, next);
    };
  }, []);

  const path = 이주소 ?? accessVenuePath(venue.slug);
  const url = `${SITE.url}${path}`;
  const 설명문 = 설명 ?? venue.description;
  let thumbPath = 이주소
    ? `/og/access-${이주소.replace(/^\/+|\/+$/g, "").replace(/\//g, "-")}-og${venue.ogV ?? ""}.png`
    : `/og/access-${venue.slug}-og${venue.ogV ?? ""}.png`;
  const 표 = useThumb();   /* 2026-09-24 쪽마다 고유 카드 */
  if (표) thumbPath = 표.file;
  const ogImage = `${SITE.url}${thumbPath}`;
  const ogAlt = 표 ? 표.alt : venue.contact ? ["광고", venue.name, venue.contact.name, venue.contact.phone].join(" · ") : `${venue.nameSpaced} 가는 길·귀가 안내`;

  /* 2026-09-25 전부10 — 장부 · 광고 쪽 여부 · 가게이름 횟수 · 쪽 소금 */
  const L = 장부찾기(venue.name);
  const 광고쪽 = venue.group === "A" && !!venue.contact;
  const z = { s: saltOf(path), 지역: cssClasses(ACCESS_CSS) };
  const 이름줄 = 이름줄이개(venue.name, 광고쪽 ? 5 : 6, path);
  const 번호줄 = 번호줄이개([L?.telephone ?? "", venue.contact?.phone ?? ""], 1);
  const 도로줄 = 도로꼴고치개(L?.address);
  const 줄 = (t: string) => 도로줄(번호줄(이름줄(t)));
  const 제목 = 변형?.title ?? venue.title;
  const h1글 = 줄(제목);
  const 앞글 = (변형?.lead ?? venue.intro).map(줄);
  const 답h2 = 변형 ? "" : 줄(`${venue.name} 핵심 세 줄 — 확인된 것만`);
  const 답들 = 변형 ? [] : venue.answer.map(줄);
  const 사실 = 사실표정리(venue.facts, venue.name, 광고쪽);
  const 마디들 = [...마디고르기(변형?.sections ?? venue.sections, 변형 ? 1900 : 99999), ...(변형 ? [] : 덧마디들[venue.slug] ?? [])].map((s) => ({ h2: 줄(s.h2), body: s.body.map(줄) }));
  const 끝h2 = 줄(변형?.closing?.h2 ?? venue.finalAnswer.h2);
  const 끝글 = (변형?.closing?.body ?? venue.finalAnswer.body).map(줄);
  const 문답 = (변형?.faq?.length ? 변형.faq : venue.faq).map((f) => ({ q: 줄(f.q), a: 줄(f.a) }));
  const 정리글 = 줄(변형?.summary ? 변형.summary.join(" ") : venue.summary);
  /* 본문 글자(공백 뺌) 어림 — 1,800자에 못 미치면 이 쪽 몫 안내 문단(guide-extra)을 2,400자 안에서 더한다 */
  const 글자 = (t: string) => String(t).replace(/\s/g, "").length;
  const 합 = [h1글, ...앞글, 답h2, ...답들, ...사실.flatMap((f) => [f.label, f.value]), ...마디들.flatMap((s) => [s.h2, ...s.body]), 끝h2, ...끝글, ...문답.flatMap((f) => [f.q, f.a]), 정리글,
    ...(변형 ? [] : [...venue.steps.flatMap((s) => [s.label, s.detail]), ...venue.sources, `${venue.nameSpaced} 도착까지 세 단계`]), "가는 길 · 귀가 내비 한 줄 정리 위치·이동 확인 정보 이동 관련 자주 묻는 것 확인일 2026년 9월 1일. 운영 사정에 따라 내용은 바뀔 수 있습니다. 공개된 자료 기준 · 업소와 제휴 관계가 없는 안내"]
    .reduce((a, t) => a + 글자(t), 0);
  const 더할글 = 0;   /* 2026-09-25 — guide-extra 문단은 다른 사이트 쪽과 문장이 겹쳐(측정 ①②) 가는 길 쪽에는 싣지 않는다 */

  const nightClub: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "NightClub",
    "@id": `${url}#venue`,
    name: venue.name,
    ...(venue.altNames ? { alternateName: venue.altNames } : {}),
    url,
    image: ogImage,
    description: 설명문,
    address: {
      "@type": "PostalAddress",
      addressLocality: venue.addressLocality,
      addressRegion: venue.addressRegion,
      addressCountry: "KR",
      ...(L?.address ? { streetAddress: L.address } : {}),
    },
    ...(광고쪽 && L?.isAdvertiser && L.telephone ? { telephone: L.telephone } : {}),
    ...(venue.ageLabel ? { typicalAgeRange: venue.ageLabel } : {}),
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: 문답.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "무너진 자리에서 다시 시작한 사람의 기록", item: `${SITE.url}/` },
      { "@type": "ListItem", position: 2, name: "가는 길", item: `${SITE.url}${ACCESS_BASE}` },
      { "@type": "ListItem", position: 3, name: venue.name, item: url },
    ],
  };

  const 트리 = (
    <>
      <Head>
        <title>{제목}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="description" content={설명문} />
        <link rel="canonical" href={url} />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large" />
        <meta name="googlebot" content="index,follow" />
        <meta name="naver-bot" content="index,follow" />
        <meta name="yeti" content="index,follow" />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:site_name" content={SITE.name} />
        <meta property="og:title" content={제목} />
        <meta property="og:description" content={설명문} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:secure_url" content={ogImage} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="1200" />
        <meta property="og:image:alt" content={ogAlt} />
        <link rel="image_src" href={ogImage} />
        <meta name="thumbnail" content={ogImage} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={제목} />
        <meta name="twitter:description" content={설명문} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={ogAlt} />
        <style dangerouslySetInnerHTML={{ __html: ACCESS_CSS }} />
      </Head>

      <Ld data={nightClub} />
      <Ld data={faqPage} />
      <Ld data={breadcrumb} />

      <article className="acc-wrap">
        {/* 2026-09-25 — 현재 위치는 nav 로(본문 글자에서 빠진다 · 가게이름 횟수 규칙) */}
        <nav className="acc-crumb" aria-label="현재 위치">
          <Link href="/">홈</Link> › <Link href={ACCESS_BASE}>가는 길</Link> › {venue.name}
        </nav>

        {광고쪽 ? (
          <p
            className="ad-label"
            style={{
              display: 'inline-block', margin: '0 0 10px', padding: '3px 10px',
              border: '1px solid #c9a227', borderRadius: 4,
              fontSize: 12, color: '#c9a227', letterSpacing: '.04em',
            }}
          >
            광고
          </p>
        ) : null}
        <span className="acc-tagline">가는 길 · 귀가 내비</span>
        <h1>{h1글}</h1>
        <PageThumb src={thumbPath} alt={ogAlt} />

        <div className="acc-intro" {...(변형 ? { "data-r": "lead" } : {})}>
          {앞글.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {변형 ? null : (
        <div className="acc-route">
          <h2>{venue.nameSpaced} 도착까지 세 단계</h2>
          <RouteLine />
          <ol className="acc-steps">
            {venue.steps.map((s, i) => (
              <li key={s.label}>
                <span className="n">{i + 1}</span>
                <span className="lb">{줄(s.label)}</span>
                <span className="dt">{줄(s.detail)}</span>
              </li>
            ))}
          </ol>
        </div>
        )}

        {변형 ? null : (
        <div data-frame="1" data-r="lead" className="acc-answer">
          <h2>{답h2}</h2>
          <ul>
            {답들.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
        )}

        <div data-frame="1" className="acc-facts">
          <table data-r="facts">
            <caption>위치·이동 확인 정보</caption>
            <tbody>
              {사실.map((f) => (
                <tr key={f.label}>
                  <th scope="row">{f.label}</th>
                  <td>{f.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {마디들.map((s) => (
          <section key={s.h2}>
            <h2>{s.h2}</h2>
            {s.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
        ))}

        <section className="acc-final">
          <h2>{끝h2}</h2>
          {끝글.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>

        <section className="acc-faq" data-r="qa">
          <h2>{venue.nameSpaced} 이동 관련 자주 묻는 것</h2>
          <dl>
            {문답.map((f) => (
              <div key={f.q}>
                <dt data-r="q">{f.q}</dt>
                <dd data-r="a">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <GuideExtra pathname={path} 글바꾸기={줄} 예산={더할글} />

        <section className="acc-close" data-r="closewrap">
          <h2>한 줄 정리</h2>
          <p data-frame="1" data-r="close" className="acc-sum">{정리글}</p>
        </section>
        <p data-frame="1" className="acc-checked">
          {광고쪽 ? "광고 · 업소 제공 정보 · " : "공개된 자료 기준 · 업소와 제휴 관계가 없는 안내 · "}
          확인일 <time dateTime="2026-09-01">2026년 9월 1일</time>.
          운영 사정에 따라 내용은 바뀔 수 있습니다.
        </p>
      </article>

      {변형 ? null : (
      <aside className="acc-wrap acc-src" aria-label="참고 자료">
        <strong>이 페이지가 참고한 자료 (링크 없이 표기)</strong>
        <ul>
          {venue.sources.filter((s) => !흔한출처.has(s)).map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </aside>
      )}

      <nav className="acc-wrap acc-related" aria-label="가까운 지역 가는 길">
        <h2>가는 길이 비슷한 다른 지역</h2>
        <ul>
          {relatedFilled.map((slug) => {
            const r = VENUE_BY_SLUG[slug];
            if (!r) return null;
            return (
              <li key={slug}>
                <Link href={accessVenuePath(slug)}>{r.name}</Link> — {r.region}
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className="acc-footer">
        <div className="acc-ad">
          광고문의 카톡 <strong>besta12</strong>
        </div>
        <p className="acc-note">
          {`본 페이지는 ${venue.name} 이동 동선 안내 페이지입니다.`}{" "} 도보 시간·버스·막차는 확인된 자료만 실었고,
          확인되지 않은 항목은 본문에 확인되지 않았다고 밝혔습니다. 출입 연령 및 이용 규정은 각 업소 방침을 따릅니다.
          최종 갱신 <time dateTime="2026-09-25">2026년 9월 25일</time>.
        </p>
        <p className="acc-note">{연령고지(venue.slug)}</p>
      </footer>

      {광고쪽 && venue.contact ? (
        <div ref={barRef} className="callbar" role="complementary" aria-label="전화 연결">
          <a href={`tel:${(L?.telephone ?? venue.contact.phone).replace(/\D/g, "")}`}>
            📞 {venue.name} {L?.nickname ?? venue.contact.name} {L?.telephone ?? venue.contact.phone}
          </a>
        </div>
      ) : (
        <div ref={barRef} className="callbar" role="complementary" aria-label="광고 제휴 문의">
          <span>
            {문의앞말고르기(venue.slug)} <b>besta12</b>
          </span>
        </div>
      )}
    </>
  );
  return <SaltContext.Provider value={z}>{saltTree(트리, z)}</SaltContext.Provider>;
}
