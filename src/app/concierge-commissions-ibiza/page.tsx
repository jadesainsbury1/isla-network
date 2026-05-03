import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Track Concierge Commissions in Ibiza | ISLA Network',
  description: 'The platform built for Ibiza concierges and GRMs to track every commission, every referral, every payment. Free forever.',
}

export default function Page() {
  return (
    <div style={{ background: '#0a0908', minHeight: '100vh', color: '#d0c8b8', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ background: '#111009', borderBottom: '1px solid #2a2620', padding: '0 24px', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontSize: 10, letterSpacing: '0.3em', color: '#c9a96e', textTransform: 'uppercase', fontFamily: 'monospace', textDecoration: 'none' }}>← ISLA · The Concierge Network</Link>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/auth/signup?role=concierge" style={{ fontSize: 11, color: '#d0c8b8', fontFamily: 'monospace', textDecoration: 'none', border: '1px solid #2a2620', padding: '6px 14px', borderRadius: 4 }}>Join Free</Link>
          <Link href="/auth/signup?role=venue" style={{ fontSize: 11, color: '#0a0908', background: '#c9a96e', fontFamily: 'monospace', textDecoration: 'none', padding: '6px 14px', borderRadius: 4, fontWeight: 600 }}>List Your Venue</Link>
        </div>
      </div>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px' }}>
        <p style={{ fontSize: 10, letterSpacing: '0.3em', color: '#5a5048', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: 16 }}>ISLA · Ibiza 2026</p>
        <h1 style={{ fontSize: 36, fontWeight: 400, color: '#f2ede4', marginBottom: 24, lineHeight: 1.2 }}>Track your concierge commissions in Ibiza</h1>
        <div style={{ fontSize: 15, lineHeight: 1.8, color: '#d0c8b8' }}>
          <p>If you work as a concierge or Guest Relations Manager in Ibiza, you already know the problem. You send a client to a restaurant, a beach club, a yacht charter. The booking happens. And then — silence. No confirmation of commission. No payment timeline. No paper trail.</p>
          <p>ISLA fixes that. It's a free platform built specifically for Ibiza concierges and GRMs to log every referral, track every commission approval, and get paid without chasing anyone.</p>
          <h2>What ISLA tracks for concierges</h2>
          <ul>
            <li>Restaurant and beach club reservations</li>
            <li>Yacht charter referrals</li>
            <li>Villa rental commissions</li>
            <li>Nightclub and event bookings</li>
            <li>Spa and wellness experiences</li>
            <li>Private members club introductions</li>
          </ul>
          <p>Every referral is logged in seconds. The venue confirms it. The commission is calculated automatically. You see exactly what you're owed and when it will be paid.</p>
          <h2>Built by an Ibiza hospitality operator</h2>
          <p>ISLA was built by someone who spent years working in luxury hospitality across Ibiza, St Barths, Courchevel and beyond. The commission tracking problem exists everywhere. We started with Ibiza because that's where the network is.</p>
          <p>Free for concierges. Always.</p>
        </div>
        <div style={{ marginTop: 48, padding: '32px', background: '#161410', border: '1px solid #2a2620', borderRadius: 6, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#8a8070', marginBottom: 20 }}>Free for concierges & Guest Relations. Venues from €500/yr.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/signup?role=concierge" style={{ padding: '12px 24px', border: '1px solid #c9a96e', borderRadius: 4, color: '#c9a96e', fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}>Join Free — Concierges</Link>
            <Link href="/auth/signup?role=venue" style={{ padding: '12px 24px', background: '#c9a96e', borderRadius: 4, color: '#0a0908', fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 600 }}>List Your Venue</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
