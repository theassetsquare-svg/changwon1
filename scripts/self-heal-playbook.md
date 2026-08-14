# 자동 복구(Self-Heal) 플레이북 — changwon1

이 문서는 Claude Code 루틴(예약 실행) 또는 수동 실행 시 따라야 할 절차입니다.
목표: **사이트 문제를 스스로 감지 → 해결 → 배포 검증 → 알림 메일/이슈 정리(처리된 알림 메일 휴지통 이동)**.

실행 명령 예시:
```
claude "scripts/self-heal-playbook.md 절차대로 changwon1 사이트를 점검하고 문제가 있으면 고쳐서 배포하라"
```

## 0. 컨텍스트
- 저장소: changwon1 (Next.js 16 static export → Cloudflare Pages, main 푸시 시 자동 배포)
- 라이브: https://changwon1.pages.dev
- GSC 키: `/home/user/.config/gsc/theasset-gsc.json` (저장소 밖, 커밋 금지)
- 알림 수신: theassetsquare@gmail.com

## 1. 문제 수집 (어디서 문제가 오는가)
1. **GitHub Issues** — label `seo` / `site-down` / `automated` 의 open 이슈 확인.
2. **Gmail** — 제목에 `[changwon1]` 이 들어간 메일(`🚨` 알림) 검색.
   - 쿼리 예: `subject:[changwon1] newer_than:7d`
   - ⚠️ `[놀쿨]`, `[ilsan*]` 등 **다른 프로젝트 메일은 절대 건드리지 말 것.**
3. **라이브 헬스체크** — 아래 페이지 200 응답 + 핵심 콘텐츠 확인:
   `/ /about/ /jjanggu/ /location/ /contacta/ /sitemap.xml /robots.txt /llms.txt /og-cover.png`

## 2. 진단
- 빌드 재현: `npm ci && npm run build && npm run check:seo`
- 라이브 응답 비교(빌드 OK인데 라이브 실패면 배포/Cloudflare 문제 → 코드 수정 불가, 메일로 보고만).
- GSC 점검: `GSC_KEY_FILE=/home/user/.config/gsc/theasset-gsc.json node scripts/gsc-report.mjs --days 28`
  - 급격한 노출/순위 하락, 신규 카니발리제이션 발견 시 원인 페이지 조정.

## 3. 해결 (안전한 자동 수정만)
허용되는 자동 수정:
- 빌드 깨짐(타입/임포트 오류), 메타 태그 누락/중복, JSON-LD 파싱 오류
- 키워드 스터핑 경고 → 본문 자연 분산
- sitemap/robots/llms 불일치 → `node scripts/gen-sitemap.mjs` 등으로 재생성
- 깨진 내부 링크, 404, 이미지 경로 오류
- 카니발리제이션 → title/H1/본문 차별화

**금지(사람 확인 필요):**
- 가짜 정보/후기/별점/가격/주소 추가 (절대 금지 — [[feedback_no_fake_info]])
- 영업정보(시간/번호/호칭) 변경
- 도메인/배포 설정 변경

수정 후: `npm run build && npm run check:seo` 재통과 확인 → `git commit` → `git push origin main`.

## 4. 배포 검증
- 푸시 후 1~3분 대기 → 라이브 페이지 재확인(200 + 변경 반영).

## 5. 알림 정리 (처리 완료 시)
- 해결한 GitHub Issue: 해결 코멘트 + close.
- 해결한 Gmail 알림: 처리 결과를 theassetsquare@gmail.com 으로 1통 발송 후,
  **해당 알림 메일을 휴지통으로 이동(trash)** — 사용자 요청. (휴지통은 30일 복구 가능)
  - ⚠️ changwon1 알림 메일만. 다른 프로젝트/중요 메일은 건드리지 않는다.
- 문제가 없었으면: 조용히 종료(불필요한 메일 발송 금지).

## 6. 보고
- 해결한 항목, 변경 커밋 해시, 라이브 검증 결과를 요약해 메일 1통.
