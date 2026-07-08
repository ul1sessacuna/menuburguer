import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, ChevronRight, ClipboardList } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { usePromos } from '../hooks/usePromos'
import { useSettings } from '../hooks/useSettings'
import { useCart } from '../context/CartContext.jsx'
import MenuCard from '../components/menu/MenuCard.jsx'
import CategoryFilter from '../components/menu/CategoryFilter.jsx'
import PromoBanner from '../components/menu/PromoBanner.jsx'
import BusinessHours from '../components/menu/BusinessHours.jsx'
import CartDrawer from '../components/cart/CartDrawer.jsx'
import WelcomeModal from '../components/menu/WelcomeModal.jsx'

function SkeletonGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="skeleton" style={{ borderRadius: '18px', aspectRatio: '3/4' }} />
      ))}
    </div>
  )
}

export default function MenuPage() {
  const { products, loading: loadingProducts } = useProducts()
  const { promos } = usePromos()
  const { settings } = useSettings()
  const { count, setIsOpen } = useCart()
  const [activeCategory, setActiveCategory] = useState('all')
  const [savedOrderId, setSavedOrderId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const id = localStorage.getItem('bajonero_order')
    if (id) setSavedOrderId(id)
  }, [])

  const availableCategories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  )

  const filtered = useMemo(
    () => activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory),
    [products, activeCategory]
  )

  const hasPromos = promos.some((p) => p.active)

  return (
    <div style={{ backgroundColor: '#0c0c0c', minHeight: '100dvh', maxWidth: '480px', margin: '0 auto' }}>

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        backgroundColor: 'rgba(12,12,12,0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Logo placeholder con inicial */}
          <div style={{
            width: '44px', height: '44px', borderRadius: '14px', flexShrink: 0,
            background: 'linear-gradient(135deg, #f0a030, #d4881a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#000', fontWeight: 900, fontSize: '1.3rem', letterSpacing: '-1px', lineHeight: 1 }}>
              {(settings?.businessName ?? 'B').charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-0.4px' }}>
              {settings?.businessName ?? 'Burger'}
            </h1>
            <div style={{ marginTop: '4px' }}>
              <BusinessHours settings={settings} />
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'relative', flexShrink: 0,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px', cursor: 'pointer', padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}
        >
          <ShoppingCart size={20} color="#fff" strokeWidth={2} />
          {count > 0 && (
            <span style={{ backgroundColor: '#4ade80', color: '#000', fontWeight: 800, fontSize: '0.75rem', borderRadius: '100px', padding: '2px 8px' }}>
              {count}
            </span>
          )}
        </button>
      </header>

      {/* Main */}
      <main style={{ padding: `20px 16px ${savedOrderId ? '132px' : '32px'}` }}>

        {/* Promos */}
        {hasPromos && (
          <div style={{ marginBottom: '20px' }}>
            <PromoBanner promos={promos} />
          </div>
        )}

        {/* Announcement */}
        {settings?.announcement?.trim() && (
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px', padding: '12px 16px', marginBottom: '20px',
            fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.55,
          }}>
            {settings.announcement}
          </div>
        )}

        {/* Categories */}
        <div style={{ marginBottom: '18px' }}>
          <CategoryFilter
            active={activeCategory}
            onChange={setActiveCategory}
            availableCategories={availableCategories}
          />
        </div>

        {/* Products grid */}
        {loadingProducts ? (
          <SkeletonGrid />
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🍔</div>
            <p style={{ margin: 0, fontWeight: 700, color: 'rgba(255,255,255,0.35)', fontSize: '0.95rem' }}>
              Sin productos disponibles
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {filtered.map((product) => (
              <MenuCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {/* Active order recovery banner */}
      {savedOrderId && (
        <div style={{ position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', maxWidth: '448px', zIndex: 25 }}>
          <button
            onClick={() => navigate(`/seguimiento/${savedOrderId}`)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              backgroundColor: '#4ade80', borderRadius: '18px', border: 'none',
              padding: '14px 18px', cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 8px 32px rgba(74,222,128,0.3)',
            }}
          >
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ClipboardList size={18} color="#000" />
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 900, fontSize: '0.88rem', color: '#000', lineHeight: 1.1 }}>Tenés un pedido activo</p>
              <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'rgba(0,0,0,0.5)', lineHeight: 1 }}>Tocá para ver el estado</p>
            </div>
            <ChevronRight size={18} color="rgba(0,0,0,0.45)" />
          </button>
        </div>
      )}

      <CartDrawer
        whatsappNumber={settings?.whatsappNumber ?? ''}
        businessName={settings?.businessName ?? 'Mi Burger'}
      />

      <WelcomeModal businessName={settings?.businessName} />
    </div>
  )
}
