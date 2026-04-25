'use client'
import { useState } from 'react'

export default function AdminLogin() {
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit() {
    if (pwd === 'islaibiza26') {
      document.cookie = 'admin_auth=islaibiza26; path=/; max-age=86400'
      window.location.href = '/admin'
    } else {
      setError(true)
      setPwd('')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 4, padding: '40px', width: 320, textAlign: 'center' }}>
        <div style={{ color: '#c9a96e', letterSpacing: '0.2em', fontSize: 14, marginBottom: 8 }}>ISLA</div>
        <div style={{ color: '#888', fontSize: 12, marginBottom: 24 }}>Admin access</div>
        <input
          type="password"
          value={pwd}
          onChange={e => { setPwd(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Password"
          autoFocus
          style={{ width: '100%', padding: '10px 12px', background: '#111', border: '1px solid #333', borderRadius: 2, color: '#f5f0e8', fontSize: 13, marginBottom: 12, boxSizing: 'border-box' }}
        />
        {error && <div style={{ color: '#e05555', fontSize: 12, marginBottom: 12 }}>Incorrect password</div>}
        <button
          onClick={handleSubmit}
          style={{ width: '100%', background: '#c9a96e', color: '#000', border: 'none', padding: '12px', fontSize: 11, letterSpacing: '0.2em', cursor: 'pointer', borderRadius: 1 }}
        >
          ENTER
        </button>
      </div>
    </div>
  )
}
