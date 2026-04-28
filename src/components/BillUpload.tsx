'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  bookingId: string
  venueName: string
  venueEmail: string
  commissionRate: string
  concierge: string
}

export default function BillUpload({ bookingId, venueName, venueEmail, commissionRate, concierge }: Props) {
  const [open, setOpen] = useState(false)
  const [billAmount, setBillAmount] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [commission, setCommission] = useState<number | null>(null)
  const router = useRouter()

  const rate = parseFloat(commissionRate?.replace('%', '') || '10')

  async function handleSubmit() {
    if (!billAmount) return
    setLoading(true)
    const form = new FormData()
    form.append('bookingId', bookingId)
    form.append('billAmount', billAmount)
    form.append('commissionRate', rate.toString())
    form.append('venueName', venueName)
    form.append('venueEmail', venueEmail)
    if (file) form.append('billPhoto', file)

    const res = await fetch('/api/venue/submit-bill', { method: 'POST', body: form })
    const data = await res.json()
    if (data.ok) {
      setCommission(data.commissionAmount)
      setDone(true)
      router.refresh()
    }
    setLoading(false)
  }

  if (done) return (
    <div style={{ background: '#0d1f0d', border: '1px solid #2a4a2a', borderRadius: 6, padding: '12px 16px', fontSize: 13 }}>
      <span style={{ color: '#4ade80' }}>✓ Bill submitted</span>
      {commission && <span style={{ color: '#888', marginLeft: 12 }}>Commission: €{commission.toFixed(2)} — pending GRM approval</span>}
    </div>
  )

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          style={{ padding: '8px 16px', background: '#C9A96E', color: '#000', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.1em' }}
        >
          Submit Bill
        </button>
      ) : (
        <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 8, padding: 20, marginTop: 12 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.2em', color: '#C9A96E', textTransform: 'uppercase', marginBottom: 16 }}>
            Submit Bill · {concierge}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 10, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Total Bill Amount (€)</label>
            <input
              type="number"
              value={billAmount}
              onChange={e => setBillAmount(e.target.value)}
              placeholder="e.g. 3200"
              style={{ width: '100%', padding: '10px 12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 4, color: '#fff', fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>
          {billAmount && (
            <div style={{ background: '#0d1a0d', border: '1px solid #2a3a2a', borderRadius: 4, padding: '10px 14px', marginBottom: 12 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#4ade80' }}>
                Commission ({rate}%): €{(parseFloat(billAmount) * rate / 100).toFixed(2)}
              </span>
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 10, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Bill Photo (optional)</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={e => setFile(e.target.files?.[0] || null)}
              style={{ fontSize: 12, color: '#888' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleSubmit}
              disabled={loading || !billAmount}
              style={{ padding: '10px 20px', background: '#C9A96E', color: '#000', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.1em', opacity: loading || !billAmount ? 0.5 : 1 }}
            >
              {loading ? 'Submitting...' : 'Confirm & Submit'}
            </button>
            <button
              onClick={() => setOpen(false)}
              style={{ padding: '10px 20px', background: 'transparent', color: '#666', border: '1px solid #333', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
