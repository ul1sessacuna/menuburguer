import { useState } from 'react'
import { X, Loader } from 'lucide-react'
import { addPromo, updatePromo } from '../../lib/firebase/promos'
import ImageUploader from './ImageUploader'

const EMPTY = { title: '', description: '', image: '', active: true }

export default function PromoForm({ promo, onClose }) {
  const isEdit = Boolean(promo)
  const [form, setForm] = useState(promo ? {
    title: promo.title,
    description: promo.description ?? '',
    image: promo.image ?? '',
    active: promo.active,
  } : EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return setError('El título es obligatorio')
    setSaving(true)
    setError('')
    try {
      if (isEdit) await updatePromo(promo.id, form)
      else await addPromo(form)
      onClose()
    } catch {
      setError('Error al guardar')
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
      <div style={{ backgroundColor: '#171717', borderRadius: '20px', width: '100%', maxWidth: '440px', maxHeight: '90dvh', overflowY: 'auto', border: '1px solid #2e2e2e' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 20px 0' }}>
          <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem' }}>{isEdit ? 'Editar promo' : 'Nueva promo'}</h3>
          <button onClick={onClose} style={{ background: '#2a2a2a', border: 'none', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} color="#f2ede8" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Título *</label>
            <input style={inputStyle} value={form.title} onChange={set('title')} placeholder="2x1 los Martes" required />
          </div>

          <div>
            <label style={labelStyle}>Descripción</label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: '64px' }}
              value={form.description}
              onChange={set('description')}
              placeholder="Detalle de la promo..."
              rows={2}
            />
          </div>

          <div>
            <label style={labelStyle}>Imagen (opcional)</label>
            <ImageUploader
              value={form.image}
              onChange={(url) => setForm((f) => ({ ...f, image: url }))}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              style={{ width: '18px', height: '18px', accentColor: '#4ade80' }}
            />
            <span style={{ fontSize: '0.88rem', color: '#f2ede8' }}>Promo activa (visible en el menú)</span>
          </label>

          {error && <p style={{ margin: 0, color: '#ef4444', fontSize: '0.82rem' }}>{error}</p>}

          <button
            type="submit"
            disabled={saving}
            style={{ padding: '12px', borderRadius: '12px', backgroundColor: saving ? '#555' : '#4ade80', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', color: '#000', fontWeight: 800, fontSize: '0.9rem', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {saving && <Loader size={16} style={{ animation: 'spin 0.6s linear infinite' }} />}
            {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear promo'}
          </button>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
