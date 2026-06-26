# HARAL Frontend — Railway PWA

Railway **web** 서비스로 배포하는 Next.js 프론트엔드입니다.

## Railway 설정

| 항목 | 값 |
|------|-----|
| Root Directory | `haral-shop` |
| Service Name | `web` |
| Start Command | `npm run start` (railway.toml) |

### 필수 환경 변수

```
NEXT_PUBLIC_API_URL=https://${{api.RAILWAY_PUBLIC_DOMAIN}}
```

백엔드 서비스 이름이 `api`가 아니면 `${{서비스이름.RAILWAY_PUBLIC_DOMAIN}}`으로 변경하세요.

## PWA

- 홈 화면 추가: `manifest.webmanifest`
- 오프라인 캐시: `public/sw.js`

배포 가이드: [../RAILWAY.md](../RAILWAY.md)
