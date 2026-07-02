import { useState } from 'react'
import { Clock, Phone, MapPin, Store, ChevronDown, Loader } from 'lucide-react'
import { updateOrderStatus } from '../../lib/firebase/orders'

const STATUS = {
  pending:   { label: 'Pendiente',      color: '#f0a030', bg: 'rgba(240,160,48,0.12)',  next: 'confirmed' },
  confirmed: { label: 'Confirmado',     color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  next: 'preparing' },
  preparing: { label: 'Preparando',     color: '#f97316', bg: 'rgba(249,115,22,0.12)',  next: 'ready' },
  ready:     { label: 'Listo',          color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   next: 'delivered' },
  delivered: { label: 'Entregado',      color: '#888',    bg: 'rgba(136,136,136,0.1)',  next: null },
  cancelled: { label: 'Cancelado',      color: '#ef4444', bg: 'rgba(239,68,68,0.1)',    next: null },
}

const NEXT_LABEL = {
  pending:   'Confirmar',
  confirmed: 'Iniciar preparación',
  preparing: 'Marcar como listo',
  ready:     'Marcar entregado',
}

const FILTERS = [
  { id: 'active',    label: 'Activos' },
  { id: 'all',       label: 'Todos' },
  { id: 'delivered', label: 'Entregados' },
]

function timeAgo(ts) {
  if (!ts) return ''
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60) return 'hace un momento'
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`
  return date.toLocaleDateString('es-AR')
}

function OrderCard({ order }) {
  const [updating, setUpdating] = useState(false)
  const [showItems, setShowItems] = useState(false)
  const s = STATUS[order.status] ?? STATUS.pending

  const handleNext = async () => {
    if (!s.next) return
    setUpdating(true)
    await updateOrderStatus(order.id, s.next)
    setUpdating(false)
  }

  const handleCancel = async () => {
    if (!confirm('¿Cancelar este pedido?')) return
    setUpdating(true)
    await updateOrderStatus(order.id, 'cancelled')
    setUpdating(false)
  }

  return (
    <div style={{
      backgroundColor: '#111', border: `1px solid ${order.status === 'pending' ? '#1a3d27' : '#1e1e1e'}`,
      borderRadius: '16px', overflow: 'hidden',
      boxShadow: order.status === 'pending' ? '0 0 0 1px rgba(74,222,128,0.15)' : 'none',
    }}>
      {/* Top bar */}
      {order.status === 'pending' && (
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #4ade80, #22c55e)' }} />
      )}

      <div style={{ padding: '16px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: '#f2ede8' }}>
              {order.customerName}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
              <Phone size={12} color="#888" />
              <a href={`tel:${order.customerPhone}`} style={{ color: '#888', fontSize: '0.8rem', textDecoration: 'none' }}>
                {order.customerPhone}
              </a>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <span style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '100px', fontWeight: 700, backgroundColor: s.bg, color: s.color }}>
              {s.label}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={11} color="#555" />
              <span style={{ fontSize: '0.72rem', color: '#555' }}>{timeAgo(order.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Delivery type */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          {order.deliveryType === 'delivery'
            ? <><MapPin size={14} color="#4ade80" /><span style={{ fontSize: '0.82rem', color: '#4ade80', fontWeight: 600 }}>Delivery</span><span style={{ fontSize: '0.82rem', color: '#888' }}>— {order.address}</span></>
            : <><Store size={14} color="#888" /><span style={{ fontSize: '0.82rem', color: '#888' }}>Retiro en local</span></>
          }
        </div>

        {/* Items toggle */}
        <button
          onClick={() => setShowItems((v) => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', width: '100%', fontFamily: 'inherit', marginBottom: '10px' }}
        >
          <span style={{ flex: 1, textAlign: 'left', fontSize: '0.82rem', color: '#f2ede8', fontWeight: 600 }}>
            {order.items?.length ?? 0} producto{order.items?.length !== 1 ? 's' : ''} · ${order.total?.toLocaleString('es-AR')}
          </span>
          <ChevronDown size={15} color="#888" style={{ transition: 'transform 200ms', transform: showItems ? 'rotate(180deg)' : 'none' }} />
        </button>

        {showItems && (
          <div style={{ backgroundColor: '#0c0c0c', borderRadius: '10px', padding: '10px 12px', marginBottom: '10px' }}>
            {order.items?.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: i < order.items.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                <span style={{ fontSize: '0.82rem', color: '#f2ede8' }}>{item.quantity}x {item.name}</span>
                <span style={{ fontSize: '0.82rem', color: '#4ade80', fontWeight: 600 }}>${(item.price * item.quantity).toLocaleString('es-AR')}</span>
              </div>
            ))}
            {order.notes && (
              <p style={{ margin: '8px 0 0', fontSize: '0.78rem', color: '#888', fontStyle: 'italic' }}>
                Nota: {order.notes}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {s.next && (
              <button
                onClick={handleNext}
                disabled={updating}
                style={{
                  flex: 1, padding: '10px', borderRadius: '10px',
                  backgroundColor: updating ? '#555' : '#4ade80', border: 'none', cursor: updating ? 'not-allowed' : 'pointer',
                  color: '#000',
                  fontWeight: 700, fontSize: '0.85rem', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
              >
                {updating ? <Loader size={14} style={{ animation: 'spin 0.6s linear infinite' }} /> : null}
                {NEXT_LABEL[order.status]}
              </button>
            )}
            <button
              onClick={handleCancel}
              disabled={updating}
              style={{
                padding: '10px 14px', borderRadius: '10px',
                backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                cursor: 'pointer', color: '#ef4444', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'inherit',
              }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function OrdersList({ orders, loading }) {
  const [filter, setFilter] = useState('active')

  const filtered = orders.filter((o) => {
    if (filter === 'active') return o.status !== 'delivered' && o.status !== 'cancelled'
    if (filter === 'delivered') return o.status === 'delivered' || o.status === 'cancelled'
    return true
  })

  const pendingCount = orders.filter((o) => o.status === 'pending').length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Pedidos</h2>
          {pendingCount > 0 && (
            <span style={{ backgroundColor: '#4ade80', color: '#000', fontWeight: 800, fontSize: '0.75rem', padding: '3px 10px', borderRadius: '100px' }}>
              {pendingCount} nuevo{pendingCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', backgroundColor: '#111', borderRadius: '10px', padding: '3px', border: '1px solid #1e1e1e' }}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 600,
                backgroundColor: filter === f.id ? '#4ade80' : 'transparent',
                color: filter === f.id ? '#000' : '#666',
                transition: 'all 150ms',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <Loader size={24} color="#4ade80" style={{ animation: 'spin 0.6s linear infinite' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#555' }}>
          <Clock size={36} style={{ marginBottom: '12px', opacity: 0.4 }} />
          <p style={{ margin: 0, fontWeight: 600, color: '#888' }}>
            {filter === 'active' ? 'No hay pedidos activos' : 'No hay pedidos'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
