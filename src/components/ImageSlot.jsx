// Rasm uchun joy — agar `src` berilmasa, chiroyli placeholder koʻrsatadi.
// Dizayndagi <image-slot> elementining ekvivalenti.
import { Pin } from './icons.jsx'

export default function ImageSlot({ src, alt = '', placeholder = 'Foto', radius = 0, className = '', style = {} }) {
  const base = {
    width: '100%',
    display: 'block',
    borderRadius: radius,
    overflow: 'hidden',
    ...style
  }
  if (src) {
    return (
      <div className={className} style={base}>
        <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    )
  }
  return (
    <div
      className={className}
      style={{
        ...base,
        background: 'linear-gradient(135deg, #e9e7e2 0%, #f3f1ed 50%, #e4e1da 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#9a988f'
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, fontFamily: "'Quicksand', sans-serif" }}>
        <Pin size={18} /> {placeholder}
      </span>
    </div>
  )
}
