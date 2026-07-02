import { useState, useRef } from 'react'
import { Upload, X, Loader, RefreshCw } from 'lucide-react'
import { uploadToCloudinary } from '../../lib/utils/cloudinary'

export default function ImageUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef()

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return setError('Solo se permiten imágenes')
    if (file.size > 8 * 1024 * 1024) return setError('El archivo no puede superar 8MB')

    setUploading(true)
    setError('')
    try {
      const url = await uploadToCloudinary(file)
      onChange(url)
    } catch {
      setError('Error al subir. Verificá tu configuración de Cloudinary.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  if (value) {
    return (
      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '140px', backgroundColor: '#0c0c0c' }}>
        <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            title="Cambiar imagen"
            style={{ background: 'rgba(0,0,0,0.65)', border: 'none', cursor: 'pointer', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
          >
            <RefreshCw size={13} color="#fff" />
          </button>
          <button
            type="button"
            onClick={() => onChange('')}
            title="Quitar imagen"
            style={{ background: 'rgba(0,0,0,0.65)', border: 'none', cursor: 'pointer', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
          >
            <X size={13} color="#fff" />
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>
    )
  }

  return (
    <div>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => { e.currentTarget.style.borderColor = '#4ade80'; e.currentTarget.style.backgroundColor = 'rgba(74,222,128,0.04)' }}
        onDragLeave={(e) => { e.currentTarget.style.borderColor = '#2e2e2e'; e.currentTarget.style.backgroundColor = '#0c0c0c' }}
        style={{
          border: '2px dashed #2e2e2e',
          borderRadius: '12px',
          height: '110px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: uploading ? 'default' : 'pointer',
          backgroundColor: '#0c0c0c',
          transition: 'border-color 150ms, background-color 150ms',
        }}
        onMouseEnter={(e) => { if (!uploading) e.currentTarget.style.borderColor = '#4ade80' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2e2e2e' }}
      >
        {uploading ? (
          <>
            <Loader size={22} color="#4ade80" style={{ animation: 'spin 0.6s linear infinite' }} />
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#555' }}>Subiendo...</p>
          </>
        ) : (
          <>
            <Upload size={22} color="#555" />
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#777', fontWeight: 600 }}>Tocá o arrastrá una imagen</p>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#444' }}>JPG, PNG, WebP · máx 8MB</p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
      {error && (
        <p style={{ margin: '6px 0 0', color: '#ef4444', fontSize: '0.78rem' }}>{error}</p>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
