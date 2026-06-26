# HARAL

한국 거주 외국인용 할랄 쇼핑몰

## 구조 (Railway 단일 서비스)

```
HARAL/
├── backend/       FastAPI — API + MySQL
├── haral-shop/    Next.js PWA (빌드 → backend/static)
└── Dockerfile     프론트 정적 export + FastAPI 한 컨테이너
```

| URL | 처리 |
|-----|------|
| `/api/*` | FastAPI |
| `/ko/`, `/en/` … | 정적 PWA (Next export) |
| `/` | `/ko/` 리다이렉트 |

## 배포 (택 1)

| 방식 | 프론트 | API | 문서 |
|------|--------|-----|------|
| **분리** (record 패턴) | Netlify | Railway | [NETLIFY.md](./NETLIFY.md) |
| **단일** | Railway | Railway | [RAILWAY.md](./RAILWAY.md) B |

## 로컬 실행

**터미널 1 — API + (빌드된) 프론트**

```powershell
cd d:\HARAL\backend
pip install -r requirements.txt
# .env 에 DATABASE_URL=sqlite:///./haral.db (로컬)
uvicorn app.main:app --reload --port 8000
```

**터미널 2 — 프론트 개발 (핫 리로드)**

```powershell
cd d:\HARAL\haral-shop
npm install
npm run dev
```

개발 시 `npm run dev`는 `:3000`, API는 `:8000` (`api.ts`가 자동 연결).

프로덕션과 동일하게 한 서버로 보려면:

```powershell
cd d:\HARAL\haral-shop
npm run build
xcopy /E /I /Y out ..\backend\static
cd ..\backend
uvicorn app.main:app --reload --port 8000
```

## 데이터

- **MySQL** (Railway) / SQLite (로컬): 상품, 주문, 회원
- **Cloudflare R2**: 상품 이미지 (선택)
- 첫 배포 시 12개 샘플 상품 자동 시드
