import { useState, useEffect } from 'react'
import { Save, Loader } from 'lucide-react'
import { updateSettings } from '../../lib/firebase/settings'

const DAYS = [
  { key: 'lunes', label: 'Lunes' },
  { key: 'martes', label: 'Martes' },
  { key: 'miercoles', label: 'Miércoles' },
  { key: 'jueves', label: 'Jueves' },
  { key: 'viernes', label: 'Viernes' },
  { key: 'sabado', label: 'Sábado' },
  { key: 'domingo', label: 'Domingo' },
]

export default function SettingsPanel({ settings }) {
  const [form, setForm] = useState(settings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { setForm(settings) }, [settings])

  const setField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const setHour = (day, field) => (e) => {
    setForm((f) => ({
      ...f,
      businessHours: {
        ...f.businessHours,
        [day]: { ...f.businessHours[day], [field]: e.target.value },
      },
    }))
  }

  const toggleClosed = (day) => {
    setForm((f) => ({
      ...f,
      businessHours: {
        ...f.businessHours,
        [day]: { ...f.businessHours[day], closed: !f.businessHours[day]?.closed },
      },
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateSettings(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    backgroundColor: '#0c0c0c', border: '1px solid #2e2e2e', borderRadius: '10px',
    padding: '10px 14px', color: '#f2ede8', fontSize: '0.88rem', outline: 'none',
    fontFamily: 'inherit', width: '100%',
  }
  const labelStyle = { fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '640px' }}>
      {/* Business info */}
      <div style={{ backgroundColor: '#171717', borderRadius: '16px', padding: '20px', border: '1px solid #2e2e2e' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>Información del local</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Nombre del local</label>
            <input style={inputStyle} value={form.businessName ?? ''} onChange={setField('businessName')} placeholder="Mi Burger" />
          </div>
          <div>
            <label style={labelStyle}>Número de WhatsApp (con código de país)</label>
            <input style={inputStyle} value={form.whatsappNumber ?? ''} onChange={setField('whatsappNumber')} placeholder="5491100000000" />
            <p style={{ margin: '5px 0 0', fontSize: '0.75rem', color: '#555' }}>Ejemplo: 5491134567890 (sin + ni espacios)</p>
          </div>
          <div>
            <label style={labelStyle}>Aviso / Anuncio</label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: '64px' }}
              value={form.announcement ?? ''}
              onChange={setField('announcement')}
              placeholder="🔥 Ahora hacemos delivery a domicilio!"
              rows={2}
            />
            <p style={{ margin: '5px 0 0', fontSize: '0.75rem', color: '#555' }}>Se muestra en la parte superior del menú (dejalo vacío para ocultarlo)</p>
          </div>
        </div>
      </div>

      {/* Business hours */}
      <div style={{ backgroundColor: '#171717', borderRadius: '16px', padding: '20px', border: '1px solid #2e2e2e' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>Horarios de atención</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {DAYS.map(({ key, label }) => {
            const day = form.businessHours?.[key] ?? { open: '18:00', close: '23:00', closed: false }
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid #1a1a1a' }}>
                <span style={{ width: '90px', fontSize: '0.85rem', color: '#f2ede8', flexShrink: 0 }}>{label}</span>
                <input
                  type="time"
                  value={day.open}
                  onChange={setHour(key, 'open')}
                  disabled={day.closed}
                  style={{ ...inputStyle, width: '110px', padding: '8px 10px', opacity: day.closed ? 0.3 : 1 }}
                />
                <span style={{ color: '#555', fontSize: '0.8rem' }}>–</span>
                <input
                  type="time"
                  value={day.close}
                  onChange={setHour(key, 'close')}
                  disabled={day.closed}
                  style={{ ...inputStyle, width: '110px', padding: '8px 10px', opacity: day.closed ? 0.3 : 1 }}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', flexShrink: 0 }}>
                  <input
                    type="checkbox"
                    checked={!!day.closed}
                    onChange={() => toggleClosed(key)}
                    style={{ accentColor: '#4ade80' }}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#666' }}>Cerrado</span>
                </label>
              </div>
            )
          })}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          padding: '14px', borderRadius: '12px',
          backgroundColor: saved ? '#22c55e' : saving ? '#555' : '#4ade80',
          border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
          color: '#000', fontWeight: 800, fontSize: '0.95rem', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          transition: 'background 300ms',
        }}
      >
        {saving ? <Loader size={18} style={{ animation: 'spin 0.6s linear infinite' }} /> : <Save size={18} />}
        {saved ? '¡Guardado!' : saving ? 'Guardando...' : 'Guardar configuración'}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
