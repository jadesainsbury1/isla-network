'use client'
import { useState } from 'react'

interface Props {
  conciergeId: string
  conciergeName: string
  initialNotes: string
  initialBlocked: boolean
}

export default function ConciergeNotesPanel({ conciergeId, conciergeName, initialNotes, initialBlocked }: Props) {
  const [notes, setNotes] = useState(initialNotes)
  const [blocked, setBlocked] = useState(initialBlocked)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    await fetch('/api/venue/concierge-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ concierge_id: conciergeId, notes, is_blocked: blocked })
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="card" style={{ padding: 24, marginTop: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--muted)', textTransform: 'uppercase' }}>Private Notes</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: blocked ? '#f44336' : 'var(--muted)' }}>
            {blocked ? `${conciergeName} is blocked from this venue` : 'Allow referrals'}
          </span>
          <button
            onClick={() => setBlocked(b => !b)}
            style={{
              background: blocked ? '#f4433622' : '#1a1a1a',
              border: `1px solid ${blocked ? '#f44336' : 'var(--border)'}`,
              borderRadius: 20,
              padding: '4px 14px',
              fontSize: 11,
              fontFamily: 'monospace',
              color: blocked ? '#f44336' : 'var(--muted)',
              cursor: 'pointer',
              letterSpacing: '0.1em',
            }}
          >
            {blocked ? 'BLOCKED' : 'BLOCK'}
          </button>
        </div>
      </div>

      {blocked && (
        <div style={{ background: '#f4433611', border: '1px solid #f4433633', borderRadius: 6, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#f44336', fontFamily: 'monospace' }}>
          This concierge will not be able to log referrals to your venue while blocked.
        </div>
      )}

      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder={`Private notes about ${conciergeName}. Not visible to the concierge.`}
        style={{
          width: '100%',
          minHeight: 100,
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          padding: '10px 12px',
          fontSize: 13,
          color: 'var(--cream)',
          resize: 'vertical',
          fontFamily: 'inherit',
          lineHeight: 1.6,
          boxSizing: 'border-box',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
        <button onClick={handleSave} className="btn btn-gold" disabled={saving} style={{ fontSize: 11, padding: '8px 18px' }}>
          {saving ? 'Saving...' : 'Save'}
        </button>
        {saved && <span style={{ fontSize: 11, color: '#4caf50', fontFamily: 'monospace' }}>Saved</span>}
      </div>
    </div>
  )
}
