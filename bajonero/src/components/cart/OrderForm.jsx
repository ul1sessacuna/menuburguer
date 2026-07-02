import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ArrowLeft, MapPin, Store, CheckCircle, Loader, ChevronRight } from 'lucide-react'
import { createOrder } from '../../lib/firebase/orders'
import { useCart } from '../../context/CartContext.jsx'

export default function OrderForm({ onBack, onClose }) {
  const { items, notes, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', deliveryType: 'pickup', address: '' })
  const [saving, setSaving] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [error, setError] = useState('')

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return setError('Nombre y teléfono son obligatorios')
    if (form.deliveryType === 'delivery' && !form.address.trim()) return setError('Ingresá la dirección de entrega')
    setSaving(true)
    setError('')
    try {
      const ref = await createOrder({
        customerName: form.name.trim(),
        customerPhone: form.phone.trim(),
        deliveryType: form.deliveryType,
        address: form.deliveryType === 'delivery' ? form.address.trim() : '',
        items: items.map(({ id, name, price, quantity, image, category }) => ({ id, name, price, quantity, image: image ?? '', category })),
        notes,
        total,
      })
      clearCart()
      localStorage.setItem('bajonero_order', ref.id)
      setOrderId(ref.id)
    } catch {
      setError('Error al enviar el pedido. Intentá de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px', padding: '14px 16px', color: '#fff',
    fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 150ms',
  }

  if (orderId) return (
    <div style={{ padding: '40px 24px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '68px', height: '68px', borderRadius: '50%', backgroundColor: 'rgba(74,222,128,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CheckCircle size={36} color="#4ade80" />
      </div>
      <div>
        <h3 style={{ margin: '0 0 6px', fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.3px' }}>¡Pedido enviado!</h3>
        <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
          Seguí el estado en tiempo real desde el menú.
        </p>
      </div>
      <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '14px 20px', width: '100%' }}>
        <p style={{ margin: '0 0 4px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>N° de pedido</p>
        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#4ade80', fontFamily: 'monospace', wordBreak: 'break-all' }}>{orderId}</p>
      </div>
      <button
        onClick={() => { onClose(); navigate(`/seguimiento/${orderId}`) }}
        style={{ width: '100%', padding: '15px', borderRadius: '16px', backgroundColor: '#4ade80', border: 'none', cursor: 'pointer', color: '#000', fontWeight: 900, fontSize: '1rem', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
      >
        Ver estado del pedido <ChevronRight size={18} strokeWidth={3} />
      </button>
      <button
        onClick={onClose}
        style={{ width: '100%', padding: '13px', borderRadius: '16px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.9rem', fontFamily: 'inherit' }}
      >
        Volver al menú
      </button>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 20px 18px' }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', cursor: 'pointer', width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={16} color="#fff" />
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.3px' }}>Datos del pedido</h2>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>Total: ${total.toLocaleString('es-AR')}</p>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', cursor: 'pointer', width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', flexShrink: 0 }}>
          <X size={16} color="rgba(255,255,255,0.65)" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '0 20px 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          style={inputStyle} placeholder="Tu nombre" value={form.name} onChange={set('name')} required
          onFocus={(e) => e.target.style.borderColor = 'rgba(74,222,128,0.5)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
        <input
          style={inputStyle} placeholder="Tu teléfono" type="tel" value={form.phone} onChange={set('phone')} required
          onFocus={(e) => e.target.style.borderColor = 'rgba(74,222,128,0.5)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />

        {/* Delivery type */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            { id: 'pickup', label: 'Retiro en local', Icon: Store },
            { id: 'delivery', label: 'Delivery', Icon: MapPin },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setForm((f) => ({ ...f, deliveryType: id }))}
              style={{
                padding: '14px 12px', borderRadius: '14px', cursor: 'pointer', fontFamily: 'inherit',
                border: form.deliveryType === id ? '1.5px solid #4ade80' : '1.5px solid rgba(255,255,255,0.08)',
                backgroundColor: form.deliveryType === id ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.03)',
                color: form.deliveryType === id ? '#4ade80' : 'rgba(255,255,255,0.35)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                transition: 'all 150ms',
              }}
            >
              <Icon size={22} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{label}</span>
            </button>
          ))}
        </div>

        {form.deliveryType === 'delivery' && (
          <input
            style={inputStyle} placeholder="Dirección de entrega" value={form.address} onChange={set('address')}
            onFocus={(e) => e.target.style.borderColor = 'rgba(74,222,128,0.5)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
        )}

        {error && (
          <p style={{ margin: 0, color: '#ef4444', fontSize: '0.82rem', backgroundColor: 'rgba(239,68,68,0.07)', padding: '11px 14px', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.18)' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          style={{
            padding: '15px', borderRadius: '16px',
            backgroundColor: saving ? 'rgba(255,255,255,0.1)' : '#4ade80',
            border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
            color: saving ? 'rgba(255,255,255,0.4)' : '#000',
            fontWeight: 900, fontSize: '1rem', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            transition: 'background 200ms',
          }}
        >
          {saving && <Loader size={18} style={{ animation: 'spin 0.6s linear infinite' }} />}
          {saving ? 'Enviando...' : 'Confirmar pedido'}
        </button>
      </form>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
