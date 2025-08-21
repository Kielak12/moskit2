# MoskitoMobil — dynamic (Cloudflare Pages + Functions + D1)

- `/admin` panel (login `123` / `123` lub ENV: `ADMIN_USER`/`ADMIN_PASS`)
- Opinie i formularze lądują w **D1** (binding name: `DB`)
- Endpointy w `functions/api/*`
- Brak build command, output dir: `/`

## Konfiguracja D1 (Pages → Settings → Functions → D1 bindings)
- Binding name: `DB`
- Database: wybierz swoją D1

## Test
- POST `/api/login` { "user":"123","pass":"123" } → Set-Cookie
- GET `/api/me` → 200
- POST `/api/reviews` → 200 (potem zaakceptuj w panelu)
- GET `/api/appointments` (po zalogowaniu) → 200
