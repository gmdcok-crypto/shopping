# HARAL Frontend (Next.js PWA)

정적 export 빌드 후 **FastAPI가 `backend/static/`에서 서빙**합니다.  
배포는 저장소 루트 `Dockerfile` → Railway 단일 서비스.

## 로컬 개발

```powershell
npm install
npm run dev
```

API는 `http://127.0.0.1:8000` (별도 터미널에서 `uvicorn`).

## 프로덕션과 동일하게 로컬 테스트

```powershell
npm run build
xcopy /E /I /Y out ..\backend\static
cd ..\backend
uvicorn app.main:app --reload --port 8000
```

→ http://localhost:8000/ko/

가이드: [../RAILWAY.md](../RAILWAY.md)
