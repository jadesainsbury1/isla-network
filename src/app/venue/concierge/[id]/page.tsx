import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

interface Props { params: Promise<{ id: string }>; searchParams: Promise<{ from?: string }> }

export default async function ConciergeProfilePage({ params, searchParams }: Props) {
  const { id } = await params
  const sp = await searchParams
  const backHref = sp?.from ? `/venue/dashboard?venue=${sp.from}` : '/venue/dashboard'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Get all venues for this user; pick the one from ?from= or first
  const { data: venues } = await supabase
    .from('venues')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  const allVenues = venues || []
  const venue = (sp?.from && allVenues.find(v => v.id === sp.from)) || allVenues[0] || null

  if (!venue) redirect('/venue/dashboard')

  // Get concierge profile
  const { data: concierge } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, concierge_tier')
    .eq('id', id)
    .single()

  // Get all bookings between this concierge and this venue
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('venue_id', venue.id)
    .eq('concierge_id', id)
    .order('date', { ascending: false })

  const all = bookings || []
  const totalBookings = all.length
  const totalCovers = all.reduce((s: number, b: any) => s + (Number(b.covers) || 0), 0)
  const totalRevenue = all.reduce((s: number, b: any) => s + (Number(b.bill_amount) || 0), 0)
  const totalCommission = all.reduce((s: number, b: any) => s + (Number(b.commission_amount) || 0), 0)
  const avgSpend = totalBookings > 0 ? totalRevenue / totalBookings : 0
  const avgPerCover = totalCovers > 0 ? totalRevenue / totalCovers : 0
  const fmt = (n: number) => 'EUR ' + Number(n).toLocaleString('en-GB', { maximumFractionDigits: 0 })

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: 32 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Link href={backHref} style={{ color: 'var(--muted)', fontSize: 12, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none' }}>
          &larr; Back to dashboard
        </Link>

        <div style={{ marginTop: 24, marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>Concierge Profile</div>
          <h1 style={{ fontSize: 32, color: 'var(--cream)', fontFamily: 'Georgia, serif', fontWeight: 300, marginBottom: 8 }}>{concierge?.full_name || 'Unknown'}</h1>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>
            {concierge?.email && <span>{concierge.email}</span>}
            {concierge?.concierge_tier && <span style={{ marginLeft: 12, padding: '2px 8px', border: '1px solid var(--gold)', borderRadius: 3, color: 'var(--gold)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{concierge.concierge_tier}</span>}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div style={{ background: 'var(--charcoal)', border: '1px solid #2a2620', borderRadius: 8, padding: 20 }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Bookings</div>
            <div style={{ fontSize: 28, color: 'var(--cream)', marginTop: 4, fontFamily: 'Georgia, serif' }}>{totalBookings}</div>
          </div>
          <div style={{ background: 'var(--charcoal)', border: '1px solid #2a2620', borderRadius: 8, padding: 20 }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Total Covers</div>
            <div style={{ fontSize: 28, color: 'var(--cream)', marginTop: 4, fontFamily: 'Georgia, serif' }}>{totalCovers}</div>
          </div>
          <div style={{ background: 'var(--charcoal)', border: '1px solid #2a2620', borderRadius: 8, padding: 20 }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Total Revenue</div>
            <div style={{ fontSize: 28, color: 'var(--gold)', marginTop: 4, fontFamily: 'Georgia, serif' }}>{fmt(totalRevenue)}</div>
          </div>
          <div style={{ background: 'var(--charcoal)', border: '1px solid #2a2620', borderRadius: 8, padding: 20 }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Avg Booking</div>
            <div style={{ fontSize: 28, color: 'var(--cream)', marginTop: 4, fontFamily: 'Georgia, serif' }}>{fmt(avgSpend)}</div>
          </div>
          <div style={{ background: 'var(--charcoal)', border: '1px solid #2a2620', borderRadius: 8, padding: 20 }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Avg / Cover</div>
            <div style={{ fontSize: 28, color: 'var(--cream)', marginTop: 4, fontFamily: 'Georgia, serif' }}>{fmt(avgPerCover)}</div>
          </div>
          <div style={{ background: 'var(--charcoal)', border: '1px solid var(--gold)', borderRadius: 8, padding: 20 }}>
            <div style={{ fontSize: 10, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Commission Earned</div>
            <div style={{ fontSize: 28, color: 'var(--gold)', marginTop: 4, fontFamily: 'Georgia, serif' }}>{fmt(totalCommission)}</div>
          </div>
        </div>

        {/* Booking history */}
        <div style={{ background: 'var(--charcoal)', border: '1px solid #2a2620', borderRadius: 8, padding: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>Booking History</div>
          {all.length === 0 ? (
            <div style={{ color: 'var(--muted)', fontSize: 13, padding: 24, textAlign: 'center' }}>No bookings yet from this concierge.</div>
          ) : (
            <table style={{ width: '100%', fontSize: 12 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--muted)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  <th style={{ padding: '8px 0' }}>Date</th>
                  <th>Guest</th>
                  <th>Covers</th>
                  <th>F&amp;B</th>
                  <th>Ticket</th>
                  <th>Commission</th>
                </tr>
              </thead>
              <tbody>
                {all.map((b: any) => (
                  <tr key={b.id} style={{ borderTop: '1px solid #1e1e1e', color: 'var(--cream)' }}>
                    <td style={{ padding: '10px 0', fontFamily: 'monospace', color: 'var(--gold)' }}>{new Date(b.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td>{b.guest_profile?.guest_name || '—'}</td>
                    <td style={{ fontFamily: 'monospace' }}>{b.covers || '—'}</td>
                    <td style={{ fontFamily: 'monospace' }}>{b.bill_amount ? fmt(Number(b.bill_amount)) : '—'}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--muted)' }}>{b.ticket_number || '—'}</td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--gold)', fontWeight: 600 }}>{b.commission_amount ? fmt(Number(b.commission_amount)) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
