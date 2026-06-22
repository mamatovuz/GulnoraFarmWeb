📸 FILIAL VA BOSHQA RASMLAR SHU PAPKAGA
=======================================

1) Filial fotosini shu papkaga (public/photos/) tashlang.
   Masalan:  public/photos/gorgaz.jpg

2) Soʻngra  src/data.js  faylini oching va BRANCH_IMAGES ichida
   tegishli filial yoniga rasm yoʻlini yozing. Masalan:

       export const BRANCH_IMAGES = {
         br1: '/photos/gorgaz.jpg',   // Gorgaz filiali
         br2: '/photos/eski-shahar.jpg',
         ...
       }

   ⚠️  Yoʻl har doim  /photos/...  bilan boshlanadi (public soʻzini yozmang).

3) Hero (yuqori) va "Biz haqimizda" rasmlari uchun ham xuddi shunday:

       export const HERO_IMAGE = '/photos/hero.jpg'
       export const ABOUT_IMAGE = '/photos/jamoa.jpg'

Bo'sh ('') qoldirilgan joyda chiroyli placeholder koʻrinadi.

Tavsiyalar:
- Filial fotosi: ~800×500 px (yoki shunga yaqin gorizontal), .jpg yoki .webp
- Hero/About: ~1000×900 px
- Fayl nomida boʻshliq va oʻzbekcha harflardan foydalanmang
  (yaxshi: gorgaz.jpg,  yomon: "Gorgaz filiali.jpg")
