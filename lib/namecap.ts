/**
 * 2026-09-25 전부10 — 가게이름은 본문에 3~8회(config 페이지규칙 · 네이버 가이드 「같은 낱말 반복」).
 * 쪽 글을 위에서부터 차례로 넘기면, 정해 둔 횟수까지는 이름을 그대로 두고 그 뒤는 「이 가게」로 바꾼다.
 * (나이트·가게 둘 다 모음으로 끝나 조사가 그대로 맞는다.) 사실·숫자는 건드리지 않는다.
 */
export function 이름줄이개(이름: string, 최대: number, 씨앗 = "") {
  /* 바꿔 쓰는 말도 쪽마다 고른다 — 같은 물음 줄(「이 가게 주소가 어디인가요?」)이 여러 쪽에 똑같이 생기지 않게 */
  const 말들 = ["이 가게", "이 업소", "이곳 나이트", "여기 나이트"];
  let h = 0; for (const ch of String(씨앗 || 이름)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const 대신 = 말들[h % 말들.length];
  let 남은 = 최대;
  const 바꾸기 = (t: string): string => {
    if (!이름 || !t || t.indexOf(이름) < 0) return t;
    return t.split(이름).reduce((acc, part, i) => {
      if (i === 0) return part;
      if (남은 > 0) { 남은 -= 1; return acc + 이름 + part; }
      return acc + 대신 + part;
    }, "");
  };
  return 바꾸기;
}

/** 같은 전화번호는 본문에 정해 둔 횟수까지만 번호로 적고, 그 뒤는 「같은 번호」로 쓴다(한 쪽 번호 반복 3회 이하) */
export function 번호줄이개(번호들: string[], 최대: number) {
  let 남은 = 최대;
  const 꼴 = 번호들.filter(Boolean).map((n) => n.replace(/\D/g, "")).filter((n) => n.length >= 9);
  return (t: string): string => {
    if (!t || !꼴.length) return t;
    return t.replace(/0\d{1,2}[-. ]?\d{3,4}[-. ]?\d{4}/g, (m) => {
      if (!꼴.includes(m.replace(/\D/g, ""))) return m;
      if (남은 > 0) { 남은 -= 1; return m; }
      return "같은 번호";
    });
  };
}

/**
 * 「택시로 8분」·「실제로 5분」·「화곡로 4분」·「온천장로107번길이라는」처럼 도로명+번지로 읽히는 글을
 * 뜻은 그대로 두고 조사만 붙여 주소로 오인되지 않게 한다(확인된 주소와 다른 주소가 본문에 있다는 오판 방지).
 * 확인된 주소(장부)와 같은 도로명+번지는 그대로 둔다.
 */
const 도로꼴 = /([가-힣A-Za-z0-9]+(?:대?로|길))(\s*)(\d+(?:-\d+)?)/g;
const 부사로 = /(으로|택시로|차로|실제로|대체로|버스로|도보로|지하철로|전철로|기차로|엘리베이터로|자가용로)$/;
export function 도로꼴고치개(주소?: string) {
  const 맞는꼴 = new Set<string>();
  for (const m of String(주소 || "").replace(/\([^)]*\)/g, " ").matchAll(도로꼴)) 맞는꼴.add(m[1] + " " + m[3]);
  return (t: string): string => {
    if (!t) return t;
    return t.replace(도로꼴, (all, 앞: string, 빈: string, 수: string, off: number, 전체: string) => {
      if (맞는꼴.has(앞 + " " + 수)) return all;
      const 뒤 = 전체.slice(off + all.length, off + all.length + 3);
      if (부사로.test(앞)) return 앞 + "는 " + 수;
      if (/^(번길|길|번 ?길)/.test(뒤)) return 앞 + "의 " + 수;
      if (/^(분|m|미터|층|km|킬로|시간|초|번 출구|번출구)/.test(뒤)) return 앞 + "까지 " + 수;
      return all;
    });
  };
}
