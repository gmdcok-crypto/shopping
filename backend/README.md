# HARAL Backend

FastAPI + MySQL + Cloudflare R2

## Railway Variables

| 변수 | 필수 |
|------|------|
| `DATABASE_URL` 또는 `MYSQL_URL` | ✅ (MySQL 플러그인) |
| `R2_ACCOUNT_ID` | ✅ (이미지 업로드) |
| `R2_ACCESS_KEY_ID` | ✅ |
| `R2_SECRET_ACCESS_KEY` | ✅ |
| `R2_BUCKET_NAME` | ✅ |
| `R2_PUBLIC_BASE_URL` | ✅ |
| `ADMIN_API_KEY` | ✅ (관리 API) |

> Railway MySQL의 `DATABASE_URL`이 `mysql://`로 시작해도 자동 변환됩니다.

## API

| Method | Path | 인증 |
|--------|------|------|
| GET | `/api/products` | - |
| GET | `/api/products/{id}` | - |
| POST | `/api/products` | X-API-Key |
| PATCH | `/api/products/{id}` | X-API-Key |
| POST | `/api/upload/image` | X-API-Key |
| POST | `/api/upload/products/{id}/image` | X-API-Key |
| POST | `/api/orders` | - |
| GET | `/api/orders` | X-API-Key |
| POST | `/api/auth/login` | - |
| POST | `/api/auth/register` | - |

상세 배포: [../RAILWAY.md](../RAILWAY.md)
