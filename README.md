# HARAL

한국 거주 외국인용 할랄 쇼핑몰

## 구조

| 서비스 | 폴더 | Railway | 저장소 |
|--------|------|---------|--------|
| API | `backend/` | api | MySQL + R2 |
| Web | `haral-shop/` | web | - |

## 배포

**[RAILWAY.md](./RAILWAY.md)** 참고

1. MySQL 플러그인 추가
2. R2 버킷 + API 토큰 설정
3. `api` / `web` 서비스 배포

## 데이터

- **MySQL**: 상품, 주문, 회원
- **Cloudflare R2**: 상품 이미지
- 첫 배포 시 12개 샘플 상품 자동 시드
