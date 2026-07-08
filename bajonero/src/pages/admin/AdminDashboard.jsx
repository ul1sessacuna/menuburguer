import { useState } from 'react'
import { LogOut, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Loader, ClipboardList, Utensils, Megaphone, Settings } from 'lucide-react'
import { logout } from '../../lib/firebase/auth'
import { useProducts } from '../../hooks/useProducts'
import { usePromos } from '../../hooks/usePromos'
import { useSettings } from '../../hooks/useSettings'
import { useOrders } from '../../hooks/useOrders'
import { deleteProduct, toggleAvailability } from '../../lib/firebase/products'
import { deletePromo, updatePromo } from '../../lib/firebase/promos'
import ProductForm from '../../components/admin/ProductForm.jsx'
import PromoForm from '../../components/admin/PromoForm.jsx'
import SettingsPanel from '../../components/admin/SettingsPanel.jsx'
import OrdersList from '../../components/admin/OrdersList.jsx'

const CATEGORY_LABELS = { burgers: 'Burgers', sides: 'Sides', drinks: 'Bebidas', desserts: 'Postres', combos: 'Combos', extras: 'Extras' }

export default function AdminDashboard() {
  const [tab, setTab] = useState('orders')
  const [productModal, setProductModal] = useState(null)
  const [promoModal, setPromoModal] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const { products, loading: loadingProducts } = useProducts()
  const { promos, loading: loadingPromos } = usePromos()
  const { settings } = useSettings()
  const { orders, loading: loadingOrders } = useOrders()

  const pendingCount = orders.filter((o) => o.status === 'pending').length

  const TABS = [
    { id: 'orders',   label: 'Pedidos',   Icon: ClipboardList, badge: pendingCount },
    { id: 'products', label: 'Productos', Icon: Utensils },
    { id: 'promos',   label: 'Promos',    Icon: Megaphone },
    { id: 'settings', label: 'Config',    Icon: Settings },
  ]

  const handleLogout = async () => { await logout() }

  const handleDeleteProduct = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    setDeleting(id)
    await deleteProduct(id)
    setDeleting(null)
  }

  const handleDeletePromo = async (id) => {
    if (!confirm('¿Eliminar esta promo?')) return
    setDeleting(id)
    await deletePromo(id)
    setDeleting(null)
  }

  const tdStyle = { padding: '12px 14px', fontSize: '0.85rem', color: '#f2ede8', borderBottom: '1px solid #1e1e1e', verticalAlign: 'middle' }
  const thStyle = { padding: '10px 14px', fontSize: '0.72rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #1e1e1e', textAlign: 'left' }

  return (
    <div style={{ backgroundColor: '#0c0c0c', minHeight: '100dvh' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#0c0c0c', borderBottom: '1px solid #1e1e1e', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
            {settings?.businessName ?? 'Mi Burger'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.7rem', color: '#4ade80', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Panel de administración
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#171717', border: '1px solid #2e2e2e', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', color: '#888', fontSize: '0.85rem', fontFamily: 'inherit' }}
        >
          <LogOut size={15} />
          Salir
        </button>
      </header>

      {/* Tabs */}
      <div style={{ backgroundColor: '#0c0c0c', borderBottom: '1px solid #1e1e1e', padding: '0 24px', display: 'flex', gap: '2px', overflowX: 'auto' }}>
        {TABS.map(({ id, label, Icon, badge }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: 600, fontFamily: 'inherit',
              color: tab === id ? '#4ade80' : '#555',
              borderBottom: tab === id ? '2px solid #4ade80' : '2px solid transparent',
              transition: 'all 150ms', marginBottom: '-1px',
              display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0,
            }}
          >
            <Icon size={16} />
            {label}
            {badge > 0 && (
              <span style={{ backgroundColor: '#4ade80', color: '#000', fontWeight: 800, fontSize: '0.65rem', padding: '2px 7px', borderRadius: '100px' }}>
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <main style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>

        {/* ORDERS */}
        {tab === 'orders' && (
          <OrdersList orders={orders} loading={loadingOrders} />
        )}

        {/* PRODUCTS */}
        {tab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Productos ({products.length})</h2>
              <button
                onClick={() => setProductModal('new')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#4ade80', border: 'none', borderRadius: '10px', padding: '10px 18px', cursor: 'pointer', color: '#000', fontWeight: 700, fontSize: '0.88rem', fontFamily: 'inherit' }}
              >
                <Plus size={16} strokeWidth={3} />
                Nuevo producto
              </button>
            </div>

            {loadingProducts ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                <Loader size={24} color="#4ade80" style={{ animation: 'spin 0.6s linear infinite' }} />
              </div>
            ) : (
              <div style={{ backgroundColor: '#111', borderRadius: '16px', overflow: 'hidden', border: '1px solid #1e1e1e' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0c0c0c' }}>
                      <th style={thStyle}>Producto</th>
                      <th style={thStyle}>Categoría</th>
                      <th style={thStyle}>Precio</th>
                      <th style={thStyle}>Estado</th>
                      <th style={thStyle}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: '#555', padding: '40px' }}>
                          No hay productos. ¡Creá el primero!
                        </td>
                      </tr>
                    ) : products.map((p) => (
                      <tr key={p.id}>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {p.image ? (
                              <img src={p.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                            ) : (
                              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#2a2a2a', flexShrink: 0 }} />
                            )}
                            <span style={{ fontWeight: 600 }}>{p.name}</span>
                          </div>
                        </td>
                        <td style={{ ...tdStyle, color: '#888' }}>{CATEGORY_LABELS[p.category] ?? p.category}</td>
                        <td style={{ ...tdStyle, color: '#4ade80', fontWeight: 700 }}>${p.price.toLocaleString('es-AR')}</td>
                        <td style={tdStyle}>
                          <button
                            onClick={() => toggleAvailability(p.id, !p.available)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            {p.available
                              ? <ToggleRight size={24} color="#22c55e" />
                              : <ToggleLeft size={24} color="#555" />
                            }
                            <span style={{ fontSize: '0.8rem', color: p.available ? '#22c55e' : '#555' }}>
                              {p.available ? 'Disponible' : 'Oculto'}
                            </span>
                          </button>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => setProductModal(p)} style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#2a2a2a', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Pencil size={14} color="#f2ede8" />
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id)} disabled={deleting === p.id} style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {deleting === p.id ? <Loader size={14} color="#ef4444" style={{ animation: 'spin 0.6s linear infinite' }} /> : <Trash2 size={14} color="#ef4444" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* PROMOS */}
        {tab === 'promos' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Promos y avisos</h2>
              <button
                onClick={() => setPromoModal('new')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#4ade80', border: 'none', borderRadius: '10px', padding: '10px 18px', cursor: 'pointer', color: '#000', fontWeight: 700, fontSize: '0.88rem', fontFamily: 'inherit' }}
              >
                <Plus size={16} strokeWidth={3} />
                Nueva promo
              </button>
            </div>

            {loadingPromos ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                <Loader size={24} color="#4ade80" style={{ animation: 'spin 0.6s linear infinite' }} />
              </div>
            ) : promos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#555' }}>
                <Megaphone size={36} style={{ marginBottom: '10px', opacity: 0.3 }} />
                <p style={{ margin: 0 }}>No hay promos. ¡Creá la primera!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {promos.map((promo) => (
                  <div key={promo.id} style={{ backgroundColor: '#111', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {promo.image && <img src={promo.image} alt="" style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{promo.title}</p>
                      {promo.description && <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#888' }}>{promo.description}</p>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <button onClick={() => updatePromo(promo.id, { active: !promo.active })} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        {promo.active ? <ToggleRight size={26} color="#22c55e" /> : <ToggleLeft size={26} color="#555" />}
                      </button>
                      <button onClick={() => setPromoModal(promo)} style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#2a2a2a', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Pencil size={14} color="#f2ede8" />
                      </button>
                      <button onClick={() => handleDeletePromo(promo.id)} disabled={deleting === promo.id} style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {deleting === promo.id ? <Loader size={14} color="#ef4444" style={{ animation: 'spin 0.6s linear infinite' }} /> : <Trash2 size={14} color="#ef4444" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <div>
            <h2 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontWeight: 700 }}>Configuración</h2>
            <SettingsPanel settings={settings} />
          </div>
        )}
      </main>

      {productModal && <ProductForm product={productModal === 'new' ? null : productModal} onClose={() => setProductModal(null)} />}
      {promoModal && <PromoForm promo={promoModal === 'new' ? null : promoModal} onClose={() => setPromoModal(null)} />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
