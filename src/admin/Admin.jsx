// Gulnora Farm — boshqaruv paneli (/admin).
// Login: admin@gulnorafarm.uz / 123@Gulnorafarm (server env orqali oʻzgartiriladi).
import { useEffect, useState } from 'react'
import { api, getToken, setToken, clearToken } from '../api.js'
import { TR, BASE_REGIONS } from '../data.js'
import Logo from '../components/Logo.jsx'
import { Chart, Handshake, Bell, Pin, Plus, Trash, Logout, Close, Star, Chat, Check, Users } from '../components/icons.jsx'

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
  { key: 'reviews', label: 'Sharxlar', icon: Chat },
  { key: 'branches', label: 'Filiallar', icon: Pin },
  { key: 'regions', label: 'Hududlar', icon: Pin },
  { key: 'vacancies', label: 'Vakansiya', icon: Users },
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
          {tab === 'reviews' && <ReviewsPanel />}
          {tab === 'branches' && <BranchesPanel />}
          {tab === 'regions' && <RegionsPanel />}
          {tab === 'vacancies' && <VacanciesPanel />}
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
const BASE_REGION_OPTS = BASE_REGIONS.map((r) => [r.key, r.name]) // [[key, uz-nom], ...]
const emptyBranch = { name: '', addr: '', near: '', name_ru: '', addr_ru: '', near_ru: '', hours: '08:00 – 24:00', phone: '', lat: '', lon: '', region: 'andijon', status: 'open', opening_date: '' }
const STATIC_BRANCHES = TR.uz.branches // data.js dagi filiallar (asl UZ matn)
const STATIC_RU = Object.fromEntries(TR.ru.branches.map((b) => [b.id, b])) // asl RU matn (id boʻyicha)
const FIELD_KEYS = ['name', 'addr', 'near', 'hours', 'phone', 'lat', 'lon', 'region', 'status', 'opening_date']
const ALL_KEYS = [...FIELD_KEYS, 'name_ru', 'addr_ru', 'near_ru'] // forma toʻliq maydonlari

function BranchesPanel() {
  const [admin, setAdmin] = useState([])
  const [ovr, setOvr] = useState({}) // branch_id -> override
  const [regions, setRegions] = useState([]) // admin qoʻshgan hududlar
  const [editing, setEditing] = useState(null) // { mode:'new'|'static'|'admin', id, initial, image }
  const [err, setErr] = useState('')
  useAuthGuard(err)

  const load = () =>
    Promise.all([api.getBranches(), api.getOverrides(), api.getRegions()])
      .then(([a, o, r]) => {
        setAdmin(a)
        const m = {}; o.forEach((x) => { m[x.branch_id] = x }); setOvr(m)
        setRegions(r)
      })
      .catch((e) => setErr(e.message))
  useEffect(() => { load() }, [])

  // Hudud tanlovlari (asosiy + admin) va nom xaritasi
  const regionOpts = [...BASE_REGION_OPTS, ...regions.map((r) => [r.key, r.name])]
  const REGION_LABEL = Object.fromEntries(regionOpts)

  // Statik filiallar (ustama qoʻllangan holda) + admin qoʻshganlari
  const staticRows = STATIC_BRANCHES.map((s) => {
    const o = ovr[s.id]
    const eff = { ...s }
    if (o) FIELD_KEYS.forEach((k) => { if (o[k] != null && o[k] !== '') eff[k] = o[k] })
    return { ...eff, id: s.id, kind: 'static', hidden: !!(o && o.hidden), edited: !!(o && !o.hidden), image: o?.image || '' }
  })
  const adminRows = admin.map((b) => ({ ...b, kind: 'admin', edited: false, hidden: false }))
  const rows = [...staticRows, ...adminRows]

  const openNew = () => setEditing({ mode: 'new', id: null, initial: { ...emptyBranch }, image: '' })
  const openEdit = (r) => {
    const initial = {}; ALL_KEYS.forEach((k) => { initial[k] = r[k] || '' })
    if (r.kind === 'static') {
      // RU maydonlar: ustama toʻldirilgan boʻlsa oʻsha, aks holda asl (data.js) RU matni
      const o = ovr[r.id], rs = STATIC_RU[r.id] || {}
      initial.name_ru = (o && o.name_ru) || rs.name || ''
      initial.addr_ru = (o && o.addr_ru) || rs.addr || ''
      initial.near_ru = (o && o.near_ru) || rs.near || ''
    }
    if (!initial.opening_date) initial.opening_date = ''
    setEditing({ mode: r.kind === 'static' ? 'static' : 'admin', id: r.id, initial, image: r.image })
  }
  const del = async (r) => {
    if (!confirmDel()) return
    try { r.kind === 'static' ? await api.hideBranch(r.id) : await api.delBranch(r.id); load() }
    catch (e) { setErr(e.message) }
  }
  const restore = async (r) => {
    try { await api.restoreBranch(r.id); load() } catch (e) { setErr(e.message) }
  }

  return (
    <div>
      <PanelHead title="Filiallar" sub="Eski va yangi filiallarni tahrirlash yoki oʻchirish mumkin" />
      {err && <ErrorBox msg={err} />}
      <button onClick={openNew} style={{ ...btnPrimary, marginBottom: 16 }}><Plus size={18} /> Yangi filial qoʻshish</button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map((r) => (
          <div key={r.id} style={{ ...card, padding: 16, display: 'flex', gap: 14, alignItems: 'center', opacity: r.hidden ? .55 : 1 }}>
            {r.image
              ? <img src={r.image} alt="" style={{ width: 72, height: 56, objectFit: 'cover', borderRadius: 10, flex: 'none' }} />
              : <div style={{ width: 72, height: 56, borderRadius: 10, flex: 'none', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b5b5b5' }}><Pin size={20} /></div>}
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15.5, color: INK, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {r.name}
                {r.status === 'coming_soon' && <Tag text="tez kunda" c="#8b6f47" bg="#f5ede0" />}
                {r.kind === 'admin' && <Tag text="yangi" c="#3d6b51" bg="#edf2ee" />}
                {r.edited && <Tag text="tahrirlangan" c="#4a5a7a" bg="#eef1f7" />}
                {r.hidden && <Tag text="oʻchirilgan" c="#a4483c" bg="#fbf1ef" />}
              </div>
              <div style={{ fontSize: 13, color: MUTED, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {[REGION_LABEL[r.region] || r.region, r.addr, r.phone].filter(Boolean).join(' · ')}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flex: 'none' }}>
              {r.hidden ? (
                <button onClick={() => restore(r)} style={{ ...btn, padding: '8px 14px', background: '#edf2ee', color: '#35604a' }}>Qayta tiklash</button>
              ) : (
                <>
                  <button onClick={() => openEdit(r)} style={{ ...btn, padding: '8px 14px', background: '#f0f0f0', color: INK }}>Tahrirlash</button>
                  <button onClick={() => del(r)} title="Oʻchirish" style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #ecd5d1', background: '#fbf1ef', color: '#a4483c', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash size={16} /></button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {editing && <BranchForm state={editing} regionOpts={regionOpts} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load() }} />}
    </div>
  )
}

function Tag({ text, c, bg }) {
  return <span style={{ fontSize: 11.5, fontWeight: 700, color: c, background: bg, padding: '2px 8px', borderRadius: 999 }}>{text}</span>
}
function GroupLabel({ text }) {
  return <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, color: '#7a7a7a', margin: '18px 0 8px', letterSpacing: '.01em' }}>{text}</div>
}

// Filial qoʻshish / tahrirlash — modal oyna
function BranchForm({ state, onClose, onSaved, regionOpts = BASE_REGION_OPTS }) {
  const [f, setF] = useState(state.initial)
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF((o) => ({ ...o, [k]: e.target.value }))
  const isStatic = state.mode === 'static'

  const submit = async (e) => {
    e.preventDefault(); setErr('')
    if (!f.name.trim()) { setErr('Filial nomini kiriting'); return }
    setBusy(true)
    try {
      const fd = new FormData()
      ALL_KEYS.forEach((k) => fd.append(k, f[k] || ''))
      if (file) fd.append('image', file)
      if (state.mode === 'new') await api.addBranch(fd)
      else if (isStatic) await api.saveOverride(state.id, fd)
      else await api.editBranch(state.id, fd)
      onSaved()
    } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }

  const title = state.mode === 'new' ? 'Yangi filial' : 'Filialni tahrirlash'
  return (
    <div onMouseDown={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(20,20,22,.5)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '5vh 16px', zIndex: 100, overflowY: 'auto' }}>
      <form onMouseDown={(e) => e.stopPropagation()} onSubmit={submit} style={{ ...card, width: 640, maxWidth: '100%', padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 21, color: INK, margin: 0 }}>{title}</h2>
          <button type="button" onClick={onClose} style={{ border: 'none', background: '#f0f0f0', width: 34, height: 34, borderRadius: 10, cursor: 'pointer', color: INK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Close size={18} /></button>
        </div>
        {isStatic && <div style={{ fontSize: 12.5, color: MUTED, background: '#f6f6f6', borderRadius: 10, padding: '10px 12px', marginBottom: 14 }}>ℹ️ Bu asl (data.js) filial. Oʻzbekcha va ruscha matnni alohida kiritishingiz mumkin.</div>}
        {err && <ErrorBox msg={err} />}

        <GroupLabel text="🇺🇿 Oʻzbekcha matn" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="gf-form2">
          <Field label="Filial nomi *"><input style={input} value={f.name} onChange={set('name')} placeholder="Masalan: Markaz filiali" /></Field>
          <Field label="Ish vaqti"><input style={input} value={f.hours} onChange={set('hours')} placeholder="08:00 – 24:00" /></Field>
          <Field label="Manzil"><input style={input} value={f.addr} onChange={set('addr')} placeholder="Andijon sh., ... koʻchasi" /></Field>
          <Field label="Moʻljal (yaqin joy)"><input style={input} value={f.near} onChange={set('near')} placeholder="Masalan: bozor yonida" /></Field>
        </div>

        <GroupLabel text="🇷🇺 Ruscha matn (ixtiyoriy)" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="gf-form2">
          <Field label="Nomi (ruscha)"><input style={input} value={f.name_ru} onChange={set('name_ru')} placeholder="Например: Филиал «Центр»" /></Field>
          <Field label="Manzil (ruscha)"><input style={input} value={f.addr_ru} onChange={set('addr_ru')} placeholder="г. Андижан, ул. ..." /></Field>
          <Field label="Moʻljal (ruscha)"><input style={input} value={f.near_ru} onChange={set('near_ru')} placeholder="Например: рядом с рынком" /></Field>
        </div>

        <GroupLabel text="📍 Umumiy maʼlumot" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="gf-form2">
          <Field label="Telefon"><input style={input} value={f.phone} onChange={set('phone')} placeholder="+998 XX XXX XX XX" /></Field>
          <Field label="Hudud">
            <select style={input} value={f.region} onChange={set('region')}>
              {regionOpts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
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
        <div style={{ marginTop: 14 }}>
          <FileField label={'Filial rasmi (ixtiyoriy)' + (state.image ? ' — hozir rasm bor' : '')} file={file} onChange={setFile} />
        </div>
        <div style={{ fontSize: 12.5, color: MUTED, marginTop: 10 }}>💡 Koordinatani Google Maps'da joyni bosib, pastdagi raqamlardan olasiz.</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button type="submit" disabled={busy} style={{ ...btnPrimary, opacity: busy ? .7 : 1 }}>{busy ? 'Saqlanmoqda…' : 'Saqlash'}</button>
          <button type="button" onClick={onClose} style={{ ...btn, background: '#f0f0f0', color: INK }}>Bekor qilish</button>
        </div>
      </form>
    </div>
  )
}

/* ---------- SHARXLAR (mijozlar fikri) ---------- */
function AdminStars({ n }) {
  return (
    <div style={{ display: 'flex', gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={15} filled={i <= n} color="#f2b01e" empty="#e0e0e0" />)}
    </div>
  )
}
function ReviewsPanel() {
  const [items, setItems] = useState([])
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(0) // ishlov berilayotgan id
  useAuthGuard(err)

  const load = () => api.getReviews().then(setItems).catch((e) => setErr(e.message))
  useEffect(() => { load() }, [])

  const act = async (id, data) => {
    setErr(''); setBusy(id)
    try { await api.updateReview(id, data); await load() }
    catch (e) { setErr(e.message) } finally { setBusy(0) }
  }
  const del = async (id) => { if (!confirmDel()) return; setErr(''); try { await api.delReview(id); load() } catch (e) { setErr(e.message) } }

  const pending = items.filter((r) => r.status === 'pending')
  const approved = items.filter((r) => r.status === 'approved')
  const rejected = items.filter((r) => r.status === 'rejected')
  const featuredCount = approved.filter((r) => r.featured).length

  const ReviewCard = ({ r, children }) => (
    <div style={{ ...card, padding: 16, display: 'flex', gap: 14, alignItems: 'flex-start', borderColor: r.featured ? '#e7c96b' : LINE, background: r.featured ? '#fffdf5' : '#fff' }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <AdminStars n={r.rating} />
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: INK }}>{r.name}</span>
          {r.city && <span style={{ fontSize: 12.5, color: MUTED }}>· {r.city}</span>}
          {r.featured && <Tag text="saytda" c="#8a6d1a" bg="#fbf1cf" />}
        </div>
        <div style={{ fontSize: 13.5, color: BODY, marginTop: 8, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{r.text}</div>
        <div style={{ fontSize: 11.5, color: '#b0b0b0', marginTop: 8 }}>{new Date(r.created_at * 1000).toLocaleString('uz-UZ')}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 'none' }}>{children}</div>
    </div>
  )

  return (
    <div>
      <PanelHead title="Sharxlar" sub="Yangi sharhlar shu yerda tasdiqlanadi. Saytda istagancha sharh koʻrsatishingiz mumkin — ular bosh sahifada uzluksiz aylanib turadi." />
      {err && <ErrorBox msg={err} />}

      {/* Moderatsiya — yangi sharhlar */}
      <GroupLabel text={`🕒 Moderatsiyada (${pending.length})`} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {pending.map((r) => (
          <ReviewCard key={r.id} r={r}>
            <button onClick={() => act(r.id, { status: 'approved' })} disabled={busy === r.id} style={{ ...btn, padding: '8px 14px', background: '#edf2ee', color: '#35604a' }}><Check size={16} color="#35604a" /> Tasdiqlash</button>
            <button onClick={() => act(r.id, { status: 'rejected' })} disabled={busy === r.id} style={{ ...btn, padding: '8px 14px', background: '#f0f0f0', color: BODY }}>Rad etish</button>
            <button onClick={() => del(r.id)} title="Oʻchirish" style={delIconBtn}><Trash size={15} /></button>
          </ReviewCard>
        ))}
        {pending.length === 0 && <Empty text="Yangi sharhlar yoʻq" />}
      </div>

      {/* Tasdiqlangan — saytda koʻrsatishni tanlash (galichka) */}
      <GroupLabel text={`⭐ Tasdiqlangan sharhlar — saytda: ${featuredCount}`} />
      <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 10 }}>
        Belgilangan (galichkali) sharhlar bosh sahifadagi «Mijozlar fikri» boʻlimida koʻrinadi. Istagancha sharhni belgilashingiz mumkin — ular sahifada uzluksiz aylanib turadi.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {approved.map((r) => {
          return (
            <ReviewCard key={r.id} r={r}>
              <button
                onClick={() => act(r.id, { featured: r.featured ? 0 : 1 })}
                disabled={busy === r.id}
                style={{ ...btn, padding: '8px 14px', background: r.featured ? 'linear-gradient(180deg,#5a5a5a,#3f3f3f)' : '#f0f0f0', color: r.featured ? '#fff' : INK, cursor: 'pointer' }}>
                {r.featured ? <><Check size={16} color="#fff" /> Saytda</> : 'Saytga qoʻyish'}
              </button>
              <button onClick={() => del(r.id)} title="Oʻchirish" style={delIconBtn}><Trash size={15} /></button>
            </ReviewCard>
          )
        })}
        {approved.length === 0 && <Empty text="Tasdiqlangan sharhlar yoʻq" />}
      </div>

      {/* Rad etilganlar */}
      {rejected.length > 0 && (
        <>
          <GroupLabel text={`🚫 Rad etilgan (${rejected.length})`} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rejected.map((r) => (
              <ReviewCard key={r.id} r={r}>
                <button onClick={() => act(r.id, { status: 'approved' })} disabled={busy === r.id} style={{ ...btn, padding: '8px 14px', background: '#edf2ee', color: '#35604a' }}>Tiklash</button>
                <button onClick={() => del(r.id)} title="Oʻchirish" style={delIconBtn}><Trash size={15} /></button>
              </ReviewCard>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
const delIconBtn = { width: 36, height: 36, borderRadius: 10, border: '1px solid #ecd5d1', background: '#fbf1ef', color: '#a4483c', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }

/* ---------- HUDUDLAR ---------- */
function RegionsPanel() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [nameRu, setNameRu] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [edit, setEdit] = useState(null) // { key, name, name_ru }
  useAuthGuard(err)

  const load = () => api.getRegions().then(setItems).catch((e) => setErr(e.message))
  useEffect(() => { load() }, [])

  const add = async (e) => {
    e.preventDefault(); setErr('')
    if (!name.trim()) { setErr('Hudud nomini kiriting'); return }
    setBusy(true)
    try { await api.addRegion(name.trim(), nameRu.trim()); setName(''); setNameRu(''); load() }
    catch (e) { setErr(e.message) } finally { setBusy(false) }
  }
  const save = async () => {
    if (!edit.name.trim()) { setErr('Hudud nomini kiriting'); return }
    setErr('')
    try { await api.editRegion(edit.key, edit.name.trim(), edit.name_ru.trim()); setEdit(null); load() }
    catch (e) { setErr(e.message) }
  }
  const del = async (key) => { if (!confirmDel()) return; try { await api.delRegion(key); load() } catch (e) { setErr(e.message) } }

  return (
    <div>
      <PanelHead title="Hududlar" sub="Filial filtridagi tugmalar (chiplar). Yangi hudud qoʻshsangiz, filial qoʻshishda tanlash mumkin boʻladi" />
      {err && <ErrorBox msg={err} />}
      <form onSubmit={add} style={{ ...card, marginBottom: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="gf-form2">
          <Field label="Hudud nomi (oʻzbekcha) *"><input style={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Masalan: Marhamat tumani" /></Field>
          <Field label="Nomi (ruscha)"><input style={input} value={nameRu} onChange={(e) => setNameRu(e.target.value)} placeholder="Например: Мархаматский район" /></Field>
        </div>
        <button style={{ ...btnPrimary, marginTop: 14, opacity: busy ? .7 : 1 }} disabled={busy}><Plus size={18} /> {busy ? 'Qoʻshilmoqda…' : 'Hudud qoʻshish'}</button>
      </form>

      <div style={{ ...card, padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: MUTED, marginBottom: 10 }}>ASOSIY HUDUDLAR (oʻzgarmas)</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {BASE_REGIONS.map((r) => (
            <span key={r.key} style={{ fontSize: 13.5, fontWeight: 600, color: BODY, background: '#f2f2f2', padding: '7px 13px', borderRadius: 999 }}>{r.name}</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((r) => (
          edit && edit.key === r.key ? (
            <div key={r.key} style={{ ...card, padding: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="gf-form2">
                <Field label="Hudud nomi (oʻzbekcha) *"><input style={input} value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} autoFocus /></Field>
                <Field label="Nomi (ruscha)"><input style={input} value={edit.name_ru} onChange={(e) => setEdit({ ...edit, name_ru: e.target.value })} placeholder="Например: Мархаматский район" /></Field>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button onClick={save} style={{ ...btnPrimary, padding: '9px 18px' }}>Saqlash</button>
                <button onClick={() => setEdit(null)} style={{ ...btn, background: '#f0f0f0', color: INK }}>Bekor qilish</button>
              </div>
            </div>
          ) : (
            <div key={r.key} style={{ ...card, padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: INK }}>{r.name}</div>
                <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2 }}>{r.name_ru ? 'RU: ' + r.name_ru : 'ruscha nomi yoʻq'} · <span style={{ color: '#b0b0b0' }}>{r.key}</span></div>
              </div>
              <button onClick={() => setEdit({ key: r.key, name: r.name, name_ru: r.name_ru || '' })} style={{ ...btn, padding: '8px 14px', background: '#f0f0f0', color: INK, flex: 'none' }}>Tahrirlash</button>
              <button onClick={() => del(r.key)} title="Oʻchirish" style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #ecd5d1', background: '#fbf1ef', color: '#a4483c', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Trash size={16} /></button>
            </div>
          )
        ))}
        {items.length === 0 && <Empty text="Hozircha admin orqali qoʻshilgan hudud yoʻq" />}
      </div>
    </div>
  )
}

/* ---------- VAKANSIYA ---------- */
const emptyVacancy = { position: '', branch: '', count: '1', gender: 'any', shift_type: 'any', shift: '', work_time: '', experience: '', salary: '', requirements: '', active: 1 }
const GENDER_OPTS = [['male', '👨 Erkak'], ['female', '👩 Ayol'], ['any', '👥 Farqi yoʻq']]
const SHIFT_OPTS = [['day', '☀️ Kunduzgi'], ['night', '🌙 Kechki'], ['any', '🕒 Belgilanmagan']]
const GENDER_LBL = Object.fromEntries(GENDER_OPTS)

// Aylanish oraligʻini eng qulay birlikda koʻrsatish (sekund → {val, unit})
function secToUnit(sec) {
  if (sec > 0 && sec % 3600 === 0) return { val: sec / 3600, unit: 'h' }
  if (sec > 0 && sec % 60 === 0) return { val: sec / 60, unit: 'm' }
  return { val: sec, unit: 's' }
}
const UNIT_SEC = { s: 1, m: 60, h: 3600 }

function VacanciesPanel() {
  const [items, setItems] = useState([])
  const [rotVal, setRotVal] = useState(10)
  const [rotUnit, setRotUnit] = useState('m')
  const [editing, setEditing] = useState(null) // { mode:'new'|'edit', id, initial }
  const [savingRot, setSavingRot] = useState(false)
  const [rotSaved, setRotSaved] = useState(false)
  const [err, setErr] = useState('')
  useAuthGuard(err)

  const load = () => api.getAllVacancies().then((d) => {
    setItems(d.items || [])
    const u = secToUnit(d.rotateSeconds ?? 600)
    setRotVal(u.val); setRotUnit(u.unit)
  }).catch((e) => setErr(e.message))
  useEffect(() => { load() }, [])

  const saveRotation = async () => {
    setErr(''); setSavingRot(true); setRotSaved(false)
    try {
      const sec = Math.max(0, Math.round(Number(rotVal) || 0)) * UNIT_SEC[rotUnit]
      await api.setVacancySettings(sec)
      setRotSaved(true); setTimeout(() => setRotSaved(false), 2500)
    } catch (e) { setErr(e.message) } finally { setSavingRot(false) }
  }
  const toggleActive = async (v) => {
    setErr('')
    try { await api.editVacancy(v.id, { ...v, active: v.active ? 0 : 1 }); load() }
    catch (e) { setErr(e.message) }
  }
  const del = async (id) => { if (!confirmDel()) return; try { await api.delVacancy(id); load() } catch (e) { setErr(e.message) } }

  const activeCount = items.filter((v) => v.active).length

  return (
    <div>
      <PanelHead title="Vakansiya" sub="Ish oʻrinlari saytdagi «Vakansiya» boʻlimida bittalab koʻrsatiladi. Bir nechta boʻlsa — belgilangan vaqtda navbatma-navbat aylanadi." />
      {err && <ErrorBox msg={err} />}

      {/* Aylanish oraligʻi */}
      <div style={{ ...card, marginBottom: 16 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15.5, color: INK, marginBottom: 4 }}>🔄 Almashinish vaqti</div>
        <div style={{ fontSize: 13, color: MUTED, marginBottom: 12 }}>Bir nechta vakansiya boʻlganda, saytda har bir vakansiya qancha vaqtdan keyin keyingisiga almashishini tanlang.</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ width: 120 }}>
            <label style={label}>Qiymat</label>
            <input style={input} type="number" min="0" value={rotVal} onChange={(e) => setRotVal(e.target.value)} />
          </div>
          <div style={{ width: 150 }}>
            <label style={label}>Birlik</label>
            <select style={input} value={rotUnit} onChange={(e) => setRotUnit(e.target.value)}>
              <option value="s">Sekund</option>
              <option value="m">Daqiqa</option>
              <option value="h">Soat</option>
            </select>
          </div>
          <button onClick={saveRotation} disabled={savingRot} style={{ ...btnPrimary, opacity: savingRot ? .7 : 1 }}>
            {savingRot ? 'Saqlanmoqda…' : 'Saqlash'}
          </button>
          {rotSaved && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#35604a', fontSize: 13.5, fontWeight: 600 }}><Check size={16} color="#35604a" /> Saqlandi</span>}
        </div>
      </div>

      <button onClick={() => setEditing({ mode: 'new', id: null, initial: { ...emptyVacancy } })} style={{ ...btnPrimary, marginBottom: 16 }}>
        <Plus size={18} /> Yangi vakansiya qoʻshish
      </button>
      <div style={{ fontSize: 13, color: MUTED, marginBottom: 14 }}>Saytda koʻrinadigan vakansiyalar: <b style={{ color: INK }}>{activeCount}</b></div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((v) => (
          <div key={v.id} style={{ ...card, padding: 16, display: 'flex', gap: 14, alignItems: 'flex-start', opacity: v.active ? 1 : .55 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, color: INK, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                💼 {v.position}
                {!v.active && <Tag text="yashirilgan" c="#a4483c" bg="#fbf1ef" />}
              </div>
              <div style={{ fontSize: 13, color: MUTED, marginTop: 4, lineHeight: 1.5 }}>
                {[v.branch, GENDER_LBL[v.gender], v.work_time, v.salary].filter(Boolean).join(' · ')}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flex: 'none' }}>
              <button onClick={() => toggleActive(v)} title={v.active ? 'Yashirish' : 'Koʻrsatish'} style={{ ...btn, padding: '8px 12px', background: v.active ? '#f0f0f0' : '#edf2ee', color: v.active ? BODY : '#35604a', fontSize: 13 }}>
                {v.active ? 'Yashirish' : 'Koʻrsatish'}
              </button>
              <button onClick={() => setEditing({ mode: 'edit', id: v.id, initial: { ...emptyVacancy, ...v } })} style={{ ...btn, padding: '8px 14px', background: '#f0f0f0', color: INK }}>Tahrirlash</button>
              <button onClick={() => del(v.id)} title="Oʻchirish" style={delIconBtn}><Trash size={15} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <Empty text="Hozircha vakansiya yoʻq. «Yangi vakansiya qoʻshish» tugmasini bosing." />}
      </div>

      {editing && <VacancyForm state={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load() }} />}
    </div>
  )
}

function VacancyForm({ state, onClose, onSaved }) {
  const [f, setF] = useState(state.initial)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF((o) => ({ ...o, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault(); setErr('')
    if (!f.position.trim()) { setErr('Lavozimni kiriting'); return }
    setBusy(true)
    try {
      if (state.mode === 'new') await api.addVacancy(f)
      else await api.editVacancy(state.id, f)
      onSaved()
    } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }

  const title = state.mode === 'new' ? 'Yangi vakansiya' : 'Vakansiyani tahrirlash'
  return (
    <div onMouseDown={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(20,20,22,.5)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '5vh 16px', zIndex: 100, overflowY: 'auto' }}>
      <form onMouseDown={(e) => e.stopPropagation()} onSubmit={submit} style={{ ...card, width: 640, maxWidth: '100%', padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 21, color: INK, margin: 0 }}>{title}</h2>
          <button type="button" onClick={onClose} style={{ border: 'none', background: '#f0f0f0', width: 34, height: 34, borderRadius: 10, cursor: 'pointer', color: INK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Close size={18} /></button>
        </div>
        {err && <ErrorBox msg={err} />}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="gf-form2">
          <Field label="Lavozim *"><input style={input} value={f.position} onChange={set('position')} placeholder="Masalan: Farmatsevt" /></Field>
          <Field label="Filial"><input style={input} value={f.branch} onChange={set('branch')} placeholder="Masalan: Boston filiali" /></Field>
          <Field label="Kerakli xodim (soni)"><input style={input} value={f.count} onChange={set('count')} placeholder="1" /></Field>
          <Field label="Kimlar uchun">
            <select style={input} value={f.gender} onChange={set('gender')}>
              {GENDER_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </Field>
          <Field label="Smena turi">
            <select style={input} value={f.shift_type} onChange={set('shift_type')}>
              {SHIFT_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </Field>
          <Field label="Smena nomi (ixtiyoriy)"><input style={input} value={f.shift} onChange={set('shift')} placeholder="Masalan: Kechki smena" /></Field>
          <Field label="Ish vaqti"><input style={input} value={f.work_time} onChange={set('work_time')} placeholder="14:00 - 00:00" /></Field>
          <Field label="Tajriba"><input style={input} value={f.experience} onChange={set('experience')} placeholder="Masalan: 1 yil" /></Field>
          <Field label="Maosh"><input style={input} value={f.salary} onChange={set('salary')} placeholder="Masalan: Kelishiladi" /></Field>
        </div>
        <div style={{ marginTop: 14 }}>
          <label style={label}>Talablar (ixtiyoriy)</label>
          <textarea style={{ ...input, resize: 'vertical', minHeight: 90 }} value={f.requirements} onChange={set('requirements')} placeholder="Qoʻshimcha talablar…" />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 14, cursor: 'pointer', fontSize: 14, color: BODY }}>
          <input type="checkbox" checked={!!f.active} onChange={(e) => setF((o) => ({ ...o, active: e.target.checked ? 1 : 0 }))} style={{ width: 17, height: 17 }} />
          Saytda koʻrsatilsin
        </label>
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button type="submit" disabled={busy} style={{ ...btnPrimary, opacity: busy ? .7 : 1 }}>{busy ? 'Saqlanmoqda…' : 'Saqlash'}</button>
          <button type="button" onClick={onClose} style={{ ...btn, background: '#f0f0f0', color: INK }}>Bekor qilish</button>
        </div>
      </form>
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
