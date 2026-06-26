# HARAL — Netlify 프론트엔드 배포

프론트 = **Netlify** · API = **Railway** → [RAILWAY.md](./RAILWAY.md)

---

## ★ 1. Environment variables (필수 — 상품이 안 나오면 여기)

Netlify → **Site configuration** → **Environment variables** → **Add a variable**

| Key | Value | Scopes |
|-----|-------|--------|
| `API_URL` | Railway **`api`** 서비스 URL | **Builds** (필수) |

예:
```
API_URL=https://api-production-xxxx.up.railway.app
```

> `shopping-production-....railway.app` 은 **옛 프론트(Railway web)** URL 입니다.  
> **`api` 서비스** 도메인을 넣어야 상품이 나옵니다.

변수 추가·변경 후 **반드시 Redeploy** 하세요. (`NEXT_PUBLIC_*` / `API_URL` 은 **빌드 시** 주입됩니다.)

---

## 2. Build settings (UI) — 전부 비우기

| 항목 | 값 |
|------|-----|
| Base directory | *(비움)* |
| Package directory | *(비움)* |
| Build command | *(비움)* |
| Publish directory | *(비움)* |

설정은 루트 `netlify.toml` 이 처리합니다.

---

## 3. Railway (백엔드)

| 서비스 | Root Directory |
|--------|----------------|
| **api** | `backend` |
| **mysql** | 플러그인 |

`api` 가 배포되고 `/api/health` 가 200이어야 상품이 표시됩니다.

---

## 4. 배포 후 확인

1. Netlify **Deploys** → Published  
2. `/ko` → 행사 배너 + **상품 목록**  
3. 상품 영역에 `API_URL is required` 가 보이면 → 변수 설정 후 **재배포**

---

## 5. 문제 해결

| 증상 | 해결 |
|------|------|
| `NEXT_PUBLIC_API_URL is required` / `API_URL is required` | Netlify에 `API_URL` 추가 → **Redeploy** |
| 상품 없음 / API error | Railway `api` + MySQL 확인 |
| `publish = base` | UI Build settings 전부 비우기 |
