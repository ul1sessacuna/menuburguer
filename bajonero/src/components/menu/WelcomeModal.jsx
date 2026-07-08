import { useState, useEffect } from 'react'
import { X, UtensilsCrossed, ShoppingCart, ClipboardList, MapPin, Sparkles } from 'lucide-react'

const STEPS = [
  {
    Icon: UtensilsCrossed,
    title: 'Explorá el menú',
    desc: 'Navegá por las categorías y tocá el + en cualquier producto para agregarlo.',
  },
  {
    Icon: ShoppingCart,
    title: 'Elegí cómo pedir',
    desc: 'Podés confirmar el pedido por la web y seguirlo en tiempo real, o enviarlo directo por WhatsApp.',
  },
  {
    Icon: ClipboardList,
    title: 'Completá tus datos',
    desc: 'Ingresá tu nombre, teléfono y si querés delivery o retiro en el local.',
  },
  {
    Icon: MapPin,
    title: 'Seguí tu pedido',
    desc: 'Una vez confirmado por la web podés ver el estado en tiempo real desde el menú.',
  },
]

const KEY = 'bajonero_welcome_seen'

export default function WelcomeModal({ businessName }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setVisible(true)
  }, [])

  const dismiss = () => {
    localStorage.setItem(KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        backgroundColor: 'rgba(0,0,0,0.78)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 200ms ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#141414',
          borderRadius: '28px',
          width: '100%',
          maxWidth: '480px',
          border: '1px solid rgba(255,255,255,0.07)',
          overflow: 'hidden',
          animation: 'slideUp 280ms cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0d2218 0%, #1a3a2a 100%)',
          padding: '28px 24px 24px',
          position: 'relative',
        }}>
          <button
            onClick={dismiss}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
              width: '30px', height: '30px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={14} color="rgba(255,255,255,0.6)" />
          </button>
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: 'rgba(74,222,128,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <Sparkles size={22} color="#4ade80" />
          </div>
          <h2 style={{ margin: '0 0 6px', fontSize: '1.4rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.4px' }}>
            ¡Bienvenido a {businessName ?? 'nuestro menú'}!
          </h2>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
            Hacé tu pedido en minutos, así de fácil:
          </p>
        </div>

        {/* Steps */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {STEPS.map(({ Icon, title, desc }, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '13px', flexShrink: 0,
                backgroundColor: 'rgba(74,222,128,0.07)',
                border: '1px solid rgba(74,222,128,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} color="#4ade80" strokeWidth={2} />
              </div>
              <div style={{ paddingTop: '3px' }}>
                <p style={{ margin: '0 0 3px', fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>{title}</p>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.42)', lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div style={{ padding: '4px 24px 28px' }}>
          <button
            onClick={dismiss}
            style={{
              width: '100%', padding: '15px', borderRadius: '16px',
              backgroundColor: '#4ade80', border: 'none', cursor: 'pointer',
              color: '#000', fontWeight: 900, fontSize: '1rem', fontFamily: 'inherit',
              letterSpacing: '-0.2px',
            }}
          >
            ¡Entendido, vamos!
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  )
}
