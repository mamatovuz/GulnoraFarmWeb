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

const ACCENT = '#26262a'

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
    <div style={{ background: '#26262a', color: '#e9e8e5', fontSize: 13.5, letterSpacing: '.01em', textAlign: 'center', padding: '9px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }} className="gf-promo">
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
      <button onClick={() => setLang(code)} style={{ border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: '6px 12px', borderRadius: 999, background: active ? '#ffffff' : 'transparent', color: active ? '#26262a' : '#8a8983' }}>
        {label}
      </button>
    )
  }
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,.88)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid #ece9e4' }}>
      <div className="gf-headpad" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <Logo size={30} />
          <span className="gf-wordmark" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 19, letterSpacing: '.005em', color: '#26262a' }}>Gulnora Farm</span>
        </a>
        <nav className="gf-nav" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {navLinks.map(([href, label]) => (
            <a key={href} href={href} style={{ fontSize: 15, color: '#54534f', fontWeight: 500 }}>{label}</a>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="gf-social-desk" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href={TELEGRAM} target="_blank" rel="noopener" aria-label="Telegram" style={iconBtn}><Telegram size={19} /></a>
            <a href={INSTAGRAM} target="_blank" rel="noopener" aria-label="Instagram" style={iconBtn}><Instagram size={18} /></a>
          </div>
          <div className="gf-langtoggle" style={{ display: 'flex', alignItems: 'center', background: '#f1efeb', borderRadius: 999, padding: 3 }}>
            {langBtn('uz', 'UZ')}{langBtn('ru', 'RU')}
          </div>
          <a className="gf-callbtn" href={`tel:${PHONE}`} style={{ display: 'flex', alignItems: 'center', gap: 8, background: ACCENT, color: '#fff', fontSize: 14.5, fontWeight: 600, padding: '11px 18px', borderRadius: 999 }}>
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
            <a key={href} href={href} onClick={closeMenu} style={{ padding: '13px 4px', fontSize: 16, fontWeight: 600, color: '#26262a', borderBottom: i < navLinks.length - 1 ? '1px solid #f0ede8' : 'none' }}>{label}</a>
          ))}
          <a href={`tel:${PHONE}`} onClick={closeMenu} style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: ACCENT, color: '#fff', fontWeight: 600, fontSize: 16, padding: 14, borderRadius: 13 }}>
            <Phone size={17} /> {PHONE_DISPLAY}
          </a>
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <a href={TELEGRAM} target="_blank" rel="noopener" style={mobSocial}><Telegram size={17} />Telegram</a>
            <a href={INSTAGRAM} target="_blank" rel="noopener" style={mobSocial}><Instagram size={16} />Instagram</a>
          </div>
        </div>
      </div>
    </header>
  )
}
const iconBtn = { width: 38, height: 38, borderRadius: 10, background: '#f1efeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#26262a' }
const mobSocial = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#f1efeb', borderRadius: 12, padding: 12, fontWeight: 600, fontSize: 14, color: '#26262a' }

/* ---------- HERO ---------- */
function Hero({ t }) {
  return (
    <section id="top" style={{ background: '#f5f4f1', position: 'relative', overflow: 'hidden' }}>
      <div className="gf-hero gf-heropad" style={{ maxWidth: 1200, margin: '0 auto', padding: '74px 24px 88px', display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 56, alignItems: 'center' }}>
        <div style={{ animation: 'gfFade .7s ease both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e7e4df', borderRadius: 999, padding: '7px 14px', fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 12.5, letterSpacing: '.12em', textTransform: 'uppercase', color: ACCENT }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4a8f5b', display: 'inline-block' }} />{t.heroEyebrow}
          </div>
          <h1 className="gf-h1" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 52, lineHeight: 1.08, letterSpacing: '-.015em', margin: '22px 0 0', color: '#212126', textWrap: 'balance' }}>{t.heroTitle}</h1>
          <p className="gf-herosub" style={{ fontSize: 18, lineHeight: 1.6, color: '#5c5b56', margin: '20px 0 0', maxWidth: 480 }}>{t.heroSub}</p>
          <div className="gf-heroctas" style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 32 }}>
            <a href="#branches" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: ACCENT, color: '#fff', fontWeight: 600, fontSize: 16, padding: '15px 26px', borderRadius: 14 }}>
              <Pin size={18} />{t.ctaBranches}
            </a>
            <a href={`tel:${PHONE}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#fff', border: '1px solid #dcd8d2', color: '#26262a', fontWeight: 600, fontSize: 16, padding: '15px 26px', borderRadius: 14 }}>
              <Phone size={18} />{t.ctaCall}
            </a>
          </div>
          <div className="gf-stats" style={{ display: 'flex', gap: 34, marginTop: 42 }}>
            <Stat num="10" label={t.statYears} />
            <div className="gf-stat-div" style={{ width: 1, background: '#e1ddd7' }} />
            <Stat num="19" label={t.statBranches} />
            <div className="gf-stat-div" style={{ width: 1, background: '#e1ddd7' }} />
            <Stat num="20K+" label={t.statClients} />
          </div>
        </div>
        <div style={{ position: 'relative', animation: 'gfFade .9s ease both' }}>
          <ImageSlot src={HERO_IMAGE} alt="Gulnora Farm dorixonasi" className="gf-hero-img" radius={22} placeholder="Dorixona fotosi" style={{ height: 460, boxShadow: '0 30px 60px -28px rgba(38,38,42,.45)' }} />
          <div className="gf-floatbadge" style={{ position: 'absolute', left: -18, bottom: 30, background: '#fff', borderRadius: 16, padding: '15px 18px', boxShadow: '0 18px 40px -20px rgba(38,38,42,.5)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: '#eef4ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pin size={22} color="#3f7a52" style={{ stroke: '#3f7a52' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#26262a' }}>{t.netBadgeNum} {t.netBadgeLabel}</div>
              <div style={{ fontSize: 12.5, color: '#6f6e69', marginTop: 1 }}>{t.netBadgeSub}</div>
            </div>
          </div>
          <div className="gf-toplogo" style={{ position: 'absolute', right: -12, top: 26, background: '#26262a', color: '#fff', borderRadius: 14, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 18px 40px -22px rgba(0,0,0,.6)' }}>
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
      <CountUp value={num} className="gf-stat-num" style={{ display: 'block', fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 30, color: '#212126' }} />
      <div style={{ fontSize: 13.5, color: '#6f6e69', marginTop: 2 }}>{label}</div>
    </div>
  )
}

/* ---------- TRUST ---------- */
function Trust({ t }) {
  const feats = [
    [<Shield key="s" />, t.feat1t, t.feat1d],
    [<Check key="c" color="#26262a" sw={1.8} size={23} />, t.feat2t, t.feat2d],
    [<Gear key="g" />, t.feat3t, t.feat3d],
    [<Users key="u" />, t.feat4t, t.feat4d]
  ]
  return (
    <section style={{ background: '#fff' }}>
      <div className="gf-grid4 gf-pad gf-reveal" style={{ maxWidth: 1200, margin: '0 auto', padding: '54px 24px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 22 }}>
        {feats.map(([icon, title, desc], i) => (
          <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ flex: 'none', width: 46, height: 46, borderRadius: 13, background: '#f3f1ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15.5 }}>{title}</div>
              <div style={{ fontSize: 13.5, color: '#6f6e69', marginTop: 3, lineHeight: 1.45 }}>{desc}</div>
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
    <section id="about" style={{ background: '#26262a', color: '#ece9e4' }}>
      <div className="gf-about gf-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '88px 24px', display: 'grid', gridTemplateColumns: '.95fr 1.05fr', gap: 56, alignItems: 'center' }}>
        <div className="gf-reveal" style={{ position: 'relative' }}>
          <ImageSlot src={ABOUT_IMAGE} alt="Gulnora Farm jamoasi" className="gf-about-img" radius={20} placeholder="Jamoa / filial fotosi" style={{ height: 420 }} />
          <div style={{ position: 'absolute', right: -16, bottom: -16, background: '#fff', color: '#26262a', borderRadius: 16, padding: '16px 20px', boxShadow: '0 22px 44px -24px rgba(0,0,0,.6)' }}>
            <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 26 }}>{t.aboutNum}</div>
            <div style={{ fontSize: 12.5, color: '#6f6e69', marginTop: 2 }}>{t.aboutNumLabel}</div>
          </div>
        </div>
        <div className="gf-reveal gf-d1">
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 12.5, letterSpacing: '.13em', textTransform: 'uppercase', color: '#a9a6a0' }}>{t.aboutEyebrow}</div>
          <h2 className="gf-sectitle" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 36, lineHeight: 1.15, letterSpacing: '-.01em', marginTop: 12, color: '#fff', textWrap: 'balance' }}>{t.aboutTitle}</h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.65, color: '#bdb9b3', marginTop: 18 }}>{t.aboutText}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 26 }}>
            {[t.aboutP1, t.aboutP2, t.aboutP3].map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Check size={22} color="#7fb98f" /><span style={{ fontSize: 16, color: '#e4e1dc' }}>{p}</span>
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
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 12.5, letterSpacing: '.13em', textTransform: 'uppercase', color: ACCENT }}>{t.navServices}</div>
          <h2 className="gf-sectitle" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 38, letterSpacing: '-.01em', marginTop: 10, color: '#212126' }}>{t.svcTitle}</h2>
          <p style={{ fontSize: 16, color: '#6f6e69', marginTop: 10, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>{t.svcSub}</p>
        </div>
        <div className="gf-grid4 gf-reveal gf-d1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 22 }}>
          {svc.map(([icon, title, desc], i) => (
            <div key={i} style={{ background: '#fbfbfa', border: '1px solid #ebe8e3', borderRadius: 18, padding: 26 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: '#f3f1ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 19, color: '#26262a', marginTop: 18 }}>{title}</div>
              <div style={{ fontSize: 14, color: '#6f6e69', marginTop: 7, lineHeight: 1.5 }}>{desc}</div>
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
    <section id="branches" style={{ background: '#f5f4f1' }}>
      <div className="gf-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '84px 24px' }}>
        <div className="gf-reveal" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 26 }}>
          <div>
            <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 12.5, letterSpacing: '.13em', textTransform: 'uppercase', color: ACCENT }}>{t.navBranches}</div>
            <h2 className="gf-sectitle" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 38, letterSpacing: '-.01em', marginTop: 10, color: '#212126' }}>{t.branchTitle}</h2>
          </div>
          <p style={{ fontSize: 16, color: '#6f6e69', maxWidth: 360 }}>{t.branchSub}</p>
        </div>

        {/* Qidiruv + eng yaqin */}
        <div className="gf-reveal" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
          <div style={{ position: 'relative', flex: '1 1 320px' }}>
            <span style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#9a9892', pointerEvents: 'none' }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
            </span>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.searchPlaceholder} className="gf-input"
              style={{ width: '100%', border: '1px solid #ded9d2', background: '#fff', borderRadius: 13, padding: '14px 15px 14px 44px', fontSize: 15, color: '#26262a', outline: 'none' }} />
            {query && (
              <button onClick={() => setQuery('')} aria-label={t.clearSearch}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: 'none', background: '#f1efeb', cursor: 'pointer', width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6f6e69' }}>
                <Close size={16} />
              </button>
            )}
          </div>
          <button onClick={findNearest} disabled={geoState === 'loading'}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: ACCENT, color: '#fff', border: 'none', cursor: geoState === 'loading' ? 'wait' : 'pointer', fontWeight: 600, fontSize: 15, padding: '14px 20px', borderRadius: 13, flex: 'none' }}>
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
              <button key={rk} onClick={() => setRegion(rk)}
                style={{ border: '1px solid ' + (active ? '#26262a' : '#ded9d2'), background: active ? '#26262a' : '#fff', color: active ? '#fff' : '#54534f', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, padding: '8px 15px', borderRadius: 999, transition: 'all .15s' }}>
                {t.regions[rk] || rk}
              </button>
            )
          })}
          <span style={{ marginLeft: 'auto', alignSelf: 'center', fontSize: 13.5, color: '#8a8983' }}>
            {geoState === 'error' ? <span style={{ color: '#c0473c' }}>{t.geoError}</span> : t.resultsCount(list.length, branches.length)}
          </span>
        </div>

        {/* Xarita */}
        <div ref={mapWrapRef} className="gf-reveal" style={{ marginBottom: 26 }}>
          <BranchMap branches={list} activeId={activeId} userLoc={userLoc} t={t} />
        </div>

        {/* Kartochkalar */}
        {list.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8a8983', fontSize: 16 }}>{t.noResults}</div>
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
  const color = open ? '#3f7a52' : '#c0473c'
  const bg = dark ? 'rgba(0,0,0,.4)' : (open ? '#eef4ef' : '#fbeceb')
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: bg, color: dark ? '#fff' : color, fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 999, backdropFilter: dark ? 'blur(4px)' : 'none', WebkitBackdropFilter: dark ? 'blur(4px)' : 'none' }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {label}{!open && !status?.open24 && status?.opensAt ? ` · ${status.opensAt} ${t.opensAtLabel}` : ''}
    </span>
  )
}
function BranchCard({ b, t, active, onFocus }) {
  const stop = (e) => e.stopPropagation()
  return (
    <div className="gf-branch-card" style={{ display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid ' + (active ? '#3f7a52' : '#ebe8e3'), borderRadius: 18, overflow: 'hidden', boxShadow: active ? '0 20px 44px -24px rgba(63,122,82,.6)' : 'none' }}>
      <button onClick={onFocus} title={t.onMap} style={{ position: 'relative', display: 'block', border: 'none', padding: 0, cursor: 'pointer', background: 'transparent', width: '100%' }}>
        <ImageSlot src={b.img} alt={b.name} placeholder="Filial fotosi" style={{ height: 158 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(20,20,22,.5),rgba(20,20,22,0) 55%)', pointerEvents: 'none' }} />
        <span style={{ position: 'absolute', top: 12, left: 12 }}><OpenBadge status={b.__status} t={t} dark /></span>
        {b.__dist != null && (
          <span style={{ position: 'absolute', top: 12, right: 12, background: '#3f7a52', color: '#fff', fontSize: 12, fontWeight: 700, padding: '5px 10px', borderRadius: 999 }}>{b.__distLabel} {t.away}</span>
        )}
        <div style={{ position: 'absolute', bottom: 11, left: 12, display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: 12.5, fontWeight: 600, background: 'rgba(0,0,0,.32)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', padding: '5px 10px', borderRadius: 999 }}>
          <Pin size={13} />{t.onMap}
        </div>
      </button>
      <div style={{ padding: '17px 18px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 19, color: '#26262a' }}>{b.name}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 12, flex: 1 }}>
          <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 14, color: '#6f6e69' }}>
            <span style={{ flex: 'none', marginTop: 1 }}><Pin size={17} color="#9a9892" style={{ stroke: '#9a9892' }} /></span>
            <span style={{ lineHeight: 1.45 }}>{b.addr}</span>
          </div>
          {b.near ? (
            <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 13, color: '#a9a7a1', marginTop: -2 }}>
              <span style={{ flex: 'none', marginTop: 1 }}><Info size={17} /></span>
              <span style={{ lineHeight: 1.4 }}>{b.near}</span>
            </div>
          ) : null}
          <div style={{ display: 'flex', gap: 9, alignItems: 'center', fontSize: 14, color: '#6f6e69' }}>
            <span style={{ flex: 'none' }}><Clock size={17} /></span><span>{b.hours}</span>
          </div>
          <a href={`tel:${b.tel}`} onClick={stop} style={{ display: 'flex', gap: 9, alignItems: 'center', fontSize: 14, fontWeight: 600, color: '#26262a' }}>
            <span style={{ flex: 'none' }}><Phone size={17} color="#9a9892" style={{ stroke: '#9a9892' }} /></span><span>{b.phone}</span>
          </a>
        </div>
        <div style={{ display: 'flex', gap: 9, marginTop: 15 }}>
          <a href={b.routeUrl} target="_blank" rel="noopener" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: ACCENT, color: '#fff', fontWeight: 600, fontSize: 13.5, padding: 11, borderRadius: 11 }}>
            <Navigate size={16} />{t.route}
          </a>
          <a href={`tel:${b.tel}`} onClick={stop} aria-label={b.phone} style={{ flex: 'none', width: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f1ed', borderRadius: 11, color: '#26262a' }}>
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
        <div className="gf-vac gf-reveal" style={{ background: '#26262a', borderRadius: 26, padding: '50px 56px', display: 'grid', gridTemplateColumns: '1.25fr .75fr', gap: 40, alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -60, top: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(127,185,143,.12)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 999, padding: '7px 14px', fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 12.5, letterSpacing: '.12em', textTransform: 'uppercase', color: '#cfe6d6' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7fb98f', display: 'inline-block' }} />{t.vacEyebrow}
            </div>
            <h2 className="gf-sectitle" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 36, lineHeight: 1.15, letterSpacing: '-.01em', marginTop: 16, color: '#fff', textWrap: 'balance' }}>{t.vacTitle}</h2>
            <p style={{ fontSize: 16.5, lineHeight: 1.6, color: '#bdb9b3', marginTop: 14, maxWidth: 520 }}>{t.vacText}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 22, marginTop: 24 }}>
              {[t.vacP1, t.vacP2, t.vacP3].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, color: '#e4e1dc', fontSize: 14.5 }}>
                  <Check size={19} color="#7fb98f" />{p}
                </div>
              ))}
            </div>
            <a href={VACANCY_BOT} target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 30, background: '#fff', color: '#26262a', fontWeight: 700, fontSize: 16, padding: '15px 26px', borderRadius: 14 }}>
              <Telegram size={20} />{t.vacBtn}
            </a>
            <div style={{ fontSize: 13, color: '#85837e', marginTop: 12, display: 'flex', alignItems: 'center', gap: 7 }}>
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
    <section id="contact" style={{ background: '#f5f4f1' }}>
      <div className="gf-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '84px 24px' }}>
        <div className="gf-reveal" style={{ textAlign: 'center', marginBottom: 42 }}>
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 12.5, letterSpacing: '.13em', textTransform: 'uppercase', color: ACCENT }}>{t.contactEyebrow}</div>
          <h2 className="gf-sectitle" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 38, letterSpacing: '-.01em', marginTop: 10, color: '#212126' }}>{t.contactTitle}</h2>
        </div>
        <div className="gf-contact gf-reveal gf-d1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <a href={`tel:${PHONE}`} className="gf-contact-card" style={{ background: '#fff', border: '1px solid #ebe8e3', borderRadius: 18, padding: 22, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ flex: 'none', width: 46, height: 46, borderRadius: 12, background: '#f3f1ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={22} /></div>
              <div><div style={{ fontWeight: 700, fontSize: 15, color: '#26262a' }}>{t.phoneLabel}</div><div style={{ fontSize: 14.5, color: '#6f6e69', marginTop: 4, lineHeight: 1.5 }}>{t.phoneValue}</div></div>
            </a>
            <a href={TELEGRAM} target="_blank" rel="noopener" className="gf-contact-card tg" style={{ background: '#fff', border: '1px solid #ebe8e3', borderRadius: 18, padding: 22, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ flex: 'none', width: 46, height: 46, borderRadius: 12, background: '#eaf4fb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#229ED9' }}><Telegram size={22} /></div>
              <div><div style={{ fontWeight: 700, fontSize: 15, color: '#26262a' }}>{t.botLabel}</div><div style={{ fontSize: 14.5, color: '#6f6e69', marginTop: 4, lineHeight: 1.5 }}>@gulnorafarm_bot</div></div>
            </a>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href={TELEGRAM} target="_blank" rel="noopener" style={contactPill}><Telegram size={19} />Telegram</a>
              <a href={INSTAGRAM} target="_blank" rel="noopener" style={contactPill}><Instagram size={18} />Instagram</a>
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #ebe8e3', borderRadius: 18, padding: 30 }}>
            <h3 style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 22, color: '#212126' }}>{t.formTitle}</h3>
            {submitted ? (
              <div style={{ marginTop: 24, background: '#eef4ef', border: '1px solid #d5e6da', borderRadius: 14, padding: 26, display: 'flex', gap: 14, alignItems: 'center' }}>
                <Check size={30} color="#3f7a52" />
                <span style={{ fontSize: 16, color: '#2f6741', fontWeight: 600 }}>{t.formThanks}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label={t.formName}><input name="name" type="text" required disabled={sending} className="gf-input" style={inputStyle} /></Field>
                <Field label={t.formPhone}><input name="phone" type="tel" required disabled={sending} placeholder="+998 __ ___ __ __" className="gf-input" style={inputStyle} /></Field>
                <Field label={t.formMsg}><textarea name="message" rows={4} disabled={sending} className="gf-input" style={{ ...inputStyle, resize: 'vertical' }} /></Field>
                {status === 'error' && (
                  <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', background: '#fbeceb', border: '1px solid #f3d2cf', borderRadius: 11, padding: '12px 14px', fontSize: 13.5, color: '#a23b32', lineHeight: 1.45 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', marginTop: 1 }}><circle cx="12" cy="12" r="9" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                    <span>{t.formError}</span>
                  </div>
                )}
                <button type="submit" disabled={sending} style={{ marginTop: 4, border: 'none', cursor: sending ? 'wait' : 'pointer', background: ACCENT, color: '#fff', fontWeight: 600, fontSize: 16, padding: 15, borderRadius: 13, opacity: sending ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
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
      <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: '#54534f', marginBottom: 7 }}>{label}</label>
      {children}
    </div>
  )
}
const inputStyle = { width: '100%', border: '1px solid #ded9d2', background: '#fbfbfa', borderRadius: 12, padding: '13px 15px', fontSize: 15, color: '#26262a', outline: 'none' }
const contactPill = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: '#fff', border: '1px solid #ebe8e3', borderRadius: 14, padding: 15, fontWeight: 600, fontSize: 14.5, color: '#26262a' }

/* ---------- FOOTER ---------- */
function Footer({ t }) {
  const navLinks = [['#about', t.navAbout], ['#services', t.navServices], ['#branches', t.navBranches], ['#vacancy', t.navVacancy], ['#contact', t.navContact]]
  return (
    <footer style={{ background: '#1c1c1f', color: '#b6b3ad' }}>
      <div className="gf-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 30px' }}>
        <div className="gf-foot" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <Logo size={30} variant="white" />
              <span style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 19, color: '#fff' }}>Gulnora Farm</span>
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#8f8c87', marginTop: 16, maxWidth: 320 }}>{t.footTagline}</p>
            <div style={{ display: 'flex', gap: 11, marginTop: 18 }}>
              <a href={TELEGRAM} target="_blank" rel="noopener" aria-label="Telegram" style={footSocial}><Telegram size={19} /></a>
              <a href={INSTAGRAM} target="_blank" rel="noopener" aria-label="Instagram" style={footSocial}><Instagram size={18} /></a>
              <a href={VACANCY_BOT} target="_blank" rel="noopener" aria-label="Vacancy bot" style={footSocial}><Users size={19} color="#cdcac4" /></a>
            </div>
          </div>
          <div>
            <div style={footHead}>{t.navMenu}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
              {navLinks.map(([href, label]) => <a key={href} href={href} style={{ fontSize: 14.5, color: '#b6b3ad' }}>{label}</a>)}
            </div>
          </div>
          <div>
            <div style={footHead}>{t.navContact}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
              <a href={`tel:${PHONE}`} style={{ fontSize: 14.5, color: '#b6b3ad' }}>{t.phoneValue}</a>
              <a href={TELEGRAM} target="_blank" rel="noopener" style={{ fontSize: 14.5, color: '#b6b3ad' }}>@gulnorafarm_bot</a>
              <a href={INSTAGRAM} target="_blank" rel="noopener" style={{ fontSize: 14.5, color: '#b6b3ad' }}>@gulnorafarm.uz</a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #2e2e32', marginTop: 36, paddingTop: 22, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 13, color: '#74716c' }}>© 2026 Gulnora Farm. {t.footRights}</span>
          <span style={{ fontSize: 13, color: '#74716c' }}>{t.footMade}</span>
        </div>
      </div>
    </footer>
  )
}
const footSocial = { width: 40, height: 40, borderRadius: 11, background: '#2a2a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cdcac4' }
const footHead = { fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6f6c67' }
