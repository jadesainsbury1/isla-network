'use client'
import { useState } from 'react'
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
  const [nationality, setNationality] = useState('')
  const [occasion, setOccasion] = useState('')
  const [dietary, setDietary] = useState('')
  const [vipNotes, setVipNotes] = useState('')
  const [spendProfile, setSpendProfile] = useState('')

  const fmt = (n: number) => '\u20ac' + n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

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

    await supabase.from('bookings').insert({
      concierge_id: conciergeId,
      venue_id: venueId,
      date,
      covers: parseInt(covers) || null,
      notes,
      status: 'pending',
      commission_status: 'pending',
      payment_status: 'unpaid',
      guest_profile: {
        nationality: nationality || null,
        occasion: occasion || null,
        dietary: dietary || null,
        vip_notes: vipNotes || null,
        spend_profile: spendProfile || null,
      }
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

        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="mono" style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)' }}>My referrals &mdash; {bookings.length} total</div>
          <button onClick={() => setShowLog(true)} className="btn btn-gold" style={{ fontSize: 11, padding: '8px 16px' }}>+ Log Referral</button>
        </div>

        {success && <div style={{ color: '#4caf50', fontSize: 12, fontFamily: 'monospace', marginBottom: 16 }}>Referral logged successfully</div>}

        {showLog && (
          <div style={{ background: 'var(--charcoal)', border: '1px solid var(--border)', borderRadius: 8, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: 'var(--cream)', fontWeight: 500, marginBottom: 16 }}>Log a Referral</div>
            <form onSubmit={handleLog}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div className="form-group">
                  <label className="form-label">Venue</label>
                  <select className="form-input" value={venueId} onChange={e => setVenueId(e.target.value)} required>
                    <option value="">Select venue</option>
                    {venues.map((v: any) => <option key={v.id} value={v.id}>{v.name} &middot; {v.area}</option>)}
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
              <div style={{ marginBottom: 12 }}>
                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Guest Profile — visible to venue before arrival</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Nationality</label>
                    <input className="form-input" placeholder="e.g. German, Dutch, British" value={nationality} onChange={e => setNationality(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Special occasion</label>
                    <input className="form-input" placeholder="e.g. Birthday, Anniversary, Honeymoon" value={occasion} onChange={e => setOccasion(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dietary requirements</label>
                    <input className="form-input" placeholder="e.g. Halal, Vegan, Nut allergy" value={dietary} onChange={e => setDietary(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Spend profile</label>
                    <select className="form-input" value={spendProfile} onChange={e => setSpendProfile(e.target.value)}>
                      <option value="">Select</option>
                      <option value="standard">Standard — under 2,000</option>
                      <option value="premium">Premium — 2,000 to 5,000</option>
                      <option value="uhnw">UHNW — 5,000+</option>
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: 12 }}>
                  <label className="form-label">VIP notes — private to venue</label>
                  <input className="form-input" placeholder="e.g. Guest is a regular at Nobu. Prefers window table. Has young children." value={vipNotes} onChange={e => setVipNotes(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className="btn btn-gold" disabled={loading}>{loading ? 'Logging...' : 'Log Referral'}</button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowLog(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

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
                {bookings.map((b: any) => (
                  <tr key={b.id}>
                    <td className="td-mono td-muted">{new Date(b.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="td-name">{(b.venue as any)?.name || '&mdash;'}</td>
                    <td className="td-muted">{(b.venue as any)?.area || '&mdash;'}</td>
                    <td className="td-mono">{b.covers || '&mdash;'}</td>
                    <td className="td-mono" style={{ color: 'var(--gold)', fontWeight: 600 }}>
                      {b.commission_amount ? fmt(Number(b.commission_amount)) : b.estimated_commission ? '~' + fmt(Number(b.estimated_commission)) : '&mdash;'}
                    </td>
                    <td>{badge(b.commission_status || 'pending')}</td>
                    <td>{badge(b.payment_status || 'unpaid')}</td>
                  </tr>
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
            <div style={{ fontSize: 24, marginBottom: 12 }}>&#10022;</div>
            <div style={{ color: 'var(--cream)', fontSize: 15, marginBottom: 8 }}>No referrals yet</div>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>Log your first referral to start tracking commission</div>
            <button onClick={() => setShowLog(true)} className="btn btn-gold">Log Your First Referral</button>
          </div>
        )}
      </div>
    </>
  )
}
