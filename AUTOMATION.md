# changwon1 자동화 개요

창원 룰루랄라 나이트 사이트의 SEO·모니터링·복구 자동화 구성 요약입니다.
"내가 신경 안 써도 되게" — 아래 3개 층이 자동으로 돌아갑니다.

## 층 1. 상시 모니터링 (GitHub Actions, Claude 불필요 · 완전 자동)

| 워크플로 | 파일 | 주기 | 하는 일 |
|---|---|---|---|
| SEO Auto Monitor | `.github/workflows/seo-auto-monitor.yml` | 6시간마다 + push | 빌드 → 키워드 스터핑 검사 → 라이브 8+페이지 헬스체크. 실패 시 **GitHub 이슈 + 이메일 알림** |
| GSC Weekly Report | `.github/workflows/gsc-weekly-report.yml` | 매주 월 09:00 KST | Search Console 실데이터(검색어·순위·페이지·카니발리제이션)를 **이메일 발송** |

## 층 2. 자동 복구 (Claude 루틴 — self-heal)

- 플레이북: `scripts/self-heal-playbook.md`
- 문제 메일/이슈를 읽고 → 안전한 수정 → 빌드·검증 → main 푸시(자동 배포) → 처리 메일 휴지통 이동 → 결과 메일.
- 실행: `claude "scripts/self-heal-playbook.md 절차대로 점검·복구하라"` (수동 또는 예약).

## 층 3. 데이터/생성 스크립트

| 스크립트 | 용도 |
|---|---|
| `scripts/gsc-report.mjs` | GSC 검색 성과 + 카니발리제이션 분석 (실데이터) |
| `scripts/check-keyword-stuffing.mjs` | 키워드 스터핑/메타 품질 검사 (`npm run check:seo`) |
| `scripts/gen-og.mjs` | OG 이미지(PNG) 생성 — 카카오톡/트위터/페북 미리보기용 |
| `scripts/gen-sitemap.mjs` | sitemap.xml 생성(lastmod 자동) |

## 필요한 저장소 시크릿 (한 번만 설정)

`GitHub > Settings > Secrets and variables > Actions > New repository secret`

| 시크릿 | 값 | 용도 |
|---|---|---|
| `GSC_CREDENTIALS` | theasset-gsc 서비스계정 JSON 전체 | GSC 주간 리포트 |
| `MAIL_USERNAME` | theassetsquare@gmail.com | 이메일 발신 계정 |
| `MAIL_PASSWORD` | Gmail **앱 비밀번호**(16자리) | 이메일 발신. https://myaccount.google.com/apppasswords |
| `ALERT_TO` | (선택) 수신 주소 | 미설정 시 theassetsquare@gmail.com |

> 시크릿 미설정이어도 모니터링은 동작하며(이슈 생성), 이메일 알림만 비활성화됩니다.

## 로컬 GSC 키 위치

`/home/user/.config/gsc/theasset-gsc.json` — 저장소 밖에 보관(커밋 금지). `.gitignore` 무관하게 추적되지 않음.

## GSC 리포트 수동 실행

```bash
GSC_KEY_FILE=/home/user/.config/gsc/theasset-gsc.json node scripts/gsc-report.mjs --days 28
```
