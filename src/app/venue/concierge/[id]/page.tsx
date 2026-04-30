import { redirect } from 'next/navigation'
import ConciergeNotesPanel from './ConciergeNotesPanel'
import { createClient } from '@/lib/supabase/server'

const TIER_LABELS: Record<string, string> = {
  elite: 'Elite',
  preferred: 'Preferred',
  verified: 'Verified',
}

const TIER_COLORS: Record<string, string> = {
  elite: '#fff',
  preferred: '#C9A96E',
  verified: '#888',
}

const SPEND_LABELS: Record<string, string> = {
  'under1k': 'Under €1,000',
  '1k-3k': '€1,000 – €3,000',
  '3k-8k': '€3,000 – €8,000',
  '8k+': '€8,000+',
}

export default async function ConciergeProfilePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Verify viewer is a venue
  const { data: venue } = await supabase
    .from('venues')
    .select('id, name')
    .eq('user_id', user.id)
    .single()
  if (!venue) redirect('/venue/dashboard')

  // Get concierge profile
  const { data: concierge } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .eq('role', 'concierge')
    .eq('is_approved', true)
    .single()

  if (!concierge) redirect('/venue/dashboard')

  // Get booking history between this concierge and this venue
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('concierge_id', params.id)
    .eq('venue_id', venue.id)
    .order('date', { ascending: false })

  const { data: noteRow } = await supabase
    .from('venue_concierge_notes')
    .select('notes, is_blocked')
    .eq('venue_id', venue.id)
    .eq('concierge_id', params.id)
    .maybeSingle()

  const existingNotes = noteRow?.notes || ''
  const isBlocked = noteRow?.is_blocked || false

  const allBookings = bookings || []
  const totalSpend = allBookings.reduce((s, b) => s + (Number(b.bill_amount) || 0), 0)
  const totalCommission = allBookings.reduce((s, b) => s + (Number(b.commission_amount) || 0), 0)
  const totalCovers = allBookings.reduce((s, b) => s + (b.covers || 0), 0)
  const tier = concierge.concierge_tier || 'verified'
  const gp = (concierge as any).guest_profile || {}
  const languages = (concierge as any).languages_spoken || []

  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/venue/dashboard" style={{ color: 'var(--muted)', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.1em', textDecoration: 'none' }}>← Dashboard</a>
          <span style={{ color: 'var(--border)' }}>·</span>
          <div className="page-title">{concierge.full_name}</div>
        </div>
      </div>
      <div className="body">

        {/* Profile header */}
        <div className="card" style={{ marginBottom: 24, padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--cream)' }}>{concierge.full_name}</div>
                <span style={{ background: tier === 'elite' ? '#1a0a2a' : tier === 'preferred' ? '#2a2000' : '#1a1a1a', color: TIER_COLORS[tier], border: `1px solid ${TIER_COLORS[tier]}`, padding: '3px 10px', borderRadius: 4, fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  {TIER_LABELS[tier]}
                </span>
              </div>
              <div style={{ fontSize: 14, color: 'var(--muted)' }}>{concierge.property || 'Independent'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>Member since</div>
              <div style={{ fontSize: 13, color: 'var(--cream)' }}>{new Date(concierge.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</div>
            </div>
          </div>

          {concierge.bio && (
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              {concierge.bio}
            </div>
          )}
        </div>

        {/* Stats from bookings with this venue */}
        {allBookings.length > 0 && (
          <div className="money-header" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
            <div className="money-box">
              <span className="money-val gold">{allBookings.length}</span>
              <span className="money-label gold">Referrals to {venue.name}</span>
            </div>
            <div className="money-box">
              <span className="money-val" style={{ color: 'var(--cream)' }}>{totalCovers}</span>
              <span className="money-label" style={{ color: 'var(--muted)' }}>Total covers</span>
            </div>
            <div className="money-box">
              <span className="money-val" style={{ color: 'var(--cream)' }}>{'€' + totalSpend.toLocaleString()}</span>
              <span className="money-label" style={{ color: 'var(--muted)' }}>Total F&B spend</span>
            </div>
            <div className="money-box">
              <span className="money-val" style={{ color: 'var(--gold)' }}>{'€' + totalCommission.toLocaleString()}</span>
              <span className="money-label" style={{ color: 'var(--muted)' }}>Commission earned</span>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

          {/* Guest profile */}
          <div className="card" style={{ padding: 24 }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 16 }}>Guest Profile</div>

            {gp.guest_profile && gp.guest_profile.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Guest type</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(gp.guest_profile || []).map((p: string) => (
                    <span key={p} style={{ background: '#1a1a2a', border: '1px solid #2a2a4a', borderRadius: 4, padding: '3px 8px', fontSize: 10, fontFamily: 'monospace', color: '#C9A96E' }}>{p}</span>
                  ))}
                </div>
              </div>
            )}

            {gp.guest_nationalities && gp.guest_nationalities.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Primary nationalities</div>
                <div style={{ fontSize: 13, color: 'var(--cream)' }}>{gp.guest_nationalities.join(', ')}</div>
              </div>
            )}

            {(concierge as any).avg_spend_per_visit && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Average spend per visit</div>
                <div style={{ fontSize: 13, color: 'var(--cream)' }}>{SPEND_LABELS[(concierge as any).avg_spend_per_visit] || (concierge as any).avg_spend_per_visit}</div>
              </div>
            )}

            {gp.typical_group_size && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Typical group size</div>
                <div style={{ fontSize: 13, color: 'var(--cream)' }}>{gp.typical_group_size}</div>
              </div>
            )}

            {(concierge as any).season && (
              <div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Season</div>
                <div style={{ fontSize: 13, color: 'var(--cream)' }}>{(concierge as any).season}</div>
              </div>
            )}

            {!gp.guest_profile && !gp.guest_nationalities && !(concierge as any).avg_spend_per_visit && (
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Profile not yet completed</div>
            )}
          </div>

          {/* Languages and details */}
          <div className="card" style={{ padding: 24 }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 16 }}>Details</div>

            {languages.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Languages spoken</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {languages.map((l: string) => (
                    <span key={l} style={{ background: '#1a2a1a', border: '1px solid #2a4a2a', borderRadius: 4, padding: '3px 8px', fontSize: 10, fontFamily: 'monospace', color: '#4caf50' }}>{l}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Verification status</div>
              <div style={{ fontSize: 13, color: '#4caf50' }}>✓ Verified by ISLA</div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>ISLA tier</div>
              <div style={{ fontSize: 13, color: TIER_COLORS[tier] }}>{TIER_LABELS[tier]} Concierge</div>
            </div>
          </div>
        </div>

        {/* Booking history */}
        {allBookings.length > 0 && (
          <div className="table-card">
            <div className="table-header">
              <span className="table-title">Booking History with {venue.name}</span>
              <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{allBookings.length} referrals</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Covers</th>
                  <th>Notes</th>
                  <th>F&B Spend</th>
                  <th>Commission</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.map(b => (
                  <tr key={b.id}>
                    <td className="td-mono td-muted">{new Date(b.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="td-mono">{b.covers || '—'}</td>
                    <td className="td-muted" style={{ fontSize: 12 }}>{b.notes || '—'}</td>
                    <td className="td-mono">{b.bill_amount ? '€' + Number(b.bill_amount).toLocaleString() : '—'}</td>
                    <td className="td-mono" style={{ color: 'var(--gold)' }}>{b.commission_amount ? '€' + Number(b.commission_amount).toFixed(0) : '—'}</td>
                    <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {allBookings.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>No bookings yet between {concierge.full_name} and {venue.name}</div>
          </div>
        )}

        <ConciergeNotesPanel
          conciergeId={params.id}
          conciergeName={concierge.full_name}
          initialNotes={existingNotes}
          initialBlocked={isBlocked}
        />

      </div>
    </>
  )
}
