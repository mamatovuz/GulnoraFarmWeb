// Mijozlar fikri — bosh sahifada. Adminda tanlangan (featured) sharhlar bazadan
// keladi; agar hali tanlanmagan boʻlsa, data.js dagi asosiy sharhlar koʻrsatiladi.
// Sharhlar soni cheklanmagan — hammasi «Hamkorlarimiz» kabi uzluksiz aylanib turadi.
import { useEffect, useState } from 'react'
import { api } from '../api.js'

const BRAND = '#767676'

function Stars({ n }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[0, 1, 2, 3, 4].map(i => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < n ? '#f2b01e' : '#e2e2e2'}>
          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ r }) {
  return (
    <article className="gf-rev-card">
      <svg className="gf-rev-quote" width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 6C5 6 3 8 3 10.5S5 15 7.5 15c.3 0 .6 0 .9-.1C7.8 16.7 6.2 18 4.5 18v2c4 0 7-3.4 7-8.5C11.5 8 9.5 6 7.5 6zm10 0C15 6 13 8 13 10.5s2 4.5 4.5 4.5c.3 0 .6 0 .9-.1-.6 1.8-2.2 3.1-3.9 3.1v2c4 0 7-3.4 7-8.5C21.5 8 19.5 6 17.5 6z" /></svg>
      <p className="gf-rev-text">{r.text}</p>
      <div className="gf-rev-foot">
        <Stars n={r.rating} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginTop: 12 }}>
          <div className="gf-rev-avatar">{(r.name || '?').charAt(0)}</div>
          <div style={{ minWidth: 0 }}>
            <div className="gf-rev-name">{r.name}</div>
            {r.city && <div className="gf-rev-city">{r.city}</div>}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Testimonials({ t, lang = 'uz' }) {
  const [dbReviews, setDbReviews] = useState(null)

  useEffect(() => {
    let alive = true
    api.getFeaturedReviews().then((rows) => alive && setDbReviews(rows)).catch(() => alive && setDbReviews([]))
    return () => { alive = false }
  }, [])

  // Bazadagi sharhni tanlangan tilga moslash (ruscha boʻsh boʻlsa — asl matn)
  const pick = (r) => {
    if (lang === 'ru') return { name: r.name_ru || r.name, city: r.city_ru || r.city, rating: r.rating, text: r.text_ru || r.text }
    return { name: r.name, city: r.city, rating: r.rating, text: r.text }
  }

  // Bazada tanlangan sharhlar boʻlsa — oʻshalar; aks holda data.js dagilar
  const list = dbReviews && dbReviews.length ? dbReviews.map(pick) : t.reviews
  if (!list.length) return null

  // Uzluksiz aylanish uchun lentani yetarlicha keng qilamiz. Sharh kam boʻlsa
  // (masalan 1-2 ta) ham lenta ekran kengligidan oshib ketishi shart, aks holda
  // uzilish (boʻshliq) koʻrinadi. Shuning uchun asosiy roʻyxatni takrorlaymiz.
  const MIN = 6
  let base = list
  if (base.length < MIN) {
    const times = Math.ceil(MIN / base.length)
    base = Array.from({ length: times }, () => list).flat()
  }
  // -50% ga siljish uchun ikki nusxa — uzluksiz koʻrinadi
  const loop = [...base, ...base]
  // Bir xil tezlik uchun davomiylik karta soniga proporsional
  const duration = base.length * 6.5

  return (
    <section id="reviews" style={{ background: 'linear-gradient(180deg,#f7f7f7 0%,#efefef 100%)' }}>
      <div className="gf-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '84px 24px 30px' }}>
        <div className="gf-reveal" style={{ textAlign: 'center', marginBottom: 8 }}>
          <div className="gf-eyebrow gf-eyebrow-c" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 12.5, letterSpacing: '.13em', textTransform: 'uppercase', color: BRAND }}>{t.reviewsEyebrow}</div>
          <h2 className="gf-sectitle" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 38, letterSpacing: '-.01em', marginTop: 10, color: '#262626' }}>{t.reviewsTitle}</h2>
        </div>
      </div>
      <div className="gf-rev-marquee gf-reveal gf-d1" aria-label={t.reviewsTitle} style={{ paddingBottom: 84 }}>
        <div className="gf-rev-track" style={{ animationDuration: duration + 's' }}>
          {loop.map((r, i) => <ReviewCard key={i} r={r} />)}
        </div>
      </div>
    </section>
  )
}
