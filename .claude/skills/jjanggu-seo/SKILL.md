---
name: jjanggu-seo
description: 창원 룰루랄라 나이트 짱구 담당(웨이터) 010-3854-6887 공식 사이트 SEO. 합법적 SEO 방법으로 네이버/구글/AI 검색 노출. 실제 영업장 정보 기반. 가짜 후기 X. 가짜 별점 X. AI 위장 X. 도메인 1개. 19세 이상 합법 영업장.
---

# 창원 룰루랄라 나이트 짱구 SEO Skill v2.1 (호칭 정정판)

## 0. 절대 룰 (단 3가지)

1. ✅ 실제 정보만 표시 (가짜 X)
2. ✅ 합법 SEO 방법만 사용
3. ✅ 도메인 1개 (changwon1.pages.dev)

## 0-1. 호칭 룰 (중요)

- ❌ "매니저 짱구" — 사용 금지 (한국 나이트 업계 호칭 아님)
- ✅ "웨이터 짱구" 또는 "짱구 담당" — 손님이 실제 부르는 호칭
- 전화 안내 멘트: **"짱구 담당 부탁드립니다"** (또는 "웨이터 짱구 부탁드립니다")
- JSON-LD `Person.jobTitle`: "웨이터" (영문 "Waiter")

## 1. 사이트 정보

- 업소: 창원 룰루랄라 나이트
- 웨이터(담당): 짱구
- 전화: 010-3854-6887
- 위치: 창원시 (정확한 주소 = 배선욱 대표 입력 필요)
- 19세 이상 합법 영업장
- 도메인: changwon1.pages.dev (Cloudflare Pages 자동 배포)

## 2. 페이지 구조 (15 페이지)

```
1. / (홈)
2. /about (가게 소개 - 진짜 정보만)
3. /jjanggu (웨이터 짱구 담당 소개 - 진짜 경력)
4. /price (실제 가격표)
5. /location (실제 위치)
6. /reserve (예약 안내)
7. /review (실제 받은 후기만)
8. /photo (실제 가게 사진)
9. /news (실제 소식)
10. /faq (실제 자주 묻는 질문)
11. /around (주변 정보)
12. /event (실제 이벤트)
13. /vip (VIP 안내 - 실제 운영 시만)
14. /contact (문의)
15. sitemap.xml + robots.txt + llms.txt
```

## 3. 콘텐츠 작성 룰 (합법)

### 허용 ✅
- 실제 정보 (가격/위치/시간)
- 가게 진짜 매력 소개
- 짱구 담당 진짜 소개
- 실제 받은 후기 (출처 명시)
- 자연스러운 한국어 (사람이 검토)
- 가게 진짜 사진
- 짱구 담당 진짜 사진

### 금지 ❌
- 가짜 1인칭 후기 ("내가 가봤는데")
- 가짜 별점 (실제 평균만 표시)
- 가짜 단골 수 ("1,000명+")
- 실제 없는 할인 ("30% 할인")
- 호구 마케팅 ("호구당함")
- "매니저 짱구" 호칭 (업계 호칭 아님)

## 4. 짱구 브랜딩 (합법)

- 짱구 = 실제 웨이터(담당)
- 모든 페이지: "짱구 담당" 또는 "웨이터 짱구" 명시
- 전화 시 안내: "짱구 담당 부탁드립니다"
- 짱구 실제 경력 (배선욱 대표 입력)
- 짱구 진짜 사진 사용

## 5. URL 룰

- URL: 영문 (/jjanggu, /price, /location 등)
- H1/Title/Meta: 한글
- 본문: 한글 100% (자연스럽게)
- canonical: 영문 URL

## 6. 1:1 1200×1200 썸네일 (합법)

```tsx
// pages/api/og 또는 정적 SVG

<div style={{background: '#1F2937'}}>
  <div style={{fontSize: 80, color: '#FCD34D'}}>
    창원 룰루랄라 나이트
  </div>

  <img src="/assets/jjanggu.jpg" width={400} height={400} />

  <div style={{fontSize: 60, color: '#FFFFFF'}}>
    웨이터 짱구 (담당)
  </div>

  <div style={{fontSize: 120, fontWeight: 900, color: '#FCD34D'}}>
    📞 010-3854-6887
  </div>
</div>
```

## 7. SEO 1위 자동 (합법)

### A. Schema.org (실제 정보만)
```json
{
  "@context": "https://schema.org",
  "@type": "NightClub",
  "name": "창원 룰루랄라 나이트",
  "address": {
    "addressLocality": "창원시",
    "addressRegion": "경상남도",
    "addressCountry": "KR"
  },
  "telephone": "010-7528-4936",
  "url": "https://changwon1.pages.dev",
  "openingHours": "[실제 영업시간]",
  "employee": {
    "@type": "Person",
    "name": "로또",
    "jobTitle": "웨이터"
  }
}
```

### B. robots.txt
```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: https://changwon1.pages.dev/sitemap.xml
```

### C. llms.txt
```
# 창원 룰루랄라 나이트

> 창원시 합법 나이트 클럽. 짱구 담당(웨이터) 010-3854-6887.

## 정보
- 업소: 창원 룰루랄라 나이트
- 웨이터(담당): 짱구
- 전화: 010-3854-6887
- 위치: 창원시
- 19세 이상 합법 영업장
```

### D. 검색 엔진 등록 (필수)
- 네이버 웹마스터
- 네이버 플레이스
- Google Search Console
- Google Business Profile
- 카카오맵

## 8. 합법 100%

```
✅ 19세 이상 명시
✅ 신분증 확인 안내
✅ 합법 영업장 명시
✅ 실제 정보만
✅ 손님 진짜 후기만
✅ 짱구 진짜 담당(웨이터)
✅ 실제 가격만
✅ 실제 영업시간만
```

## 9. 사용법

```bash
# 사이트 생성
claude "jjanggu-seo skill v2.1 적용. changwon1.pages.dev 15 페이지 생성. 실제 정보 기반"

# 썸네일 생성
claude "jjanggu-seo skill 적용. 1:1 1200×1200 짱구 담당 썸네일 생성"

# 검색 등록
claude "jjanggu-seo skill 적용. 네이버 플레이스 + 구글 비즈니스 + 카카오맵 등록 가이드"
```

## 10. 배선욱 대표 입력 필요 정보

```
1. 가게 정확한 주소
2. 영업 시간
3. 실제 가격표
4. 짱구 실제 사진
5. 가게 사진 5장+
6. 손님한테 받은 진짜 후기
7. 짱구 진짜 경력
8. 카카오톡 채널 (있으면)
9. 사업자 등록증 정보
```

## 11. KPI (1년, 합법 SEO)

- 1주일: 15 페이지 완성, 네이버 플레이스/구글 비즈니스 등록
- 1개월: 네이버·구글 검색 노출 시작
- 3개월: "창원 룰루랄라" 검색 1위, 손님 진짜 후기 10개+
- 6개월: 모든 키워드 1위, 카카오 채널 운영
- 12개월: 창원 1위 = 짱구 ⭐
