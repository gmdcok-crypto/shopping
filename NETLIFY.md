# HARAL — Netlify 프론트엔드 배포

프론트 = **Netlify** · API = **Railway** → [RAILWAY.md](./RAILWAY.md)

---

## ★ Build settings (UI) — 전부 비우기

Netlify UI → **Site configuration** → **Build & deploy** → **Build settings**

| 항목 | 값 |
|------|-----|
| **Base directory** | *(비움)* |
| **Package directory** | *(비움)* |
| **Build command** | *(비움)* |
| **Publish directory** | *(비움)* |

> UI에 `haral-shop` / `.next` / `npm run build` 가 남아 있으면 **삭제** 후 Save.  
> UI 설정이 `netlify.toml` 보다 **우선**합니다.

모든 설정은 저장소 **루트** `netlify.toml` 이 담당합니다:

```toml
base = "haral-shop"
command = "npm run build"
publish = ".next"      # haral-shop/.next (base와 다름)
NODE_VERSION = "22"
```

### 자주 나는 오류

| 오류 | 원인 | 해결 |
|------|------|------|
| `publish directory cannot be the same as base` | UI에 Base=`haral-shop` + Publish 비움 | **UI 전부 비우기** |
| Node 20 vs 22 | 구버전 Node | `netlify.toml`에 Node 22 (이미 설정됨) |
| exit 254 | 루트에서 빌드 | `netlify.toml` base 사용 |

---

## Environment variables

| 변수 | 값 |
|------|-----|
| `NEXT_PUBLIC_API_URL` | Railway `api` URL |

---

## 배포

1. UI Build settings **전부 비운 뒤** Save
2. **Deploys** → **Trigger deploy**
3. Netlify URL `/ko` 확인
