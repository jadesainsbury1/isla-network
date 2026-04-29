'use client'
import { useState } from 'react'
import BookingMessage from '@/components/BookingMessage'
import { createClient } from '@/lib/supabase/client'

interface Totals {
  totalEarned: number
  totalPaid: number
  totalPending: number
  totalUnpaid: number
}

interface Props {
  bookings: any[]
  venues: any[]
  conciergeId: string
  totals: Totals
}

export default function RevenueClient({ bookings, venues, conciergeId, totals }: Props) {
  const [showLog, setShowLog] = useState(false)
  const [venueId, setVenueId] = useState('')
  const [date, setDate] = useState('')
  const [covers, setCovers] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const fmt = (n: number) => '€' + n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  const badge = (status: string) => {
    const map: Record<string, string> = {
      approved: 'badge-paid',
      paid: 'badge-paid',
      pending: 'badge-pending',
      unpaid: 'badge-pending',
    }
    return <span className={'badge ' + (map[status] || '')}>{status}</span>
  }

  async function handleLog(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const selectedVenue = venues.find(v => v.id === venueId)
    const rate = parseFloat((selectedVenue?.commission_rate || '10%').replace('%', '')) / 100

    await supabase.from('bookings').insert({
      concierge_id: conciergeId,
      venue_id: venueId,
      date,
      covers: parseInt(covers) || null,
      notes,
      status: 'pending',
      commission_status: 'pending',
      payment_status: 'unpaid',
    })
    setLoading(false)
    setSuccess(true)
    setShowLog(false)
    setTimeout(() => window.location.reload(), 800)
  }

  return (
    <>
      <div className="topbar">
        <div className="page-title">My Earnings</div>
      </div>
      <div className="body">

        {/* Stats */}
        <div className="money-header" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="money-box">
            <span className="money-val gold">{fmt(totals.totalEarned)}</span>
            <span className="money-label gold">Total earned</span>
          </div>
          <div className="money-box">
            <span className="money-val green">{fmt(totals.totalPaid)}</span>
            <span className="money-label green">Paid to me</span>
          </div>
          <div className="money-box">
            <span className="money-val" style={{ color: totals.totalUnpaid > 0 ? '#f44336' : 'var(--cream)' }}>{fmt(totals.totalUnpaid)}</span>
            <span className="money-label" style={{ color: 'var(--muted)' }}>Due from ISLA</span>
          </div>
          <div className="money-box">
            <span className="money-val" style={{ color: 'var(--muted)' }}>{fmt(totals.totalPending)}</span>
            <span className="money-label" style={{ color: 'var(--muted)' }}>Awaiting approval</span>
          </div>
        </div>

        {/* Log referral button */}
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="mono" style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)' }}>My referrals — {bookings.length} total</div>
          <button onClick={() => setShowLog(true)} className="btn btn-gold" style={{ fontSize: 11, padding: '8px 16px' }}>+ Log Referral</button>
        </div>

        {success && <div style={{ color: '#4caf50', fontSize: 12, fontFamily: 'monospace', marginBottom: 16 }}>✓ Referral logged successfully</div>}

        {/* Log modal */}
        {showLog && (
          <div style={{ background: 'var(--charcoal)', border: '1px solid var(--border)', borderRadius: 8, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: 'var(--cream)', fontWeight: 500, marginBottom: 16 }}>Log a Referral</div>
            <form onSubmit={handleLog}>
              <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div className="form-group">
                  <label className="form-label">Venue</label>
                  <select className="form-input" value={venueId} onChange={e => setVenueId(e.target.value)} required>
                    <option value="">Select venue</option>
                    {venues.map(v => <option key={v.id} value={v.id}>{v.name} · {v.area}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date of visit</label>
                  <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Number of covers</label>
                  <input className="form-input" type="number" placeholder="4" value={covers} onChange={e => setCovers(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Notes (optional)</label>
                  <input className="form-input" placeholder="Birthday dinner, champagne on arrival" value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className="btn btn-gold" disabled={loading}>{loading ? 'Logging...' : 'Log Referral'}</button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowLog(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Bookings table */}
        {bookings.length > 0 ? (
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Area</th>
                  <th>Covers</th>
                  <th>Commission</th>
                  <th>Approval</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td className="td-mono td-muted">{new Date(b.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="td-name">{(b.venue as any)?.name || '—'}</td>
                    <td className="td-muted">{(b.venue as any)?.area || '—'}</td>
                    <td className="td-mono">{b.covers || '—'}</td>
                    <td className="td-mono" style={{ color: 'var(--gold)', fontWeight: 600 }}>
                      {b.commission_amount ? fmt(Number(b.commission_amount)) : b.estimated_commission ? '~' + fmt(Number(b.estimated_commission)) : '—'}
                    </td>
                    <td>{badge(b.commission_status || 'pending')}</td>
                    <td>{badge(b.payment_status || 'unpaid')}</td>
                  </tr>
                  <tr><td colSpan={7} style={{ padding: 0, border: 'none' }}><BookingMessage bookingId={b.id} currentUserId={conciergeId} currentUserName='Concierge' currentUserRole='concierge' messages={[]} /></td></tr>
                ))}
              </tbody>
            </table>
            {totals.totalUnpaid > 0 && (
              <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Total due from ISLA</span>
                <span style={{ color: '#f44336', fontWeight: 600 }}>{fmt(totals.totalUnpaid)}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>✦</div>
            <div style={{ color: 'var(--cream)', fontSize: 15, marginBottom: 8 }}>No referrals yet</div>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>Log your first referral to start tracking commission</div>
            <button onClick={() => setShowLog(true)} className="btn btn-gold">Log Your First Referral</button>
          </div>
        )}
      <div style={{ marginTop: 32 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>My Client Profile</div>
        <ConciergeProfileForm userId={conciergeId} />
      </div>
      </div>
    </>
  )
}
