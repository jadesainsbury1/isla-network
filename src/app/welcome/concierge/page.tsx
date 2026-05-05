import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ConciergeWelcomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, is_approved, founding_member_unlocked')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'concierge') redirect('/auth/login')
  if (!profile?.is_approved) redirect('/pending')
  if (profile?.founding_member_unlocked) redirect('/concierge/revenue')

  const launchDate = new Date('2026-06-01T00:00:00')
  const today = new Date()
  const daysToLaunch = Math.max(0, Math.ceil((launchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f2ede4', fontFamily: 'Helvetica, sans-serif', padding: '32px 20px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Link href="/" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 26, color: '#c9a96e', textDecoration: 'none', letterSpacing: '0.05em' }}>
            ISLA
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', border: '1px solid #c9a96e', borderRadius: 999, color: '#c9a96e', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            ★ Founding Concierge · Approved
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 34, lineHeight: 1.15, margin: '0 0 8px', color: '#f2ede4' }}>
            Welcome, {profile?.full_name?.split(' ')[0] || 'Concierge'}.
          </h1>
          <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 26, color: '#c9a96e', margin: 0 }}>
            You are in.
          </h2>
        </div>

        <div style={{ background: '#1a1410', border: '1px solid #c9a96e', borderRadius: 8, padding: 24, textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', color: '#8a8070', textTransform: 'uppercase', marginBottom: 10 }}>Network Opens</div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 30, color: '#c9a96e', marginBottom: 4 }}>1 June 2026</div>
          <div style={{ fontSize: 12, color: '#8a8070' }}>{daysToLaunch} days · Ibiza season launch</div>
        </div>

        <div style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#c5bfb5', margin: 0 }}>
            ISLA is launching the 2026 season with a curated network of verified concierges and founding venues. We are onboarding everyone in parallel so that on opening day, the network is alive.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#c5bfb5', marginTop: 14 }}>
            On 1 June, the full venue directory unlocks and you can start logging bookings. Until then —
          </p>
        </div>

        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: 16 }}>While you wait</div>

          {[
            { num: '01', title: 'Tell us your favourite venues', sub: 'We will prioritise getting them on ISLA', href: 'mailto:hello@islanetwork.es?subject=Venue%20Recommendations' },
            { num: '02', title: 'Refer a concierge friend', sub: 'Founding membership · skip the queue', href: 'mailto:hello@islanetwork.es?subject=Concierge%20Referral' },
            { num: '03', title: '15-min call with Jade', sub: 'Direct line to the founder', href: 'mailto:hello@islanetwork.es?subject=Concierge%20Onboarding%20Call' },
            { num: '04', title: 'Follow @islanetwork.es', sub: 'Launch updates and new venues', href: 'https://instagram.com/islanetwork.es' },
          ].map((item) => (
            <a key={item.num} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} style={{ display: 'block', padding: '18px 20px', background: '#1a1410', border: '1px solid #2a2620', borderRadius: 6, marginBottom: 10, textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 16, color: '#c9a96e', minWidth: 28 }}>{item.num}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f2ede4', marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: '#8a8070' }}>{item.sub}</div>
                </div>
                <span style={{ color: '#c9a96e', fontSize: 16 }}>→</span>
              </div>
            </a>
          ))}
        </div>

        <div style={{ background: '#1a1410', border: '1px solid #2a2620', borderRadius: 8, padding: 24, marginBottom: 36 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: 14 }}>Your Founding Benefits</div>
          {[
            'Free for life. Always.',
            'First access to all venues at launch',
            'Priority placement in venue directory',
            'Direct line to the founding team',
            'Your feedback shapes the product',
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
              <span style={{ color: '#6abb7a', fontWeight: 700, marginTop: 1, fontSize: 13 }}>✓</span>
              <span style={{ fontSize: 13, color: '#c5bfb5' }}>{b}</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', paddingTop: 28, borderTop: '1px solid #2a2620' }}>
          <p style={{ fontSize: 12, color: '#8a8070', margin: '0 0 14px' }}>
            Questions? <a href="mailto:hello@islanetwork.es" style={{ color: '#c9a96e' }}>hello@islanetwork.es</a>
          </p>
          <form action="/auth/signout" method="post" style={{ display: 'inline' }}>
            <button type="submit" style={{ background: 'transparent', border: 'none', color: '#5a5048', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
              Sign out
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
