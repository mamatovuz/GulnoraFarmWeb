// Hamkorlar — rasmlar oʻngdan chapga uzluksiz aylanib turadi (marquee).
// Rasmlar admin paneldan qoʻshiladi (/api/partners).
import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Handshake } from './icons.jsx'

const BRAND = '#767676'

export default function Partners({ t }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    let alive = true
    api.getPartners().then((rows) => alive && setItems(rows)).catch(() => {})
    return () => { alive = false }
  }, [])

  if (!items.length) return null

  // Uzluksiz aylanish uchun roʻyxatni ikki marta takrorlaymiz
  const loop = [...items, ...items]

  return (
    <section id="partners" style={{ background: '#fff' }}>
      <div className="gf-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px 78px' }}>
        <div className="gf-reveal" style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 12.5, letterSpacing: '.13em', textTransform: 'uppercase', color: BRAND }} className="gf-eyebrow gf-eyebrow-c">{t.partnersEyebrow}</div>
          <h2 className="gf-sectitle" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 38, letterSpacing: '-.01em', marginTop: 10, color: '#262626' }}>{t.partnersTitle}</h2>
          <p style={{ fontSize: 16, color: '#6b6b6b', marginTop: 10, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>{t.partnersSub}</p>
        </div>
      </div>
      <div className="gf-marquee gf-reveal" aria-label={t.partnersTitle}>
        <div className="gf-marquee-track">
          {loop.map((p, i) => (
            <div key={i} className="gf-partner" title={p.name}>
              <img src={p.image} alt={p.name || 'Hamkor'} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
