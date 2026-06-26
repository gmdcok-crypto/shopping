# HARAL — Railway 배포 (단일 서비스)

프론트(PWA)와 API를 **Railway 서비스 1개**에서 실행합니다 (`record` 프로젝트와 동일 패턴).

```
Railway Project
├── haral (또는 shopping)   루트 Dockerfile — FastAPI + 정적 PWA
└── mysql                   MySQL 플러그인
```

Netlify는 **사용하지 않습니다.**

---

## 1. MySQL

1. Railway → **+ New** → **Database** → **MySQL**
2. 앱 서비스 → **Variables** → `DATABASE_URL`을 MySQL에서 **Reference**로 연결

---

## 2. 앱 서비스

| 설정 | 값 |
|------|-----|
| Root Directory | *(비움 — 저장소 루트)* |
| Builder | Dockerfile (`Dockerfile`) |
| Start Command | *(비움 — Dockerfile CMD)* |

**Healthcheck:** `GET /api/health`

배포 후 확인:

- `https://<도메인>/api/health` → `{"status":"ok", ...}`
- `https://<도메인>/ko/` → 쇼핑몰 화면 + 상품 목록

---

## 3. 환경 변수 (선택)

| 변수 | 설명 |
|------|------|
| `DATABASE_URL` | MySQL Reference (필수) |
| `R2_*` | 이미지 업로드 (선택) |
| `ADMIN_API_KEY` | 관리자 API (선택) |
| `CORS_ORIGINS` | 커스텀 도메인 사용 시 |

`API_URL` / `NEXT_PUBLIC_API_URL` 은 **필요 없음** (같은 도메인 `/api`).

---

## 4. 옛 설정 정리

| 제거/중지 | 이유 |
|-----------|------|
| Netlify 사이트 | Railway가 프론트+API 담당 |
| Railway `shopping` (Next만 돌리던 서비스) | 루트 Dockerfile 서비스로 통합 |
| 별도 `api` 서비스 | 통합 Dockerfile에 포함 |

---

## 5. 문제 해결

| 증상 | 해결 |
|------|------|
| 상품 없음 / API error | `/api/health` 확인, MySQL `DATABASE_URL` Reference |
| 빈 화면 | Deploy 로그에서 `npm run build` 성공 여부 확인 |
| DB 연결 실패 | `DATABASE_URL` 형식 (`mysql://` → 자동 변환) |

로컬 Docker 테스트:

```powershell
cd d:\HARAL
docker build -t haral .
docker run -p 8000:8000 -e DATABASE_URL=sqlite:///./haral.db haral
```
