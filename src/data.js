// Gulnora Farm — saytning barcha matnlari (UZ/RU) va filiallar maʼlumotlari
// Manba: claude.ai/design "Pharmacy website design" loyihasi

export const PHONE = '+998785553000'
export const PHONE_DISPLAY = '+998 78 555 30 00'
export const TELEGRAM = 'https://t.me/gulnorafarm_bot'
export const VACANCY_BOT = 'https://t.me/Gulnorafarmvacancy_bot'
export const INSTAGRAM = 'https://www.instagram.com/gulnorafarm.uz'

/* =========================================================================
   FILIAL RASMLARI  📸
   -------------------------------------------------------------------------
   1) Filial fotosini  public/photos/  papkasiga tashlang
      (masalan: public/photos/gorgaz.jpg)
   2) Quyida tegishli filial yoniga yo'lini yozing
      (masalan: br1: '/photos/gorgaz.jpg')
   Bo'sh ('') qoldirilsa — chiroyli placeholder ko'rinadi.
   Rasm yo'li har doim '/photos/...' bilan boshlanadi.
   ========================================================================= */
export const BRANCH_IMAGES = {
  br1: '',   // Gorgaz filiali
  br2: '',   // Eski shahar №1 filiali
  br3: '',   // Soy filiali
  br4: '',   // Yangi bozor filiali
  br5: '',   // Jalabek filiali
  br6: '',   // Soy №2 filiali
  br7: '',   // Sanchas filiali
  br8: '',   // Yangi bozor filiali №2
  br9: '',   // Paytugʻ filiali
  br10: '',  // Semashka filiali
  br11: '',  // Boston filiali
  br12: '',  // Kanechka filiali
  br13: '',  // Old Sitiy filiali
  br14: '',  // Asaka filiali
  br15: '',  // Qoʻrgʻontepa filiali
  br16: ''   // Xoʻjaobod filiali
}

// Hero (yuqori) va "Biz haqimizda" bo'limidagi katta rasmlar (ixtiyoriy)
export const HERO_IMAGE = ''   // masalan: '/photos/hero.jpg'
export const ABOUT_IMAGE = ''  // masalan: '/photos/jamoa.jpg'

/* =========================================================================
   TELEGRAM — ARIZALAR (backendsiz)
   -------------------------------------------------------------------------
   Saytdagi "Savol qoldiring" formasi to'g'ridan-to'g'ri brauzerdan
   Telegram Bot API orqali pastdagi kanalga xabar yuboradi.
   Bot SHU kanalda ADMIN bo'lishi shart (aks holda xabar bormaydi).

   🔐  Token va kanal ID kodda EMAS — ular  .env.local  faylida saqlanadi
       (u .gitignore orqali GitHub'ga yuklanmaydi). Birinchi marta sozlash:
         1) loyiha ildizida  .env.local  fayl yarating (.env.example dan nusxa)
         2) qiymatlarni yozing:
              VITE_TELEGRAM_BOT_TOKEN=...
              VITE_TELEGRAM_CHAT_ID=-100...
         3) npm run dev / npm run build qayta ishga tushiring
   ⚠️  Backendsiz yechimda token build qilingan JS ichida baribir ko'rinadi.
       Agar token oshkor bo'lib qolsa — @BotFather da /revoke qilib yangilang.
   ========================================================================= */
export const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || ''
export const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || ''

// Formadagi arizani Telegram kanaliga yuboradi
export async function sendLeadToTelegram({ name, phone, message, lang }) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error('Telegram sozlanmagan: .env.local fayliga VITE_TELEGRAM_BOT_TOKEN va VITE_TELEGRAM_CHAT_ID yozing')
  }
  const lines = [
    '🆕 <b>Yangi ariza — Gulnora Farm</b>',
    '',
    '👤 <b>Ism:</b> ' + esc(name),
    '📞 <b>Telefon:</b> ' + esc(phone),
  ]
  if (message) lines.push('💬 <b>Xabar:</b> ' + esc(message))
  lines.push('', '🌐 Til: ' + (lang === 'ru' ? 'Ruscha' : 'Oʻzbekcha'))
  lines.push('🕒 ' + new Date().toLocaleString(lang === 'ru' ? 'ru-RU' : 'uz-UZ'))

  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: lines.join('\n'),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })
  const data = await res.json().catch(() => ({ ok: false, description: 'Network error' }))
  if (!res.ok || !data.ok) throw new Error(data.description || 'Telegram xatoligi')
  return data
}

// HTML maxsus belgilarini xavfsizlash
function esc(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const uzBranches = [
  { id: 'br1', name: 'Gorgaz filiali', addr: 'Andijon sh., Gorgaz krugavoy', near: 'Televideniye tomonga chiqishda', hours: '08:00 – 24:00', phone: '+998 97 266 31 00', lat: '40.747291', lon: '72.361420', tag: '' },
  { id: 'br2', name: 'Eski shahar №1 filiali', addr: 'Andijon sh., Fitrat koʻchasi', near: 'Hamkorbank koʻchasi, Dunyo bozor oldida', hours: '08:00 – 24:00', phone: '+998 91 476 00 28', lat: '40.784818', lon: '72.346347', tag: '' },
  { id: 'br3', name: 'Soy filiali', addr: 'Andijon sh., krugavoyda', near: '3-Poliklinika qatorida', hours: '08:00 – 24:00', phone: '+998 97 272 15 55', lat: '40.7979344', lon: '72.3459594', tag: '' },
  { id: 'br4', name: 'Yangi bozor filiali', addr: 'Andijon sh., Boburshoh koʻchasi 37-B', near: 'Yangi bozor, Istanbul kafe qatorida', hours: '08:00 – 24:00', phone: '+998 95 917 17 46', lat: '40.7594818', lon: '72.3532151', tag: '' },
  { id: 'br5', name: 'Jalabek filiali', addr: 'A. Yoʻldashev koʻchasi 7-uy', near: 'Alpomish meros qatorida', hours: '08:00 – 24:00', phone: '+998 93 476 00 28', lat: '40.759345', lon: '72.334462', tag: '' },
  { id: 'br6', name: 'Soy №2 filiali', addr: 'Cholpon Shoh koʻchasi 46-uy', near: 'Jenshen qatorida', hours: '08:00 – 24:00', phone: '+998 88 475 00 28', lat: '40.796833', lon: '72.346242', tag: '' },
  { id: 'br7', name: 'Sanchas filiali', addr: 'Klinika Med Sanchas', near: 'Sanchas svetofori yonida', hours: '08:00 – 24:00', phone: '+998 87 295 11 00', lat: '40.810534', lon: '72.326574', tag: '' },
  { id: 'br8', name: 'Yangi bozor filiali №2', addr: 'Andijon sh., Boburshoh koʻchasi 37-B', near: 'Akmal farm yonida', hours: '08:00 – 24:00', phone: '+998 91 475 00 28', lat: '40.7594818', lon: '72.3532151', tag: '' },
  { id: 'br9', name: 'Paytugʻ filiali', addr: 'Shifokorlar koʻchasi 1-uy', near: 'Bolalar shifoxonasi koʻprigida', hours: '08:00 – 24:00', phone: '+998 95 111 50 44', lat: '40.895216', lon: '72.256457', tag: '' },
  { id: 'br10', name: 'Semashka filiali', addr: 'Mirpoʻstun koʻchasi', near: 'Toshkent mehmonxonasi oldida', hours: '08:00 – 24:00', phone: '+998 88 781 88 83', lat: '40.754213', lon: '72.375309', tag: '' },
  { id: 'br11', name: 'Boston filiali', addr: 'Gulbadanbegim koʻchasi 6a-uy', near: '211 Damas stoyankasi yonida', hours: '08:00 – 24:00', phone: '+998 90 544 00 28', lat: '40.773943', lon: '72.384646', tag: '' },
  { id: 'br12', name: 'Kanechka filiali', addr: 'Andijon sh., Furqat koʻchasi', near: 'Kanechka bozori roparasida', hours: '08:00 – 24:00', phone: '+998 90 203 39 03', lat: '40.743662', lon: '72.336832', tag: '' },
  { id: 'br13', name: 'Old Sitiy filiali', addr: 'Andijon sh., Abdurauf Fitrat 251-b', near: 'Old Sitiy hududida', hours: '08:00 – 24:00', phone: '+998 94 486 00 28', lat: '40.785320', lon: '72.347544', tag: '' },
  { id: 'br14', name: 'Asaka filiali', addr: 'Asaka sh., Umid koʻchasi', near: 'Dehqon bozor roparasida, tunel oldida', hours: '08:00 – 24:00', phone: '+998 88 779 10 01', lat: '40.646383', lon: '72.242480', tag: '' },
  { id: 'br15', name: 'Qoʻrgʻontepa filiali', addr: 'Qoʻrgʻontepa tumani', near: 'Ishonch savdo majmuasi yonida', hours: '08:00 – 24:00', phone: '+998 91 488 01 21', lat: '40.730607', lon: '72.759374', tag: '' },
  { id: 'br16', name: 'Xoʻjaobod filiali', addr: 'Xoʻjaobod tumani', near: 'Ishonch savdo majmuasi yonida', hours: '08:00 – 24:00', phone: '+998 90 203 00 28', lat: '40.669493', lon: '72.558542', tag: '' }
]

const ruBranches = [
  { id: 'br1', name: 'Филиал «Горгаз»', addr: 'Андижан, Горгаз кольцевая', near: 'У выезда к телевидению', hours: '08:00 – 24:00', phone: '+998 97 266 31 00', lat: '40.747291', lon: '72.361420', tag: '' },
  { id: 'br2', name: 'Филиал «Эски шахар №1»', addr: 'Андижан, ул. Фитрат', near: 'Рядом с «Дунё бозор»', hours: '08:00 – 24:00', phone: '+998 91 476 00 28', lat: '40.784818', lon: '72.346347', tag: '' },
  { id: 'br3', name: 'Филиал «Сой»', addr: 'Андижан, на кольцевой', near: 'Напротив 3-й поликлиники', hours: '08:00 – 24:00', phone: '+998 97 272 15 55', lat: '40.7979344', lon: '72.3459594', tag: '' },
  { id: 'br4', name: 'Филиал «Янги бозор»', addr: 'Андижан, ул. Бобуршох 37-Б', near: 'Рядом с кафе «Истанбул»', hours: '08:00 – 24:00', phone: '+998 95 917 17 46', lat: '40.7594818', lon: '72.3532151', tag: '' },
  { id: 'br5', name: 'Филиал «Жалабек»', addr: 'ул. А. Йулдашева, 7', near: 'Рядом с «Алпомиш мерос»', hours: '08:00 – 24:00', phone: '+998 93 476 00 28', lat: '40.759345', lon: '72.334462', tag: '' },
  { id: 'br6', name: 'Филиал «Сой №2»', addr: 'ул. Чолпон Шох, 46', near: 'Рядом с «Женшен»', hours: '08:00 – 24:00', phone: '+998 88 475 00 28', lat: '40.796833', lon: '72.346242', tag: '' },
  { id: 'br7', name: 'Филиал «Санчас»', addr: 'Клиника Мед Санчас', near: 'У светофора Санчас', hours: '08:00 – 24:00', phone: '+998 87 295 11 00', lat: '40.810534', lon: '72.326574', tag: '' },
  { id: 'br8', name: 'Филиал «Янги бозор №2»', addr: 'Андижан, ул. Бобуршох 37-Б', near: 'Рядом с «Акмал фарм»', hours: '08:00 – 24:00', phone: '+998 91 475 00 28', lat: '40.7594818', lon: '72.3532151', tag: '' },
  { id: 'br9', name: 'Филиал «Пайтуг»', addr: 'ул. Шифокорлар, 1', near: 'У моста детской больницы', hours: '08:00 – 24:00', phone: '+998 95 111 50 44', lat: '40.895216', lon: '72.256457', tag: '' },
  { id: 'br10', name: 'Филиал «Семашко»', addr: 'ул. Мирпустун', near: 'Напротив гостиницы «Ташкент»', hours: '08:00 – 24:00', phone: '+998 88 781 88 83', lat: '40.754213', lon: '72.375309', tag: '' },
  { id: 'br11', name: 'Филиал «Бостон»', addr: 'ул. Гулбаданбегим, 6а', near: 'Рядом со стоянкой 211 Дамас', hours: '08:00 – 24:00', phone: '+998 90 544 00 28', lat: '40.773943', lon: '72.384646', tag: '' },
  { id: 'br12', name: 'Филиал «Канечка»', addr: 'Андижан, ул. Фурката', near: 'Напротив рынка «Канечка»', hours: '08:00 – 24:00', phone: '+998 90 203 39 03', lat: '40.743662', lon: '72.336832', tag: '' },
  { id: 'br13', name: 'Филиал «Олд Сити»', addr: 'Андижан, Абдурауф Фитрат 251-б', near: 'Олд Сити', hours: '08:00 – 24:00', phone: '+998 94 486 00 28', lat: '40.785320', lon: '72.347544', tag: '' },
  { id: 'br14', name: 'Филиал «Асака»', addr: 'г. Асака, ул. Умид', near: 'Напротив дехканского рынка, у тоннеля', hours: '08:00 – 24:00', phone: '+998 88 779 10 01', lat: '40.646383', lon: '72.242480', tag: '' },
  { id: 'br15', name: 'Филиал «Кургантепа»', addr: 'Кургантепинский район', near: 'Рядом с ТЦ «Ишонч»', hours: '08:00 – 24:00', phone: '+998 91 488 01 21', lat: '40.730607', lon: '72.759374', tag: '' },
  { id: 'br16', name: 'Филиал «Ходжаабад»', addr: 'Ходжаабадский район', near: 'Рядом с ТЦ «Ишонч»', hours: '08:00 – 24:00', phone: '+998 90 203 00 28', lat: '40.669493', lon: '72.558542', tag: '' }
]

export const TR = {
  uz: {
    promo: 'Andijon viloyati boʻylab 16 ta filial — sizga eng yaqin Gulnora Farm',
    navAbout: 'Biz haqimizda', navServices: 'Yoʻnalishlar', navBranches: 'Filiallar', navVacancy: 'Vakansiya', navContact: 'Aloqa', navMenu: 'Menyu',
    call: 'Qoʻngʻiroq',
    heroEyebrow: 'Dorixonalar tarmogʻi',
    heroTitle: 'Sizga eng yaqin ishonchli dorixona',
    heroSub: 'Gulnora Farm — Andijon viloyati boʻylab kengayib borayotgan dorixonalar tarmogʻi. Har bir filialda original mahsulotlar va malakali farmatsevtlar maslahati.',
    ctaCall: 'Qoʻngʻiroq qilish', ctaBranches: 'Filiallarni koʻrish',
    netBadgeNum: '16', netBadgeLabel: 'filial', netBadgeSub: 'Andijon viloyati boʻylab',
    statYears: 'yillik tajriba', statBranches: 'filial', statClients: 'mamnun mijoz',
    feat1t: 'Litsenziyalangan', feat1d: 'Barcha filiallar rasmiy litsenziyaga ega',
    feat2t: 'Sifat kafolati', feat2d: 'Faqat sertifikatlangan mahsulotlar',
    feat3t: 'Keng tarmoq', feat3d: 'Shahar boʻylab qulay joylashuv',
    feat4t: 'Malakali jamoa', feat4d: 'Har bir filialda tajribali farmatsevtlar',
    aboutEyebrow: 'Biz haqimizda',
    aboutTitle: 'Yildan-yilga oʻsib borayotgan dorixonalar tarmogʻi',
    aboutText: 'Gulnora Farm 2019-yilda birinchi dorixonadan boshlangan. Bugun biz Andijon viloyati boʻylab 16 ta filialga egamiz va har bir mijozga bir xil yuqori sifatli xizmat koʻrsatamiz.',
    aboutNum: '16', aboutNumLabel: 'faol filial',
    aboutP1: 'Barcha filiallarda yagona sifat standarti',
    aboutP2: 'Tajribali farmatsevtlar jamoasi',
    aboutP3: 'Mijozga gʻamxoʻrlik va halol munosabat',
    svcTitle: 'Filiallarimizda nimalar bor', svcSub: 'Har bir Gulnora Farm filialida quyidagilarni topasiz',
    svc1t: 'Dori vositalari', svc1d: 'Retsept boʻyicha va retseptsiz original dorilar',
    svc2t: 'Vitamin va parvarish', svc2d: 'Vitaminlar, BADlar va shaxsiy parvarish mahsulotlari',
    svc3t: 'Tibbiy jihozlar', svc3d: 'Oʻlchov asboblari va tibbiy buyumlar',
    svc4t: 'Farmatsevt maslahati', svc4d: 'Malakali mutaxassisdan bepul maslahat',
    branchTitle: 'Bizning filiallar', branchSub: 'Sizga eng yaqin Gulnora Farm filialini tanlang',
    onMap: 'Xaritada', route: 'Yoʻl koʻrsatish', botLabel: 'Telegram bot',
    vacEyebrow: 'Vakansiya', vacTitle: 'Bizning jamoaga qoʻshiling',
    vacText: 'Gulnora Farm tarmogʻi tez oʻsmoqda — bizga farmatsevtlar, sotuvchi-maslahatchilar va boshqa mutaxassislar kerak. Barcha boʻsh ish oʻrinlari Telegram botimizda.',
    vacP1: 'Rasmiy ish', vacP2: 'Munosib maosh', vacP3: 'Karyera oʻsishi',
    vacBtn: 'Vakansiyalarni koʻrish',
    contactEyebrow: 'Aloqa', contactTitle: 'Biz bilan bogʻlaning',
    phoneLabel: 'Telefon', phoneValue: PHONE_DISPLAY,
    formTitle: 'Savol qoldiring', formName: 'Ismingiz', formPhone: 'Telefon raqamingiz', formMsg: 'Xabaringiz', formSend: 'Yuborish',
    formSending: 'Yuborilmoqda…',
    formThanks: 'Rahmat! Arizangiz qabul qilindi. Tez orada siz bilan bogʻlanamiz.',
    formError: 'Yuborishda xatolik yuz berdi. Iltimos, qaytadan urinib koʻring yoki telefon orqali bogʻlaning.',
    footTagline: 'Gulnora Farm — Andijon viloyati boʻylab ishonchli dorixonalar tarmogʻi.',
    footRights: 'Barcha huquqlar himoyalangan.', footMade: 'Sevgi bilan tayyorlangan',

    // Filial qidiruv / xarita
    regions: { all: 'Barchasi', andijon: 'Andijon shahri', asaka: 'Asaka', qurgontepa: 'Qoʻrgʻontepa', xojaobod: 'Xoʻjaobod', paytug: 'Paytugʻ' },
    searchPlaceholder: 'Filial yoki manzil boʻyicha qidiring…',
    nearMe: 'Menga eng yaqin',
    nearMeLoading: 'Aniqlanmoqda…',
    geoError: 'Joylashuvni aniqlab boʻlmadi. Brauzerda ruxsat bering.',
    resultsCount: (n, total) => `${total} tadan ${n} ta filial`,
    noResults: 'Hech narsa topilmadi. Boshqacha qidiring.',
    clearSearch: 'Tozalash',
    mapTitle: 'Barcha filiallar xaritada',
    openNow: 'Hozir ochiq', closedNow: 'Yopiq', open24: '24 soat', opensAtLabel: 'da ochiladi',
    away: 'uzoqlikda',

    // Mijozlar fikri
    reviewsEyebrow: 'Mijozlar fikri', reviewsTitle: 'Mijozlarimiz nima deydi',
    reviews: [
      { name: 'Dilnoza R.', city: 'Andijon', rating: 5, text: 'Har doim kerakli dorini shu yerdan topaman. Farmatsevtlar juda xushmuomala va bilimli. Rahmat, Gulnora Farm!' },
      { name: 'Aziz M.', city: 'Asaka', rating: 5, text: 'Narxlari qulay, mahsulotlar original. Uyimga eng yaqin filial boʻlgani uchun doim shu yerdan olaman.' },
      { name: 'Sevara T.', city: 'Andijon', rating: 5, text: 'Telegram bot orqali dori borligini tekshirib, borib oldim. Juda qulay xizmat, vaqtni tejadim.' },
      { name: 'Jasur K.', city: 'Xoʻjaobod', rating: 5, text: 'Tunda ham ochiq filiali borligi juda yordam berdi. Bolam kasal boʻlganda qutqardi.' }
    ],

    branches: uzBranches
  },
  ru: {
    promo: 'Более 16 филиалов в Андижанской области — Gulnora Farm рядом с вами',
    navAbout: 'О нас', navServices: 'Направления', navBranches: 'Филиалы', navVacancy: 'Вакансии', navContact: 'Контакты', navMenu: 'Меню',
    call: 'Позвонить',
    heroEyebrow: 'Сеть аптек',
    heroTitle: 'Надёжная аптека рядом с вами',
    heroSub: 'Gulnora Farm — растущая сеть аптек в Андижанской области. В каждом филиале — оригинальные товары и консультация квалифицированных фармацевтов.',
    ctaCall: 'Позвонить', ctaBranches: 'Смотреть филиалы',
    netBadgeNum: '16', netBadgeLabel: 'филиалов', netBadgeSub: 'в Андижанской области',
    statYears: 'лет опыта', statBranches: 'филиалов', statClients: 'довольных клиентов',
    feat1t: 'Лицензия', feat1d: 'Все филиалы имеют официальную лицензию',
    feat2t: 'Гарантия качества', feat2d: 'Только сертифицированные товары',
    feat3t: 'Широкая сеть', feat3d: 'Удобное расположение по городу',
    feat4t: 'Опытная команда', feat4d: 'В каждом филиале — опытные фармацевты',
    aboutEyebrow: 'О нас',
    aboutTitle: 'Сеть аптек, которая растёт год за годом',
    aboutText: 'Gulnora Farm началась в 2019 году с первой аптеки. Сегодня это сеть из более чем 16 филиалов в Андижанской области, и каждому клиенту мы оказываем одинаково высокий уровень сервиса.',
    aboutNum: '16', aboutNumLabel: 'действующих филиалов',
    aboutP1: 'Единый стандарт качества во всех филиалах',
    aboutP2: 'Опытная команда фармацевтов',
    aboutP3: 'Забота о клиенте и честное отношение',
    svcTitle: 'Что есть в наших филиалах', svcSub: 'В каждом филиале Gulnora Farm вы найдёте',
    svc1t: 'Лекарства', svc1d: 'Оригинальные препараты по рецепту и без',
    svc2t: 'Витамины и уход', svc2d: 'Витамины, БАД и средства личного ухода',
    svc3t: 'Медтехника', svc3d: 'Приборы измерения и медицинские изделия',
    svc4t: 'Консультация', svc4d: 'Бесплатная консультация специалиста',
    branchTitle: 'Наши филиалы', branchSub: 'Выберите ближайший к вам филиал Gulnora Farm',
    onMap: 'На карте', route: 'Построить маршрут', botLabel: 'Telegram-бот',
    vacEyebrow: 'Вакансии', vacTitle: 'Присоединяйтесь к нашей команде',
    vacText: 'Сеть Gulnora Farm быстро растёт — нам нужны фармацевты, продавцы-консультанты и другие специалисты. Все открытые вакансии — в нашем Telegram-боте.',
    vacP1: 'Официальное трудоустройство', vacP2: 'Достойная зарплата', vacP3: 'Карьерный рост',
    vacBtn: 'Смотреть вакансии',
    contactEyebrow: 'Контакты', contactTitle: 'Свяжитесь с нами',
    phoneLabel: 'Телефон', phoneValue: PHONE_DISPLAY,
    formTitle: 'Оставьте вопрос', formName: 'Ваше имя', formPhone: 'Номер телефона', formMsg: 'Сообщение', formSend: 'Отправить',
    formSending: 'Отправка…',
    formThanks: 'Спасибо! Заявка принята. Мы скоро с вами свяжемся.',
    formError: 'Ошибка при отправке. Попробуйте ещё раз или свяжитесь по телефону.',
    footTagline: 'Gulnora Farm — надёжная сеть аптек в Андижанской области.',
    footRights: 'Все права защищены.', footMade: 'Сделано с любовью',

    // Поиск филиалов / карта
    regions: { all: 'Все', andijon: 'Андижан', asaka: 'Асака', qurgontepa: 'Кургантепа', xojaobod: 'Ходжаабад', paytug: 'Пайтуг' },
    searchPlaceholder: 'Поиск по филиалу или адресу…',
    nearMe: 'Ближайший ко мне',
    nearMeLoading: 'Определяем…',
    geoError: 'Не удалось определить местоположение. Разрешите доступ в браузере.',
    resultsCount: (n, total) => `${n} из ${total} филиалов`,
    noResults: 'Ничего не найдено. Попробуйте иначе.',
    clearSearch: 'Очистить',
    mapTitle: 'Все филиалы на карте',
    openNow: 'Открыто', closedNow: 'Закрыто', open24: '24 часа', opensAtLabel: 'откроется в',
    away: 'от вас',

    // Отзывы
    reviewsEyebrow: 'Отзывы', reviewsTitle: 'Что говорят наши клиенты',
    reviews: [
      { name: 'Дилноза Р.', city: 'Андижан', rating: 5, text: 'Всегда нахожу здесь нужное лекарство. Фармацевты очень вежливые и знающие. Спасибо, Gulnora Farm!' },
      { name: 'Азиз М.', city: 'Асака', rating: 5, text: 'Цены доступные, товары оригинальные. Беру всегда здесь — ближайший филиал к дому.' },
      { name: 'Севара Т.', city: 'Андижан', rating: 5, text: 'Проверила наличие через Telegram-бот и забрала. Очень удобно, сэкономила время.' },
      { name: 'Жасур К.', city: 'Ходжаабад', rating: 5, text: 'Круглосуточный филиал очень выручил, когда ночью заболел ребёнок.' }
    ],

    branches: ruBranches
  }
}

// Filial hududi (qidiruv chiplari uchun). Nomlar TR.*.regions da tarjima qilinadi.
export const BRANCH_REGION = {
  br1: 'andijon', br2: 'andijon', br3: 'andijon', br4: 'andijon', br5: 'andijon',
  br6: 'andijon', br7: 'andijon', br8: 'andijon', br9: 'paytug', br10: 'andijon',
  br11: 'andijon', br12: 'andijon', br13: 'andijon', br14: 'asaka',
  br15: 'qurgontepa', br16: 'xojaobod'
}

export function withBranchUrls(branches) {
  return branches.map(b => {
    const mapUrl = 'https://www.google.com/maps?q=' + b.lat + ',' + b.lon + '&ll=' + b.lat + ',' + b.lon + '&z=16'
    const routeUrl = 'https://www.google.com/maps/dir/?api=1&destination=' + b.lat + ',' + b.lon
    return {
      ...b,
      mapUrl,
      routeUrl,
      lat: parseFloat(b.lat),
      lon: parseFloat(b.lon),
      region: BRANCH_REGION[b.id] || 'andijon',
      tel: (b.phone || '').replace(/[^\d+]/g, ''),
      img: BRANCH_IMAGES[b.id] || '' // filial fotosi (yuqoridagi BRANCH_IMAGES dan)
    }
  })
}

// ── Yordamchi funksiyalar ─────────────────────────────────────────────────

// Ikki nuqta orasidagi masofa (km) — Haversine formulasi
export function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formatDistance(km) {
  if (km == null) return ''
  return km < 1 ? Math.round(km * 1000) + ' m' : km.toFixed(1) + ' km'
}

// "08:00 – 24:00" kabi ish vaqtidan hozir ochiq/yopiqligini aniqlaydi
export function branchOpenStatus(hours, now = new Date()) {
  const m = (hours || '').match(/(\d{1,2}):(\d{2})\D+(\d{1,2}):(\d{2})/)
  if (!m) return { open: true, open24: false }
  let start = +m[1] * 60 + +m[2]
  let end = +m[3] * 60 + +m[4]
  const open24 = start === 0 && (end === 1440 || end === 0)
  const cur = now.getHours() * 60 + now.getMinutes()
  if (end <= start) end += 1440 // yarim tundan oshsa
  let c = cur
  const open = (c >= start && c < end) || (c + 1440 >= start && c + 1440 < end)
  const opensAt = m[1].padStart(2, '0') + ':' + m[2]
  return { open, open24, opensAt }
}
