import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function VenueWelcomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: venue } = await supabase
    .from('venues')
    .select('name, founding_member_unlocked')
    .eq('user_id', user.id)
    .single()

  if (venue?.founding_member_unlocked) redirect('/venue/dashboard')

  const launchDate = new Date('2026-06-01T00:00:00')
  const today = new Date()
  const daysToLaunch = Math.max(0, Math.ceil((launchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f2ede4', fontFamily: 'Helvetica, sans-serif', padding: '40px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Link href="/" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 28, color: '#c9a96e', textDecoration: 'none', letterSpacing: '0.05em' }}>
            ISLA
          </Link>
        </div>

        {/* Founding Member Badge */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-block', padding: '6px 18px', border: '1px solid #c9a96e', borderRadius: 999, color: '#c9a96e', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            ★ Founding Venue · Approved
          </div>
        </div>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 44, lineHeight: 1.1, margin: '0 0 8px', color: '#f2ede4' }}>
            Welcome, {venue?.name || 'Founding Venue'}.
          </h1>
          <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 32, color: '#c9a96e', margin: 0 }}>
            You are in.
          </h2>
        </div>

        {/* Countdown */}
        <div style={{ background: '#1a1410', border: '1px solid #c9a96e', borderRadius: 8, padding: 32, textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', color: '#8a8070', textTransform: 'uppercase', marginBottom: 12 }}>Network Opens</div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 36, color: '#c9a96e', marginBottom: 4 }}>1 June 2026</div>
          <div style={{ fontSize: 13, color: '#8a8070' }}>{daysToLaunch} days · Ibiza season launch</div>
        </div>

        {/* Why we are doing this */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#c5bfb5', margin: 0 }}>
            ISLA is launching the 2026 season with a curated network of founding venues and verified concierges. We are onboarding everyone in parallel so that on opening day, the network is alive — not empty.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#c5bfb5', marginTop: 16 }}>
            On 1 June, your dashboard activates and the full concierge directory unlocks. Until then, here is what you can do to prepare.
          </p>
        </div>

        {/* Action items */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: 20 }}>While you wait</div>

          {[
            { num: '01', title: 'Complete your venue profile', sub: 'Booking instructions, packages, contact details', href: 'mailto:hello@islanetwork.es?subject=Founding%20Venue%20Profile%20-%20' + encodeURIComponent(venue?.name || '') },
            { num: '02', title: 'Schedule a 15-minute onboarding call', sub: 'Direct line to Jade — founder', href: 'mailto:hello@islanetwork.es?subject=Founding%20Venue%20Call%20-%20' + encodeURIComponent(venue?.name || '') },
            { num: '03', title: 'Refer a concierge or GRM you trust', sub: 'Skip the queue · founding members get priority', href: 'mailto:hello@islanetwork.es?subject=Concierge%20Referral' },
            { num: '04', title: 'Follow @islanetwork.es', sub: 'Launch updates · founding member features', href: 'https://instagram.com/islanetwork.es' },
          ].map((item) => (
            <a key={item.num} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} style={{ display: 'block', padding: '20px 24px', background: '#1a1410', border: '1px solid #2a2620', borderRadius: 6, marginBottom: 12, textDecoration: 'none', transition: 'border-color 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 18, color: '#c9a96e', minWidth: 32 }}>{item.num}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#f2ede4', marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: '#8a8070' }}>{item.sub}</div>
                </div>
                <span style={{ color: '#c9a96e', fontSize: 18 }}>→</span>
              </div>
            </a>
          ))}
        </div>

        {/* Founding member benefits */}
        <div style={{ background: '#1a1410', border: '1px solid #2a2620', borderRadius: 8, padding: 28, marginBottom: 48 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: 16 }}>Your Founding Member Benefits</div>
          {[
            'Locked pricing for as long as you remain on ISLA',
            'Priority placement in the concierge directory',
            'First access to bookings on opening day',
            'Direct line to the founding team',
            'Shape the product — your feedback ships',
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
              <span style={{ color: '#6abb7a', fontWeight: 700, marginTop: 2 }}>✓</span>
              <span style={{ fontSize: 14, color: '#c5bfb5' }}>{b}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', paddingTop: 32, borderTop: '1px solid #2a2620' }}>
          <p style={{ fontSize: 13, color: '#8a8070', margin: '0 0 16px' }}>
            Questions? Reply directly to <a href="mailto:hello@islanetwork.es" style={{ color: '#c9a96e' }}>hello@islanetwork.es</a>
          </p>
          <form action="/auth/signout" method="post" style={{ display: 'inline' }}>
            <button type="submit" style={{ background: 'transparent', border: 'none', color: '#5a5048', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
              Sign out
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
