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
      <div style={{ position: 'fixed', top: 0, left: 0, height: 3, width: `${progress}%`, background: 'linear-gradient(90deg,#b4b4b4 0%,#767676 45%,#3a3a3a 100%)', zIndex: 200, transition: 'width .1s linear' }} />

      {/* Suzuvchi tugmalar */}
      <div style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 190, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <button onClick={toTop} aria-label="Tepaga" title="Tepaga"
          style={{ width: 46, height: 46, borderRadius: '50%', border: '1px solid #e4e4e4', cursor: 'pointer', background: '#fff', color: '#262626', boxShadow: '0 2px 4px rgba(38,38,38,.06), 0 12px 26px -12px rgba(38,38,38,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: show ? 1 : 0, transform: show ? 'scale(1)' : 'scale(.7)', pointerEvents: show ? 'auto' : 'none', transition: 'opacity .3s, transform .3s' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
        </button>
        {/* Ikkalasi ham brend grafitida — sayt bo'ylab bitta urg'u rangi */}
        <a href={`tel:${PHONE}`} aria-label="Qoʻngʻiroq" title="Qoʻngʻiroq" className="gf-float"
          style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(180deg,#828282 0%,#6d6d6d 100%)', color: '#fff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.16), 0 10px 26px -10px rgba(38,38,38,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Phone size={22} />
        </a>
        <a href={TELEGRAM} target="_blank" rel="noopener" aria-label="Telegram" title="Telegram"
          className="gf-float gf-float-tg"
          style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(180deg,#5a5a5a 0%,#454545 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Telegram size={26} />
        </a>
      </div>
    </>
  )
}
