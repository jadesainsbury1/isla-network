import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function OpportunitiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: venues } = await supabase
    .from('venues')
    .select('*')
    .eq('is_active', true)
    .order('commission_rate', { ascending: false })

  const allVenues = venues || []
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
            <div style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
              🔥 Top opportunities right now
            </div>
            {hot.map(venue => (
              <div key={venue.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--card)', border: '1px solid var(--gold)', borderRadius: 8, marginBottom: 8, gap: 16 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{venue.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{venue.area || 'Ibiza'} · {venue.category}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--gold)', fontFamily: 'Georgia, serif', lineHeight: 1 }}>{venue.commission_rate}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace', marginTop: 3 }}>{venue.commission_basis}</div>
                </div>
              </div>
            ))}

            {rest.length > 0 && (
              <>
                <div style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12, marginTop: 24 }}>
                  All venues on ISLA
                </div>
                {rest.map(venue => (
                  <div key={venue.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 8, gap: 16 }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{venue.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{venue.area || 'Ibiza'} · {venue.category}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--gold)', fontFamily: 'Georgia, serif', lineHeight: 1 }}>{venue.commission_rate}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace', marginTop: 3 }}>{venue.commission_basis}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}