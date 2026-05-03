import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Track Concierge Bookings Ibiza | ISLA Network',
  description: 'Log, confirm and pay concierge referrals in one place. Built for Ibiza hospitality venues and GRM professionals.',
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
        <h1 style={{ fontSize: 36, fontWeight: 400, color: '#f2ede4', marginBottom: 24, lineHeight: 1.2 }}>Track every concierge booking in Ibiza</h1>
        <div style={{ fontSize: 15, lineHeight: 1.8, color: '#d0c8b8' }}>
          <p>Concierge bookings in Ibiza have always been managed the same way — a WhatsApp message, a handshake, a brown envelope at the end of the season. No record. No transparency. No protection for either side.</p>
          <p>ISLA is the first platform built to track concierge bookings properly. Concierges log referrals in seconds. Venues confirm them. Commissions are calculated and paid through the platform.</p>
          <h2>The booking flow</h2>
          <ul>
            <li>Concierge logs a referral — venue, guest name, date, covers</li>
            <li>Venue receives a notification and confirms the booking</li>
            <li>After the visit, the venue submits the bill amount</li>
            <li>Commission is calculated automatically at the agreed rate</li>
            <li>Payment is tracked and confirmed through ISLA</li>
          </ul>
          <h2>Why Ibiza hospitality professionals use ISLA</h2>
          <p>The Ibiza season is short and intense. Concierges are managing dozens of client requests simultaneously across restaurants, beach clubs, yacht charters and villa rentals. ISLA gives them one place to track all of it — and ensures they never lose a commission because something got lost in a WhatsApp thread.</p>
          <p>For venues, ISLA means full visibility on which concierges are driving real revenue — and the ability to protect those relationships even when the team changes.</p>
          <p>Free for concierges. Venues from €500/yr.</p>
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
