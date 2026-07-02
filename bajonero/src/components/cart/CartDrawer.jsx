import { useState, useEffect } from 'react'
import { X, MessageCircle, ChevronRight } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import { openWhatsApp } from '../../lib/utils/whatsapp.js'
import CartItem from './CartItem.jsx'
import OrderForm from './OrderForm.jsx'

export default function CartDrawer({ whatsappNumber, businessName }) {
  const { items, isOpen, setIsOpen, notes, setNotes, total, count, clearCart } = useCart()
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [showNotes, setShowNotes] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false)
    setShowOrderForm(false)
  }

  const handleWhatsApp = () => {
    openWhatsApp(whatsappNumber, items, notes, businessName)
    clearCart()
    setIsOpen(false)
  }

  return (
    <>
      {isOpen && (
        <div
          onClick={handleClose}
          className="animate-fade-in"
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 40, backdropFilter: 'blur(4px)' }}
        />
      )}

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: '#111', borderRadius: '24px 24px 0 0',
        maxHeight: '92dvh', display: 'flex', flexDirection: 'column',
        transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 320ms cubic-bezier(0.32, 0.72, 0, 1)',
        boxShadow: '0 -16px 60px rgba(0,0,0,0.6)',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '14px', paddingBottom: '4px' }}>
          <div style={{ width: '40px', height: '4px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '2px' }} />
        </div>

        {showOrderForm ? (
          <OrderForm onBack={() => setShowOrderForm(false)} onClose={handleClose} businessName={businessName} />
        ) : (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>Tu pedido</h2>
                {count > 0 && (
                  <span style={{ backgroundColor: '#4ade80', color: '#000', fontWeight: 800, fontSize: '0.72rem', borderRadius: '100px', padding: '3px 9px' }}>
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={handleClose}
                style={{ background: 'rgba(255,255,255,0.07)', border: 'none', cursor: 'pointer', width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} color="rgba(255,255,255,0.65)" />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '52px 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛒</div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'rgba(255,255,255,0.35)' }}>Tu carrito está vacío</p>
                  <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: 'rgba(255,255,255,0.2)' }}>Explorá el menú y agregá algo</p>
                </div>
              ) : (
                items.map((item) => <CartItem key={item.id} item={item} />)
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ padding: '16px 20px 36px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Notes toggle */}
                <button
                  onClick={() => setShowNotes((v) => !v)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', fontFamily: 'inherit',
                    fontWeight: 600, marginBottom: showNotes ? '10px' : '16px',
                    display: 'block',
                  }}
                >
                  {showNotes ? '− Ocultar aclaraciones' : '+ Agregar aclaraciones'}
                </button>

                {showNotes && (
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Sin cebolla, punto de cocción, alergia a..."
                    rows={2}
                    style={{
                      width: '100%', backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px',
                      padding: '12px 14px', color: '#fff', fontSize: '0.85rem',
                      resize: 'none', outline: 'none', marginBottom: '16px',
                      lineHeight: 1.5, fontFamily: 'inherit',
                    }}
                  />
                )}

                {/* Total */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', fontWeight: 600 }}>Total</span>
                  <span style={{ color: '#fff', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
                    ${total.toLocaleString('es-AR')}
                  </span>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => setShowOrderForm(true)}
                    style={{
                      width: '100%', padding: '15px 20px', borderRadius: '16px',
                      backgroundColor: '#4ade80', border: 'none', cursor: 'pointer',
                      color: '#000', fontWeight: 900, fontSize: '1rem', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      letterSpacing: '-0.2px',
                    }}
                  >
                    Confirmar pedido
                    <ChevronRight size={18} strokeWidth={3} />
                  </button>

                  <button
                    onClick={handleWhatsApp}
                    style={{
                      width: '100%', padding: '14px', borderRadius: '16px',
                      backgroundColor: 'rgba(37,211,102,0.08)',
                      border: '1px solid rgba(37,211,102,0.18)', cursor: 'pointer',
                      color: '#25D366', fontWeight: 700, fontSize: '0.95rem', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}
                  >
                    <MessageCircle size={18} strokeWidth={2} />
                    Pedir por WhatsApp
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
