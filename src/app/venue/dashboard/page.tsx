import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ReferralActions from '@/components/ReferralActions'
import type { Booking, Profile } from '@/lib/types'

export default async function VenueDashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Get venue owned by this user
  const { data: venue } = await supabase
    .from('venues')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!venue) {
    return (
      <>
        <div className="topbar">
          <div className="page-title">Dashboard</div>
        </div>
        <div className="body">
          <div className="empty-state">
            <div className="empty-state-icon">✦</div>
            <div className="empty-state-title">Set up your venue listing</div>
            <div className="empty-state-sub">Complete your listing so concierges can find and refer your venue</div>
            <a href="/venue/listing" className="btn btn-gold" style={{ marginTop: 16, display: 'inline-flex' }}>
              Set Up Listing →
            </a>
          </div>
        </div>
      </>
    )
  }

  // Get bookings for this venue
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, concierge:profiles(*)')
    .eq('venue_id', venue.id)
    .order('created_at', { ascending: false })

  const allBookings: Booking[] = bookings || []
  const pending = allBookings.filter(b => b.status === 'pending')
  const confirmed = allBookings.filter(b => b.status === 'confirmed')
  const totalCovers = allBookings.reduce((sum, b) => sum + (b.covers || 0), 0)

  // Unique concierges
  const conciergeIds = new Set(allBookings.map(b => b.concierge_id))

  return (
    <>
      <div className="topbar">
        <div className="page-title">Dashboard</div>
      </div>
      <div className="body">

        {/* Stats */}
        <div className="money-header" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="money-box">
            <span className="money-val gold">{pending.length}</span>
            <span className="money-label gold">Pending referrals</span>
          </div>
          <div className="money-box">
            <span className="money-val green">{confirmed.length}</span>
            <span className="money-label green">Confirmed</span>
          </div>
          <div className="money-box">
            <span className="money-val" style={{ color: 'var(--cream)' }}>{conciergeIds.size}</span>
            <span className="money-label" style={{ color: 'var(--muted)' }}>Concierges</span>
          </div>
        </div>

        {/* Pending referrals */}
        <div style={{ marginBottom: 24 }}>
          <div className="mono" style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
            Pending referrals — action required
          </div>

          {pending.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>No pending referrals right now</div>
            </div>
          ) : (
            pending.map(b => {
              const concierge = b.concierge as Profile
              return (
                <div key={b.id} className="confirm-card">
                  <div>
                    <div className="confirm-title">
                      {concierge?.full_name || 'Concierge'} · {concierge?.property || ''}
                    </div>
                    <div className="confirm-sub">
                      {b.covers ? `${b.covers} covers · ` : ''}
                      {new Date(b.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                      {b.notes ? ` · ${b.notes}` : ''}
                    </div>
                  </div>
                  <ReferralActions bookingId={b.id} />
                </div>
              )
            })
          )}
        </div>

        {/* All bookings table */}
        {allBookings.length > 0 && (
          <div className="table-card">
            <div className="table-header">
              <span className="table-title">All Referrals</span>
              <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{allBookings.length} total · {totalCovers} covers</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Concierge</th>
                  <th>Property</th>
                  <th>Date</th>
                  <th>Covers</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.map(b => {
                  const concierge = b.concierge as Profile
                  return (
                    <tr key={b.id}>
                      <td className="td-name">{concierge?.full_name || '—'}</td>
                      <td className="td-muted">{concierge?.property || '—'}</td>
                      <td className="td-mono td-muted">
                        {new Date(b.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="td-mono">{b.covers || '—'}</td>
                      <td>
                        <span className={`badge badge-${b.status}`}>{b.status}</span>
                      </td>
                      <td className="td-muted">{b.notes || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
