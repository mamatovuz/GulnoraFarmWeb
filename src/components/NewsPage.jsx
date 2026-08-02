// Yangiliklar sahifasi (/news) — barcha yangiliklar toʻliq (rasm + matn) koʻrinadi.
import { useEffect, useState } from 'react'
import { TR } from '../data.js'
import { api } from '../api.js'
import Logo from './Logo.jsx'
import { Bell, ArrowLeft } from './icons.jsx'

const INK = '#262626', BODY = '#565656', MUTED = '#8c8c8c', LINE = '#e4e4e4'
const DISPLAY = "'Quicksand', sans-serif"
const SURFACE = 'linear-gradient(180deg,#f7f7f7 0%,#efefef 100%)'
const SEEN_KEY = 'gf_news_seen'
const LANG_KEY = 'gf_lang'

export default function NewsPage() {
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_KEY) || 'uz')
  const [items, setItems] = useState(null)
  const t = TR[lang]

  useEffect(() => { localStorage.setItem(LANG_KEY, lang) }, [lang])

  useEffect(() => {
    api.getNews()
      .then((rows) => {
        setItems(rows)
        if (rows.length) localStorage.setItem(SEEN_KEY, String(rows[0].id))
      })
      .catch(() => setItems([]))
  }, [])

  const fmtDate = (sec) => {
    try { return new Date(sec * 1000).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'uz-UZ', { day: '2-digit', month: 'long', year: 'numeric' }) }
    catch { return '' }
  }

  const langBtn = (code, labelTxt) => {
    const active = lang === code
    return (
      <button onClick={() => setLang(code)} style={{ border: 'none', cursor: 'pointer', fontFamily: DISPLAY, fontSize: 13, fontWeight: 700, padding: '6px 12px', borderRadius: 999, background: active ? '#fff' : 'transparent', color: active ? INK : MUTED, boxShadow: active ? '0 1px 2px rgba(38,38,38,.14)' : 'none' }}>{labelTxt}</button>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: SURFACE }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(14px) saturate(120%)', borderBottom: '1px solid ' + LINE }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px', height: 66, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, color: BODY, fontFamily: DISPLAY, fontWeight: 700, fontSize: 14.5 }}>
            <span className="gf-well" style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: INK }}><ArrowLeft size={19} /></span>
            <span className="gf-news-back-text">{t.newsBack}</span>
          </a>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo size={28} />
            <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 18, color: INK }}>Gulnora Farm</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', background: '#efefef', borderRadius: 999, padding: 3 }}>
            {langBtn('uz', 'UZ')}{langBtn('ru', 'RU')}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '54px 20px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid ' + LINE, borderRadius: 999, padding: '7px 15px', fontFamily: DISPLAY, fontWeight: 600, fontSize: 12.5, letterSpacing: '.12em', textTransform: 'uppercase', color: '#4f4f4f' }}>
            <Bell size={15} color="#767676" />{t.newsTitle}
          </div>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 40, letterSpacing: '-.015em', margin: '18px 0 0', color: INK }}>{t.newsPageTitle}</h1>
          <p style={{ fontSize: 16.5, color: MUTED, marginTop: 12, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.55 }}>{t.newsPageSub}</p>
        </div>

        {items === null ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: MUTED }}>…</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: MUTED }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fff', border: '1px solid ' + LINE, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Bell size={28} color="#c0c0c0" /></div>
            <div style={{ fontSize: 16 }}>{t.newsEmpty}</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {items.map((n) => (
              <article key={n.id} style={{ background: '#fff', border: '1px solid ' + LINE, borderRadius: 24, overflow: 'hidden', boxShadow: '0 2px 4px rgba(38,38,38,.04), 0 26px 54px -34px rgba(38,38,38,.4)' }}>
                {n.image && (
                  <img src={n.image} alt={n.title} loading="lazy" style={{ width: '100%', maxHeight: 460, objectFit: 'cover', display: 'block' }} />
                )}
                <div style={{ padding: '28px 32px 34px' }}>
                  <div style={{ fontSize: 13, color: '#a6a6a6', fontWeight: 600, letterSpacing: '.02em' }}>{fmtDate(n.created_at)}</div>
                  <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 27, lineHeight: 1.22, color: INK, margin: '8px 0 0', textWrap: 'balance' }}>{n.title}</h2>
                  {n.body && <p style={{ fontSize: 16.5, lineHeight: 1.72, color: '#4a4a4a', marginTop: 16, whiteSpace: 'pre-wrap' }}>{n.body}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
