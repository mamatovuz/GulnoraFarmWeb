// Yangiliklar qoʻngʻirogʻi — navbar tepasida. Bosilganda /news sahifasiga oʻtadi,
// yangiliklar toʻliq (rasm + matn) oʻsha yerda koʻrinadi.
import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Bell } from './icons.jsx'

const INK = '#262626'
const SEEN_KEY = 'gf_news_seen'

export default function NewsBell({ t }) {
  const [items, setItems] = useState([])
  const [seenId] = useState(() => Number(localStorage.getItem(SEEN_KEY) || 0))

  useEffect(() => {
    let alive = true
    api.getNews().then((rows) => alive && setItems(rows)).catch(() => {})
    return () => { alive = false }
  }, [])

  const unread = items.filter((n) => n.id > seenId).length

  return (
    <a href="/news" aria-label={t.newsTitle} title={t.newsTitle} className="gf-well"
      style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: INK, position: 'relative' }}>
      <Bell size={19} />
      {unread > 0 && (
        <span style={{ position: 'absolute', top: -2, right: -2, minWidth: 17, height: 17, padding: '0 4px', borderRadius: 999, background: '#c0392b', color: '#fff', fontSize: 10.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 2px #fff' }}>
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </a>
  )
}
