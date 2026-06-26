# HARAL — Railway 배포 가이드

백엔드·프론트엔드 **모두 Railway**에서 실행합니다.

## 서비스 구조

```
Railway Project
├── api        (backend/)     FastAPI + MySQL + R2
├── web        (haral-shop/)   Next.js PWA
└── mysql      (플러그인)      MySQL
```

---

## 1. MySQL 추가

1. Railway 프로젝트 → **+ New** → **Database** → **MySQL**
2. `api` 서비스 → **Variables** → `MYSQL_URL` 또는 `DATABASE_URL`을 MySQL에서 **Reference**로 연결

> `mysql://user:pass@host:3306/railway` 형식이면 앱에서 자동으로 `mysql+pymysql://`로 변환합니다.

---

## 2. Cloudflare R2 설정

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → R2 → **Create bucket** (`haral-shop`)
2. **Manage R2 API Tokens** → Object Read & Write 권한으로 토큰 생성
3. Public access 또는 Custom Domain 연결
4. `api` 서비스 Variables:

| 변수 | 설명 |
|------|------|
| `R2_ACCOUNT_ID` | Cloudflare Account ID |
| `R2_ACCESS_KEY_ID` | R2 API 토큰 Access Key |
| `R2_SECRET_ACCESS_KEY` | R2 API 토큰 Secret |
| `R2_BUCKET_NAME` | `haral-shop` |
| `R2_PUBLIC_BASE_URL` | `https://pub-xxxx.r2.dev` 또는 CDN 도메인 |
| `ADMIN_API_KEY` | 관리자용 랜덤 문자열 |

---

## 3. 백엔드 (api)

| 설정 | 값 |
|------|-----|
| Root Directory | `backend` |
| Service Name | `api` |

첫 배포 시 `products.json` → MySQL 자동 시드 (12개 상품).

**헬스체크:** `GET /api/health`

---

## 4. 프론트엔드 (web)

| 설정 | 값 |
|------|-----|
| Root Directory | `haral-shop` |
| Variable | `NEXT_PUBLIC_API_URL=https://${{api.RAILWAY_PUBLIC_DOMAIN}}` |

---

## 5. 관리자 API (이미지 업로드)

### 상품 이미지 업로드 (R2 + DB 연동)

```bash
curl -X POST "https://<api-domain>/api/upload/products/beef-steak/image" \
  -H "X-API-Key: YOUR_ADMIN_API_KEY" \
  -F "file=@product.jpg"
```

### 이미지만 업로드

```bash
curl -X POST "https://<api-domain>/api/upload/image" \
  -H "X-API-Key: YOUR_ADMIN_API_KEY" \
  -F "file=@product.jpg"
```

API 문서: `https://<api-domain>/docs`

---

## 6. 데이터 저장 구조

| 데이터 | 저장소 |
|--------|--------|
| 상품 정보, 주문, 회원 | MySQL |
| 상품 이미지 파일 | Cloudflare R2 |
| DB `image` 필드 | R2 공개 URL |

---

## 7. 문제 해결

| 증상 | 해결 |
|------|------|
| DB 연결 실패 | `DATABASE_URL` Reference 연결 확인 |
| 상품 없음 | api 로그 "Seeded N products" 확인 |
| R2 업로드 503 | R2 환경 변수 5개 설정 확인 |
| 업로드 401 | `X-API-Key` = `ADMIN_API_KEY` 확인 |
