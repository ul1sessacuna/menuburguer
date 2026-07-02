import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function PromoBanner({ promos }) {
  const [index, setIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const active = promos.filter((p) => p.active)

  useEffect(() => {
    if (active.length <= 1) return
    const t = setInterval(() => setIndex((i) => (i + 1) % active.length), 4000)
    return () => clearInterval(t)
  }, [active.length])

  if (!active.length || dismissed) return null

  const promo = active[index]

  return (
    <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', height: '160px', backgroundColor: '#111' }}>
      {promo.image ? (
        <img src={promo.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0d2218 0%, #1a3a2a 100%)' }} />
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%)' }} />

      <div style={{ position: 'absolute', inset: 0, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <p style={{ margin: '0 0 5px', fontSize: '0.72rem', fontWeight: 800, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Promo
        </p>
        <p style={{ margin: 0, fontWeight: 900, fontSize: '1.3rem', color: '#fff', lineHeight: 1.2, letterSpacing: '-0.3px' }}>
          {promo.title}
        </p>
        {promo.description && (
          <p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
            {promo.description}
          </p>
        )}
      </div>

      <button
        onClick={() => setDismissed(true)}
        style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'rgba(0,0,0,0.45)', border: 'none', cursor: 'pointer',
          width: '26px', height: '26px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <X size={12} color="rgba(255,255,255,0.75)" />
      </button>

      {active.length > 1 && (
        <div style={{ position: 'absolute', bottom: '14px', right: '16px', display: 'flex', gap: '4px', alignItems: 'center' }}>
          {active.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              style={{
                width: i === index ? '18px' : '6px', height: '6px', borderRadius: '3px',
                backgroundColor: i === index ? '#4ade80' : 'rgba(255,255,255,0.3)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'width 300ms ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
