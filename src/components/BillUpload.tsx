'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  bookingId: string
  venueName: string
  venueEmail: string
  commissionRate: string
  concierge: string
  minSpend?: number
}

export default function BillUpload({ bookingId, venueName, venueEmail, commissionRate, concierge, minSpend = 0 }: Props) {
  const [open, setOpen] = useState(false)
  const [billAmount, setBillAmount] = useState('')
  const [ticketNumber, setTicketNumber] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanNote, setScanNote] = useState('')
  const [done, setDone] = useState(false)
  const [commission, setCommission] = useState<number | null>(null)
  const router = useRouter()

  const rate = parseFloat(commissionRate?.replace('%', '') || '10')

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] || null
    setFile(selected)
    if (!selected) return

    setScanning(true)
    setScanNote('Scanning bill...')
    setBillAmount('')

    try {
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1]
        const mediaType = selected.type || 'image/jpeg'

        const res = await fetch('/api/venue/scan-bill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64, mediaType })
        })
        const data = await res.json()
        if (data.amount) {
          setBillAmount(data.amount.toString())
          setScanNote('Amount extracted — please verify before submitting')
        } else {
          setScanNote('Could not read amount — please enter manually')
        }
        setScanning(false)
      }
      reader.readAsDataURL(selected)
    } catch {
      setScanNote('Scan failed — please enter amount manually')
      setScanning(false)
    }
  }

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

    form.append('ticket_number', ticketNumber)

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
      {commission && <span style={{ color: '#888', marginLeft: 12 }}>Commission: €{commission.toFixed(2)} — pending approval</span>}
    </div>
  )

  return (
    <div>
      {!open ? (
        <button onClick={() => setOpen(true)} style={{ padding: '8px 16px', background: '#C9A96E', color: '#000', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
          Submit Bill
        </button>
      ) : (
        <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 8, padding: 20, marginTop: 12 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.2em', color: '#C9A96E', textTransform: 'uppercase', marginBottom: 16 }}>
            Submit Bill · {concierge}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 10, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
              Bill Photo — AI will read the total automatically
            </label>
            <input type="file" accept="image/*,.pdf" onChange={handleFileChange} style={{ fontSize: 12, color: '#888' }} />
            {scanning && (
              <div style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 11, color: '#C9A96E' }}>
                ✦ Scanning bill...
              </div>
            )}
            {scanNote && !scanning && (
              <div style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 11, color: scanNote.includes('verify') ? '#4ade80' : '#888' }}>
                {scanNote.includes('verify') ? '✓ ' : '⚠ '}{scanNote}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 10, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
              Net F&B Total (€) — excl. service charge & IVA
            </label>
            <input
              type="number"
              value={billAmount}
              onChange={e => setBillAmount(e.target.value)}
              placeholder={scanning ? 'Reading bill...' : 'e.g. 3200'}
              disabled={scanning}
              style={{ width: '100%', padding: '10px 12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 4, color: '#fff', fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6, fontFamily: 'monospace' }}>
              Ticket / Receipt Number <span style={{ color: '#666', textTransform: 'none', letterSpacing: 0 }}>(for finance reference)</span>
            </label>
            <input
              type="text"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              placeholder="e.g. #A2841 or POS-12345"
              style={{ width: '100%', padding: '10px 12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 4, color: '#fff', fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>

          {billAmount && (() => {
            const amt = parseFloat(billAmount)
            const meetsThreshold = !minSpend || amt >= minSpend
            const commissionPreview = meetsThreshold ? (amt * rate / 100) : 0
            return (
              <div style={{ background: meetsThreshold ? '#0d1a0d' : '#1a1408', border: '1px solid ' + (meetsThreshold ? '#2a3a2a' : '#3a2e1a'), borderRadius: 4, padding: '10px 14px', marginBottom: 16 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 12, color: meetsThreshold ? '#4ade80' : '#d4a548' }}>
                  Commission ({rate}%): €{commissionPreview.toFixed(2)}
                </div>
                {!meetsThreshold && (
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#888', marginTop: 4 }}>
                    Below €{minSpend.toLocaleString('en-GB')} threshold — no commission applies
                  </div>
                )}
              </div>
            )
          })()}

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleSubmit} disabled={loading || !billAmount || scanning} style={{ padding: '10px 20px', background: '#C9A96E', color: '#000', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.1em', opacity: loading || !billAmount || scanning ? 0.5 : 1 }}>
              {loading ? 'Submitting...' : 'Confirm & Submit'}
            </button>
            <button onClick={() => setOpen(false)} style={{ padding: '10px 20px', background: 'transparent', color: '#666', border: '1px solid #333', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
