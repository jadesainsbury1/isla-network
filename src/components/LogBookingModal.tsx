'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Venue } from '@/lib/types'

interface Props {
  venues: Venue[]
  conciergeId: string
  onClose: () => void
}

function generateRef() {
  const year = new Date().getFullYear()
  const num = Math.floor(1000 + Math.random() * 9000)
  return `ISLA-${year}-${num}`
}

export default function LogBookingModal({ venues, conciergeId, onClose }: Props) {
  const router = useRouter()
  const [venueId, setVenueId] = useState(venues[0]?.id || '')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [covers, setCovers] = useState('')
  const [guestName, setGuestName] = useState('')
  const [estimatedSpend, setEstimatedSpend] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ref] = useState(generateRef())

  const selectedVenue = venues.find(v => v.id === venueId)
  const rate = selectedVenue?.commission_rate ? parseFloat(selectedVenue.commission_rate) / 100 : null
  const spend = estimatedSpend ? parseFloat(estimatedSpend) : null
  const estComm = rate && spend ? spend * rate : null
  const estIva = estComm ? estComm * 0.21 : null
  const estTotal = estComm && estIva ? estComm + estIva : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.from('bookings').insert({
      concierge_id: conciergeId,
      venue_id: venueId,
      date,
      covers: covers ? parseInt(covers) : null,
      notes: notes || null,
      status: 'pending',
      reference_number: ref,
      guest_name: guestName || null,
      estimated_spend: spend || null,
      estimated_commission: estComm || null,
    })
    if (error) { setError(error.message); setLoading(false); return }
    router.refresh()
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <h2>Log a Booking</h2>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--gold)', letterSpacing: '0.1em' }}>{ref}</div>
        </div>
        <p className="modal-sub">Your ISLA reference is generated. Venue confirms it. Commission tracked automatically.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Venue</label>
            <select className="form-input" value={venueId} onChange={e => setVenueId(e.target.value)}>
              {venues.map(v => (
                <option key={v.id} value={v.id}>{v.name} — {v.commission_rate} {v.commission_basis}</option>
              ))}
            </select>
          </div>
          <div className="two-col">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Covers / Guests</label>
              <input className="form-input" type="number" placeholder="4" min="1" value={covers} onChange={e => setCovers(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Guest name (optional)</label>
            <input className="form-input" placeholder="Mr Johnson · birthday group" value={guestName} onChange={e => setGuestName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Estimated spend €</label>
            <input className="form-input" type="number" placeholder="3200" min="0" value={estimatedSpend} onChange={e => setEstimatedSpend(e.target.value)} />
          </div>
          {estTotal && estComm && estIva && (
            <div className="commission-preview">
              <span className="comm-preview-label">Estimated commission</span>
              <span className="comm-preview-val">€{estComm.toFixed(2)}</span>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                IVA 21%: €{estIva.toFixed(2)} · Total due: €{estTotal.toFixed(2)}
              </div>
            </div>
          )}
          {!estTotal && selectedVenue && (
            <div className="commission-preview">
              <span className="comm-preview-label">Commission rate · paid direct by venue</span>
              <span className="comm-preview-val">{selectedVenue.commission_rate}</span>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Enter estimated spend to see your commission</div>
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <input className="form-input" placeholder="VIP · window table · anniversary" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          {error && <div className="form-error" style={{ marginBottom: 12 }}>{error}</div>}
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-gold" disabled={loading}>{loading ? 'Logging...' : 'Log Booking'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
