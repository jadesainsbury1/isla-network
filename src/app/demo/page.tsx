'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const DEMO_CONCIERGE_ID = '00000000-0000-0000-0000-000000000001'
const DEMO_VENUE_ID = '00000000-0000-0000-0000-000000000010'

type Booking = {
  id: string
  date: string
  covers: number
  notes: string
  status: string
  estimated_commission: number
  actual_commission: number
  venues?: { name: string }
}

type Venue = {
  id: string
  name: string
  category: string
  area: string
  commission_rate: string
  commission_basis: string
  contact: string
  booking_instructions: string
  is_verified: boolean
}

type Profile = {
  full_name: string
  property: string
}

export default function DemoPage() {
  const [view, setView] = useState<'concierge' | 'venue'>('concierge')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [venue, setVenue] = useState<Venue | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      setLoading(true)
      const { data: profileData } = await supabase.from('profiles').select('full_name, property').eq('id', DEMO_CONCIERGE_ID).single()
      const { data: bookingData } = await supabase.from('bookings').select('*, venues(name)').eq('concierge_id', DEMO_CONCIERGE_ID).order('date', { ascending: false })
      const { data: venueData } = await supabase.from('venues').select('*').eq('id', DEMO_VENUE_ID).single()
      if (profileData) setProfile(profileData)
      if (bookingData) setBookings(bookingData)
      if (venueData) setVenue(venueData)
      setLoading(false)
    }
    load()
  }, [])

  const totalOwed = bookings.filter(b => b.status !== 'paid').reduce((s, b) => s + (b.estimated_commission || 0), 0)
  const confirmed = bookings.filter(b => b.status === 'paid').reduce((s, b) => s + (b.actual_commission || 0), 0)
  const overdue = bookings.filter(b => b.status === 'overdue').reduce((s, b) => s + (b.estimated_commission || 0), 0)
  const totalCovers = bookings.reduce((s, b) => s + (b.covers || 0), 0)
  const totalPaid = bookings.filter(b => b.status === 'paid').reduce((s, b) => s + (b.actual_commission || 0), 0)

  const statusColour = (s: string) => {
    if (s === 'paid') return { bg: '#3A6A4A22', border: '#3A6A4A44', text: '#6ABB7A' }
    if (s === 'overdue') return { bg: '#8A2A1A22', border: '#8A2A1A44', text: '#C05A3A' }
    return { bg: '#B8944A22', border: '#B8944A44', text: '#D4AC62' }
  }

  const card: React.CSSProperties = { background: '#1E1C18', borderRadius: 8, padding: 24 }

  return (
    <div style={{ background: '#12100E', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif', color: '#F5EFE6' }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet" />

      <div style={{ borderBottom: '1px solid #2A2620', padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, letterSpacing: '0.2em', color: '#B8944A' }}>ISLA</div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, letterSpacing: '0.3em', color: '#5A5048', textTransform: 'uppercase' as const }}>The Concierge Network</div>
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.3em', color: '#B8944A', textTransform: 'uppercase' as const, background: '#B8944A11', border: '1px solid #B8944A33', padding: '6px 16px' }}>
          Live Demo — No Login Required
        </div>
        <a href="/" style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.15em', color: '#7A7068', textTransform: 'uppercase' as const, textDecoration: 'none' }}>Back to ISLA</a>
      </div>

      <div style={{ textAlign: 'center', padding: '48px 24px 32px' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.4em', color: '#B8944A', textTransform: 'uppercase' as const, marginBottom: 12 }}>Interactive Platform Demo</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 300, lineHeight: 1, marginBottom: 16, color: '#F5EFE6' }}>
          See exactly how ISLA works.
        </h1>
        <p style={{ color: '#9A8E82', fontSize: 15, maxWidth: 480, margin: '0 auto 32px' }}>Real data. Real dashboards. Toggle between the concierge view and the venue view.</p>
        <div style={{ display: 'inline-flex', border: '1px solid #2A2620', overflow: 'hidden' }}>
          <button onClick={() => setView('concierge')} style={{ padding: '12px 32px', fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' as const, cursor: 'pointer', border: 'none', background: view === 'concierge' ? '#B8944A' : 'transparent', color: view === 'concierge' ? '#12100E' : '#7A7068', fontWeight: view === 'concierge' ? 500 : 400, transition: 'all 0.2s' }}>Concierge View</button>
          <button onClick={() => setView('venue')} style={{ padding: '12px 32px', fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' as const, cursor: 'pointer', border: 'none', borderLeft: '1px solid #2A2620', background: view === 'venue' ? '#B8944A' : 'transparent', color: view === 'venue' ? '#12100E' : '#7A7068', fontWeight: view === 'venue' ? 500 : 400, transition: 'all 0.2s' }}>Venue View</button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#5A5048', fontFamily: 'DM Mono, monospace', fontSize: 11, letterSpacing: '0.2em' }}>Loading...</div>
        ) : view === 'concierge' ? (
          <ConciergeView profile={profile} bookings={bookings} totalOwed={totalOwed} confirmed={confirmed} overdue={overdue} statusColour={statusColour} card={card} />
        ) : (
          <VenueView venue={venue} bookings={bookings} totalCovers={totalCovers} totalPaid={totalPaid} statusColour={statusColour} card={card} />
        )}
      </div>

      <div style={{ background: '#1E1C18', borderTop: '1px solid #2A2620', padding: '48px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 300, color: '#F5EFE6', marginBottom: 12 }}>Ready to start tracking?</h2>
        <p style={{ color: '#9A8E82', marginBottom: 28, fontSize: 14 }}>Free for concierges. Always. Venues from €500/yr.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' as const }}>
          <a href="/auth/signup" style={{ padding: '14px 36px', background: '#B8944A', color: '#12100E', fontFamily: 'DM Mono, monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' as const, textDecoration: 'none', fontWeight: 500 }}>Join Free as Concierge</a>
          <a href="mailto:hello@islanetwork.es" style={{ padding: '14px 28px', background: 'transparent', color: '#9A9088', fontFamily: 'DM Mono, monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' as const, textDecoration: 'none', border: '1px solid #5A5048' }}>List Your Venue</a>
        </div>
      </div>
    </div>
  )
}

function ConciergeView({ profile, bookings, totalOwed, confirmed, overdue, statusColour, card }: any) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, padding: '16px 20px', background: '#1E1C18', borderRadius: 8 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#B8944A22', border: '1px solid #B8944A44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif', fontSize: 18, color: '#B8944A' }}>{profile?.full_name?.[0] ?? 'S'}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#F2EDE4' }}>{profile?.full_name ?? 'Sofia Reyes'}</div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.15em', color: '#6A6058', textTransform: 'uppercase' as const }}>{profile?.property ?? 'Cap Rocat Hotel'} · Verified Concierge</div>
        </div>
        <div style={{ marginLeft: 'auto', padding: '3px 10px', background: '#3A6A4A22', border: '1px solid #3A6A4A44', fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#6ABB7A', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Verified</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 24 }}>
        {[{ label: 'Total Owed', val: `€${totalOwed}`, col: '#B8944A' }, { label: 'Confirmed Paid', val: `€${confirmed}`, col: '#6ABB7A' }, { label: 'Overdue', val: `€${overdue}`, col: '#C05A3A' }].map(s => (
          <div key={s.label} style={{ ...card, textAlign: 'center' as const }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, color: s.col, fontWeight: 300, lineHeight: 1, marginBottom: 6 }}>{s.val}</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.15em', color: '#6A6058', textTransform: 'uppercase' as const }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={card}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.25em', color: '#7A7068', textTransform: 'uppercase' as const, marginBottom: 16 }}>My Bookings</div>
        {bookings.map((b: any) => {
          const c = statusColour(b.status)
          return (
            <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#242018', borderRadius: 4, marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 13, color: '#F2EDE4', fontWeight: 500, marginBottom: 2 }}>{b.venues?.name ?? 'Nobu Ibiza Bay'}</div>
                <div style={{ fontSize: 11, color: '#7A7068' }}>{b.date} · {b.covers} covers · {b.notes}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: c.text, fontWeight: 300 }}>€{b.actual_commission ?? b.estimated_commission}</span>
                <span style={{ padding: '2px 8px', background: c.bg, border: `1px solid ${c.border}`, fontFamily: 'DM Mono, monospace', fontSize: 9, color: c.text, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>{b.status}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function VenueView({ venue, bookings, totalCovers, totalPaid, statusColour, card }: any) {
  return (
    <div>
      <div style={{ ...card, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 500, color: '#F2EDE4', marginBottom: 4 }}>{venue?.name ?? 'Nobu Ibiza Bay'}</div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.15em', color: '#7A7068', textTransform: 'uppercase' as const }}>{venue?.category} · {venue?.area}</div>
          <div style={{ fontSize: 12, color: '#9A8E82', marginTop: 8 }}>Contact: {venue?.contact}</div>
          <div style={{ fontSize: 12, color: '#7A7068', marginTop: 4, fontStyle: 'italic' }}>{venue?.booking_instructions}</div>
        </div>
        <div style={{ textAlign: 'right' as const }}>
          <div style={{ padding: '3px 10px', background: '#3A6A4A22', border: '1px solid #3A6A4A44', fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#6ABB7A', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 8 }}>Verified</div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, color: '#B8944A', fontWeight: 300 }}>{venue?.commission_rate}</div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: '#6A6058', letterSpacing: '0.1em' }}>{venue?.commission_basis}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 24 }}>
        {[{ label: 'Active Concierges', val: '1', col: '#B8944A' }, { label: 'Total Covers', val: String(totalCovers), col: '#B8944A' }, { label: 'Total Paid Out', val: `€${totalPaid}`, col: '#6ABB7A' }].map(s => (
          <div key={s.label} style={{ ...card, textAlign: 'center' as const }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, color: s.col, fontWeight: 300, lineHeight: 1, marginBottom: 6 }}>{s.val}</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.15em', color: '#6A6058', textTransform: 'uppercase' as const }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={card}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: '0.25em', color: '#7A7068', textTransform: 'uppercase' as const, marginBottom: 16 }}>Bookings Received</div>
        {bookings.map((b: any) => {
          const c = statusColour(b.status)
          return (
            <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#242018', borderRadius: 4, marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 13, color: '#F2EDE4', fontWeight: 500, marginBottom: 2 }}>Sofia Reyes · {b.covers} covers</div>
                <div style={{ fontSize: 11, color: '#7A7068' }}>{b.date} · {b.notes}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: c.text, fontWeight: 300 }}>€{b.actual_commission ?? b.estimated_commission}</span>
                <span style={{ padding: '2px 8px', background: c.bg, border: `1px solid ${c.border}`, fontFamily: 'DM Mono, monospace', fontSize: 9, color: c.text, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>{b.status}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
