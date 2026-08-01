// Gulnora Farm — backend (Express + SQLite).
// Statik saytni (dist) va /api endpointlarini bitta portda beradi.
import express from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import db, { UPLOADS_DIR } from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const PORT = process.env.PORT || 3000
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gulnorafarm.uz'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123@Gulnorafarm'
const JWT_SECRET = process.env.JWT_SECRET || 'gulnora-farm-secret-change-me'
const TZ = '+5 hours' // Andijon (UTC+5) — bugun/oy chegaralari uchun

const app = express()
app.use(express.json())

/* ---------- Fayl yuklash (rasm) ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = (path.extname(file.originalname) || '.jpg').toLowerCase()
    cb(null, Date.now() + '-' + crypto.randomBytes(6).toString('hex') + ext)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true)
    else cb(new Error('Faqat rasm fayllari'))
  },
})
const imgUrl = (filename) => (filename ? '/uploads/' + filename : '')

/* ---------- Auth ---------- */
function safeEqual(a, b) {
  const ba = Buffer.from(String(a))
  const bb = Buffer.from(String(b))
  if (ba.length !== bb.length) return false
  return crypto.timingSafeEqual(ba, bb)
}
function auth(req, res, next) {
  const h = req.headers.authorization || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : ''
  try {
    jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Avtorizatsiya talab qilinadi' })
  }
}

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {}
  if (safeEqual(email, ADMIN_EMAIL) && safeEqual(password, ADMIN_PASSWORD)) {
    const token = jwt.sign({ role: 'admin', email }, JWT_SECRET, { expiresIn: '30d' })
    return res.json({ token })
  }
  res.status(401).json({ error: 'Login yoki parol notoʻgʻri' })
})

/* ---------- Statistika: tashrif yozish ---------- */
app.post('/api/visit', (req, res) => {
  const vid = String((req.body && req.body.visitorId) || '').slice(0, 64)
  if (vid) db.prepare('INSERT INTO visits (visitor_id) VALUES (?)').run(vid)
  res.json({ ok: true })
})

app.get('/api/stats', auth, (req, res) => {
  const q = (where) =>
    db.prepare(`SELECT COUNT(DISTINCT visitor_id) n FROM visits WHERE ${where}`).get().n
  const v = (where) =>
    db.prepare(`SELECT COUNT(*) n FROM visits WHERE ${where}`).get().n
  const today = `date(ts,'unixepoch','${TZ}') = date('now','${TZ}')`
  const month = `strftime('%Y-%m', ts,'unixepoch','${TZ}') = strftime('%Y-%m','now','${TZ}')`
  res.json({
    visitorsToday: q(today),
    visitorsMonth: q(month),
    visitorsTotal: q('1=1'),
    viewsToday: v(today),
    viewsTotal: v('1=1'),
  })
})

/* ---------- Hamkorlar ---------- */
app.get('/api/partners', (req, res) => {
  const rows = db.prepare('SELECT * FROM partners ORDER BY sort ASC, id ASC').all()
  res.json(rows.map((r) => ({ id: r.id, name: r.name, image: imgUrl(r.image) })))
})
app.post('/api/partners', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Rasm tanlanmadi' })
  const name = (req.body.name || '').trim()
  const info = db
    .prepare('INSERT INTO partners (name, image) VALUES (?, ?)')
    .run(name, req.file.filename)
  res.json({ id: info.lastInsertRowid, name, image: imgUrl(req.file.filename) })
})
app.delete('/api/partners/:id', auth, (req, res) => {
  removeRowImage('partners', req.params.id)
  db.prepare('DELETE FROM partners WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

/* ---------- Yangiliklar ---------- */
app.get('/api/news', (req, res) => {
  const rows = db.prepare('SELECT * FROM news ORDER BY id DESC').all()
  res.json(
    rows.map((r) => ({
      id: r.id,
      title: r.title,
      body: r.body,
      image: imgUrl(r.image),
      created_at: r.created_at,
    })),
  )
})
app.post('/api/news', auth, upload.single('image'), (req, res) => {
  const title = (req.body.title || '').trim()
  const body = (req.body.body || '').trim()
  if (!title) return res.status(400).json({ error: 'Sarlavha kiritilmadi' })
  const file = req.file ? req.file.filename : ''
  const info = db.prepare('INSERT INTO news (title, body, image) VALUES (?, ?, ?)').run(title, body, file)
  res.json({ id: info.lastInsertRowid, title, body, image: imgUrl(file) })
})
app.delete('/api/news/:id', auth, (req, res) => {
  removeRowImage('news', req.params.id)
  db.prepare('DELETE FROM news WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

/* ---------- Filiallar (admin qoʻshadigan) ---------- */
const BRANCH_FIELDS = ['name', 'addr', 'near', 'hours', 'phone', 'lat', 'lon', 'region', 'status', 'opening_date']
app.get('/api/branches', (req, res) => {
  const rows = db.prepare('SELECT * FROM branches ORDER BY id ASC').all()
  res.json(rows.map((r) => ({ ...r, id: 'db' + r.id, image: imgUrl(r.image) })))
})
app.post('/api/branches', auth, upload.single('image'), (req, res) => {
  const b = {}
  for (const f of BRANCH_FIELDS) b[f] = (req.body[f] || '').trim()
  if (!b.name) return res.status(400).json({ error: 'Filial nomi kiritilmadi' })
  if (b.status !== 'coming_soon') b.status = 'open'
  b.opening_date = b.status === 'coming_soon' ? b.opening_date || null : null
  const file = req.file ? req.file.filename : ''
  const info = db
    .prepare(
      `INSERT INTO branches (name, addr, near, hours, phone, lat, lon, region, status, opening_date, image)
       VALUES (@name,@addr,@near,@hours,@phone,@lat,@lon,@region,@status,@opening_date,@image)`,
    )
    .run({ ...b, hours: b.hours || '08:00 – 24:00', region: b.region || 'andijon', image: file })
  res.json({ id: 'db' + info.lastInsertRowid })
})
app.put('/api/branches/:id', auth, upload.single('image'), (req, res) => {
  const id = String(req.params.id).replace(/^db/, '')
  const row = db.prepare('SELECT * FROM branches WHERE id = ?').get(id)
  if (!row) return res.status(404).json({ error: 'Filial topilmadi' })
  const b = {}
  for (const f of BRANCH_FIELDS) b[f] = (req.body[f] || '').trim()
  if (!b.name) return res.status(400).json({ error: 'Filial nomi kiritilmadi' })
  if (b.status !== 'coming_soon') b.status = 'open'
  b.opening_date = b.status === 'coming_soon' ? b.opening_date || null : null
  let image = row.image
  if (req.file) {
    if (row.image) { const p = path.join(UPLOADS_DIR, row.image); fs.existsSync(p) && fs.unlink(p, () => {}) }
    image = req.file.filename
  }
  db.prepare(
    `UPDATE branches SET name=@name, addr=@addr, near=@near, hours=@hours, phone=@phone,
      lat=@lat, lon=@lon, region=@region, status=@status, opening_date=@opening_date, image=@image WHERE id=@id`,
  ).run({ ...b, hours: b.hours || '08:00 – 24:00', region: b.region || 'andijon', image, id })
  res.json({ ok: true })
})
app.delete('/api/branches/:id', auth, (req, res) => {
  const id = String(req.params.id).replace(/^db/, '')
  removeRowImage('branches', id)
  db.prepare('DELETE FROM branches WHERE id = ?').run(id)
  res.json({ ok: true })
})

/* ---------- Statik filiallar ustamasi (tahrirlash / yashirish) ---------- */
app.get('/api/branch-overrides', (req, res) => {
  const rows = db.prepare('SELECT * FROM branch_overrides').all()
  res.json(rows.map((r) => ({ ...r, image: imgUrl(r.image), hidden: !!r.hidden })))
})
app.put('/api/branch-overrides/:id', auth, upload.single('image'), (req, res) => {
  const branchId = String(req.params.id)
  const b = {}
  for (const f of BRANCH_FIELDS) b[f] = (req.body[f] || '').trim()
  if (!b.name) return res.status(400).json({ error: 'Filial nomi kiritilmadi' })
  if (b.status !== 'coming_soon') b.status = 'open'
  b.opening_date = b.status === 'coming_soon' ? b.opening_date || null : null
  const existing = db.prepare('SELECT image FROM branch_overrides WHERE branch_id = ?').get(branchId)
  let image = existing ? existing.image : ''
  if (req.file) {
    if (existing && existing.image) { const p = path.join(UPLOADS_DIR, existing.image); fs.existsSync(p) && fs.unlink(p, () => {}) }
    image = req.file.filename
  }
  db.prepare(
    `INSERT INTO branch_overrides
       (branch_id, name, addr, near, hours, phone, lat, lon, region, status, opening_date, image, hidden, updated_at)
     VALUES (@branch_id,@name,@addr,@near,@hours,@phone,@lat,@lon,@region,@status,@opening_date,@image,0,strftime('%s','now'))
     ON CONFLICT(branch_id) DO UPDATE SET
       name=@name, addr=@addr, near=@near, hours=@hours, phone=@phone, lat=@lat, lon=@lon,
       region=@region, status=@status, opening_date=@opening_date, image=@image, hidden=0, updated_at=strftime('%s','now')`,
  ).run({ ...b, branch_id: branchId, image })
  res.json({ ok: true })
})
// Statik filialni yashirish (oʻchirish)
app.post('/api/branch-overrides/:id/hide', auth, (req, res) => {
  const branchId = String(req.params.id)
  db.prepare(
    `INSERT INTO branch_overrides (branch_id, hidden, updated_at)
     VALUES (?, 1, strftime('%s','now'))
     ON CONFLICT(branch_id) DO UPDATE SET hidden=1, updated_at=strftime('%s','now')`,
  ).run(branchId)
  res.json({ ok: true })
})
// Ustamani butunlay olib tashlash (asl holatga qaytarish)
app.post('/api/branch-overrides/:id/restore', auth, (req, res) => {
  const branchId = String(req.params.id)
  const row = db.prepare('SELECT image FROM branch_overrides WHERE branch_id = ?').get(branchId)
  if (row && row.image) { const p = path.join(UPLOADS_DIR, row.image); fs.existsSync(p) && fs.unlink(p, () => {}) }
  db.prepare('DELETE FROM branch_overrides WHERE branch_id = ?').run(branchId)
  res.json({ ok: true })
})

// Yozuv o'chirilganda rasm faylini ham o'chiradi
function removeRowImage(table, id) {
  const row = db.prepare(`SELECT image FROM ${table} WHERE id = ?`).get(id)
  if (row && row.image) {
    const p = path.join(UPLOADS_DIR, row.image)
    fs.existsSync(p) && fs.unlink(p, () => {})
  }
}

/* ---------- Statik fayllar ---------- */
app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d' }))
app.use(express.static(path.join(ROOT, 'dist')))

// SPA fallback — /admin va boshqa yoʻllar index.html ga tushadi
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
    return res.status(404).json({ error: 'Topilmadi' })
  }
  res.sendFile(path.join(ROOT, 'dist', 'index.html'))
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(400).json({ error: err.message || 'Xatolik' })
})

app.listen(PORT, () => console.log(`Gulnora Farm server: http://localhost:${PORT}`))
