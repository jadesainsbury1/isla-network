import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function OpportunitiesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: venues } = await supabase
    .from('venues')
    .select('*')
    .eq('is_active', true)
    .order('commission_rate', { ascending: false })

  const allVenues = venues || []

  // Show top 3 as "hot" opportunities
  const hot = allVenues.slice(0, 3)
  const rest = allVenues.slice(3)

  return (
    <>
      <div className="topbar">
        <div className="page-title">Opportunities</div>
      </div>
      <div className="body">

        {allVenues.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">⚡</div>
            <div className="empty-state-title">No opportunities yet</div>
            <div className="empty-state-sub">Venues will appear here once they join ISLA</div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 8 }}>
              <div className="mono" style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
                🔥 Top opportunities right now
              </div>
              {hot.map(venue => (
                <div key={venue.id} className="opp-card hot">
                  <div>
                    <div className="opp-title">{venue.name}</div>
                    <div className="opp-sub">{venue.area || 'Ibiza'} · {venue.category}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span className="opp-comm">{venue.commission_rate}</span>
                    <span className="opp-basis">{venue.commission_basis}</span>
                  </div>
                </div>
              ))}
            </div>

            {rest.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
                  All venues on ISLA
                </div>
                {rest.map(venue => (
                  <div key={venue.id} className="opp-card">
                    <div>
                      <div className="opp-title">{venue.name}</div>
                      <div className="opp-sub">{venue.area || 'Ibiza'} · {venue.category}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span className="opp-comm">{venue.commission_rate}</span>
                      <span className="opp-basis">{venue.commission_basis}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
