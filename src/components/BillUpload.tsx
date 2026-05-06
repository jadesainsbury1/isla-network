'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  bookingId: string
  venueId: string
  venueName: string
  venueEmail: string
  commissionRate: string
  commissionBasis: string
  minSpend: number
  minSpendBasis: string
  concierge: string
}

export default function BillUpload({ bookingId, venueId, venueName, venueEmail, commissionRate, commissionBasis, minSpend, minSpendBasis, concierge }: Props) {
  const [open, setOpen] = useState(false)
  const [netAmount, setNetAmount] = useState('')
  const [grossAmount, setGrossAmount] = useState('')
  const [ticketNumber, setTicketNumber] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanNote, setScanNote] = useState('')
  const [done, setDone] = useState(false)
  const [result, setResult] = useState<{commission: number, meetsThreshold: boolean} | null>(null)
  const router = useRouter()

  const rate = parseFloat(String(commissionRate || '10').replace('%', '')) || 10
  const basis = commissionBasis || 'net'

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] || null
    setFile(selected)
    if (!selected) return
    setScanning(true)
    setScanNote('Scanning bill...')
    setNetAmount('')
    setGrossAmount('')
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
        if (data.net) setNetAmount(data.net.toString())
        if (data.gross) setGrossAmount(data.gross.toString())
        if (data.net || data.gross) {
          setScanNote('Amounts extracted - please verify before submitting')
        } else {
          setScanNote('Could not read bill - please enter manually')
        }
        setScanning(false)
      }
      reader.readAsDataURL(selected)
    } catch {
      setScanNote('Scan failed - please enter manually')
      setScanning(false)
    }
  }

  async function handleSubmit() {
    if (!netAmount && !grossAmount) return
    setLoading(true)
    const form = new FormData()
    form.append('bookingId', bookingId)
    form.append('venueId', venueId)
    form.append('netAmount', netAmount || '0')
    form.append('grossAmount', grossAmount || '0')
    form.append('venueName', venueName)
    form.append('venueEmail', venueEmail)
    form.append('ticket_number', ticketNumber)
    if (file) form.append('billPhoto', file)
    const res = await fetch('/api/venue/submit-bill', { method: 'POST', body: form })
    const data = await res.json()
    if (data.ok) {
      setResult({ commission: data.commissionAmount, meetsThreshold: data.meetsThreshold })
      setDone(true)
      router.refresh()
    }
    setLoading(false)
  }

  const net = parseFloat(netAmount) || 0
  const gross = parseFloat(grossAmount) || 0
  const thresholdAmount = minSpendBasis === 'net' ? net : gross
  const meetsThreshold = minSpend === 0 || thresholdAmount >= minSpend
  const commissionBase = basis === 'gross' ? gross : net
  const commissionPreview = meetsThreshold ? (commissionBase * rate) / 100 : 0

  if (done) return (
    <div style={{ background: result?.meetsThreshold ? '#0d1f0d' : '#1a1408', border: '1px solid ' + (result?.meetsThreshold ? '#2a4a2a' : '#3a2e1a'), borderRadius: 6, padding: '12px 16px', fontSize: 13 }}>
      <span style={{ color: result?.meetsThreshold ? '#4ade80' : '#d4a548' }}>
        {result?.meetsThreshold ? 'Bill submitted' : 'Bill submitted - below threshold'}
      </span>
      {result && <span style={{ color: '#888', marginLeft: 12 }}>Commission: EUR {result.commission.toFixed(2)}</span>}
    </div>
  )

  return (
    <div>
      {!open ? (
        <button onClick={() => setOpen(true)} style={{ padding: '8px 16px', background: '#C9A96E', color: '#000', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
          Submit Bill
        </button>
      ) : (
        <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 8, padding: 20, marginTop: 12, width: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.2em', color: '#C9A96E', textTransform: 'uppercase', marginBottom: 4 }}>
            Submit Bill - {concierge}
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#888', marginBottom: 16 }}>
            Rule: {rate}% of {basis}{minSpend > 0 ? ` - threshold EUR ${minSpend.toLocaleString('en-GB')} ${minSpendBasis}` : ''}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 10, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
              Bill Photo - AI reads net + gross automatically
            </label>
            <input type="file" accept="image/*,.pdf" onChange={handleFileChange} style={{ fontSize: 12, color: '#888' }} />
            {scanning && <div style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 11, color: '#C9A96E' }}>Scanning bill...</div>}
            {scanNote && !scanning && (
              <div style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 11, color: scanNote.includes('verify') ? '#4ade80' : '#888' }}>
                {scanNote}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 10, color: basis === 'net' ? '#C9A96E' : '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                Net F&B {basis === 'net' ? '*' : ''}
              </label>
              <input type="number" value={netAmount} onChange={e => setNetAmount(e.target.value)} placeholder="excl. IVA + service" disabled={scanning}
                style={{ width: '100%', padding: '10px 12px', background: '#1a1a1a', border: '1px solid ' + (basis === 'net' ? '#C9A96E' : '#333'), borderRadius: 4, color: '#fff', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 10, color: (basis === 'gross' || minSpendBasis === 'gross') ? '#C9A96E' : '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                Gross Total {basis === 'gross' ? '*' : ''}
              </label>
              <input type="number" value={grossAmount} onChange={e => setGrossAmount(e.target.value)} placeholder="incl. IVA + service" disabled={scanning}
                style={{ width: '100%', padding: '10px 12px', background: '#1a1a1a', border: '1px solid ' + ((basis === 'gross' || minSpendBasis === 'gross') ? '#C9A96E' : '#333'), borderRadius: 4, color: '#fff', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6, fontFamily: 'monospace' }}>
              Ticket / Receipt Number <span style={{ color: '#666', textTransform: 'none', letterSpacing: 0 }}>(for finance)</span>
            </label>
            <input type="text" value={ticketNumber} onChange={e => setTicketNumber(e.target.value)} placeholder="e.g. #A2841 or POS-12345"
              style={{ width: '100%', padding: '10px 12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 4, color: '#fff', fontSize: 14, boxSizing: 'border-box' }} />
          </div>

          {(net > 0 || gross > 0) && (
            <div style={{ background: meetsThreshold ? '#0d1a0d' : '#1a1408', border: '1px solid ' + (meetsThreshold ? '#2a3a2a' : '#3a2e1a'), borderRadius: 4, padding: '10px 14px', marginBottom: 16 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 12, color: meetsThreshold ? '#4ade80' : '#d4a548' }}>
                Commission ({rate}% of {basis}): EUR {commissionPreview.toFixed(2)}
              </div>
              {!meetsThreshold && minSpend > 0 && (
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#888', marginTop: 4 }}>
                  Below EUR {minSpend.toLocaleString('en-GB')} {minSpendBasis} threshold - no commission applies
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleSubmit} disabled={loading || (!netAmount && !grossAmount) || scanning}
              style={{ padding: '10px 20px', background: '#C9A96E', color: '#000', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.1em', opacity: loading || (!netAmount && !grossAmount) || scanning ? 0.5 : 1 }}>
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
