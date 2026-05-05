'use client'
import { useState } from 'react'

export default function WaitlistForm({ location }: { location: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, location })
      })
      if (res.ok) {
        setStatus('done')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div style={{ color: '#6abb7a', fontSize: 12, fontFamily: "'DM Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.15em' }}>
        ✓ You are on the list
      </div>
    )
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 6, marginTop: 4 }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={status === 'loading'}
        style={{
          flex: 1,
          background: '#0a0a0a',
          border: '1px solid #2a2620',
          borderRadius: 4,
          padding: '8px 10px',
          color: '#f2ede4',
          fontSize: 12,
          fontFamily: 'inherit',
          outline: 'none',
        }}
      />
      <button
        type="submit"
        disabled={status === 'loading' || !email}
        style={{
          background: '#c9a96e',
          color: '#0a0a0a',
          border: 'none',
          borderRadius: 4,
          padding: '8px 14px',
          fontSize: 11,
          fontFamily: "'DM Mono', monospace",
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 700,
          cursor: status === 'loading' ? 'default' : 'pointer',
          opacity: status === 'loading' || !email ? 0.5 : 1,
        }}
      >
        {status === 'loading' ? '...' : 'Notify'}
      </button>
    </form>
  )
}
