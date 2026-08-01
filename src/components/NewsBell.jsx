// Yangiliklar qoʻngʻirogʻi — navbar tepasida. Bosilganda yangiliklar roʻyxati
// ochiladi (rasm + matn). Yangi yangiliklar soni nishonda koʻrsatiladi.
import { useEffect, useRef, useState } from 'react'
import { api } from '../api.js'
import { Bell, Close } from './icons.jsx'

const INK = '#262626'
const SEEN_KEY = 'gf_news_seen'

export default function NewsBell({ t }) {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [seenId, setSeenId] = useState(() => Number(localStorage.getItem(SEEN_KEY) || 0))
  const boxRef = useRef(null)

  useEffect(() => {
    let alive = true
    api.getNews().then((rows) => alive && setItems(rows)).catch(() => {})
    return () => { alive = false }
  }, [])

  // Tashqariga bosilganda yopish
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
      const maxId = items[0].id // roʻyxat DESC — eng yangisi birinchi
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
        <div className="gf-news-pop" style={{ position: 'absolute', top: 48, right: 0, width: 340, maxWidth: '86vw', maxHeight: 460, overflowY: 'auto', background: '#fff', border: '1px solid #e4e4e4', borderRadius: 18, boxShadow: '0 24px 60px -22px rgba(38,38,38,.5)', zIndex: 80 }}>
          <div style={{ position: 'sticky', top: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #efefef' }}>
            <span style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 16, color: INK }}>{t.newsTitle}</span>
            <button onClick={() => setOpen(false)} aria-label={t.newsClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#8c8c8c' }}><Close size={18} /></button>
          </div>
          {items.length === 0 ? (
            <div style={{ padding: '34px 20px', textAlign: 'center', color: '#8c8c8c', fontSize: 14.5 }}>{t.newsEmpty}</div>
          ) : (
            <div>
              {items.map((n) => (
                <article key={n.id} style={{ padding: 16, borderBottom: '1px solid #f2f2f2' }}>
                  {n.image && (
                    <img src={n.image} alt={n.title} loading="lazy" style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 12, marginBottom: 10, display: 'block' }} />
                  )}
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 15.5, color: INK, lineHeight: 1.3 }}>{n.title}</div>
                  <div style={{ fontSize: 11.5, color: '#a6a6a6', marginTop: 3 }}>{fmtDate(n.created_at)}</div>
                  {n.body && <p style={{ fontSize: 13.5, color: '#565656', lineHeight: 1.5, marginTop: 8, whiteSpace: 'pre-wrap' }}>{n.body}</p>}
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
