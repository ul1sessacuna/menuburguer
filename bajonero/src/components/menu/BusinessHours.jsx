const DAY_KEYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']

function getTodayKey() {
  const idx = new Date().getDay()
  return DAY_KEYS[idx === 0 ? 6 : idx - 1]
}

function isCurrentlyOpen(hours) {
  if (!hours) return false
  const key = getTodayKey()
  const day = hours[key]
  if (!day || day.closed) return false
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const [oh, om] = day.open.split(':').map(Number)
  const [ch, cm] = day.close.split(':').map(Number)
  const openMin = oh * 60 + om
  let closeMin = ch * 60 + cm
  if (closeMin < openMin) closeMin += 24 * 60
  return nowMin >= openMin && nowMin < closeMin
}

export default function BusinessHours({ settings }) {
  const hours = settings?.businessHours
  const isOpen = isCurrentlyOpen(hours)
  const today = hours?.[getTodayKey()]

  const text = isOpen
    ? `Abierto · hasta las ${today?.close}`
    : today && !today.closed
      ? `Cerrado · abre a las ${today?.open}`
      : 'Cerrado hoy'

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
      <div style={{
        width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0,
        backgroundColor: isOpen ? '#4ade80' : '#ef4444',
        boxShadow: isOpen ? '0 0 0 3px rgba(74,222,128,0.2)' : 'none',
      }} />
      <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
        {text}
      </span>
    </div>
  )
}
