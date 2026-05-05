'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  bookingId: string
  commissionAmount: number
  conciergeName: string
}

export default function MarkPaidButton({ bookingId, commissionAmount, conciergeName }: Props) {
  const [open, setOpen] = useState(false)
  const [method, setMethod] = useState('bank_transfer')
  const [reference, setReference] = useState('')
  const [paidDate, setPaidDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/booking/mark-paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          paidMethod: method,
          paidReference: reference || null,
          paidAt: paidDate ? new Date(paidDate).toISOString() : new Date().toISOString()
        })
      })
      const data = await res.json()
      if (!data.ok) {
        setError(data.error || 'Failed to mark as paid')
        setLoading(false)
        return
      }
      setOpen(false)
      router.refresh()
    } catch (e) {
      setError('Network error')
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '6px 12px',
          background: 'var(--gold)',
          color: '#000',
          border: 'none',
          borderRadius: 4,
          fontSize: 11,
          fontFamily: 'monospace',
          letterSpacing: '0.1em',
          fontWeight: 700,
          cursor: 'pointer',
          textTransform: 'uppercase',
        }}
      >
        Mark Paid
      </button>
    )
  }

  return (
    <div style={{ background: '#0a0a0a', border: '1px solid var(--gold)', borderRadius: 8, padding: 20, maxWidth: 480 }}>
      <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 4 }}>
        Mark Commission Paid
      </div>
      <div style={{ color: 'var(--cream)', fontSize: 14, marginBottom: 20, fontFamily: 'Georgia, serif' }}>
        EUR {commissionAmount.toLocaleString('en-GB', { maximumFractionDigits: 0 })} to {conciergeName}
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6, fontFamily: 'monospace' }}>
          Payment Method
        </label>
        <select
          value={method}
          onChange={e => setMethod(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 4, color: 'var(--cream)', fontSize: 13, fontFamily: 'monospace' }}
        >
          <option value="bank_transfer">Bank transfer</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6, fontFamily: 'monospace' }}>
          Payment Date
        </label>
        <input
          type="date"
          value={paidDate}
          onChange={e => setPaidDate(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 4, color: 'var(--cream)', fontSize: 13, fontFamily: 'monospace' }}
        />
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={{ display: 'block', fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6, fontFamily: 'monospace' }}>
          Reference / Transaction ID <span style={{ color: '#555', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
        </label>
        <input
          type="text"
          value={reference}
          onChange={e => setReference(e.target.value)}
          placeholder="e.g. TRX-9847 or wire ref"
          style={{ width: '100%', padding: '10px 12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 4, color: 'var(--cream)', fontSize: 13, fontFamily: 'monospace', boxSizing: 'border-box' }}
        />
      </div>

      {error && (
        <div style={{ background: '#2a1010', border: '1px solid #4a1010', borderRadius: 4, padding: '8px 12px', marginBottom: 14, fontSize: 12, color: '#ff8888', fontFamily: 'monospace' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ padding: '10px 20px', background: 'var(--gold)', color: '#000', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: loading ? 0.5 : 1 }}
        >
          {loading ? 'Saving...' : 'Confirm Payment Sent'}
        </button>
        <button
          onClick={() => setOpen(false)}
          style={{ padding: '10px 20px', background: 'transparent', color: '#888', border: '1px solid #333', borderRadius: 4, fontSize: 11, cursor: 'pointer', fontFamily: 'monospace' }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
