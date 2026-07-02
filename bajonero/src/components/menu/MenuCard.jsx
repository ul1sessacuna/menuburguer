import { Plus, Minus } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'

const CATEGORY_EMOJI = {
  burgers: '🍔', sides: '🍟', drinks: '🥤',
  desserts: '🍰', combos: '🎁', extras: '✨',
}

export default function MenuCard({ product }) {
  const { addItem, updateQuantity, items } = useCart()
  const cartItem = items.find((i) => i.id === product.id)
  const qty = cartItem?.quantity ?? 0

  return (
    <div style={{
      borderRadius: '18px', overflow: 'hidden', position: 'relative',
      aspectRatio: '3/4', backgroundColor: '#141414',
      outline: qty > 0 ? '2px solid #4ade80' : '2px solid transparent',
      outlineOffset: '-2px', transition: 'outline-color 200ms',
    }}>
      {/* Background */}
      {product.image ? (
        <img
          src={product.image} alt={product.name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.2rem', backgroundColor: '#1a1a1a' }}>
          {CATEGORY_EMOJI[product.category] ?? '🍔'}
        </div>
      )}

      {/* Bottom gradient */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '68%', background: 'linear-gradient(to top, rgba(0,0,0,0.96) 0%, transparent 100%)' }} />

      {/* Unavailable overlay */}
      {!product.available && (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.68)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{
            fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            border: '1px solid rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '100px',
          }}>
            No disponible
          </span>
        </div>
      )}

      {/* Content overlay */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 12px 12px' }}>
        <p className="line-clamp-2" style={{
          margin: '0 0 7px', fontSize: '0.82rem', fontWeight: 700,
          color: '#fff', lineHeight: 1.25,
        }}>
          {product.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
          <span style={{ fontWeight: 900, fontSize: '0.92rem', color: qty > 0 ? '#4ade80' : '#fff', letterSpacing: '-0.3px' }}>
            ${product.price.toLocaleString('es-AR')}
          </span>

          {product.available && (
            qty === 0 ? (
              <button
                onClick={() => addItem(product)}
                style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  backgroundColor: '#4ade80', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                <Plus size={15} color="#000" strokeWidth={3} />
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => updateQuantity(product.id, qty - 1)}
                  style={{
                    width: '26px', height: '26px', borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.18)', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Minus size={12} color="#fff" strokeWidth={2.5} />
                </button>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.88rem', minWidth: '14px', textAlign: 'center' }}>{qty}</span>
                <button
                  onClick={() => addItem(product)}
                  style={{
                    width: '26px', height: '26px', borderRadius: '50%',
                    backgroundColor: '#4ade80', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Plus size={12} color="#000" strokeWidth={3} />
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
