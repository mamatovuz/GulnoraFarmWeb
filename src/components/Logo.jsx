// Gulnora Farm belgisi (haqiqiy "SG" monogrammasi).
// variant="graphite" — yorug' fon uchun, variant="white" — qorong'i fon uchun.
// Rasm eni balandlikdan kengroq (≈1.64:1), shuning uchun balandlik bo'yicha o'lchaymiz.
export default function Logo({ size = 30, variant = 'graphite', style = {} }) {
  const src = variant === 'white' ? '/assets/mark-white.png' : '/assets/mark-graphite.png'
  return (
    <img
      src={src}
      alt="Gulnora Farm"
      width={Math.round(size * 1.636)}
      height={size}
      style={{ height: size, width: 'auto', display: 'block', flex: 'none', ...style }}
    />
  )
}
