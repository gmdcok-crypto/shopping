# HARAL — Netlify 프론트엔드 배포

프론트엔드(**haral-shop**)는 **Netlify**, API·DB는 **Railway**입니다.

```
GitHub (monorepo)
├── haral-shop/  →  Netlify (프론트)
└── backend/       →  Railway api + MySQL
```

---

## 1. Netlify 사이트 설정

[Netlify Dashboard](https://app.netlify.com) → Site configuration → **Build & deploy**

| 항목 | 값 |
|------|-----|
| **Base directory** | `haral-shop` *(또는 비움 — `netlify.toml`이 지정)* |
| **Build command** | *(비움 — `netlify.toml` 사용)* |
| **Publish directory** | *(비움 — Next.js 플러그인이 처리)* |

> UI에 `npm run build` + `publish: .next`가 **루트**로 직접 설정되어 있으면 **삭제**하세요.  
> 그게 `exit code 254` 오류 원인입니다.

### 필수 환경 변수 (Environment variables)

| 변수 | 값 |
|------|-----|
| `NEXT_PUBLIC_API_URL` | Railway `api` 서비스 URL (예: `https://api-production-xxxx.up.railway.app`) |

Railway `api` 서비스가 없으면 상품 목록이 비어 있을 수 있습니다.

---

## 2. Railway (백엔드만)

| 서비스 | Root Directory | 역할 |
|--------|----------------|------|
| **api** | `backend` | FastAPI |
| **mysql** | (플러그인) | DB |
| ~~web~~ | — | **Netlify 쓰면 Railway web 불필요** |

자세한 API·MySQL·R2 설정: [RAILWAY.md](./RAILWAY.md)

---

## 3. 배포 후 확인

1. Netlify → **Deploys** → 최신 **Published**
2. Netlify 사이트 URL `/ko` → **「진행 중인 행사」** 배너 슬라이드
3. 상품이 보이려면 Railway `api` + MySQL 연결 확인

---

## 4. 문제 해결

| 증상 | 해결 |
|------|------|
| `build.command failed` exit 254 | Netlify UI에서 루트 빌드 설정 삭제, `netlify.toml` 사용 |
| 배너 안 보임 | Netlify 최신 배포 성공 여부 확인, 시크릿 창으로 접속 |
| 상품 없음 | `NEXT_PUBLIC_API_URL` → Railway api 도메인 확인 |
