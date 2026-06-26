# HARAL — Netlify 프론트엔드 배포

프론트엔드(**haral-shop**)는 **Netlify**, API·DB는 **Railway**입니다.

---

## 1. Netlify Build settings (스크린샷 기준)

| 항목 | 값 |
|------|-----|
| **Base directory** | `haral-shop` |
| **Package directory** | *(비움)* |
| **Build command** | *(비움)* |
| **Publish directory** | *(비움 — 절대 `haral-shop`이나 `.next` 넣지 마세요)* |
| **Node.js** | **22** (`haral-shop/netlify.toml` + `.nvmrc`) |

> **Publish = Base** 이면 플러그인 오류:  
> `Your publish directory cannot be the same as the base directory`

> **Node 20** 이면 플러그인 오류:  
> `@netlify/plugin-nextjs` 는 **Node 22+** 필요

설정 파일: `haral-shop/netlify.toml` (저장소 루트 아님)

### Environment variables

| 변수 | 값 |
|------|-----|
| `NEXT_PUBLIC_API_URL` | Railway `api` URL (예: `https://api-production-xxxx.up.railway.app`) |

---

## 2. Railway (백엔드만)

| 서비스 | Root Directory |
|--------|----------------|
| **api** | `backend` |
| **mysql** | 플러그인 |

→ [RAILWAY.md](./RAILWAY.md)

---

## 3. 배포 후

1. Netlify **Deploys** → **Published**
2. Netlify URL `/ko` → 「진행 중인 행사」 배너

---

## 4. 문제 해결

| 오류 | 해결 |
|------|------|
| exit 254 | Base = `haral-shop`, 루트에서 빌드하지 않기 |
| publish = base | Publish directory **비우기** |
| Node 20 vs 22 | `NODE_VERSION=22` (이미 netlify.toml에 설정) |
| 상품 없음 | `NEXT_PUBLIC_API_URL` 확인 |
