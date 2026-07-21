// Brend palitrasi — logo foni #767676 dan olingan neytral shkala
const BRAND = '#767676'
const ACCENT = '#4f4f4f'
const LINE = '#e4e4e4'
const SURFACE = 'linear-gradient(180deg,#f7f7f7 0%,#efefef 100%)'

function Stars({ n }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[0, 1, 2, 3, 4].map(i => (
        <svg key={i} width="17" height="17" viewBox="0 0 24 24" fill={i < n ? '#4f4f4f' : '#dedede'}>
          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials({ t }) {
  return (
    <section id="reviews" style={{ background: SURFACE }}>
      <div className="gf-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '84px 24px' }}>
        <div className="gf-reveal" style={{ textAlign: 'center', marginBottom: 44 }}>
          <div className="gf-eyebrow gf-eyebrow-c" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 12.5, letterSpacing: '.13em', textTransform: 'uppercase', color: BRAND }}>{t.reviewsEyebrow}</div>
          <h2 className="gf-sectitle" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 38, letterSpacing: '-.01em', marginTop: 10, color: '#262626' }}>{t.reviewsTitle}</h2>
        </div>
        <div className="gf-grid4 gf-reveal gf-d1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 22 }}>
          {t.reviews.map((r, i) => (
            <div key={i} className="gf-card" style={{ background: 'linear-gradient(180deg,#ffffff 0%,#fafafa 100%)', border: '1px solid ' + LINE, borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#e0e0e0" style={{ marginBottom: 10 }}><path d="M7.5 6C5 6 3 8 3 10.5S5 15 7.5 15c.3 0 .6 0 .9-.1C7.8 16.7 6.2 18 4.5 18v2c4 0 7-3.4 7-8.5C11.5 8 9.5 6 7.5 6zm10 0C15 6 13 8 13 10.5s2 4.5 4.5 4.5c.3 0 .6 0 .9-.1-.6 1.8-2.2 3.1-3.9 3.1v2c4 0 7-3.4 7-8.5C21.5 8 19.5 6 17.5 6z" /></svg>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#565656', flex: 1 }}>{r.text}</p>
              <div style={{ marginTop: 16 }}>
                <Stars n={r.rating} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 11 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(180deg,#828282 0%,#6d6d6d 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.18)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 15, flex: 'none' }}>{r.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 14, color: '#262626' }}>{r.name}</div>
                    <div style={{ fontSize: 12.5, color: '#8c8c8c' }}>{r.city}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
