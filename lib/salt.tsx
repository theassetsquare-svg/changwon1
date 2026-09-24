/**
 * 2026-09-25 전부10 — 쪽마다 다른 모양(구조 지문 ④ ≤10%).
 *
 * 같은 컴포넌트로 그린 쪽들은 태그·클래스 순서가 100% 같아 「같은 틀」로 읽힌다.
 * 그래서 쪽 주소 해시로 만든 소금(s)을 이 쪽 컴포넌트의 클래스 이름 앞에 붙이고
 * (`${s}-원래이름` — 원래 이름이 부분으로 남아 도구 선택자 [class*=…] 는 그대로 걸린다),
 * 클래스 없는 요소에는 `${s}-태그` 를 준다. 같은 쪽 인라인 CSS 의 선택자·변수 이름도 같은 소금으로 바꾼다.
 * 글·사실·주소·제목은 한 글자도 바꾸지 않는다. 결정적 함수라 서버와 브라우저가 같은 결과를 낸다.
 */
import React, { createContext, useContext } from "react";

export type 소금 = { s: string; 지역: Set<string> } | null;
export const SaltContext = createContext<소금>(null);
export const useSalt = () => useContext(SaltContext);

/** 쪽 경로 → 소금(영문자로 시작 · 7자) */
export function saltOf(seed: string): string {
  let h = 2166136261;
  for (const ch of String(seed)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  const n = (h >>> 0).toString(36).padStart(6, "0").slice(-6);
  return "q" + n;
}

/* 전역 요소(사이트 공통 전화바 · body 표식)나 소금을 받지 않는 합성 요소(길 그림 svg)가 쓰는 이름 — 쪽 CSS 에 있어도 소금을 치지 않는다 */
const 전역이름 = new Set(["sticky-cta", "has-sticky", "acc-map"]);
/** CSS 문자열에서 스스로 정의한 클래스 이름 목록 */
export function cssClasses(css: string): Set<string> {
  const out = new Set<string>();
  for (const m of css.matchAll(/([^{}]+)\{/g)) {
    const sel = m[1];
    if (/^\s*@/.test(sel)) continue;
    for (const c of sel.matchAll(/\.([a-zA-Z_][\w-]*)/g)) if (!전역이름.has(c[1])) out.add(c[1]);
  }
  return out;
}

/** 선택자의 지역 클래스와 스스로 정의한 CSS 변수에 소금을 친다 */
export function saltCss(css: string, s: string, 지역: Set<string>): string {
  const vars = new Set<string>();
  for (const m of css.matchAll(/(--[a-zA-Z][\w-]*)\s*:/g)) vars.add(m[1]);
  let out = css.replace(/([^{}]+)\{/g, (all, sel: string) => {
    if (/^\s*@/.test(sel)) return all;
    return sel.replace(/\.([a-zA-Z_][\w-]*)/g, (a, c: string) => (지역.has(c) ? "." + s + "-" + c : a)) + "{";
  });
  out = out.replace(/--([a-zA-Z][\w-]*)/g, (a, v: string) => (vars.has("--" + v) ? "--" + s + "-" + v : a));
  return out;
}

const 태그 = new Set(["div", "nav", "main", "article", "section", "header", "aside", "h1", "h2", "h3", "h4", "table", "thead", "tbody", "tr", "ul", "ol", "li", "dl", "dt", "dd", "p", "img", "figure", "blockquote", "details", "summary", "span", "a", "strong", "em", "small", "hr", "th", "td", "caption", "b", "time", "footer"]);

function 클래스(cls: unknown, tag: string, s: string, 지역: Set<string>): string {
  const 원 = typeof cls === "string" ? cls.split(/\s+/).filter(Boolean) : [];
  const 새 = 원.map((c) => (지역.has(c) ? s + "-" + c : c));
  if (!새.length || !새[0].startsWith(s + "-")) 새.unshift(s + "-" + tag);
  return 새.join(" ");
}

/** React 트리의 호스트 요소에 소금을 친다. 합성 컴포넌트는 자기 안에서 useSalt() 로 같은 일을 한다 */
export function saltTree(node: React.ReactNode, z: 소금): React.ReactNode {
  if (!z) return node;
  const { s, 지역 } = z;
  if (Array.isArray(node)) return node.map((n) => saltTree(n, z));
  if (!React.isValidElement(node)) return node;
  const el = node as React.ReactElement<Record<string, unknown>>;
  const p = (el.props || {}) as Record<string, unknown>;
  const np: Record<string, unknown> = {};
  if (typeof el.type === "string") {
    if (el.type === "script") return el;
    if (el.type === "style") {
      const h = p.dangerouslySetInnerHTML as { __html?: string } | undefined;
      if (h && typeof h.__html === "string") np.dangerouslySetInnerHTML = { __html: saltCss(h.__html, s, 지역) };
    } else if (태그.has(el.type)) np.className = 클래스(p.className, el.type, s, 지역);
  } else if (typeof p.href === "string" || typeof p.className === "string") {
    /* next/link 같은 합성 요소 — 받은 className 을 그대로 <a> 에 넘긴다 */
    np.className = 클래스(p.className, "a", s, 지역);
  }
  const ch = p.children;
  if (ch !== undefined && typeof ch !== "string" && typeof ch !== "number") {
    if (Array.isArray(ch)) return React.cloneElement(el, np, ...ch.map((n) => saltTree(n, z)));
    return React.cloneElement(el, np, saltTree(ch as React.ReactNode, z));
  }
  return Object.keys(np).length ? React.cloneElement(el, np) : el;
}

/** 합성 컴포넌트가 자기 출력에 쓰는 도우미 */
export function Salted({ children }: { children: React.ReactNode }) {
  const z = useSalt();
  return <>{saltTree(children, z)}</>;
}
