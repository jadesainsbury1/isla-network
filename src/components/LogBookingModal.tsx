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

export default function LogBookingModal({ venues, conciergeId, onClose }: Props) {
  const router = useRouter()
  const [venueId, setVenueId] = useState(venues[0]?.id || '')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [covers, setCovers] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedVenue = venues.find(v => v.id === venueId)

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
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.refresh()
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <h2>Log a Booking</h2>
        <p className="modal-sub">10 seconds. Venue confirms it. Commission tracked automatically.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Venue</label>
            <select className="form-input" value={venueId} onChange={e => setVenueId(e.target.value)}>
              {venues.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} — {v.commission_rate} {v.commission_basis}
                </option>
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
              <input className="form-input" type="number" placeholder="e.g. 4" min="1" value={covers} onChange={e => setCovers(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <input className="form-input" placeholder="Birthday group · VIP · window table" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          {selectedVenue && (
            <div className="commission-preview">
              <span className="comm-preview-label">Commission rate · paid direct by venue</span>
              <span className="comm-preview-val">{selectedVenue.commission_rate}</span>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                Basis: {selectedVenue.commission_basis} · confirmed by venue after booking
              </div>
            </div>
          )}

          {error && <div className="form-error" style={{ marginBottom: 12 }}>{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-gold" disabled={loading}>
              {loading ? 'Logging…' : 'Log Booking →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
