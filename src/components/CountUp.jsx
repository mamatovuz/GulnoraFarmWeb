import { useEffect, useRef, useState } from 'react'

// Raqamni 0 dan berilgan qiymatgacha skrollda sanab chiqadi.
// value: "5+", "16", "20K+" kabi — raqam va qo'shimcha (suffix) avtomatik ajratiladi.
export default function CountUp({ value, duration = 1400, className, style }) {
  const m = String(value).match(/^([\d.,]+)(.*)$/)
  const target = m ? parseFloat(m[1].replace(',', '.')) : 0
  const suffix = m ? m[2] : ''
  const [n, setN] = useState(0)
  const ref = useRef(null)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const start = () => {
      if (done.current) return
      done.current = true
      const t0 = performance.now()
      const tick = (t) => {
        const p = Math.min((t - t0) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
        setN(target * eased)
        if (p < 1) requestAnimationFrame(tick)
        else setN(target)
      }
      requestAnimationFrame(tick)
    }
    if (!('IntersectionObserver' in window)) { start(); return }
    const io = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting) { start(); io.disconnect() } })
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [target, duration])

  const display = Number.isInteger(target) ? Math.round(n) : n.toFixed(1)
  return <span ref={ref} className={className} style={style}>{display}{suffix}</span>
}
