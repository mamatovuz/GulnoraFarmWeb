// SQLite baza — Railway'da /data volume ichida saqlanadi (doimiy).
import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'

// Ma'lumotlar papkasi: Railway'da volume /data ga ulanadi.
// Lokal ishlashda ./data ishlatiladi.
export const DATA_DIR =
  process.env.DATA_DIR || (fs.existsSync('/data') ? '/data' : path.resolve('data'))
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads')

fs.mkdirSync(DATA_DIR, { recursive: true })
fs.mkdirSync(UPLOADS_DIR, { recursive: true })

const db = new Database(path.join(DATA_DIR, 'app.db'))
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS partners (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT DEFAULT '',
    image     TEXT NOT NULL,
    sort      INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s','now'))
  );

  CREATE TABLE IF NOT EXISTS news (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    title     TEXT NOT NULL,
    body      TEXT DEFAULT '',
    image     TEXT DEFAULT '',
    created_at INTEGER DEFAULT (strftime('%s','now'))
  );

  CREATE TABLE IF NOT EXISTS branches (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT NOT NULL,
    addr         TEXT DEFAULT '',
    near         TEXT DEFAULT '',
    name_ru      TEXT DEFAULT '',
    addr_ru      TEXT DEFAULT '',
    near_ru      TEXT DEFAULT '',
    hours        TEXT DEFAULT '08:00 – 24:00',
    phone        TEXT DEFAULT '',
    lat          TEXT DEFAULT '',
    lon          TEXT DEFAULT '',
    region       TEXT DEFAULT 'andijon',
    status       TEXT DEFAULT 'open',
    opening_date TEXT,
    image        TEXT DEFAULT '',
    created_at   INTEGER DEFAULT (strftime('%s','now'))
  );

  CREATE TABLE IF NOT EXISTS visits (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_id TEXT NOT NULL,
    ts         INTEGER DEFAULT (strftime('%s','now'))
  );
  CREATE INDEX IF NOT EXISTS idx_visits_ts ON visits(ts);

  -- Admin qoʻshadigan hududlar (filial filtri chiplari)
  CREATE TABLE IF NOT EXISTS regions (
    key        TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    name_ru    TEXT DEFAULT '',
    sort       INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s','now'))
  );

  -- Mijozlar sharhlari. status: pending | approved | rejected.
  -- featured=1 boʻlgan (koʻpi 4 ta) sharhlar bosh sahifada "Mijozlar fikri"da chiqadi.
  CREATE TABLE IF NOT EXISTS reviews (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    city       TEXT DEFAULT '',
    rating     INTEGER DEFAULT 5,
    text       TEXT NOT NULL,
    name_ru    TEXT DEFAULT '',
    city_ru    TEXT DEFAULT '',
    text_ru    TEXT DEFAULT '',
    status     TEXT DEFAULT 'pending',
    featured   INTEGER DEFAULT 0,
    sort       INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (strftime('%s','now'))
  );

  -- data.js dagi statik filiallarni tahrirlash/o'chirish uchun ustama (override).
  -- branch_id — statik filial IDsi (br1, br2, ...). hidden=1 boʻlsa filial yashiriladi.
  CREATE TABLE IF NOT EXISTS branch_overrides (
    branch_id    TEXT PRIMARY KEY,
    name         TEXT,
    addr         TEXT,
    near         TEXT,
    name_ru      TEXT DEFAULT '',
    addr_ru      TEXT DEFAULT '',
    near_ru      TEXT DEFAULT '',
    hours        TEXT,
    phone        TEXT,
    lat          TEXT,
    lon          TEXT,
    region       TEXT,
    status       TEXT,
    opening_date TEXT,
    image        TEXT DEFAULT '',
    hidden       INTEGER DEFAULT 0,
    updated_at   INTEGER DEFAULT (strftime('%s','now'))
  );
`)

// Migratsiya — eski bazalarga yetishmayotgan ustunlarni qoʻshadi
function ensureColumn(table, col, def = "TEXT DEFAULT ''") {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all()
  if (!cols.some((c) => c.name === col)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${def}`)
}
for (const table of ['branches', 'branch_overrides']) {
  ensureColumn(table, 'name_ru')
  ensureColumn(table, 'addr_ru')
  ensureColumn(table, 'near_ru')
}
// Eski bazalarda reviews jadvaliga yetishmayotgan ustunlar
for (const col of ['name_ru', 'city_ru', 'text_ru']) ensureColumn('reviews', col)
ensureColumn('reviews', 'status', "TEXT DEFAULT 'pending'")
ensureColumn('reviews', 'featured', 'INTEGER DEFAULT 0')
ensureColumn('reviews', 'sort', 'INTEGER DEFAULT 0')

// Boshlangʻich (data.js dagi) sharhlar — bazaga bir marta, tasdiqlangan va
// bosh sahifada koʻrinadigan (featured) qilib yoziladi. Admin keyin ularni
// oʻchirishi yoki oʻrniga mijoz sharhlarini qoʻyishi mumkin.
const reviewCount = db.prepare('SELECT COUNT(*) n FROM reviews').get().n
if (reviewCount === 0) {
  const seed = [
    { name: 'Dilnoza R.', city: 'Andijon', rating: 5, text: 'Har doim kerakli dorini shu yerdan topaman. Farmatsevtlar juda xushmuomala va bilimli. Rahmat, Gulnora Farm!', name_ru: 'Дилноза Р.', city_ru: 'Андижан', text_ru: 'Всегда нахожу здесь нужное лекарство. Фармацевты очень вежливые и знающие. Спасибо, Gulnora Farm!' },
    { name: 'Aziz M.', city: 'Asaka', rating: 5, text: 'Narxlari qulay, mahsulotlar original. Uyimga eng yaqin filial boʻlgani uchun doim shu yerdan olaman.', name_ru: 'Азиз М.', city_ru: 'Асака', text_ru: 'Цены доступные, товары оригинальные. Беру всегда здесь — ближайший филиал к дому.' },
    { name: 'Sevara T.', city: 'Andijon', rating: 5, text: 'Telegram bot orqali dori borligini tekshirib, borib oldim. Juda qulay xizmat, vaqtni tejadim.', name_ru: 'Севара Т.', city_ru: 'Андижан', text_ru: 'Проверила наличие через Telegram-бот и забрала. Очень удобно, сэкономила время.' },
    { name: 'Jasur K.', city: 'Xoʻjaobod', rating: 5, text: 'Tunda ham ochiq filiali borligi juda yordam berdi. Bolam kasal boʻlganda qutqardi.', name_ru: 'Жасур К.', city_ru: 'Ходжаабад', text_ru: 'Круглосуточный филиал очень выручил, когда ночью заболел ребёнок.' },
  ]
  const stmt = db.prepare(
    `INSERT INTO reviews (name, city, rating, text, name_ru, city_ru, text_ru, status, featured, sort)
     VALUES (@name,@city,@rating,@text,@name_ru,@city_ru,@text_ru,'approved',1,@sort)`,
  )
  seed.forEach((r, i) => stmt.run({ ...r, sort: i }))
}

export default db
