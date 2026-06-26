# HARAL — Netlify 프론트 + Railway API

`record`의 `client/netlify.toml`과 같은 **분리 구조**입니다.

```
Netlify (haral-shop/out)     Railway (FastAPI)
     │                              │
     │  /ko/  정적 PWA               │
     │  /api/* ─── redirect ───────► /api/products …
```

---

## 1. Railway (API)

프론트를 Netlify에 두면 Railway는 **API만** 담당합니다.

| 설정 | 값 |
|------|-----|
| Dockerfile | `Dockerfile.api` (또는 `backend/Dockerfile`) |
| Root Directory | `backend` *(Dockerfile.api 쓸 때는 루트)* |
| Healthcheck | `/api/health` |
| MySQL | `DATABASE_URL` Reference |

통합 `Dockerfile`(프론트+API 한 서버)을 써도 API URL만 Netlify redirect에 넣으면 됩니다.

---

## 2. Netlify (프론트)

**Site configuration → Build & deploy** — UI 값은 **전부 비움** (`netlify.toml` 사용)

| 항목 | 값 |
|------|-----|
| Base directory | *(비움)* |
| Build command | *(비움)* |
| Publish directory | *(비움)* |

**Plugins:** `@netlify/plugin-nextjs` **제거** (정적 `out/` 배포 — 플러그인 불필요)

### redirect API URL 수정

`netlify.toml`의 Railway 주소를 **실제 API 도메인**으로 변경:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://<your-railway-api>.up.railway.app/api/:splat"
  status = 200
  force = true
```

변경 후 **Trigger deploy**.

---

## 3. 배포 후 확인

1. `https://<netlify-site>.netlify.app/ko/` — 화면
2. Network → `/api/products` — 200
3. `https://<railway-api>/api/health` — 200

---

## 4. 문제 해결

| 증상 | 해결 |
|------|------|
| `publish directory cannot be the same as base` | UI Build settings 비우기, `@netlify/plugin-nextjs` 제거 |
| 상품 API error 500 | `netlify.toml`의 Railway URL이 **API** 도메인인지 확인 |
| 빌드 스킵됨 | `ignore = "exit 0"` 없는지 확인 |

API 상세: [RAILWAY.md](./RAILWAY.md)
