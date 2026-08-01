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

  -- data.js dagi statik filiallarni tahrirlash/oʻchirish uchun ustama (override).
  -- branch_id — statik filial IDsi (br1, br2, ...). hidden=1 boʻlsa filial yashiriladi.
  CREATE TABLE IF NOT EXISTS branch_overrides (
    branch_id    TEXT PRIMARY KEY,
    name         TEXT,
    addr         TEXT,
    near         TEXT,
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

export default db
