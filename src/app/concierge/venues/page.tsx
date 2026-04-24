import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const CATEGORY_EMOJI: Record<string, string> = {
  'Restaurant': '🍽',
  'Beach Club': '🌅',
  'Yacht Charter': '🛥',
  'Nightclub': '🎵',
  'Villa Rental': '🏡',
  'Private Chef': '👨‍🍳',
  'Wellness': '🧘',
  'Experience': '✨',
}

const CATEGORY_ORDER = [
  'Restaurant',
  'Beach Club', 
  'Yacht Charter',
  'Nightclub',
  'Villa Rental',
  'Private Chef',
  'Wellness',
  'Experience',
]

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

  const grouped: Record<string, typeof allVenues> = {}
  for (const venue of allVenues) {
    const cat = venue.category || 'Other'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(venue)
  }

  const categories = [
    ...CATEGORY_ORDER.filter(c => grouped[c]),
    ...Object.keys(grouped).filter(c => !CATEGORY_ORDER.includes(c))
  ]

  function dots(n: number) {
    return Array.from({ length: 5 }, (_, i) => (
      <div key={i} className={`rel-dot${i < n ? (n >= 4 ? ' on' : ' warn') : ''}`} />
    ))
  }

  function refNum(venueId: string) {
    const date = new Date()
    const yy = date.getFullYear()
    const short = venueId.slice(-4).toUpperCase()
    const rand = Math.floor(Math.random() * 9000) + 1000
    return `ISLA-${yy}-${short}-${rand}`
  }

  function waLink(venue: any, ref: string) {
    const contact = venue.contact || ''
    const phoneMatch = contact.match(/\+[\d\s]{8,15}/)
    const phone = phoneMatch ? phoneMatch[0].replace(/\s/g, '') : ''
    const msg = encodeURIComponent(
      `Hi, this is an ISLA verified concierge referral.\n\nVenue: ${venue.name}\nRef: ${ref}\n\nPlease confirm this booking and reply with CONFIRMED or CANCELLED.\n\nThank you.`
    )
    if (phone) {
      return `https://wa.me/${phone.replace('+', '')}?text=${msg}`
    }
    return `https://wa.me/?text=${msg}`
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
            <div className="empty-state-sub">ISLA venues will appear here once verified</div>
          </div>
        ) : (
          <>
            {categories.map(category => (
              <div key={category} style={{ marginBottom: 40 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 16,
                  paddingBottom: 10,
                  borderBottom: '1px solid var(--border)'
                }}>
                  <span style={{ fontSize: 20 }}>{CATEGORY_EMOJI[category] || '🏛'}</span>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    fontWeight: 600
                  }}>{category}</span>
                  <span style={{
                    fontSize: 11,
                    color: 'var(--muted)',
                    marginLeft: 4
                  }}>· {grouped[category].length} {grouped[category].length === 1 ? 'venue' : 'venues'}</span>
                </div>

                <div className="venue-grid">
                  {grouped[category].map(venue => {
                    const ref = refNum(venue.id)
                    const wa = waLink(venue, ref)
                    return (
                      <div key={venue.id} className="venue-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                          <div style={{ fontSize: 28 }}>{CATEGORY_EMOJI[venue.category] || '🏛'}</div>
                          {venue.is_verified && (
                            <span className="badge badge-confirmed" style={{ fontSize: 10 }}>✓ Verified</span>
                          )}
                        </div>

                        <div className="venue-card-name">{venue.name}</div>

                        {venue.area && (
                          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2, marginBottom: 8 }}>
                            📍 {venue.area}
                          </div>
                        )}

                        <div className="venue-comm-row">
                          <span className="vcr-label">Your rate</span>
                          <span className="vcr-val">{venue.commission_rate}</span>
                        </div>

                        {venue.commission_basis && (
                          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>
                            Basis: {venue.commission_basis}
                          </div>
                        )}

                        {venue.booking_instructions && (
                          <div style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic', marginBottom: 8, lineHeight: 1.5 }}>
                            {venue.booking_instructions}
                          </div>
                        )}

                        {venue.contact && (
                          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>
                            Contact: {venue.contact}
                          </div>
                        )}

                        <div className="venue-reliability" style={{ marginBottom: 12 }}>
                          <span className="rel-label">Pays on time:</span>
                          <div className="rel-dots">{dots(5)}</div>
                        </div>

                        
                          href={wa}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '10px 0',
                            background: 'var(--gold)',
                            color: 'var(--ink)',
                            fontFamily: 'monospace',
                            fontSize: 11,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                            textDecoration: 'none',
                            borderRadius: 4,
                            fontWeight: 600,
                            marginBottom: 6
                          }}
                        >
                          Refer Now →
                        </a>

                        <div style={{
                          fontSize: 9,
                          color: 'var(--muted)',
                          fontFamily: 'monospace',
                          letterSpacing: '0.1em',
                          textAlign: 'center'
                        }}>
                          Ref: {ref}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  )
}