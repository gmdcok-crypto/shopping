# HARAL — Railway 배포

## 배포 방식 (2가지)

### A. Netlify 프론트 + Railway API (분리) — `record` client 패턴

```
Netlify          Railway
haral-shop/out   Dockerfile.api (또는 backend/)
```

→ [NETLIFY.md](./NETLIFY.md)

| Railway 설정 | 값 |
|--------------|-----|
| Dockerfile | `Dockerfile.api` |
| Healthcheck | `/api/health` |

### B. Railway 단일 서비스 (프론트+API)

```
Railway: 루트 Dockerfile → FastAPI + static PWA
```

Netlify 불필요. `https://<도메인>/ko/` 로 접속.

| Railway 설정 | 값 |
|--------------|-----|
| Dockerfile | `Dockerfile` |
| Healthcheck | `/api/health` |

---

## MySQL

1. Railway → **+ New** → **Database** → **MySQL**
2. 앱 서비스 → **Variables** → `DATABASE_URL` Reference

---

## 환경 변수

| 변수 | 설명 |
|------|------|
| `DATABASE_URL` | MySQL Reference (필수) |
| `R2_*` | 이미지 업로드 (선택) |
| `ADMIN_API_KEY` | 관리자 API (선택) |
| `CORS_ORIGINS` | Netlify 도메인 (`https://xxx.netlify.app`) |

Netlify 분리 시 프론트는 `API_URL` 불필요 (same-origin `/api` + redirect).

---

## 문제 해결

| 증상 | 해결 |
|------|------|
| 상품 없음 / API error | `/api/health`, MySQL `DATABASE_URL` |
| Netlify에서 API 500 | `netlify.toml` Railway URL 확인 |
| 빈 화면 (단일 서비스) | Deploy 로그 `npm run build` 확인 |
