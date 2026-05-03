'use client'
import { useState } from 'react'

export default function InviteModal({ role, inviterName, inviterEmail, onClose }: {
  role: 'concierge' | 'venue'
  inviterName: string
  inviterEmail: string
  onClose: () => void
}) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!email) return
    setLoading(true)
    await fetch('/api/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviterName, inviterEmail, inviteeEmail: email, role })
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 24 }}>
      <div style={{ background: '#161410', border: '1px solid #2a2620', borderRadius: 8, padding: 32, maxWidth: 440, width: '100%' }}>
        <div style={{ fontSize: 9, letterSpacing: '0.3em', color: '#5a5048', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 16 }}>Invite to ISLA</div>
        {sent ? (
          <>
            <p style={{ fontSize: 15, color: '#6abb7a', marginBottom: 8 }}>Invitation sent ✓</p>
            <p style={{ fontSize: 12, color: '#8a8070', lineHeight: 1.6, marginBottom: 24 }}>
              {role === 'concierge' ? 'They'll receive a free access link to join the network.' : 'They'll receive an invite to list their venue on ISLA.'}
            </p>
            <button onClick={onClose} style={{ padding: '8px 20px', border: '1px solid #2a2620', borderRadius: 4, background: 'transparent', color: '#8a8070', fontSize: 11, fontFamily: 'monospace', cursor: 'pointer' }}>Close</button>
          </>
        ) : (
          <>
            <h3 style={{ fontSize: 18, fontWeight: 400, color: '#f2ede4', marginBottom: 8 }}>
              {role === 'concierge' ? 'Invite a concierge or GRM' : 'Invite another venue'}
            </h3>
            <p style={{ fontSize: 12, color: '#8a8070', lineHeight: 1.6, marginBottom: 20 }}>
              {role === 'concierge'
                ? 'Your network is your earnings. Every concierge you invite expands what you can track and earn.'
                : 'Invite another venue to join ISLA. The more venues on the network, the more concierges refer to everyone.'}
            </p>
            <input
              type="email"
              placeholder="Their email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', background: '#0a0908', border: '1px solid #2a2620', borderRadius: 4, color: '#d0c8b8', fontSize: 13, marginBottom: 12, boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={send} disabled={loading || !email} style={{ flex: 1, padding: '10px', background: '#c9a96e', border: 'none', borderRadius: 4, color: '#0a0908', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 600 }}>
                {loading ? 'Sending...' : 'Send Invite →'}
              </button>
              <button onClick={onClose} style={{ padding: '10px 16px', border: '1px solid #2a2620', borderRadius: 4, background: 'transparent', color: '#8a8070', fontSize: 11, fontFamily: 'monospace', cursor: 'pointer' }}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
