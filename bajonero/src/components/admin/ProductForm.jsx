import { useState } from 'react'
import { X, Loader } from 'lucide-react'
import { addProduct, updateProduct } from '../../lib/firebase/products'
import ImageUploader from './ImageUploader'

const CATEGORIES = [
  { id: 'burgers', name: '🍔 Burgers' },
  { id: 'combos', name: '🎁 Combos' },
  { id: 'sides', name: '🍟 Sides' },
  { id: 'drinks', name: '🥤 Bebidas' },
  { id: 'desserts', name: '🍰 Postres' },
  { id: 'extras', name: '✨ Extras' },
]

const EMPTY = { name: '', description: '', price: '', category: 'burgers', image: '' }

export default function ProductForm({ product, onClose }) {
  const isEdit = Boolean(product)
  const [form, setForm] = useState(product ? {
    name: product.name,
    description: product.description ?? '',
    price: String(product.price),
    category: product.category,
    image: product.image ?? '',
  } : EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price) return setError('Nombre y precio son obligatorios')
    setSaving(true)
    setError('')
    try {
      const data = { ...form, price: Number(form.price) }
      if (isEdit) await updateProduct(product.id, data)
      else await addProduct(data)
      onClose()
    } catch {
      setError('Ocurrió un error. Intentá de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', backgroundColor: '#0c0c0c', border: '1px solid #2e2e2e',
    borderRadius: '10px', padding: '10px 14px', color: '#f2ede8',
    fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
  }
  const labelStyle = {
    display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#888',
    marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#171717', borderRadius: '20px', width: '100%', maxWidth: '480px', maxHeight: '90dvh', overflowY: 'auto', border: '1px solid #2e2e2e' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 20px 0' }}>
          <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>{isEdit ? 'Editar producto' : 'Nuevo producto'}</h3>
          <button onClick={onClose} style={{ background: '#2a2a2a', border: 'none', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} color="#f2ede8" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Image upload */}
          <div>
            <label style={labelStyle}>Imagen (opcional)</label>
            <ImageUploader
              value={form.image}
              onChange={(url) => setForm((f) => ({ ...f, image: url }))}
            />
          </div>

          <div>
            <label style={labelStyle}>Nombre *</label>
            <input style={inputStyle} value={form.name} onChange={set('name')} placeholder="Classic Burger" required />
          </div>

          <div>
            <label style={labelStyle}>Descripción</label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: '72px' }}
              value={form.description}
              onChange={set('description')}
              placeholder="Doble medallón, lechuga, tomate..."
              rows={3}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Precio *</label>
              <input style={inputStyle} type="number" value={form.price} onChange={set('price')} placeholder="1200" min="0" required />
            </div>
            <div>
              <label style={labelStyle}>Categoría</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {error && <p style={{ margin: 0, color: '#ef4444', fontSize: '0.82rem' }}>{error}</p>}

          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '13px', borderRadius: '12px', backgroundColor: saving ? '#555' : '#4ade80',
              border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
              color: '#000', fontWeight: 800, fontSize: '0.95rem', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            {saving && <Loader size={16} style={{ animation: 'spin 0.6s linear infinite' }} />}
            {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
