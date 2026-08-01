# Gulnora Farm — veb-sayt

Andijon viloyati boʻylab **19f ta filialga** ega dorixonalar tarmogʻi — *Gulnora Farm* uchun rasmiy bir sahifali (landing) veb-sayt. React + Vite asosida qurilgan.

## Imkoniyatlar

- 🌐 **Ikki til** — Oʻzbekcha (UZ) va Ruscha (RU), bir tugma bilan almashtiriladi
- 🏥 **19 ta filial** — har biri manzil, moʻljal, ish vaqti va telefon bilan; Google Maps xaritasi va yoʻl koʻrsatish havolalari
- 📱 **Toʻliq moslashuvchan (responsive)** dizayn + mobil menyu
- ✨ Scroll-reveal animatsiyalari
- 📞 Aloqa formasi, Telegram bot va Instagram havolalari
- 💼 Vakansiya boʻlimi (Telegram bot orqali)

## Imkoniyatlar (yangi)

- 🔐 **Admin panel** — `/admin` sahifasi, login/parol bilan
- 🤝 **Hamkorlarimiz** — landing sahifada rasmlar oʻngdan chapga aylanib turadi; admin paneldan rasm yuklab qoʻshiladi
- 🔔 **Yangiliklar** — navbardagi qoʻngʻiroq belgisida; admin rasm + matn bilan eʼlon qiladi
- 🏥 **Filial qoʻshish** — admin paneldan yangi filial (rasm fayldan yuklanadi) qoʻshiladi
- 📊 **Statistika** — bugun / shu oy / jami nechta odam saytga kirgani admin panelda koʻrinadi

## Ishga tushirish (lokal, 2 ta terminal)

```bash
npm install          # paketlarni oʻrnatish (bir marta)

# 1-terminal — backend (SQLite + API), 3000-portda
npm run server

# 2-terminal — frontend (Vite), 5173-portda
npm run dev
```

Sayt: http://localhost:5173 · Admin panel: http://localhost:5173/admin

**Admin login (default):**
`admin@gulnorafarm.uz` / `123@Gulnorafarm`
(Railway'da `ADMIN_EMAIL` / `ADMIN_PASSWORD` orqali oʻzgartiriladi.)

## Railway'ga deploy (SQLite + doimiy volume)

1. Loyihani GitHub'ga yuklang va Railway'da **New Project → Deploy from GitHub**.
2. **Variables** boʻlimiga qoʻshing:
   ```
   DATA_DIR=/data
   ADMIN_EMAIL=admin@gulnorafarm.uz
   ADMIN_PASSWORD=123@Gulnorafarm
   JWT_SECRET=<uzun tasodifiy satr>
   ```
   (Telegram uchun avvalgi `VITE_TELEGRAM_*` qiymatlarni ham qoʻshing — ular build vaqtida kerak.)
3. **Volume** yarating va **Mount path** ni `/data` qilib bogʻlang.
   Baza (`app.db`) va yuklangan rasmlar shu volume'da saqlanadi — deploy'lar orasida yoʻqolmaydi.
4. Railway avtomatik: `npm run build` (frontend) → `npm start` (server) qiladi (`nixpacks.toml`).
   Server statik saytni va `/api` ni bitta portda beradi (`PORT` ni Railway oʻzi beradi).

## Telegram ariza yuborish (backendsiz) — sozlash

Saytdagi "Savol qoldiring" formasi arizani to'g'ridan-to'g'ri Telegram kanaliga yuboradi.
Token va kanal ID maxfiy — ular `.env.local` faylida saqlanadi (GitHub'ga **yuklanmaydi**).

1. `.env.example` faylidan nusxa olib `.env.local` yarating
2. Qiymatlarni to'ldiring:
   ```
   VITE_TELEGRAM_BOT_TOKEN=<@BotFather dan olingan token>
   VITE_TELEGRAM_CHAT_ID=-100xxxxxxxxxx
   ```
3. Bot o'sha kanalda **admin** bo'lishi shart
4. `npm run dev` / `npm run build` ni qayta ishga tushiring

> ⚠️ Backendsiz yechimda token build qilingan JS ichida ko'rinadi. Token oshkor bo'lsa,
> [@BotFather](https://t.me/BotFather) da `/revoke` qilib yangilang va `.env.local` ni yangilang.

## Build (ishlab chiqarish uchun)

```bash
npm run build    # natija: dist/ papkasida
npm run preview  # build qilingan saytni koʻrish
```

## Tuzilma

```
src/
  App.jsx              — barcha boʻlimlar (Header, Hero, Filiallar, Vakansiya, Aloqa, Footer)
  data.js              — UZ/RU matnlar va 19 filial maʼlumotlari
  index.css            — global uslublar, responsive, animatsiyalar
  components/
    Logo.jsx           — Gulnora Farm belgisi (vektor)
    ImageSlot.jsx      — rasm joylari (foto qoʻyish uchun)
    icons.jsx          — SVG ikonkalar
```

## Rasmlar qoʻshish

Hozircha rasm joylari (`ImageSlot`) placeholder koʻrinishida. Haqiqiy fotosuratlarni qoʻshish uchun
`ImageSlot` komponentiga `src` xususiyatini bering, masalan:

```jsx
<ImageSlot src="/photos/filial.jpg" placeholder="Dorixona fotosi" ... />
```

## Aloqa

- Telegram: [@gulnorafarm_bot](https://t.me/gulnorafarm_bot)
- Vakansiya: [@Gulnorafarmvacancy_bot](https://t.me/Gulnorafarmvacancy_bot)
- Instagram: [@gulnorafarm.uz](https://www.instagram.com/gulnorafarm.uz)
