import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader, Lock } from 'lucide-react'
import { login } from '../../lib/firebase/auth'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminLogin() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) navigate('/admin/dashboard', { replace: true })
  }, [user, loading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      const codes = {
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/invalid-credential': 'Credenciales inválidas',
        'auth/too-many-requests': 'Demasiados intentos. Intentá más tarde',
      }
      setError(codes[err.code] ?? 'Error al iniciar sesión')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0c0c0c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #4ade80', borderTopColor: 'transparent', animation: 'spin 0.6s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const inputStyle = {
    width: '100%', backgroundColor: '#171717', border: '1.5px solid #2e2e2e',
    borderRadius: '12px', padding: '13px 16px', color: '#f2ede8',
    fontSize: '1rem', outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 150ms',
  }

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0c0c0c', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '20px', backgroundColor: '#171717', border: '1.5px solid #2e2e2e', marginBottom: '16px' }}>
            <Lock size={28} color="#4ade80" />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>Panel Admin</h1>
          <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: '#666' }}>Ingresá con tu cuenta de administrador</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              autoComplete="email"
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#4ade80'}
              onBlur={(e) => e.target.style.borderColor = '#2e2e2e'}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              autoComplete="current-password"
              style={{ ...inputStyle, paddingRight: '48px' }}
              onFocus={(e) => e.target.style.borderColor = '#4ade80'}
              onBlur={(e) => e.target.style.borderColor = '#2e2e2e'}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              {showPass ? <EyeOff size={18} color="#555" /> : <Eye size={18} color="#555" />}
            </button>
          </div>

          {error && (
            <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '10px 14px' }}>
              <p style={{ margin: 0, color: '#ef4444', fontSize: '0.85rem' }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '14px', borderRadius: '12px',
              backgroundColor: submitting ? '#555' : '#4ade80',
              border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
              color: '#000', fontWeight: 800, fontSize: '1rem', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              marginTop: '4px',
            }}
          >
            {submitting && <Loader size={18} style={{ animation: 'spin 0.6s linear infinite' }} />}
            {submitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.75rem', color: '#333' }}>
          Este acceso es exclusivo para administradores
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
