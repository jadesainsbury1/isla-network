'use client'
import { useState } from 'react'

export default function ReferForm({ referrerName }: { referrerName: string }) {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [type, setType] = useState<'concierge' | 'venue' | 'grm'>('concierge')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    if (!name.trim() || !contact.trim()) {
      setError('Name and contact are required')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, type, note })
      })
      const data = await res.json()
      if (data.ok) setDone(true)
      else setError(data.error || 'Something went wrong')
    } catch (e: any) {
      setError(e.message || 'Network error')
    }
    setLoading(false)
  }

  if (done) {
    return (
      <div style={{ background: '#1a1410', border: '1px solid #2a4a2a', borderRadius: 8, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 28, color: '#4ade80', marginBottom: 8 }}>✓</div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#f2ede4', marginBottom: 8 }}>Referral received.</div>
        <p style={{ fontSize: 13, color: '#8a8070', lineHeight: 1.7, margin: 0 }}>
          Thank you{referrerName ? `, ${referrerName.split(' ')[0]}` : ''}. We will reach out to <strong style={{ color: '#c9a96e' }}>{name}</strong> within 24 hours.
        </p>
        <button onClick={() => { setName(''); setContact(''); setNote(''); setDone(false) }} style={{ marginTop: 20, padding: '10px 20px', background: 'transparent', border: '1px solid #c9a96e', color: '#c9a96e', borderRadius: 4, fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>Refer another</button>
      </div>
    )
  }

  const inputStyle = { width: '100%', padding: '12px 14px', background: '#1a1410', border: '1px solid #2a2620', borderRadius: 6, color: '#f2ede4', fontSize: 14, boxSizing: 'border-box' as const, fontFamily: 'inherit' }
  const labelStyle = { display: 'block', fontSize: 10, color: '#8a8070', textTransform: 'uppercase' as const, letterSpacing: '0.15em', marginBottom: 6, fontFamily: 'monospace' }

  return (
    <div style={{ background: '#1a1410', border: '1px solid #2a2620', borderRadius: 8, padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>They are a</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['concierge', 'grm', 'venue'] as const).map(t => (
            <button key={t} type="button" onClick={() => setType(t)} style={{ flex: 1, padding: '10px 12px', background: type === t ? '#c9a96e' : 'transparent', color: type === t ? '#0a0a0a' : '#c5bfb5', border: '1px solid ' + (type === t ? '#c9a96e' : '#2a2620'), borderRadius: 4, fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>{t === 'grm' ? 'GRM' : t}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Their name</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Maria Lopez" style={inputStyle} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>WhatsApp, email, or Instagram</label>
        <input value={contact} onChange={e => setContact(e.target.value)} placeholder="e.g. +34 600 123 456 or @handle" style={inputStyle} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Why them? (optional)</label>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Where they work, who they look after..." rows={3} style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }} />
      </div>

      {error && <div style={{ padding: '10px 14px', background: '#2a1410', border: '1px solid #4a2620', borderRadius: 4, color: '#f87171', fontSize: 12, marginBottom: 16 }}>{error}</div>}

      <button onClick={submit} disabled={loading || !name.trim() || !contact.trim()} style={{ width: '100%', padding: '14px', background: '#c9a96e', color: '#0a0a0a', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: loading ? 'wait' : 'pointer', opacity: loading || !name.trim() || !contact.trim() ? 0.5 : 1 }}>
        {loading ? 'Sending...' : 'Send referral'}
      </button>
    </div>
  )
}
