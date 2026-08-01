// Gulnora Farm — boshqaruv paneli (/admin).
// Login: admin@gulnorafarm.uz / 123@Gulnorafarm (server env orqali oʻzgartiriladi).
import { useEffect, useState } from 'react'
import { api, getToken, setToken, clearToken } from '../api.js'
import Logo from '../components/Logo.jsx'
import { Chart, Handshake, Bell, Pin, Plus, Trash, Logout, Close } from '../components/icons.jsx'

const INK = '#262626', BODY = '#565656', MUTED = '#6b6b6b', LINE = '#e4e4e4'
const DISPLAY = "'Quicksand', sans-serif"
const card = { background: '#fff', border: '1px solid ' + LINE, borderRadius: 18, padding: 22 }
const input = { width: '100%', border: '1px solid #d6d6d6', background: '#fafafa', borderRadius: 12, padding: '11px 14px', fontSize: 14.5, color: INK, outline: 'none', boxSizing: 'border-box' }
const label = { display: 'block', fontSize: 13, fontWeight: 600, color: BODY, marginBottom: 6 }
const btn = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: DISPLAY, fontWeight: 700, borderRadius: 12, border: 'none', cursor: 'pointer', padding: '11px 18px', fontSize: 14.5 }
const btnPrimary = { ...btn, background: 'linear-gradient(180deg,#5a5a5a 0%,#3f3f3f 100%)', color: '#fff' }

export default function Admin() {
  const [authed, setAuthed] = useState(!!getToken())
  if (!authed) return <Login onDone={() => setAuthed(true)} />
  return <Dashboard onLogout={() => { clearToken(); setAuthed(false) }} />
}

/* ---------- LOGIN ---------- */
function Login({ onDone }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr(''); setLoading(true)
    try {
      const { token } = await api.login(email.trim(), password)
      setToken(token)
      onDone()
    } catch (e) { setErr(e.message) } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg,#f7f7f7,#ededed)', padding: 20 }}>
      <form onSubmit={submit} style={{ ...card, width: 380, maxWidth: '100%', padding: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, justifyContent: 'center', marginBottom: 6 }}>
          <Logo size={34} /><span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 21, color: INK }}>Gulnora Farm</span>
        </div>
        <div style={{ textAlign: 'center', color: MUTED, fontSize: 14, marginBottom: 22 }}>Boshqaruv paneli</div>
        <div style={{ marginBottom: 14 }}>
          <label style={label}>Login (email)</label>
          <input style={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@gulnorafarm.uz" required autoFocus />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={label}>Parol</label>
          <input style={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        {err && <div style={{ background: '#f7ecea', border: '1px solid #ebd5d1', color: '#8e4239', borderRadius: 10, padding: '10px 12px', fontSize: 13.5, marginBottom: 14 }}>{err}</div>}
        <button type="submit" disabled={loading} style={{ ...btnPrimary, width: '100%', padding: 13, opacity: loading ? .7 : 1 }}>
          {loading ? 'Kirilmoqda…' : 'Kirish'}
        </button>
      </form>
    </div>
  )
}

/* ---------- DASHBOARD ---------- */
const TABS = [
  { key: 'stats', label: 'Statistika', icon: Chart },
  { key: 'partners', label: 'Hamkorlar', icon: Handshake },
  { key: 'news', label: 'Yangiliklar', icon: Bell },
  { key: 'branches', label: 'Filiallar', icon: Pin },
]

function Dashboard({ onLogout }) {
  const [tab, setTab] = useState('stats')
  return (
    <div style={{ minHeight: '100vh', background: '#f4f4f4' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid ' + LINE, position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 20px', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo size={28} /><span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, color: INK }}>Gulnora Farm</span>
            <span style={{ fontSize: 12, color: MUTED, background: '#f0f0f0', padding: '3px 9px', borderRadius: 999 }}>admin</span>
          </a>
          <button onClick={onLogout} style={{ ...btn, background: '#f0f0f0', color: INK }}><Logout size={17} /> Chiqish</button>
        </div>
      </header>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '20px', display: 'grid', gridTemplateColumns: '210px 1fr', gap: 20, alignItems: 'start' }} className="gf-admin-grid">
        <nav style={{ ...card, padding: 10, position: 'sticky', top: 82 }} className="gf-admin-nav">
          {TABS.map((tb) => {
            const Icon = tb.icon, on = tab === tb.key
            return (
              <button key={tb.key} onClick={() => setTab(tb.key)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', borderRadius: 11, border: 'none', cursor: 'pointer', marginBottom: 4, textAlign: 'left', fontFamily: DISPLAY, fontWeight: 700, fontSize: 14.5, background: on ? 'linear-gradient(180deg,#5a5a5a,#3f3f3f)' : 'transparent', color: on ? '#fff' : BODY }}>
                <Icon size={18} color={on ? '#fff' : '#8a8a8a'} /> {tb.label}
              </button>
            )
          })}
        </nav>
        <main style={{ minWidth: 0 }}>
          {tab === 'stats' && <StatsPanel />}
          {tab === 'partners' && <PartnersPanel />}
          {tab === 'news' && <NewsPanel />}
          {tab === 'branches' && <BranchesPanel />}
        </main>
      </div>
    </div>
  )
}

function useAuthGuard(err) {
  useEffect(() => {
    if (err && /avtorizatsiya|401/i.test(err)) { clearToken(); location.reload() }
  }, [err])
}

/* ---------- STATISTIKA ---------- */
function StatsPanel() {
  const [s, setS] = useState(null)
  const [err, setErr] = useState('')
  useAuthGuard(err)
  useEffect(() => { api.stats().then(setS).catch((e) => setErr(e.message)) }, [])

  const cards = [
    { n: s?.visitorsToday, t: 'Bugun kirganlar', d: 'Bugungi noyob tashrifchilar' },
    { n: s?.visitorsMonth, t: 'Shu oy', d: 'Oylik noyob tashrifchilar' },
    { n: s?.visitorsTotal, t: 'Jami', d: 'Boshidan beri jami tashrifchilar' },
    { n: s?.viewsToday, t: 'Bugungi koʻrishlar', d: 'Bugungi umumiy ochilishlar' },
    { n: s?.viewsTotal, t: 'Jami koʻrishlar', d: 'Umumiy sahifa ochilishlari' },
  ]
  return (
    <div>
      <PanelHead title="Statistika" sub="Saytga tashriflar (Andijon vaqti bilan)" />
      {err && <ErrorBox msg={err} />}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
        {cards.map((c, i) => (
          <div key={i} style={{ ...card, padding: 20 }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, color: INK }}>{s ? c.n : '…'}</div>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: INK, marginTop: 6 }}>{c.t}</div>
            <div style={{ fontSize: 12.5, color: MUTED, marginTop: 3, lineHeight: 1.4 }}>{c.d}</div>
          </div>
        ))}
      </div>
      <div style={{ ...card, marginTop: 16, fontSize: 13.5, color: MUTED }}>
        Batafsil statistika Google Analytics'da ham koʻrinadi: <b style={{ color: INK }}>G-K4KWDXGWD4</b> (analytics.google.com).
      </div>
    </div>
  )
}

/* ---------- HAMKORLAR ---------- */
function PartnersPanel() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  useAuthGuard(err)

  const load = () => api.getPartners().then(setItems).catch((e) => setErr(e.message))
  useEffect(() => { load() }, [])

  const add = async (e) => {
    e.preventDefault(); setErr('')
    if (!file) { setErr('Rasm tanlang'); return }
    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('name', name); fd.append('image', file)
      await api.addPartner(fd)
      setName(''); setFile(null); e.target.reset(); load()
    } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }
  const del = async (id) => { if (!confirmDel()) return; await api.delPartner(id); load() }

  return (
    <div>
      <PanelHead title="Hamkorlar" sub="Rasmlar landing sahifada oʻngdan chapga aylanib turadi" />
      {err && <ErrorBox msg={err} />}
      <form onSubmit={add} style={{ ...card, marginBottom: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="gf-form2">
          <div>
            <label style={label}>Hamkor nomi (ixtiyoriy)</label>
            <input style={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Masalan: Pfizer" />
          </div>
          <FileField label="Logotip / rasm" file={file} onChange={setFile} />
        </div>
        <button style={{ ...btnPrimary, marginTop: 14, opacity: busy ? .7 : 1 }} disabled={busy}><Plus size={18} /> {busy ? 'Qoʻshilmoqda…' : 'Qoʻshish'}</button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14 }}>
        {items.map((p) => (
          <div key={p.id} style={{ ...card, padding: 14, textAlign: 'center', position: 'relative' }}>
            <div style={{ height: 84, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={p.image} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ fontSize: 13, color: BODY, marginTop: 8, fontWeight: 600 }}>{p.name || '—'}</div>
            <DelBtn onClick={() => del(p.id)} />
          </div>
        ))}
        {items.length === 0 && <Empty text="Hozircha hamkorlar yoʻq" />}
      </div>
    </div>
  )
}

/* ---------- YANGILIKLAR ---------- */
function NewsPanel() {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  useAuthGuard(err)

  const load = () => api.getNews().then(setItems).catch((e) => setErr(e.message))
  useEffect(() => { load() }, [])

  const add = async (e) => {
    e.preventDefault(); setErr('')
    if (!title.trim()) { setErr('Sarlavha kiriting'); return }
    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('title', title); fd.append('body', body)
      if (file) fd.append('image', file)
      await api.addNews(fd)
      setTitle(''); setBody(''); setFile(null); e.target.reset(); load()
    } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }
  const del = async (id) => { if (!confirmDel()) return; await api.delNews(id); load() }

  return (
    <div>
      <PanelHead title="Yangiliklar" sub="Navbardagi qoʻngʻiroq belgisida koʻrinadi" />
      {err && <ErrorBox msg={err} />}
      <form onSubmit={add} style={{ ...card, marginBottom: 18 }}>
        <div style={{ marginBottom: 14 }}>
          <label style={label}>Sarlavha</label>
          <input style={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Yangilik sarlavhasi" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={label}>Matn</label>
          <textarea style={{ ...input, resize: 'vertical', minHeight: 90 }} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Yangilik matni…" />
        </div>
        <FileField label="Rasm (ixtiyoriy)" file={file} onChange={setFile} />
        <button style={{ ...btnPrimary, marginTop: 14, opacity: busy ? .7 : 1 }} disabled={busy}><Plus size={18} /> {busy ? 'Eʼlon qilinmoqda…' : 'Eʼlon qilish'}</button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((n) => (
          <div key={n.id} style={{ ...card, display: 'flex', gap: 14, alignItems: 'flex-start', position: 'relative' }}>
            {n.image && <img src={n.image} alt="" style={{ width: 96, height: 72, objectFit: 'cover', borderRadius: 10, flex: 'none' }} />}
            <div style={{ minWidth: 0, flex: 1, paddingRight: 30 }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, color: INK }}>{n.title}</div>
              {n.body && <div style={{ fontSize: 13.5, color: BODY, marginTop: 5, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{n.body}</div>}
            </div>
            <DelBtn onClick={() => del(n.id)} />
          </div>
        ))}
        {items.length === 0 && <Empty text="Hozircha yangiliklar yoʻq" />}
      </div>
    </div>
  )
}

/* ---------- FILIALLAR ---------- */
const REGIONS = [
  ['andijon', 'Andijon shahri'], ['asaka', 'Asaka'], ['qurgontepa', 'Qoʻrgʻontepa'],
  ['xojaobod', 'Xoʻjaobod'], ['paytug', 'Paytugʻ'],
]
const emptyBranch = { name: '', addr: '', near: '', hours: '08:00 – 24:00', phone: '', lat: '', lon: '', region: 'andijon', status: 'open', opening_date: '' }

function BranchesPanel() {
  const [items, setItems] = useState([])
  const [f, setF] = useState(emptyBranch)
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  useAuthGuard(err)

  const load = () => api.getBranches().then(setItems).catch((e) => setErr(e.message))
  useEffect(() => { load() }, [])
  const set = (k) => (e) => setF((o) => ({ ...o, [k]: e.target.value }))

  const add = async (e) => {
    e.preventDefault(); setErr('')
    if (!f.name.trim()) { setErr('Filial nomini kiriting'); return }
    setBusy(true)
    try {
      const fd = new FormData()
      Object.entries(f).forEach(([k, v]) => fd.append(k, v))
      if (file) fd.append('image', file)
      await api.addBranch(fd)
      setF(emptyBranch); setFile(null); e.target.reset(); load()
    } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }
  const del = async (id) => { if (!confirmDel()) return; await api.delBranch(id); load() }

  return (
    <div>
      <PanelHead title="Filiallar" sub="Bu yerda qoʻshilgan filiallar saytdagi roʻyxat va xaritaga chiqadi" />
      {err && <ErrorBox msg={err} />}
      <form onSubmit={add} style={{ ...card, marginBottom: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="gf-form2">
          <Field label="Filial nomi *"><input style={input} value={f.name} onChange={set('name')} placeholder="Masalan: Markaz filiali" /></Field>
          <Field label="Telefon"><input style={input} value={f.phone} onChange={set('phone')} placeholder="+998 XX XXX XX XX" /></Field>
          <Field label="Manzil"><input style={input} value={f.addr} onChange={set('addr')} placeholder="Andijon sh., ... koʻchasi" /></Field>
          <Field label="Moʻljal (yaqin joy)"><input style={input} value={f.near} onChange={set('near')} placeholder="Masalan: bozor yonida" /></Field>
          <Field label="Ish vaqti"><input style={input} value={f.hours} onChange={set('hours')} placeholder="08:00 – 24:00" /></Field>
          <Field label="Hudud">
            <select style={input} value={f.region} onChange={set('region')}>
              {REGIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </Field>
          <Field label="Kenglik (lat)"><input style={input} value={f.lat} onChange={set('lat')} placeholder="40.783430" /></Field>
          <Field label="Uzunlik (lon)"><input style={input} value={f.lon} onChange={set('lon')} placeholder="72.350380" /></Field>
          <Field label="Holati">
            <select style={input} value={f.status} onChange={set('status')}>
              <option value="open">Ochiq (faoliyatda)</option>
              <option value="coming_soon">Tez kunda ochiladi</option>
            </select>
          </Field>
          {f.status === 'coming_soon' && (
            <Field label="Ochilish sanasi"><input style={input} type="date" value={f.opening_date} onChange={set('opening_date')} /></Field>
          )}
        </div>
        <div style={{ marginTop: 14 }}><FileField label="Filial rasmi (ixtiyoriy)" file={file} onChange={setFile} /></div>
        <div style={{ fontSize: 12.5, color: MUTED, marginTop: 10 }}>
          💡 Koordinatani Google Maps'da joyni bosib, pastdagi raqamlardan olasiz (masalan 40.78, 72.35).
        </div>
        <button style={{ ...btnPrimary, marginTop: 14, opacity: busy ? .7 : 1 }} disabled={busy}><Plus size={18} /> {busy ? 'Qoʻshilmoqda…' : 'Filial qoʻshish'}</button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((b) => (
          <div key={b.id} style={{ ...card, display: 'flex', gap: 14, alignItems: 'center', position: 'relative' }}>
            {b.image && <img src={b.image} alt="" style={{ width: 84, height: 64, objectFit: 'cover', borderRadius: 10, flex: 'none' }} />}
            <div style={{ minWidth: 0, flex: 1, paddingRight: 30 }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, color: INK }}>
                {b.name} {b.status === 'coming_soon' && <span style={{ fontSize: 12, color: '#8b6f47', fontWeight: 600 }}>· tez kunda</span>}
              </div>
              <div style={{ fontSize: 13, color: MUTED, marginTop: 3 }}>{b.addr}{b.phone ? ' · ' + b.phone : ''}</div>
            </div>
            <DelBtn onClick={() => del(b.id)} />
          </div>
        ))}
        {items.length === 0 && <Empty text="Hozircha admin orqali qoʻshilgan filial yoʻq" />}
      </div>
    </div>
  )
}

/* ---------- Umumiy kichik komponentlar ---------- */
function PanelHead({ title, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, color: INK, margin: 0 }}>{title}</h1>
      {sub && <div style={{ fontSize: 14, color: MUTED, marginTop: 4 }}>{sub}</div>}
    </div>
  )
}
function Field({ label: l, children }) {
  return <div><label style={label}>{l}</label>{children}</div>
}
function FileField({ label: l, file, onChange }) {
  return (
    <div>
      <label style={label}>{l}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <label style={{ ...btn, background: '#f0f0f0', color: INK, cursor: 'pointer', flex: 'none' }}>
          Fayl tanlash
          <input type="file" accept="image/*" onChange={(e) => onChange(e.target.files[0] || null)} style={{ display: 'none' }} />
        </label>
        <span style={{ fontSize: 13, color: file ? INK : MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {file ? file.name : 'Fayl tanlanmagan'}
        </span>
      </div>
    </div>
  )
}
function DelBtn({ onClick }) {
  return (
    <button onClick={onClick} title="Oʻchirish" style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderRadius: 9, border: '1px solid #ecd5d1', background: '#fbf1ef', color: '#a4483c', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Trash size={16} />
    </button>
  )
}
function ErrorBox({ msg }) {
  return <div style={{ background: '#f7ecea', border: '1px solid #ebd5d1', color: '#8e4239', borderRadius: 12, padding: '11px 14px', fontSize: 13.5, marginBottom: 16 }}>{msg}</div>
}
function Empty({ text }) {
  return <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: MUTED, fontSize: 14.5, padding: '30px 10px' }}>{text}</div>
}
function confirmDel() { return window.confirm('Rostdan oʻchirilsinmi?') }
