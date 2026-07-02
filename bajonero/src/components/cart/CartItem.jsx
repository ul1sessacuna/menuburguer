import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'

export default function CartItem({ item }) {
  const { updateQuantity } = useCart()

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#1e1e1e' }}>
        {item.image
          ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🍔</div>
        }
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{item.name}</p>
        <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#4ade80', fontWeight: 700 }}>
          ${(item.price * item.quantity).toLocaleString('es-AR')}
        </p>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0,
        backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '100px', padding: '4px 6px',
      }}>
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          style={{
            width: '28px', height: '28px', borderRadius: '50%', border: 'none', cursor: 'pointer',
            backgroundColor: item.quantity === 1 ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {item.quantity === 1 ? <Trash2 size={13} color="#ef4444" /> : <Minus size={13} color="rgba(255,255,255,0.7)" />}
        </button>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem', minWidth: '20px', textAlign: 'center' }}>
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          style={{
            width: '28px', height: '28px', borderRadius: '50%', border: 'none', cursor: 'pointer',
            backgroundColor: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Plus size={13} color="#000" strokeWidth={3} />
        </button>
      </div>
    </div>
  )
}
