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
        // Brend kulrangining eng yorug' pog'onalari — placeholder ham palitradan chiqmaydi
        background: 'linear-gradient(135deg, #f3f3f3 0%, #e8e8e8 55%, #dedede 100%)',
        boxShadow: 'inset 0 0 0 1px rgba(38,38,38,.055)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#8c8c8c'
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, fontFamily: "'Quicksand', sans-serif" }}>
        <Pin size={18} /> {placeholder}
      </span>
    </div>
  )
}
