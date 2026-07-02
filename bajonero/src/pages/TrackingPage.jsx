import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { subscribeToOrder } from '../lib/firebase/orders'
import { ChevronLeft, Loader, MapPin, Store, XCircle, CheckCircle, ClipboardList, Check, ChefHat, Bell, Home } from 'lucide-react'

const STEPS = [
  { key: 'pending',   label: 'Recibido',   Icon: ClipboardList },
  { key: 'confirmed', label: 'Confirmado', Icon: Check },
  { key: 'preparing', label: 'Preparando', Icon: ChefHat },
  { key: 'ready',     label: 'Listo',      Icon: Bell },
  { key: 'delivered', label: 'Entregado',  Icon: Home },
]

const STATUS_META = {
  pending:   { color: '#4ade80', bg: 'rgba(74,222,128,0.1)',    label: 'Recibido',   msg: 'Tu pedido fue recibido. Esperando confirmación.' },
  confirmed: { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',    label: 'Confirmado', msg: 'Confirmado. ¡Pronto empezamos a prepararlo!' },
  preparing: { color: '#fb923c', bg: 'rgba(251,146,60,0.1)',    label: 'Preparando', msg: 'Estamos preparando tu pedido con cariño.' },
  ready:     { color: '#4ade80', bg: 'rgba(74,222,128,0.1)',    label: '¡Listo!',    msg: 'Tu pedido está listo. ¡A disfrutar!' },
  delivered: { color: '#6b7280', bg: 'rgba(107,114,128,0.1)',   label: 'Entregado',  msg: 'Pedido entregado. ¡Gracias por elegirnos!' },
  cancelled: { color: '#f87171', bg: 'rgba(248,113,113,0.1)',   label: 'Cancelado',  msg: 'Este pedido fue cancelado.' },
}

function timeAgo(ts) {
  if (!ts) return ''
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60) return 'hace un momento'
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`
  return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

function ProgressStepper({ status }) {
  if (status === 'cancelled') return null
  const currentIdx = STEPS.findIndex((s) => s.key === status)

  return (
    <div style={{ padding: '8px 4px 4px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        {STEPS.map((step, idx) => {
          const done = idx < currentIdx
          const active = idx === currentIdx
          return (
            <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
              {idx > 0 && (
                <div style={{
                  position: 'absolute', top: '17px', right: '50%', left: '-50%', height: '2px', zIndex: 0,
                  backgroundColor: done || active ? '#4ade80' : 'rgba(255,255,255,0.07)',
                  transition: 'background-color 600ms',
                }} />
              )}
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%', zIndex: 1, position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: done ? '#4ade80' : active ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.05)',
                border: active ? '2px solid #4ade80' : done ? '2px solid #4ade80' : '2px solid rgba(255,255,255,0.08)',
                boxShadow: active ? '0 0 0 5px rgba(74,222,128,0.12)' : 'none',
                transition: 'all 500ms',
              }}>
                {done
                  ? <Check size={15} color="#000" strokeWidth={3} />
                  : <step.Icon size={15} color={active ? '#4ade80' : 'rgba(255,255,255,0.2)'} strokeWidth={2} />
                }
              </div>
              <p style={{
                margin: '6px 0 0', fontSize: '0.6rem', fontWeight: active ? 800 : 500, textAlign: 'center', lineHeight: 1.2,
                color: active ? '#4ade80' : done ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)',
                transition: 'color 500ms',
              }}>
                {step.label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function TrackingPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(undefined)

  useEffect(() => {
    if (!orderId) return
    const unsub = subscribeToOrder(orderId, (data) => {
      setOrder(data)
      if (data?.status === 'delivered' || data?.status === 'cancelled') {
        localStorage.removeItem('bajonero_order')
      }
    })
    return unsub
  }, [orderId])

  const meta = order ? (STATUS_META[order.status] ?? STATUS_META.pending) : null

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0c0c0c', color: '#fff', fontFamily: 'inherit' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'sticky', top: 0, backgroundColor: 'rgba(12,12,12,0.9)',
        backdropFilter: 'blur(16px)', zIndex: 10,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'rgba(255,255,255,0.07)', border: 'none', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          <ChevronLeft size={18} color="#fff" />
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, letterSpacing: '-0.2px' }}>Estado del pedido</h1>
          <p style={{ margin: 0, fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{orderId}</p>
        </div>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px 16px' }}>

        {order === undefined && (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}>
            <Loader size={28} color="#4ade80" style={{ animation: 'spin 0.6s linear infinite' }} />
          </div>
        )}

        {order === null && (
          <div style={{ textAlign: 'center', paddingTop: '80px' }}>
            <XCircle size={48} color="rgba(248,113,113,0.5)" style={{ marginBottom: '16px' }} />
            <h2 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: 800 }}>Pedido no encontrado</h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.35)', fontSize: '0.88rem' }}>Verificá el número e intentá de nuevo.</p>
          </div>
        )}

        {order && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* Status card */}
            <div style={{
              backgroundColor: '#111', borderRadius: '20px',
              border: `1px solid ${meta.color}22`, padding: '22px 20px', textAlign: 'center',
            }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: meta.bg, padding: '7px 16px', borderRadius: '100px', marginBottom: '12px' }}>
                {order.status === 'cancelled'
                  ? <XCircle size={14} color={meta.color} />
                  : order.status === 'delivered'
                  ? <CheckCircle size={14} color={meta.color} />
                  : <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: meta.color, animation: 'pulse 1.6s ease-in-out infinite' }} />
                }
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: meta.color }}>{meta.label}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>{meta.msg}</p>
            </div>

            {/* Stepper */}
            {order.status !== 'cancelled' && (
              <div style={{ backgroundColor: '#111', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', padding: '18px 12px 14px' }}>
                <ProgressStepper status={order.status} />
              </div>
            )}

            {/* Order details */}
            <div style={{ backgroundColor: '#111', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem' }}>{order.customerName}</p>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{timeAgo(order.createdAt)}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                {order.deliveryType === 'delivery'
                  ? <><MapPin size={13} color="#4ade80" /><span style={{ fontSize: '0.82rem', color: '#4ade80', fontWeight: 700 }}>Delivery</span><span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)' }}> · {order.address}</span></>
                  : <><Store size={13} color="rgba(255,255,255,0.35)" /><span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)' }}>Retiro en local</span></>
                }
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {order.items?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{item.quantity}× {item.name}</span>
                    <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700 }}>${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                  </div>
                ))}
                {order.notes && (
                  <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>"{order.notes}"</p>
                )}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '6px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>Total</span>
                  <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff', letterSpacing: '-0.3px' }}>${order.total?.toLocaleString('es-AR')}</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
      `}</style>
    </div>
  )
}
