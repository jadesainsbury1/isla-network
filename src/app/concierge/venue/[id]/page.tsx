import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const TIER_COLORS: Record<string, string> = {
  elite: '#fff',
  preferred: '#C9A96E',
  verified: '#888',
}

export default async function VenueProfilePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'concierge') redirect('/concierge/revenue')

  const { data: venue } = await supabase
    .from('venues')
    .select('*')
    .eq('id', params.id)
    .eq('is_active', true)
    .single()

  if (!venue) redirect('/concierge/revenue')

  const packages = (venue as any).packages || []
  const menuUrl = (venue as any).menu_url || null
  const menuPdfUrl = (venue as any).menu_pdf_url || null

  return (
    <>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/concierge/revenue" style={{ color: 'var(--muted)', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.1em', textDecoration: 'none' }}>← My Referrals</a>
          <span style={{ color: 'var(--border)' }}>·</span>
          <div className="page-title">{venue.name}</div>
        </div>
      </div>
      <div className="body">

        {/* Header */}
        <div className="card" style={{ marginBottom: 24, padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--cream)', marginBottom: 4 }}>{venue.name}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{venue.category} · {venue.area}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace', marginBottom: 4 }}>Commission</div>
              <div style={{ fontSize: 18, color: 'var(--gold)', fontWeight: 600 }}>{venue.commission_rate}</div>
              <div style={{ fontSize: 10, color: '#555', fontFamily: 'monospace' }}>{venue.commission_basis}</div>
            </div>
          </div>

          {venue.description && (
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              {venue.description}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

          {/* Booking info */}
          <div className="card" style={{ padding: 24 }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 16 }}>Booking Details</div>
            {venue.booking_instructions && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>How to book</div>
                <div style={{ fontSize: 13, color: 'var(--cream)', lineHeight: 1.6 }}>{venue.booking_instructions}</div>
              </div>
            )}
            {venue.min_spend && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Minimum spend</div>
                <div style={{ fontSize: 13, color: 'var(--cream)' }}>€{venue.min_spend.toLocaleString()}</div>
              </div>
            )}
            {venue.dress_code && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Dress code</div>
                <div style={{ fontSize: 13, color: 'var(--cream)' }}>{venue.dress_code}</div>
              </div>
            )}
            {venue.seasonal_notes && (
              <div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Season notes</div>
                <div style={{ fontSize: 13, color: 'var(--cream)', lineHeight: 1.6 }}>{venue.seasonal_notes}</div>
              </div>
            )}
          </div>

          {/* Menu & contact */}
          <div className="card" style={{ padding: 24 }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 16 }}>Menus & Info</div>
            {menuUrl && (
              <div style={{ marginBottom: 14 }}>
                <a href={menuUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--charcoal)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 16px', color: 'var(--gold)', textDecoration: 'none', fontSize: 12, fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                  ↗ View Menu
                </a>
              </div>
            )}
            {menuPdfUrl && (
              <div style={{ marginBottom: 14 }}>
                <a href={menuPdfUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--charcoal)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 16px', color: 'var(--cream)', textDecoration: 'none', fontSize: 12, fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                  ↓ Download Menu PDF
                </a>
              </div>
            )}
            {venue.contact && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Direct contact</div>
                <div style={{ fontSize: 13, color: 'var(--cream)', fontFamily: 'monospace' }}>{venue.contact}</div>
              </div>
            )}
            {venue.website && (
              <div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Website</div>
                <a href={venue.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: 'var(--gold)', fontFamily: 'monospace' }}>{venue.website}</a>
              </div>
            )}
            {!menuUrl && !menuPdfUrl && !venue.contact && (
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>No menu added yet</div>
            )}
          </div>
        </div>

        {/* Packages */}
        {packages.length > 0 && (
          <div className="card" style={{ padding: 24, marginBottom: 24 }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 16 }}>Packages & Offers</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
              {packages.map((pkg: any) => (
                <div key={pkg.id} style={{ background: 'var(--charcoal)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ fontSize: 13, color: 'var(--cream)', fontWeight: 500 }}>{pkg.name}</div>
                    <span style={{ background: '#1a1a2a', border: '1px solid #2a2a4a', borderRadius: 3, padding: '2px 6px', fontSize: 9, fontFamily: 'monospace', color: '#888', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{pkg.type}</span>
                  </div>
                  {pkg.description && <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8, lineHeight: 1.5 }}>{pkg.description}</div>}
                  <div style={{ display: 'flex', gap: 12 }}>
                    {pkg.price && <span style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--gold)', fontWeight: 600 }}>€{pkg.price}</span>}
                    {pkg.min_spend && <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#666' }}>Min €{pkg.min_spend}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  )
}
