/**
 * 2026-09-25 전부10 — 가게 쪽 본문 목표 1,800~2,500자(config 페이지규칙 새쪽_목표).
 * 소제목 마디가 많아 목표를 넘는 쪽은 첫 마디와 끝 마디(가는 길·문의가 든 자리)를 먼저 두고,
 * 사이 마디는 차례대로 예산 안에서만 싣는다. 글은 고치지 않고 싣는 마디 수만 정한다.
 */
export const 글자 = (t: string) => String(t).replace(/\s/g, "").length;
export function 마디고르기<T extends { h2: string; body: string[] }>(마디: T[], 예산: number): T[] {
  const 크기 = (s: T) => 글자(s.h2) + s.body.reduce((a, p) => a + 글자(p), 0);
  const 전체 = 마디.reduce((a, s) => a + 크기(s), 0);
  if (전체 <= 예산 || 마디.length <= 2) return 마디;
  const 고름 = new Set<number>([0, 마디.length - 1]);
  let 남 = 예산 - 크기(마디[0]) - 크기(마디[마디.length - 1]);
  for (let i = 1; i < 마디.length - 1; i++) { const n = 크기(마디[i]); if (n <= 남) { 고름.add(i); 남 -= n; } }
  return 마디.filter((_, i) => 고름.has(i));
}
