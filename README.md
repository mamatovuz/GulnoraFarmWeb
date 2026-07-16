# Gulnora Farm — veb-sayt

Andijon viloyati boʻylab **16 ta filialga** ega dorixonalar tarmogʻi — *Gulnora Farm* uchun rasmiy bir sahifali (landing) veb-sayt. React + Vite asosida qurilgan.

## Imkoniyatlar

- 🌐 **Ikki til** — Oʻzbekcha (UZ) va Ruscha (RU), bir tugma bilan almashtiriladi
- 🏥 **19 ta filial** — har biri manzil, moʻljal, ish vaqti va telefon bilan; Google Maps xaritasi va yoʻl koʻrsatish havolalari
- 📱 **Toʻliq moslashuvchan (responsive)** dizayn + mobil menyu
- ✨ Scroll-reveal animatsiyalari
- 📞 Aloqa formasi, Telegram bot va Instagram havolalari
- 💼 Vakansiya boʻlimi (Telegram bot orqali)

## Ishga tushirish

```bash
npm install      # paketlarni oʻrnatish
npm run dev      # http://localhost:5173 da ochiladi
```

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
