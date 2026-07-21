import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Brend kulrangidagi maxsus pin (faol pin to'qroq va kattaroq)
function pinIcon(active) {
  const c = active ? '#262626' : '#767676'
  const size = active ? 42 : 34
  return L.divIcon({
    className: 'gf-pin',
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${c}" stroke="#fff" stroke-width="1.4" style="filter:drop-shadow(0 4px 6px rgba(0,0,0,.35))">
      <path d="M12 2C7.6 2 4 5.6 4 10c0 5.4 8 12 8 12s8-6.6 8-12c0-4.4-3.6-8-8-8z"/>
      <circle cx="12" cy="10" r="3" fill="#fff" stroke="none"/></svg>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size + 6],
  })
}

// Foydalanuvchi joylashuvi pini
const userIcon = L.divIcon({
  className: 'gf-userpin',
  html: `<div style="width:18px;height:18px;border-radius:50%;background:#262626;border:3px solid #fff;box-shadow:0 0 0 4px rgba(118,118,118,.35),0 2px 5px rgba(0,0,0,.3)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

export default function BranchMap({ branches, activeId, userLoc, t }) {
  const elRef = useRef(null)
  const mapRef = useRef(null)
  const layerRef = useRef(null)
  const markersRef = useRef({})
  const userMarkerRef = useRef(null)

  // Xaritani bir marta yaratish
  useEffect(() => {
    if (mapRef.current || !elRef.current) return
    const map = L.map(elRef.current, { scrollWheelZoom: false, attributionControl: true })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map)
    map.setView([40.78, 72.35], 11)
    layerRef.current = L.layerGroup().addTo(map)
    mapRef.current = map
    // container o'lchamini to'g'rilash
    setTimeout(() => map.invalidateSize(), 100)
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Filiallar o'zgarganda pinlarni qayta chizish
  useEffect(() => {
    const map = mapRef.current
    const layer = layerRef.current
    if (!map || !layer) return
    layer.clearLayers()
    markersRef.current = {}
    const pts = []
    branches.forEach(b => {
      if (isNaN(b.lat) || isNaN(b.lon)) return
      const status = b.__status
      const badge = status?.open
        ? `<span style="color:#3d6b51;font-weight:600">● ${t.openNow}</span>`
        : `<span style="color:#9a473d;font-weight:600">● ${t.closedNow}</span>`
      const dist = b.__dist != null ? ` · ${b.__distLabel}` : ''
      const m = L.marker([b.lat, b.lon], { icon: pinIcon(b.id === activeId) })
        .bindPopup(
          `<div style="font-family:'Hanken Grotesk',sans-serif;min-width:180px">
            <div style="font-weight:700;font-size:14px;color:#262626;margin-bottom:3px">${b.name}</div>
            <div style="font-size:12.5px;color:#6b6b6b;line-height:1.4;margin-bottom:6px">${b.addr}</div>
            <div style="font-size:12px;margin-bottom:8px">${badge}${dist}</div>
            <a href="${b.routeUrl}" target="_blank" rel="noopener" style="display:inline-block;font-family:'Quicksand',sans-serif;background:linear-gradient(180deg,#5a5a5a 0%,#454545 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.13);color:#fff;font-size:12.5px;font-weight:700;padding:7px 15px;border-radius:999px;text-decoration:none">${t.route}</a>
          </div>`,
          { closeButton: true }
        )
      m.addTo(layer)
      markersRef.current[b.id] = m
      pts.push([b.lat, b.lon])
    })
    if (pts.length && !activeId) {
      map.fitBounds(pts, { padding: [40, 40], maxZoom: 13 })
    }
  }, [branches, activeId, t])

  // Faol filialga yaqinlashish + popup ochish
  useEffect(() => {
    const map = mapRef.current
    if (!map || !activeId) return
    const b = branches.find(x => x.id === activeId)
    const m = markersRef.current[activeId]
    if (b && m) {
      map.flyTo([b.lat, b.lon], 15, { duration: 0.8 })
      m.openPopup()
    }
  }, [activeId, branches])

  // Foydalanuvchi joylashuvi
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (userMarkerRef.current) { userMarkerRef.current.remove(); userMarkerRef.current = null }
    if (userLoc) {
      userMarkerRef.current = L.marker([userLoc.lat, userLoc.lon], { icon: userIcon, zIndexOffset: 1000 })
        .addTo(map).bindPopup('📍 ' + (t.nearMe))
    }
  }, [userLoc, t])

  return <div ref={elRef} className="gf-map" style={{ width: '100%', height: 420, borderRadius: 20, overflow: 'hidden', border: '1px solid #e4e4e4', boxShadow: '0 2px 4px rgba(38,38,38,.05), 0 18px 40px -28px rgba(38,38,38,.42)', zIndex: 0 }} />
}
