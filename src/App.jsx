import { useEffect, useMemo, useRef, useState } from 'react'
import { TR, withBranchUrls, sendLeadToTelegram, distanceKm, formatDistance, branchOpenStatus, PHONE, PHONE_DISPLAY, TELEGRAM, VACANCY_BOT, INSTAGRAM, HERO_IMAGE, ABOUT_IMAGE } from './data.js'
import Logo from './components/Logo.jsx'
import ImageSlot from './components/ImageSlot.jsx'
import BranchMap from './components/BranchMap.jsx'
import CountUp from './components/CountUp.jsx'
import Testimonials from './components/Testimonials.jsx'
import FloatingUI from './components/FloatingUI.jsx'
import {
  Pin, Phone, Telegram, Instagram, Shield, Check, Gear, Users,
  Pill, Heart, Activity, Chat, Clock, Info, Navigate, Menu, Close
} from './components/icons.jsx'

// Brend palitrasi — bitta manbadan: logo foni #767676 (sof neytral, R=G=B).
// To'liq shkala src/index.css dagi :root o'zgaruvchilarida.
const BRAND = '#767676'   // ★ logo rangi — urg'u, faol holat, bezak
const ACCENT = '#4f4f4f'  // asosiy tugmalar (oq matn bilan 8.2:1 kontrast)
const INK = '#262626'     // sarlavhalar va to'q yuzalar
const BODY = '#565656'    // asosiy matn (7.4:1)
const MUTED = '#6b6b6b'   // ikkilamchi matn (5.3:1)
const LINE = '#e4e4e4'    // chegaralar
const TINT = '#efefef'    // ikonka uyalari, chiplar

// Qorong'i bo'limlar uchun matn pog'onalari (grafit fon ustida)
const D_TITLE = '#ffffff'
const D_BODY = '#b0b0b0'
const D_SOFT = '#e4e4e4'

// Takrorlanuvchi yuzalar — rang emas, yorug'lik bilan chuqurlik
const SURFACE = 'linear-gradient(180deg,#f7f7f7 0%,#efefef 100%)'
const DARK = 'linear-gradient(158deg,#313131 0%,#262626 52%,#1d1d1d 100%)'

// Shakl va shrift — logoning yumaloq, bir tekis monoliniyali xarakteriga moslangan.
// Qoida: harakat qiluvchi element (tugma, chip, input) — kapsula;
// idish (kartochka, panel) — yumshoq to'rtburchak; ikonka uyasi — doira.
const DISPLAY = "'Quicksand', sans-serif" // logo yozuvidagi geometrik-yumaloq shrift
const R_CARD = 20
const R_PANEL = 28

const btnBase = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
  fontFamily: DISPLAY, fontWeight: 700, letterSpacing: '.005em',
  borderRadius: 999, border: 'none', cursor: 'pointer',
}
// Fon, gradient, soya va hover — .gf-btn-* / .gf-well klasslaridan keladi
// (index.css). Bu yerda faqat geometriya va matn rangi qoladi, shunda
// gradientni inline `background` bosib ketmaydi.
const btnPrimary = { ...btnBase, color: '#fff' }
const btnGhost = { ...btnBase, border: '1px solid #d6d6d6', color: INK }
// Ikonka uyasi — logodagi doiraviy "G" ni takrorlaydi
const dot = (size, bg) => ({
  width: size, height: size, borderRadius: '50%', flex: 'none',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  ...(bg ? { background: bg } : null),
})

export default function App() {
  const [lang, setLang] = useState('uz')
  const [menuOpen, setMenuOpen] = useState(false)
  const [ready, setReady] = useState(false)

  const t = TR[lang]
  const branches = withBranchUrls(t.branches)

  // Scroll-reveal — faqat mount boʻlgandan keyin yoqiladi
  useEffect(() => {
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    const els = () => Array.from(document.querySelectorAll('.gf-reveal:not(.gf-in)'))
    const reveal = (el) => el.classList.add('gf-in')
    const check = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight
      els().forEach(el => {
        const r = el.getBoundingClientRect()
        if (r.top < vh * 0.92 && r.bottom > 0) reveal(el)
      })
    }
    check()
    let io
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target) } })
      }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' })
      els().forEach(el => io.observe(el))
    }
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check, { passive: true })
    const safety = setTimeout(() => els().forEach(reveal), 2500)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
      clearTimeout(safety)
      if (io) io.disconnect()
    }
  }, [ready, lang])

  const closeMenu = () => setMenuOpen(false)

  const rootClass = (ready ? 'gf-ready' : '') + (menuOpen ? ' gf-menu-open' : '')

  return (
    <div className={rootClass}>
      <PromoBar t={t} />
      <Header
        t={t} lang={lang} setLang={setLang}
        menuOpen={menuOpen} setMenuOpen={setMenuOpen} closeMenu={closeMenu}
      />
      <Hero t={t} />
      <Trust t={t} />
      <About t={t} />
      <Services t={t} />
      <Branches t={t} branches={branches} />
      <Testimonials t={t} />
      <Vacancy t={t} />
      <Contact t={t} lang={lang} />
      <Footer t={t} />
      <FloatingUI />
    </div>
  )
}

/* ---------- PROMO BAR ---------- */
function PromoBar({ t }) {
  return (
    <div style={{ background: 'linear-gradient(90deg,#3a3a3a 0%,#4f4f4f 50%,#3a3a3a 100%)', color: '#fff', fontSize: 13.5, letterSpacing: '.01em', textAlign: 'center', padding: '9px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }} className="gf-promo">
      <Pin size={15} />
      <span>{t.promo}</span>
    </div>
  )
}

/* ---------- HEADER ---------- */
function Header({ t, lang, setLang, menuOpen, setMenuOpen, closeMenu }) {
  const navLinks = [
    ['#about', t.navAbout], ['#services', t.navServices], ['#branches', t.navBranches],
    ['#vacancy', t.navVacancy], ['#contact', t.navContact]
  ]
  const langBtn = (code, label) => {
    const active = lang === code
    return (
      <button onClick={() => setLang(code)} style={{ border: 'none', cursor: 'pointer', fontFamily: DISPLAY, fontSize: 13, fontWeight: 700, padding: '6px 12px', borderRadius: 999, background: active ? '#ffffff' : 'transparent', color: active ? INK : MUTED, boxShadow: active ? '0 1px 2px rgba(38,38,38,.14)' : 'none', transition: 'background .18s, color .18s' }}>
        {label}
      </button>
    )
  }
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,.86)', backdropFilter: 'blur(14px) saturate(120%)', WebkitBackdropFilter: 'blur(14px) saturate(120%)', borderBottom: '1px solid ' + LINE, boxShadow: '0 1px 20px -14px rgba(38,38,38,.5)' }}>
      <div className="gf-headpad" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <Logo size={30} />
          <span className="gf-wordmark" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 19, letterSpacing: '.005em', color: '#262626' }}>Gulnora Farm</span>
        </a>
        <nav className="gf-nav" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {navLinks.map(([href, label]) => (
            <a key={href} href={href} className="gf-navlink" style={{ fontFamily: DISPLAY, fontSize: 15, color: BODY, fontWeight: 600 }}>{label}</a>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="gf-social-desk" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href={TELEGRAM} target="_blank" rel="noopener" aria-label="Telegram" className="gf-well" style={iconBtn}><Telegram size={19} /></a>
            <a href={INSTAGRAM} target="_blank" rel="noopener" aria-label="Instagram" className="gf-well" style={iconBtn}><Instagram size={18} /></a>
          </div>
          <div className="gf-langtoggle" style={{ display: 'flex', alignItems: 'center', background: TINT, borderRadius: 999, padding: 3, boxShadow: 'inset 0 0 0 1px rgba(38,38,38,.055)' }}>
            {langBtn('uz', 'UZ')}{langBtn('ru', 'RU')}
          </div>
          <a className="gf-callbtn gf-btn-primary" href={`tel:${PHONE}`} style={{ ...btnPrimary, gap: 8, fontSize: 14.5, padding: '11px 18px' }}>
            <Phone size={16} /><span className="gf-callbtn-text">{t.call}</span>
          </a>
          <button className="gf-burger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            {menuOpen ? <Close /> : <Menu />}
          </button>
        </div>
      </div>
      <div className="gf-mobile-menu">
        <div style={{ display: 'flex', flexDirection: 'column', padding: '6px 16px 18px' }}>
          {navLinks.map(([href, label], i) => (
            <a key={href} href={href} onClick={closeMenu} style={{ fontFamily: DISPLAY, padding: '13px 4px', fontSize: 16, fontWeight: 600, color: INK, borderBottom: i < navLinks.length - 1 ? '1px solid #ededed' : 'none' }}>{label}</a>
          ))}
          <a href={`tel:${PHONE}`} onClick={closeMenu} className="gf-btn-primary" style={{ ...btnPrimary, marginTop: 14, fontSize: 16, padding: 14 }}>
            <Phone size={17} /> {PHONE_DISPLAY}
          </a>
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <a href={TELEGRAM} target="_blank" rel="noopener" className="gf-well" style={mobSocial}><Telegram size={17} />Telegram</a>
            <a href={INSTAGRAM} target="_blank" rel="noopener" className="gf-well" style={mobSocial}><Instagram size={16} />Instagram</a>
          </div>
        </div>
      </div>
    </header>
  )
}
const iconBtn = { ...dot(38), color: INK }
const mobSocial = { ...btnBase, flex: 1, gap: 8, padding: 12, fontSize: 14, color: INK }

/* ---------- HERO ---------- */
function Hero({ t }) {
  return (
    <section id="top" style={{ background: SURFACE, position: 'relative', overflow: 'hidden' }}>
      {/* Brend kulrangidagi yumshoq yorug'lik — chuqurlik rang bilan emas, yorug'lik bilan */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(760px 340px at 72% 4%, rgba(255,255,255,.72) 0%, rgba(255,255,255,0) 66%), radial-gradient(760px 400px at 4% 100%, rgba(118,118,118,.16) 0%, rgba(118,118,118,0) 68%)', pointerEvents: 'none' }} />
      <div className="gf-hero gf-heropad" style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '74px 24px 88px', display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 56, alignItems: 'center' }}>
        <div style={{ animation: 'gfFade .7s ease both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid ' + LINE, borderRadius: 999, padding: '7px 14px', boxShadow: '0 1px 2px rgba(38,38,38,.05)', fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 12.5, letterSpacing: '.12em', textTransform: 'uppercase', color: ACCENT }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#767676', display: 'inline-block' }} />{t.heroEyebrow}
          </div>
          <h1 className="gf-h1" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 52, lineHeight: 1.08, letterSpacing: '-.015em', margin: '22px 0 0', color: '#262626', textWrap: 'balance' }}>{t.heroTitle}</h1>
          <p className="gf-herosub" style={{ fontSize: 18, lineHeight: 1.6, color: '#565656', margin: '20px 0 0', maxWidth: 480 }}>{t.heroSub}</p>
          <div className="gf-heroctas" style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 32 }}>
            <a href="#branches" className="gf-btn-primary" style={{ ...btnPrimary, fontSize: 16, padding: '15px 28px' }}>
              <Pin size={18} />{t.ctaBranches}
            </a>
            <a href={`tel:${PHONE}`} className="gf-btn-ghost" style={{ ...btnGhost, fontSize: 16, padding: '15px 28px' }}>
              <Phone size={18} />{t.ctaCall}
            </a>
          </div>
          <div className="gf-stats" style={{ display: 'flex', gap: 34, marginTop: 42 }}>
            <Stat num="10" label={t.statYears} />
            <div className="gf-stat-div" style={{ width: 1, background: '#dedede' }} />
            <Stat num="19" label={t.statBranches} />
            <div className="gf-stat-div" style={{ width: 1, background: '#dedede' }} />
            <Stat num="20K+" label={t.statClients} />
          </div>
        </div>
        <div style={{ position: 'relative', animation: 'gfFade .9s ease both' }}>
          <ImageSlot src={HERO_IMAGE} alt="Gulnora Farm dorixonasi" className="gf-hero-img" radius={R_CARD} placeholder="Dorixona fotosi" style={{ height: 460, boxShadow: '0 4px 8px rgba(38,38,38,.06), 0 34px 64px -32px rgba(38,38,38,.5)' }} />
          <div className="gf-floatbadge" style={{ position: 'absolute', left: -18, bottom: 30, background: '#fff', borderRadius: R_CARD, padding: '15px 18px', border: '1px solid ' + LINE, boxShadow: '0 2px 4px rgba(38,38,38,.05), 0 18px 40px -24px rgba(38,38,38,.42)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="gf-well" style={dot(42)}>
              <Pin size={22} color={ACCENT} style={{ stroke: ACCENT }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#262626' }}>{t.netBadgeNum} {t.netBadgeLabel}</div>
              <div style={{ fontSize: 12.5, color: '#6b6b6b', marginTop: 1 }}>{t.netBadgeSub}</div>
            </div>
          </div>
          <div className="gf-toplogo" style={{ position: 'absolute', right: -12, top: 26, background: 'linear-gradient(180deg,#828282 0%,#767676 100%)', color: '#fff', borderRadius: 999, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: 'inset 0 1px 0 rgba(255,255,255,.16), 0 18px 40px -22px rgba(38,38,38,.65)' }}>
            <Logo size={22} variant="white" />
            <span style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 14 }}>Gulnora Farm</span>
          </div>
        </div>
      </div>
    </section>
  )
}
function Stat({ num, label }) {
  return (
    <div>
      <CountUp value={num} className="gf-stat-num" style={{ display: 'block', fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 30, color: '#262626' }} />
      <div style={{ fontSize: 13.5, color: '#6b6b6b', marginTop: 2 }}>{label}</div>
    </div>
  )
}

/* ---------- TRUST ---------- */
function Trust({ t }) {
  const feats = [
    [<Shield key="s" />, t.feat1t, t.feat1d],
    [<Check key="c" color="#262626" sw={1.8} size={23} />, t.feat2t, t.feat2d],
    [<Gear key="g" />, t.feat3t, t.feat3d],
    [<Users key="u" />, t.feat4t, t.feat4d]
  ]
  return (
    <section style={{ background: '#fff' }}>
      <div className="gf-grid4 gf-pad gf-reveal" style={{ maxWidth: 1200, margin: '0 auto', padding: '54px 24px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 22 }}>
        {feats.map(([icon, title, desc], i) => (
          <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div className="gf-well" style={dot(46)}>{icon}</div>
            <div>
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15.5 }}>{title}</div>
              <div style={{ fontSize: 13.5, color: '#6b6b6b', marginTop: 3, lineHeight: 1.45 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------- ABOUT ---------- */
function About({ t }) {
  return (
    <section id="about" style={{ background: DARK, color: D_SOFT, position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(800px 400px at 88% 0%, rgba(118,118,118,.30) 0%, rgba(118,118,118,0) 60%)', pointerEvents: 'none' }} />
      <div className="gf-about gf-pad" style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '88px 24px', display: 'grid', gridTemplateColumns: '.95fr 1.05fr', gap: 56, alignItems: 'center' }}>
        <div className="gf-reveal" style={{ position: 'relative' }}>
          <ImageSlot src={ABOUT_IMAGE} alt="Gulnora Farm jamoasi" className="gf-about-img" radius={R_CARD} placeholder="Jamoa / filial fotosi" style={{ height: 420, boxShadow: '0 34px 64px -34px rgba(0,0,0,.7)' }} />
          <div style={{ position: 'absolute', right: -16, bottom: -16, background: '#fff', color: INK, borderRadius: R_CARD, padding: '16px 20px', boxShadow: '0 22px 44px -22px rgba(0,0,0,.75)' }}>
            <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 26 }}>{t.aboutNum}</div>
            <div style={{ fontSize: 12.5, color: '#6b6b6b', marginTop: 2 }}>{t.aboutNumLabel}</div>
          </div>
        </div>
        <div className="gf-reveal gf-d1">
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 12.5, letterSpacing: '.13em', textTransform: 'uppercase', color: '#a6a6a6' }} className="gf-eyebrow gf-eyebrow-dark">{t.aboutEyebrow}</div>
          <h2 className="gf-sectitle" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 36, lineHeight: 1.15, letterSpacing: '-.01em', marginTop: 12, color: '#fff', textWrap: 'balance' }}>{t.aboutTitle}</h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.65, color: D_BODY, marginTop: 18 }}>{t.aboutText}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 26 }}>
            {[t.aboutP1, t.aboutP2, t.aboutP3].map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Check size={22} color="#c6c6c6" /><span style={{ fontSize: 16, color: D_SOFT }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- SERVICES ---------- */
function Services({ t }) {
  const svc = [
    [<Pill key="1" />, t.svc1t, t.svc1d],
    [<Heart key="2" />, t.svc2t, t.svc2d],
    [<Activity key="3" />, t.svc3t, t.svc3d],
    [<Chat key="4" />, t.svc4t, t.svc4d]
  ]
  return (
    <section id="services" style={{ background: '#fff' }}>
      <div className="gf-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '84px 24px' }}>
        <div className="gf-reveal" style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 12.5, letterSpacing: '.13em', textTransform: 'uppercase', color: BRAND }} className="gf-eyebrow gf-eyebrow-c">{t.navServices}</div>
          <h2 className="gf-sectitle" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 38, letterSpacing: '-.01em', marginTop: 10, color: '#262626' }}>{t.svcTitle}</h2>
          <p style={{ fontSize: 16, color: '#6b6b6b', marginTop: 10, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>{t.svcSub}</p>
        </div>
        <div className="gf-grid4 gf-reveal gf-d1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 22 }}>
          {svc.map(([icon, title, desc], i) => (
            <div key={i} className="gf-card gf-svc" style={{ background: 'linear-gradient(180deg,#ffffff 0%,#fafafa 100%)', border: '1px solid ' + LINE, borderRadius: R_CARD, padding: 26 }}>
              <div className="gf-well" style={dot(52)}>{icon}</div>
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 19, color: INK, marginTop: 18 }}>{title}</div>
              <div style={{ fontSize: 14, color: '#6b6b6b', marginTop: 7, lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- BRANCHES ---------- */
function Branches({ t, branches }) {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('all')
  const [userLoc, setUserLoc] = useState(null)
  const [activeId, setActiveId] = useState(null)
  const [geoState, setGeoState] = useState('idle') // idle | loading | error
  const mapWrapRef = useRef(null)

  // Hududlar (chiplar) — filiallar tartibida noyob
  const regionKeys = useMemo(() => {
    const seen = []
    branches.forEach(b => { if (!seen.includes(b.region)) seen.push(b.region) })
    return ['all', ...seen]
  }, [branches])

  // Filtrlash + holat + masofa
  const list = useMemo(() => {
    const now = new Date()
    const q = query.trim().toLowerCase()
    let arr = branches
      .filter(b => region === 'all' || b.region === region)
      .filter(b => !q || [b.name, b.addr, b.near].filter(Boolean).some(s => s.toLowerCase().includes(q)))
      .map(b => {
        const status = branchOpenStatus(b.hours, now)
        let dist = null, distLabel = ''
        if (userLoc) { dist = distanceKm(userLoc.lat, userLoc.lon, b.lat, b.lon); distLabel = formatDistance(dist) }
        return { ...b, __status: status, __dist: dist, __distLabel: distLabel }
      })
    if (userLoc) arr = arr.sort((a, b) => a.__dist - b.__dist)
    return arr
  }, [branches, query, region, userLoc])

  const findNearest = () => {
    if (!navigator.geolocation) { setGeoState('error'); return }
    setGeoState('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lon: pos.coords.longitude }
        setUserLoc(loc)
        setGeoState('idle')
        // eng yaqin filialga fokus
        const nearest = branches.reduce((best, b) => {
          const d = distanceKm(loc.lat, loc.lon, b.lat, b.lon)
          return !best || d < best.d ? { id: b.id, d } : best
        }, null)
        if (nearest) setActiveId(nearest.id)
        mapWrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      },
      () => setGeoState('error'),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const focusBranch = (id) => {
    setActiveId(id)
    mapWrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section id="branches" style={{ background: SURFACE }}>
      <div className="gf-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '84px 24px' }}>
        <div className="gf-reveal" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 26 }}>
          <div>
            <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 12.5, letterSpacing: '.13em', textTransform: 'uppercase', color: BRAND }} className="gf-eyebrow">{t.navBranches}</div>
            <h2 className="gf-sectitle" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 38, letterSpacing: '-.01em', marginTop: 10, color: '#262626' }}>{t.branchTitle}</h2>
          </div>
          <p style={{ fontSize: 16, color: '#6b6b6b', maxWidth: 360 }}>{t.branchSub}</p>
        </div>

        {/* Qidiruv + eng yaqin */}
        <div className="gf-reveal" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
          <div style={{ position: 'relative', flex: '1 1 320px' }}>
            <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#9e9e9e', pointerEvents: 'none' }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
            </span>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.searchPlaceholder} className="gf-input"
              style={{ width: '100%', border: '1px solid #d6d6d6', background: '#fff', borderRadius: 999, padding: '14px 18px 14px 46px', fontSize: 15, color: INK, outline: 'none' }} />
            {query && (
              <button onClick={() => setQuery('')} aria-label={t.clearSearch} className="gf-well"
                style={{ ...dot(28, '#efefef'), position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', border: 'none', cursor: 'pointer', color: '#6b6b6b' }}>
                <Close size={16} />
              </button>
            )}
          </div>
          <button onClick={findNearest} disabled={geoState === 'loading'} className="gf-btn-primary"
            style={{ ...btnPrimary, cursor: geoState === 'loading' ? 'wait' : 'pointer', fontSize: 15, padding: '14px 22px', flex: 'none' }}>
            {geoState === 'loading'
              ? <span className="gf-spin" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} />
              : <Pin size={17} />}
            {geoState === 'loading' ? t.nearMeLoading : t.nearMe}
          </button>
        </div>

        {/* Hudud chiplari */}
        <div className="gf-reveal" style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginBottom: 18 }}>
          {regionKeys.map(rk => {
            const active = region === rk
            return (
              <button key={rk} onClick={() => setRegion(rk)} className={'gf-chip' + (active ? ' gf-chip-on' : '')}
                style={{ ...btnBase, border: '1px solid ' + (active ? '#4f4f4f' : '#d6d6d6'), background: active ? 'linear-gradient(180deg,#5a5a5a 0%,#454545 100%)' : '#fff', color: active ? '#fff' : BODY, boxShadow: active ? 'inset 0 1px 0 rgba(255,255,255,.13), 0 6px 14px -8px rgba(38,38,38,.5)' : 'none', fontSize: 13.5, padding: '8px 16px' }}>
                {t.regions[rk] || rk}
              </button>
            )
          })}
          <span style={{ marginLeft: 'auto', alignSelf: 'center', fontSize: 13.5, color: '#8c8c8c' }}>
            {geoState === 'error' ? <span style={{ color: '#9a473d' }}>{t.geoError}</span> : t.resultsCount(list.length, branches.length)}
          </span>
        </div>

        {/* Xarita */}
        <div ref={mapWrapRef} className="gf-reveal" style={{ marginBottom: 26 }}>
          <BranchMap branches={list} activeId={activeId} userLoc={userLoc} t={t} />
        </div>

        {/* Kartochkalar */}
        {list.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8c8c8c', fontSize: 16 }}>{t.noResults}</div>
        ) : (
          <div className="gf-grid3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
            {list.map(b => <BranchCard key={b.id} b={b} t={t} active={b.id === activeId} onFocus={() => focusBranch(b.id)} />)}
          </div>
        )}
      </div>
    </section>
  )
}
function OpenBadge({ status, t, dark }) {
  const open = status?.open
  const label = status?.open24 ? t.open24 : open ? t.openNow : t.closedNow
  const color = open ? '#3d6b51' : '#9a473d'
  const bg = dark ? 'rgba(28,28,28,.55)' : (open ? '#edf2ee' : '#f7ecea')
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: bg, color: dark ? '#fff' : color, fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 999, border: dark ? 'none' : '1px solid ' + (open ? '#d8e4dc' : '#ebd5d1'), backdropFilter: dark ? 'blur(4px)' : 'none', WebkitBackdropFilter: dark ? 'blur(4px)' : 'none' }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {label}{!open && !status?.open24 && status?.opensAt ? ` · ${status.opensAt} ${t.opensAtLabel}` : ''}
    </span>
  )
}
function BranchCard({ b, t, active, onFocus }) {
  const stop = (e) => e.stopPropagation()
  return (
    <div className="gf-branch-card" style={{ display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid ' + (active ? BRAND : '#e4e4e4'), borderRadius: R_CARD, overflow: 'hidden', boxShadow: active ? '0 4px 8px rgba(38,38,38,.06), 0 30px 56px -28px rgba(38,38,38,.55)' : undefined }}>
      <button onClick={onFocus} title={t.onMap} style={{ position: 'relative', display: 'block', border: 'none', padding: 0, cursor: 'pointer', background: 'transparent', width: '100%' }}>
        <ImageSlot src={b.img} alt={b.name} placeholder="Filial fotosi" style={{ height: 158 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(20,20,22,.5),rgba(20,20,22,0) 55%)', pointerEvents: 'none' }} />
        <span style={{ position: 'absolute', top: 12, left: 12 }}><OpenBadge status={b.__status} t={t} dark /></span>
        {b.__dist != null && (
          <span style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(38,38,38,.82)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '5px 10px', borderRadius: 999 }}>{b.__distLabel} {t.away}</span>
        )}
        <div style={{ position: 'absolute', bottom: 11, left: 12, display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: 12.5, fontWeight: 600, background: 'rgba(0,0,0,.32)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', padding: '5px 10px', borderRadius: 999 }}>
          <Pin size={13} />{t.onMap}
        </div>
      </button>
      <div style={{ padding: '17px 18px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 19, color: INK }}>{b.name}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 12, flex: 1 }}>
          <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 14, color: '#6b6b6b' }}>
            <span style={{ flex: 'none', marginTop: 1 }}><Pin size={17} color="#9e9e9e" style={{ stroke: '#9e9e9e' }} /></span>
            <span style={{ lineHeight: 1.45 }}>{b.addr}</span>
          </div>
          {b.near ? (
            <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 13, color: '#a6a6a6', marginTop: -2 }}>
              <span style={{ flex: 'none', marginTop: 1 }}><Info size={17} /></span>
              <span style={{ lineHeight: 1.4 }}>{b.near}</span>
            </div>
          ) : null}
          <div style={{ display: 'flex', gap: 9, alignItems: 'center', fontSize: 14, color: '#6b6b6b' }}>
            <span style={{ flex: 'none' }}><Clock size={17} /></span><span>{b.hours}</span>
          </div>
          <a href={`tel:${b.tel}`} onClick={stop} style={{ display: 'flex', gap: 9, alignItems: 'center', fontSize: 14, fontWeight: 600, color: '#262626' }}>
            <span style={{ flex: 'none' }}><Phone size={17} color="#9e9e9e" style={{ stroke: '#9e9e9e' }} /></span><span>{b.phone}</span>
          </a>
        </div>
        <div style={{ display: 'flex', gap: 9, marginTop: 15 }}>
          <a href={b.routeUrl} target="_blank" rel="noopener" className="gf-btn-primary" style={{ ...btnPrimary, flex: 1, gap: 7, fontSize: 13.5, padding: 12 }}>
            <Navigate size={16} />{t.route}
          </a>
          <a href={`tel:${b.tel}`} onClick={stop} aria-label={b.phone} className="gf-well" style={{ ...dot(44), color: INK }}>
            <Phone size={18} />
          </a>
        </div>
      </div>
    </div>
  )
}

/* ---------- VACANCY ---------- */
function Vacancy({ t }) {
  return (
    <section id="vacancy" style={{ background: '#fff' }}>
      <div className="gf-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '84px 24px' }}>
        <div className="gf-vac gf-reveal" style={{ background: 'linear-gradient(135deg,#5e5e5e 0%,#3a3a3a 45%,#242424 100%)', boxShadow: '0 40px 80px -44px rgba(38,38,38,.75)', borderRadius: R_PANEL, padding: '50px 56px', display: 'grid', gridTemplateColumns: '1.25fr .75fr', gap: 40, alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', right: -60, top: -60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,.11) 0%, rgba(255,255,255,0) 70%)' }} />
          <div aria-hidden style={{ position: 'absolute', left: -80, bottom: -90, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(118,118,118,.28) 0%, rgba(118,118,118,0) 70%)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 999, padding: '7px 14px', fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 12.5, letterSpacing: '.12em', textTransform: 'uppercase', color: '#d0d0d0' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#c6c6c6', display: 'inline-block' }} />{t.vacEyebrow}
            </div>
            <h2 className="gf-sectitle" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 36, lineHeight: 1.15, letterSpacing: '-.01em', marginTop: 16, color: '#fff', textWrap: 'balance' }}>{t.vacTitle}</h2>
            <p style={{ fontSize: 16.5, lineHeight: 1.6, color: '#b0b0b0', marginTop: 14, maxWidth: 520 }}>{t.vacText}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 22, marginTop: 24 }}>
              {[t.vacP1, t.vacP2, t.vacP3].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, color: D_SOFT, fontSize: 14.5 }}>
                  <Check size={19} color="#c6c6c6" />{p}
                </div>
              ))}
            </div>
            <a href={VACANCY_BOT} target="_blank" rel="noopener" className="gf-btn-invert" style={{ ...btnBase, gap: 10, marginTop: 30, background: '#fff', color: INK, fontSize: 16, padding: '15px 28px' }}>
              <Telegram size={20} />{t.vacBtn}
            </a>
            <div style={{ fontSize: 13, color: '#9a9a9a', marginTop: 12, display: 'flex', alignItems: 'center', gap: 7 }}>
              <Telegram size={15} />@Gulnorafarmvacancy_bot
            </div>
          </div>
          <div className="gf-vacicon" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,.12)' }}>
              <Users size={76} color="#fff" sw={1.4} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- CONTACT ---------- */
function Contact({ t, lang }) {
  // status: idle | sending | done | error
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = (fd.get('name') || '').toString().trim()
    const phone = (fd.get('phone') || '').toString().trim()
    const message = (fd.get('message') || '').toString().trim()
    if (!name || !phone) return
    setStatus('sending')
    try {
      await sendLeadToTelegram({ name, phone, message, lang })
      setStatus('done')
    } catch (err) {
      console.error('Telegram yuborishda xatolik:', err)
      setStatus('error')
    }
  }

  const submitted = status === 'done'
  const sending = status === 'sending'
  return (
    <section id="contact" style={{ background: SURFACE }}>
      <div className="gf-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '84px 24px' }}>
        <div className="gf-reveal" style={{ textAlign: 'center', marginBottom: 42 }}>
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 12.5, letterSpacing: '.13em', textTransform: 'uppercase', color: BRAND }} className="gf-eyebrow gf-eyebrow-c">{t.contactEyebrow}</div>
          <h2 className="gf-sectitle" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 38, letterSpacing: '-.01em', marginTop: 10, color: '#262626' }}>{t.contactTitle}</h2>
        </div>
        <div className="gf-contact gf-reveal gf-d1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <a href={`tel:${PHONE}`} className="gf-contact-card" style={{ background: '#fff', border: '1px solid #e4e4e4', borderRadius: R_CARD, padding: 22, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div className="gf-well" style={dot(46)}><Phone size={22} /></div>
              <div><div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: INK }}>{t.phoneLabel}</div><div style={{ fontSize: 14.5, color: '#6b6b6b', marginTop: 4, lineHeight: 1.5 }}>{t.phoneValue}</div></div>
            </a>
            <a href={TELEGRAM} target="_blank" rel="noopener" className="gf-contact-card tg" style={{ background: '#fff', border: '1px solid #e4e4e4', borderRadius: R_CARD, padding: 22, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div className="gf-well" style={{ ...dot(46), color: INK }}><Telegram size={22} /></div>
              <div><div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, color: INK }}>{t.botLabel}</div><div style={{ fontSize: 14.5, color: '#6b6b6b', marginTop: 4, lineHeight: 1.5 }}>@gulnorafarm_bot</div></div>
            </a>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href={TELEGRAM} target="_blank" rel="noopener" className="gf-btn-ghost" style={contactPill}><Telegram size={19} />Telegram</a>
              <a href={INSTAGRAM} target="_blank" rel="noopener" className="gf-btn-ghost" style={contactPill}><Instagram size={18} />Instagram</a>
            </div>
          </div>
          <div className="gf-card" style={{ background: '#fff', border: '1px solid ' + LINE, borderRadius: R_CARD, padding: 30 }}>
            <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, color: INK }}>{t.formTitle}</h3>
            {submitted ? (
              <div style={{ marginTop: 24, background: '#edf2ee', border: '1px solid #d8e4dc', borderRadius: 16, padding: 26, display: 'flex', gap: 14, alignItems: 'center' }}>
                <Check size={30} color="#3d6b51" />
                <span style={{ fontSize: 16, color: '#35604a', fontWeight: 600 }}>{t.formThanks}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label={t.formName}><input name="name" type="text" required disabled={sending} className="gf-input" style={inputStyle} /></Field>
                <Field label={t.formPhone}><input name="phone" type="tel" required disabled={sending} placeholder="+998 __ ___ __ __" className="gf-input" style={inputStyle} /></Field>
                <Field label={t.formMsg}><textarea name="message" rows={4} disabled={sending} className="gf-input" style={{ ...inputStyle, resize: 'vertical' }} /></Field>
                {status === 'error' && (
                  <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', background: '#f7ecea', border: '1px solid #ebd5d1', borderRadius: 14, padding: '12px 14px', fontSize: 13.5, color: '#8e4239', lineHeight: 1.45 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', marginTop: 1 }}><circle cx="12" cy="12" r="9" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                    <span>{t.formError}</span>
                  </div>
                )}
                <button type="submit" disabled={sending} className="gf-btn-primary" style={{ ...btnPrimary, display: 'flex', marginTop: 4, cursor: sending ? 'wait' : 'pointer', fontSize: 16, padding: 15, opacity: sending ? 0.7 : 1, gap: 10 }}>
                  {sending && <span className="gf-spin" style={{ width: 17, height: 17, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} />}
                  {sending ? t.formSending : t.formSend}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: '#565656', marginBottom: 7 }}>{label}</label>
      {children}
    </div>
  )
}
const inputStyle = { width: '100%', border: '1px solid #d6d6d6', background: '#fafafa', borderRadius: 14, padding: '13px 16px', fontSize: 15, color: INK, outline: 'none' }
const contactPill = { ...btnGhost, flex: 1, border: '1px solid ' + LINE, padding: 15, fontSize: 14.5 }

/* ---------- FOOTER ---------- */
function Footer({ t }) {
  const navLinks = [['#about', t.navAbout], ['#services', t.navServices], ['#branches', t.navBranches], ['#vacancy', t.navVacancy], ['#contact', t.navContact]]
  return (
    <footer style={{ background: 'linear-gradient(180deg,#262626 0%,#1b1b1b 100%)', color: '#b4b4b4' }}>
      <div className="gf-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 30px' }}>
        <div className="gf-foot" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <Logo size={30} variant="white" />
              <span style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 19, color: '#fff' }}>Gulnora Farm</span>
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#9a9a9a', marginTop: 16, maxWidth: 320 }}>{t.footTagline}</p>
            <div style={{ display: 'flex', gap: 11, marginTop: 18 }}>
              <a href={TELEGRAM} target="_blank" rel="noopener" aria-label="Telegram" style={footSocial}><Telegram size={19} /></a>
              <a href={INSTAGRAM} target="_blank" rel="noopener" aria-label="Instagram" style={footSocial}><Instagram size={18} /></a>
              <a href={VACANCY_BOT} target="_blank" rel="noopener" aria-label="Vacancy bot" style={footSocial}><Users size={19} color="#d0d0d0" /></a>
            </div>
          </div>
          <div>
            <div style={footHead}>{t.navMenu}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
              {navLinks.map(([href, label]) => <a key={href} href={href} style={{ fontSize: 14.5, color: '#b4b4b4' }}>{label}</a>)}
            </div>
          </div>
          <div>
            <div style={footHead}>{t.navContact}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
              <a href={`tel:${PHONE}`} style={{ fontSize: 14.5, color: '#b4b4b4' }}>{t.phoneValue}</a>
              <a href={TELEGRAM} target="_blank" rel="noopener" style={{ fontSize: 14.5, color: '#b4b4b4' }}>@gulnorafarm_bot</a>
              <a href={INSTAGRAM} target="_blank" rel="noopener" style={{ fontSize: 14.5, color: '#b4b4b4' }}>@gulnorafarm.uz</a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.10)', marginTop: 36, paddingTop: 22, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 13, color: '#909090' }}>© 2026 Gulnora Farm. {t.footRights}</span>
          <span style={{ fontSize: 13, color: '#909090' }}>{t.footMade}</span>
        </div>
      </div>
    </footer>
  )
}
const footSocial = { ...dot(40, 'rgba(255,255,255,.07)'), color: '#d0d0d0', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.09)' }
const footHead = { fontFamily: DISPLAY, fontWeight: 700, fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', color: '#9a9a9a' }
