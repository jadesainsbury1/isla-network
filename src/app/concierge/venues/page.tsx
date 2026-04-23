import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function VenuesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: venues } = await supabase
    .from('venues')
    .select('*')
    .eq('is_active', true)
    .order('name')

  const allVenues = venues || []

  function dots(n: number) {
    return Array.from({ length: 5 }, (_, i) => (
      <div key={i} className={`rel-dot${i < n ? (n >= 4 ? ' on' : ' warn') : ''}`} />
    ))
  }

  return (
    <>
      <div className="topbar">
        <div className="page-title">All Venues</div>
      </div>
      <div className="body">
        {allVenues.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🗺</div>
            <div className="empty-state-title">No venues listed yet</div>
            <div className="empty-state-sub">ISLA venues will appear here once they&apos;re verified</div>
          </div>
        ) : (
          <div className="venue-grid">
            {allVenues.map(venue => (
              <div key={venue.id} className="venue-card">
                <div style={{ fontSize: 28, marginBottom: 8 }}>
                  {CATEGORY_EMOJI[venue.category] || '🏛'}
                </div>
                <div className="venue-card-name">{venue.name}</div>
                <div className="venue-card-type">{venue.category} · {venue.area || 'Ibiza'}</div>
                {venue.area && <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>📍 {venue.area}</div>}
                <div className="venue-comm-row">
                  <span className="vcr-label">Your rate</span>
                  <span className="vcr-val">{venue.commission_rate}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>
                  {venue.booking_instructions && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, fontStyle: 'italic' }}>{venue.booking_instructions}</div>}
                  Basis: {venue.commission_basis}
                </div>
                {venue.contact && (
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>
                    Contact: {venue.contact}
                  </div>
                )}
                <div className="venue-reliability">
                  <span className="rel-label">Pays on time:</span>
                  <div className="rel-dots">{dots(5)}</div>
                </div>
                {venue.is_verified && (
                  <div style={{ marginTop: 10 }}>
                    <span className="badge badge-confirmed">✓ ISLA Verified</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

const CATEGORY_EMOJI: Record<string, string> = {
  Restaurant: '🍽',
  'Beach Club': '🌅',
  Charter: '🛥',
  Nightclub: '🍒',
  Wellness: '🧘',
  Steakhouse: '🥩',
  Catamaran: '⛵',
  Hotel: '🏨',
}
