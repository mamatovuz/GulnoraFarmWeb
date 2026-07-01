import { useEffect, useState } from 'react'
import { TELEGRAM, PHONE } from '../data.js'
import { Telegram, Phone } from './icons.jsx'

// Yuqoridagi skroll-progress chizig'i + suzuvchi tugmalar (Telegram, qo'ng'iroq, tepaga)
export default function FloatingUI() {
  const [progress, setProgress] = useState(0)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      const p = max > 0 ? (h.scrollTop / max) * 100 : 0
      setProgress(p)
      setShow(h.scrollTop > 500)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <>
      {/* Skroll progress */}
      <div style={{ position: 'fixed', top: 0, left: 0, height: 3, width: `${progress}%`, background: 'linear-gradient(90deg,#3f7a52,#26262a)', zIndex: 200, transition: 'width .1s linear' }} />

      {/* Suzuvchi tugmalar */}
      <div style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 190, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <button onClick={toTop} aria-label="Tepaga" title="Tepaga"
          style={{ width: 46, height: 46, borderRadius: '50%', border: 'none', cursor: 'pointer', background: '#fff', color: '#26262a', boxShadow: '0 8px 22px -8px rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: show ? 1 : 0, transform: show ? 'scale(1)' : 'scale(.7)', pointerEvents: show ? 'auto' : 'none', transition: 'opacity .3s, transform .3s' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
        </button>
        <a href={`tel:${PHONE}`} aria-label="Qoʻngʻiroq" title="Qoʻngʻiroq"
          style={{ width: 52, height: 52, borderRadius: '50%', background: '#26262a', color: '#fff', boxShadow: '0 10px 26px -8px rgba(38,38,42,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Phone size={22} />
        </a>
        <a href={TELEGRAM} target="_blank" rel="noopener" aria-label="Telegram" title="Telegram"
          className="gf-float-tg"
          style={{ width: 56, height: 56, borderRadius: '50%', background: '#229ED9', color: '#fff', boxShadow: '0 12px 30px -8px rgba(34,158,217,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Telegram size={26} />
        </a>
      </div>
    </>
  )
}
