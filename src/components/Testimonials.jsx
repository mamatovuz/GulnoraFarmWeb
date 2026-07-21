const ACCENT = '#5f5f5f'

function Stars({ n }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[0, 1, 2, 3, 4].map(i => (
        <svg key={i} width="17" height="17" viewBox="0 0 24 24" fill={i < n ? '#f0a92b' : '#e0e0e0'}>
          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials({ t }) {
  return (
    <section id="reviews" style={{ background: '#f4f4f4' }}>
      <div className="gf-pad" style={{ maxWidth: 1200, margin: '0 auto', padding: '84px 24px' }}>
        <div className="gf-reveal" style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 600, fontSize: 12.5, letterSpacing: '.13em', textTransform: 'uppercase', color: ACCENT }}>{t.reviewsEyebrow}</div>
          <h2 className="gf-sectitle" style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 38, letterSpacing: '-.01em', marginTop: 10, color: '#2b2b2b' }}>{t.reviewsTitle}</h2>
        </div>
        <div className="gf-grid4 gf-reveal gf-d1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 22 }}>
          {t.reviews.map((r, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e4e4e4', borderRadius: 18, padding: 24, display: 'flex', flexDirection: 'column' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#e2e2e2" style={{ marginBottom: 10 }}><path d="M7.5 6C5 6 3 8 3 10.5S5 15 7.5 15c.3 0 .6 0 .9-.1C7.8 16.7 6.2 18 4.5 18v2c4 0 7-3.4 7-8.5C11.5 8 9.5 6 7.5 6zm10 0C15 6 13 8 13 10.5s2 4.5 4.5 4.5c.3 0 .6 0 .9-.1-.6 1.8-2.2 3.1-3.9 3.1v2c4 0 7-3.4 7-8.5C21.5 8 19.5 6 17.5 6z" /></svg>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#4c4c4c', flex: 1 }}>{r.text}</p>
              <div style={{ marginTop: 16 }}>
                <Stars n={r.rating} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 11 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#767676', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 15, flex: 'none' }}>{r.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#2b2b2b' }}>{r.name}</div>
                    <div style={{ fontSize: 12.5, color: '#8a8a8a' }}>{r.city}</div>
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
