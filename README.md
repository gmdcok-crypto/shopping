# HARAL

한국 거주 외국인용 할랄 쇼핑몰

## 구조

| 역할 | 폴더 | 배포 |
|------|------|------|
| **프론트** | `haral-shop/` | **Netlify** |
| **API** | `backend/` | **Railway** (api + MySQL) |

## 배포

- **프론트 (Netlify):** [NETLIFY.md](./NETLIFY.md)
- **API (Railway):** [RAILWAY.md](./RAILWAY.md)

1. Netlify: GitHub 연결 → `netlify.toml`로 `haral-shop` 빌드
2. Railway: `api` + MySQL, `NEXT_PUBLIC_API_URL`을 Netlify에 설정
3. R2(이미지 업로드)는 나중에 가능

## 데이터

- **MySQL**: 상품, 주문, 회원
- **Cloudflare R2**: 상품 이미지 (선택)
- 첫 API 배포 시 12개 샘플 상품 자동 시드
