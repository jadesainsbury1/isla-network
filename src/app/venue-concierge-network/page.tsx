import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Venue Concierge Network Ibiza | Commission Tracking | ISLA',
  description: 'Connect your venue with verified Ibiza concierges and GRMs. Track every referral commission automatically. From €500/yr.',
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
        <h1 style={{ fontSize: 36, fontWeight: 400, color: '#f2ede4', marginBottom: 24, lineHeight: 1.2 }}>The concierge network built for Ibiza venues</h1>
        <div style={{ fontSize: 15, lineHeight: 1.8, color: '#d0c8b8' }}>
          <p>Every season, Ibiza venues lose their best concierge relationships when a GRM moves on. The contacts live in a personal phone. The commission history disappears. The next person starts from zero.</p>
          <p>ISLA gives your venue a permanent concierge network that belongs to the business — not the staff member running it.</p>
          <h2>What ISLA does for venues</h2>
          <ul>
            <li>Every verified concierge and GRM in Ibiza can find and refer your venue</li>
            <li>Referrals are tracked automatically — no spreadsheets, no WhatsApp chains</li>
            <li>Commission rates are agreed upfront and stored in the platform</li>
            <li>You see exactly who sends your best clients and how much revenue they drive</li>
            <li>When a GRM leaves, nothing is lost</li>
          </ul>
          <h2>Works across all venue types</h2>
          <p>ISLA is not just for restaurants. It works for beach clubs, yacht charters, villa rentals, nightclubs, spas, private members clubs, hotel experiences and more. Any business that pays concierge commission can list on ISLA.</p>
          <p>Founding venue listings from €500/yr. Limited places.</p>
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
