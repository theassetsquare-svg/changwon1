import guideExtra from '@/lib/guide-extra.json';
import { useSalt, saltTree } from '@/lib/salt';

/**
 * 쪽마다 다른 안내 문단.
 *
 * ★ 2026-09-01 — 본문이 1,800자에 못 미치던 쪽을 채우려고 넣었다(설계도 4장).
 *   글은 `lib/guide-extra.json` 에 쪽 주소별로 들어 있고, 조합이 쪽마다 달라
 *   같은 문단이 두 쪽에 나오지 않는다(유사도 10% 기준).
 *   자료에 그 쪽이 없으면 아무것도 그리지 않는다.
 * ★ 2026-09-25 — 부른 쪽의 소금(구조 지문)과 가게이름 횟수 규칙을 같이 따른다.
 */
type 마디 = { 소제목: string; 문단: string[] };

export default function GuideExtra({ pathname, 글바꾸기, 예산 }: { pathname: string; 글바꾸기?: (t: string) => string; /** 더 넣어도 되는 글자 수(공백 뺌) — 본문 1,800~2,500자 목표 */ 예산?: number }) {
  const z0 = useSalt();
  const z = z0 ? { s: z0.s, 지역: new Set([...z0.지역, 'guide-more']) } : z0;
  const 키 = String(pathname).replace(/\/+$/, '');
  const 마디들 = (guideExtra as Record<string, 마디[]>)[키];
  if (!마디들 || !마디들.length) return null;
  const 바꿈 = 글바꾸기 ?? ((t: string) => t);
  const 글자 = (t: string) => t.replace(/\s/g, '').length;
  let 남 = 예산 ?? Infinity;
  const 고른 = 마디들.filter((m) => { const n = 글자(m.소제목) + m.문단.reduce((a, p) => a + 글자(p), 0); if (n > 남) return false; 남 -= n; return true; });
  if (!고른.length) return null;
  return (
    <>
      {saltTree(고른.map((m, i) => (
        <section className="guide-more" key={키 + '-' + i}>
          <h2>{바꿈(m.소제목)}</h2>
          {m.문단.map((p, j) => (
            <p key={키 + '-' + i + '-' + j}>{바꿈(p)}</p>
          ))}
        </section>
      )), z)}
    </>
  );
}
