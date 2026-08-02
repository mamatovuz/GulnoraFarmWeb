// Sharh soʻrash oynasi — foydalanuvchi saytda ~30 soniya turgach chiqadi.
// Yulduzcha baho + ism + sabab. Yuborilgan sharh admin moderatsiyasiga tushadi.
import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Star, Close } from './icons.jsx'

const INK = '#262626', BODY = '#565656', MUTED = '#8c8c8c', LINE = '#e4e4e4'
const DISPLAY = "'Quicksand', sans-serif"
const DONE_KEY = 'gf_review_done'        // yuborilgan — boshqa chiqmaydi
const SNOOZE_KEY = 'gf_review_snooze'    // "keyinroq" — vaqtincha yashiriladi
const DELAY_MS = 30000                    // 30 soniya
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000 // 7 kun

const input = { width: '100%', border: '1px solid #d6d6d6', background: '#fafafa', borderRadius: 12, padding: '12px 14px', fontSize: 15, color: INK, outline: 'none', boxSizing: 'border-box' }

export default function ReviewPrompt({ t }) {
  const [show, setShow] = useState(false)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [text, setText] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | done
  const [err, setErr] = useState('')

  useEffect(() => {
    if (localStorage.getItem(DONE_KEY)) return
    const snooze = Number(localStorage.getItem(SNOOZE_KEY) || 0)
    if (snooze && Date.now() - snooze < SNOOZE_MS) return
    const timer = setTimeout(() => setShow(true), DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!show) return
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  const close = () => {
    setShow(false)
    if (status !== 'done') localStorage.setItem(SNOOZE_KEY, String(Date.now()))
  }

  const submit = async (e) => {
    e.preventDefault(); setErr('')
    if (!rating) { setErr(t.rvErrRating); return }
    if (!name.trim() || !text.trim()) return
    setStatus('sending')
    try {
      await api.submitReview({ name: name.trim(), city: city.trim(), rating, text: text.trim() })
      localStorage.setItem(DONE_KEY, '1')
      setStatus('done')
      setTimeout(() => setShow(false), 2600)
    } catch (e) { setErr(e.message); setStatus('idle') }
  }

  if (!show) return null
  const active = hover || rating
  const sending = status === 'sending'

  return (
    <div onMouseDown={close} style={{ position: 'fixed', inset: 0, background: 'rgba(18,18,20,.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4vh 16px', zIndex: 300 }}>
      <div onMouseDown={(e) => e.stopPropagation()} style={{ width: 440, maxWidth: '100%', background: '#fff', borderRadius: 24, boxShadow: '0 40px 90px -30px rgba(0,0,0,.6)', overflow: 'hidden', animation: 'gfFade .25s ease both' }}>
        {status === 'done' ? (
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#edf2ee', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#3d6b51" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 19, color: INK, lineHeight: 1.35 }}>{t.rvThanks}</div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div style={{ position: 'relative', padding: '26px 28px 4px' }}>
              <button type="button" onClick={close} aria-label={t.rvClose} style={{ position: 'absolute', top: 16, right: 16, width: 34, height: 34, borderRadius: 10, border: 'none', background: '#f2f2f2', color: '#6b6b6b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Close size={18} /></button>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, color: INK, margin: '0 40px 0 0', lineHeight: 1.25 }}>{t.rvPromptTitle}</h2>
              <p style={{ fontSize: 14.5, color: MUTED, marginTop: 8, lineHeight: 1.5 }}>{t.rvPromptSub}</p>
            </div>

            <div style={{ padding: '14px 28px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '6px 0 4px' }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button key={i} type="button" className="gf-star-btn" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)} onClick={() => setRating(i)} aria-label={i + ' / 5'}>
                      <Star size={38} filled={i <= active} color="#f2b01e" empty="#e4e4e4" />
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: 12.5, color: MUTED, fontWeight: 600, minHeight: 16 }}>{rating ? `${rating} / 5` : t.rvRatingLabel}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="gf-form2">
                <input style={input} value={name} onChange={(e) => setName(e.target.value)} placeholder={t.rvName} required disabled={sending} />
                <input style={input} value={city} onChange={(e) => setCity(e.target.value)} placeholder={t.rvCity} disabled={sending} />
              </div>
              <textarea style={{ ...input, resize: 'vertical', minHeight: 88 }} value={text} onChange={(e) => setText(e.target.value)} placeholder={t.rvText} required disabled={sending} />

              {err && <div style={{ background: '#f7ecea', border: '1px solid #ebd5d1', color: '#8e4239', borderRadius: 10, padding: '9px 12px', fontSize: 13 }}>{err}</div>}

              <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
                <button type="submit" disabled={sending} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9, fontFamily: DISPLAY, fontWeight: 700, fontSize: 15.5, padding: 14, borderRadius: 999, border: 'none', cursor: sending ? 'wait' : 'pointer', background: 'linear-gradient(180deg,#5a5a5a 0%,#3f3f3f 100%)', color: '#fff', opacity: sending ? .7 : 1 }}>
                  {sending && <span className="gf-spin" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} />}
                  {sending ? t.rvSending : t.rvSubmit}
                </button>
                <button type="button" onClick={close} disabled={sending} style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15, padding: '14px 18px', borderRadius: 999, border: '1px solid ' + LINE, background: '#fff', color: BODY, cursor: 'pointer' }}>{t.rvLater}</button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
