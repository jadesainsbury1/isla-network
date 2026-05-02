'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function PreviewPage() {
  const [view, setView] = useState<'concierge' | 'venue'>('concierge')

  return (
    <div style={{ background: '#0a0908', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ background: '#111009', borderBottom: '1px solid #2a2620', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <Link href="/" style={{ fontSize: 10, letterSpacing: '0.3em', color: '#c9a96e', textTransform: 'uppercase', fontFamily: 'monospace', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          ← ISLA
        </Link>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['concierge', 'venue'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '6px 16px', borderRadius: 4, border: '1px solid', cursor: 'pointer',
              fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.15em', textTransform: 'uppercase',
              background: view === v ? '#c9a96e' : 'transparent',
              color: view === v ? '#0a0908' : '#8a8070',
              borderColor: view === v ? '#c9a96e' : '#2a2620'
            }}>
              {v === 'concierge' ? 'Concierge View' : 'Venue View'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/auth/signup?role=concierge" style={{ padding: '6px 14px', border: '1px solid #2a2620', borderRadius: 4, color: '#d0c8b8', fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.1em', textDecoration: 'none', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Join Free
          </Link>
          <Link href="/auth/signup?role=venue" style={{ padding: '6px 14px', background: '#c9a96e', borderRadius: 4, color: '#0a0908', fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.1em', textDecoration: 'none', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>
            List Venue
          </Link>
        </div>
      </div>
      <div style={{ background: '#0f0e0c', borderBottom: '1px solid #1a1810', padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 10, letterSpacing: '0.2em', color: '#5a5048', fontFamily: 'monospace', textTransform: 'uppercase' }}>
          {view === 'concierge' ? '✦ Concierge dashboard — every referral, every commission, every payment tracked' : '✦ Venue dashboard — every referral, every concierge, every euro in one place'}
        </span>
        <span style={{ fontSize: 10, color: '#2a2620', fontFamily: 'monospace' }}>· Example data</span>
      </div>
      <iframe
        key={view}
        src={view === 'venue' ? '/preview-venue.html' : '/preview-concierge.html'}
        style={{ width: '100%', height: 'calc(100vh - 88px)', border: 'none', display: 'block' }}
        title={`ISLA ${view} dashboard preview`}
      />
    </div>
  )
}
