// Yangiliklar qoʻngʻirogʻi — navbar tepasida. Bosilganda yangiliklar roʻyxati
// ochiladi; yangilikni bossa — toʻliq oʻqish uchun modal oyna ochiladi.
import { useEffect, useRef, useState } from 'react'
import { api } from '../api.js'
import { Bell, Close } from './icons.jsx'

const INK = '#262626', BODY = '#565656', MUTED = '#8c8c8c'
const DISPLAY = "'Quicksand', sans-serif"
const SEEN_KEY = 'gf_news_seen'

export default function NewsBell({ t }) {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(null) // toʻliq oʻqilayotgan yangilik
  const [seenId, setSeenId] = useState(() => Number(localStorage.getItem(SEEN_KEY) || 0))
  const boxRef = useRef(null)

  useEffect(() => {
    let alive = true
    api.getNews().then((rows) => alive && setItems(rows)).catch(() => {})
    return () => { alive = false }
  }, [])

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const unread = items.filter((n) => n.id > seenId).length

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (next && items.length) {
      const maxId = items[0].id
      localStorage.setItem(SEEN_KEY, String(maxId))
      setSeenId(maxId)
    }
  }

  const fmtDate = (sec) => {
    try { return new Date(sec * 1000).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'long', year: 'numeric' }) }
    catch { return '' }
  }

  return (
    <div ref={boxRef} style={{ position: 'relative', display: 'flex' }}>
      <button onClick={toggle} aria-label={t.newsTitle} className="gf-well" style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: INK, position: 'relative' }}>
        <Bell size={19} />
        {unread > 0 && (
          <span style={{ position: 'absolute', top: -2, right: -2, minWidth: 17, height: 17, padding: '0 4px', borderRadius: 999, background: '#c0392b', color: '#fff', fontSize: 10.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 2px #fff' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="gf-news-pop" style={{ position: 'absolute', top: 50, right: 0, width: 380, maxWidth: '92vw', maxHeight: 480, overflowY: 'auto', background: '#fff', border: '1px solid #ececec', borderRadius: 20, boxShadow: '0 30px 70px -26px rgba(38,38,38,.55)', zIndex: 80 }}>
          <div style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 18px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <Bell size={17} color="#5a5a5a" />
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, color: INK }}>{t.newsTitle}</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label={t.newsClose} style={{ border: 'none', background: '#f2f2f2', width: 30, height: 30, borderRadius: 9, cursor: 'pointer', color: '#6b6b6b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Close size={17} /></button>
          </div>

          {items.length === 0 ? (
            <div style={{ padding: '46px 20px', textAlign: 'center', color: MUTED }}>
              <div style={{ width: 54, height: 54, borderRadius: '50%', background: '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><Bell size={24} color="#c0c0c0" /></div>
              <div style={{ fontSize: 14.5 }}>{t.newsEmpty}</div>
            </div>
          ) : (
            <div style={{ padding: 8 }}>
              {items.map((n) => {
                const isNew = n.id > seenId
                return (
                  <button key={n.id} onClick={() => { setActive(n); setOpen(false) }} className="gf-news-item"
                    style={{ width: '100%', display: 'flex', gap: 13, alignItems: 'center', textAlign: 'left', padding: 10, borderRadius: 14, border: 'none', background: 'transparent', cursor: 'pointer' }}>
                    {n.image
                      ? <img src={n.image} alt="" loading="lazy" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 12, flex: 'none' }} />
                      : <div style={{ width: 60, height: 60, borderRadius: 12, flex: 'none', background: 'linear-gradient(135deg,#f0f0f0,#e4e4e4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b0b0b0' }}><Bell size={20} /></div>}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        {isNew && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#c0392b', flex: 'none' }} />}
                        <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14.5, color: INK, lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.title}</span>
                      </div>
                      {n.body && <div style={{ fontSize: 12.5, color: BODY, marginTop: 3, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{n.body}</div>}
                      <div style={{ fontSize: 11, color: '#a6a6a6', marginTop: 4 }}>{fmtDate(n.created_at)}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {active && <NewsModal n={active} onClose={() => setActive(null)} fmtDate={fmtDate} closeLabel={t.newsClose} />}
    </div>
  )
}

function NewsModal({ n, onClose, fmtDate, closeLabel }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div onMouseDown={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(18,18,20,.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4vh 16px', zIndex: 200 }}>
      <div onMouseDown={(e) => e.stopPropagation()} style={{ width: 560, maxWidth: '100%', maxHeight: '92vh', overflowY: 'auto', background: '#fff', borderRadius: 22, boxShadow: '0 40px 90px -30px rgba(0,0,0,.6)', animation: 'gfFade .25s ease both' }}>
        <div style={{ position: 'relative' }}>
          {n.image && <img src={n.image} alt={n.title} style={{ width: '100%', maxHeight: 300, objectFit: 'cover', display: 'block', borderRadius: '22px 22px 0 0' }} />}
          <button onClick={onClose} aria-label={closeLabel} style={{ position: 'absolute', top: 14, right: 14, width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(6px)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Close size={19} /></button>
        </div>
        <div style={{ padding: '24px 28px 28px' }}>
          <div style={{ fontSize: 12.5, color: '#a6a6a6', fontWeight: 600 }}>{fmtDate(n.created_at)}</div>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 25, lineHeight: 1.2, color: INK, margin: '6px 0 0' }}>{n.title}</h2>
          {n.body && <p style={{ fontSize: 15.5, lineHeight: 1.65, color: '#4a4a4a', marginTop: 14, whiteSpace: 'pre-wrap' }}>{n.body}</p>}
        </div>
      </div>
    </div>
  )
}
