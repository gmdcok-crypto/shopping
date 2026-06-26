# HARAL

한국 거주 외국인용 할랄 쇼핑몰

## 구조

| 서비스 | 폴더 | Railway | 저장소 |
|--------|------|---------|--------|
| API | `backend/` | api | MySQL + R2 |
| Web | `haral-shop/` | web | - |

## 배포 (Railway만 — Netlify 사용 안 함)

**[RAILWAY.md](./RAILWAY.md)** — Railway 전용. Netlify에 사이트가 있으면 빌드 오류가 납니다 → **Netlify 사이트 삭제 또는 빌드 중지** 필요.

1. GitHub `main` 푸시 → **Railway** 자동 배포
2. `web` 서비스: Root Directory `haral-shop`, Builder `Dockerfile`, 도메인 생성
3. `api` + MySQL (상품 데이터용, R2는 나중에 가능)

## 데이터

- **MySQL**: 상품, 주문, 회원
- **Cloudflare R2**: 상품 이미지
- 첫 배포 시 12개 샘플 상품 자동 시드
