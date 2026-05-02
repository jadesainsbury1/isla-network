'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import BookingChat from '@/components/BookingChat'

interface Totals {
  totalEarned: number
  totalPaid: number
  totalPending: number
  totalUnpaid: number
}

interface Props {
  bookings: any[]
  venues: any[]
  conciergeId: string
  totals: Totals
}

export default function RevenueClient({ bookings, venues, conciergeId, totals }: Props) {
  const [showLog, setShowLog] = useState(false)
  const [venueId, setVenueId] = useState('')
  const [date, setDate] = useState('')
  const [covers, setCovers] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [nationality, setNationality] = useState('')
  const [occasion, setOccasion] = useState('')
  const [dietary, setDietary] = useState('')
  const [vipNotes, setVipNotes] = useState('')
  const [spendProfile, setSpendProfile] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+34')
  const [arrivalTime, setArrivalTime] = useState('')
  const [guestSource, setGuestSource] = useState('')
  const [sendingConfirmation, setSendingConfirmation] = useState<string | null>(null)
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [filterVenue, setFilterVenue] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDate, setEditDate] = useState('')
  const [editCovers, setEditCovers] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editLoading, setEditLoading] = useState(false)

  const fmt = (n: number) => '\u20ac' + n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  const badge = (status: string) => {
    const map: Record<string, string> = {
      approved: 'badge-paid',
      paid: 'badge-paid',
      pending: 'badge-pending',
      unpaid: 'badge-pending',
    }
    return <span className={'badge ' + (map[status] || '')}>{status}</span>
  }

  async function handleLog(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    const { data: noteRow } = await supabase
      .from('venue_concierge_notes')
      .select('is_blocked')
      .eq('venue_id', venueId)
      .eq('concierge_id', conciergeId)
      .maybeSingle()

    if (noteRow?.is_blocked) {
      setLoading(false)
      alert('You are not able to log referrals to this venue.')
      return
    }

    await supabase.from('bookings').insert({
      concierge_id: conciergeId,
      venue_id: venueId,
      date,
      covers: parseInt(covers) || null,
      notes,
      status: 'pending',
      commission_status: 'pending',
      payment_status: 'unpaid',
      guest_profile: {
        nationality: nationality || null,
        occasion: occasion || null,
        dietary: dietary || null,
        vip_notes: vipNotes || null,
        spend_profile: spendProfile || null,
        guest_name: guestName || null,
        guest_email: guestEmail || null,
        guest_phone: guestPhone || null,
        arrival_time: arrivalTime || null,
        guest_source: guestSource || null,
      }
    })

    // Send guest confirmation if email provided
    if (guestEmail) {
      fetch('/api/booking/guest-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestEmail, guestName, venueId, conciergeId, date, covers: parseInt(covers) || null, arrivalTime })
      }).catch(() => {})
    }

    // Notify venue by email
    fetch('/api/booking/notify-venue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ venueId, conciergeId, date, covers: parseInt(covers) || null, notes })
    }).catch(() => {}) // fire-and-forget

    setLoading(false)
    setSuccess(true)
    setShowLog(false)
    setTimeout(() => window.location.reload(), 800)
  }

  async function handleEdit(bookingId: string) {
    setEditLoading(true)
    const supabase = createClient()
    await supabase.from('bookings').update({
      date: editDate,
      covers: parseInt(editCovers) || null,
      notes: editNotes,
      guest_profile: {
        nationality: nationality || null,
        occasion: occasion || null,
        dietary: dietary || null,
        vip_notes: vipNotes || null,
        spend_profile: spendProfile || null,
      }
    }).eq('id', bookingId)
    setEditingId(null)
    setEditLoading(false)
    window.location.reload()
  }

  const filteredBookings = bookings
    .filter((b: any) => {
      if (filterVenue && b.venue_id !== filterVenue) return false
      if (filterStatus === 'pending' && b.commission_status !== 'pending') return false
      if (filterStatus === 'approved' && b.commission_status !== 'approved') return false
      if (filterStatus === 'paid' && b.payment_status !== 'paid') return false
      if (filterStatus === 'unpaid' && b.payment_status === 'paid') return false
      return true
    })
    .sort((a: any, b: any) => {
      const da = new Date(a.date).getTime()
      const db = new Date(b.date).getTime()
      return sortDir === 'desc' ? db - da : da - db
    })

  return (
    <>
      <div className="topbar">
        <div className="page-title">My Earnings</div>
        <div style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "0.15em", color: "var(--muted)", textTransform: "uppercase" }}>Tracked via ISLA · protected by signed agreement</div>
      </div>
      <div className="body">

        {/* Earnings Summary */}
        <div style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #1a1500 100%)", border: "1px solid #2a2000", borderRadius: 12, padding: "28px 32px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: "0.25em", color: "#888", textTransform: "uppercase", marginBottom: 6 }}>Your earnings via ISLA · Season 2026</div>
              <div style={{ fontSize: 40, fontWeight: 700, color: "#C9A96E", lineHeight: 1 }}>{fmt(totals.totalEarned)}</div>
              <div style={{ fontSize: 12, color: "#555", marginTop: 6, fontFamily: "monospace" }}>
                {fmt(totals.totalPaid)} paid · {fmt(totals.totalUnpaid > 0 ? totals.totalUnpaid : 0)} outstanding
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 16 }}>
                <span style={{ fontFamily: "monospace", fontSize: 10, color: "#C9A96E", letterSpacing: "0.1em" }}>
                  {venues.length} active {venues.length === 1 ? "venue" : "venues"} working with you
                </span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              {(() => {
                const totalFnB = bookings.reduce((s: number, b: any) => s + (Number(b.total_amount) || 0), 0)
                const uniqueVenues = new Set(bookings.map((b: any) => b.venue_id)).size
                const avgBooking = bookings.length > 0 ? totalFnB / bookings.length : 0
                return (
                  <div style={{ display: "flex", gap: 32 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontWeight: 600, color: "var(--cream)" }}>{fmt(totalFnB)}</div>
                      <div style={{ fontSize: 10, fontFamily: "monospace", color: "#666", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 4 }}>F&B driven</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontWeight: 600, color: "var(--cream)" }}>{bookings.length}</div>
                      <div style={{ fontSize: 10, fontFamily: "monospace", color: "#666", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 4 }}>Bookings</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontWeight: 600, color: "var(--cream)" }}>{uniqueVenues}</div>
                      <div style={{ fontSize: 10, fontFamily: "monospace", color: "#666", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 4 }}>Venues</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontWeight: 600, color: "var(--cream)" }}>{fmt(avgBooking)}</div>
                      <div style={{ fontSize: 10, fontFamily: "monospace", color: "#666", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 4 }}>Avg booking</div>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
          {totals.totalUnpaid > 0 && (
            <div style={{ borderTop: "1px solid #2a2000", paddingTop: 14, fontSize: 12, color: "#f44336", fontFamily: "monospace" }}>
              {fmt(totals.totalUnpaid)} approved and awaiting payment from venues
            </div>
          )}
        </div>


        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="mono" style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)' }}>My referrals — {bookings.length} total</div>
          <button onClick={() => setShowLog(true)} className="btn btn-gold" style={{ fontSize: 11, padding: '8px 16px' }}>+ Log Booking</button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <select value={filterVenue} onChange={e => setFilterVenue(e.target.value)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, color: filterVenue ? 'var(--cream)' : 'var(--muted)', fontSize: 11, padding: '6px 10px', fontFamily: 'monospace' }}>
            <option value="">All venues</option>
            {venues.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, color: filterStatus ? 'var(--cream)' : 'var(--muted)', fontSize: 11, padding: '6px 10px', fontFamily: 'monospace' }}>
            <option value="">All statuses</option>
            <option value="pending">Pending approval</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <button onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--muted)', fontSize: 11, padding: '6px 10px', fontFamily: 'monospace', cursor: 'pointer' }}>
            Date {sortDir === 'desc' ? '↓' : '↑'}
          </button>
          {(filterVenue || filterStatus) && <button onClick={() => { setFilterVenue(''); setFilterStatus('') }} style={{ background: 'transparent', border: '1px solid #333', borderRadius: 4, color: '#666', fontSize: 11, padding: '6px 10px', fontFamily: 'monospace', cursor: 'pointer' }}>✕ Clear</button>}
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace', lineHeight: '30px' }}>{filteredBookings.length} of {bookings.length}</span>
        </div>

        {success && <div style={{ color: '#4caf50', fontSize: 12, fontFamily: 'monospace', marginBottom: 16 }}>Referral logged successfully</div>}

        {viewingId && (() => {
          const b = bookings.find((x: any) => x.id === viewingId)
          if (!b) return null
          const gp = b.guest_profile || {}
          const sourceMap: Record<string, string> = { hotel_guest: 'Hotel guest', yacht: 'Yacht / charter', private_villa: 'Private villa', returning: 'Returning client', referral: 'Personal referral', other: 'Other' }
          const spendMap: Record<string, string> = { standard: 'Standard — under 2,000', premium: 'Premium — 2,000 to 5,000', uhnw: 'UHNW — 5,000+' }
          return (
            <div style={{ background: 'var(--charcoal)', border: '1px solid #333', borderRadius: 8, padding: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: 'var(--cream)', fontWeight: 500 }}>Booking — {(b.venue as any)?.name}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {b.status === 'pending' && new Date(b.date) > new Date() && (
                    <button onClick={() => { setViewingId(null); setEditingId(b.id); setEditDate(b.date); setEditCovers(b.covers?.toString() || ''); setEditNotes(b.notes || ''); setNationality(gp.nationality || ''); setOccasion(gp.occasion || ''); setDietary(gp.dietary || ''); setVipNotes(gp.vip_notes || ''); setSpendProfile(gp.spend_profile || ''); setGuestName(gp.guest_name || ''); setGuestEmail(gp.guest_email || ''); setGuestPhone(gp.guest_phone || ''); setArrivalTime(gp.arrival_time || ''); setGuestSource(gp.guest_source || '') }} className="btn btn-gold" style={{ fontSize: 11, padding: '6px 14px' }}>Edit</button>
                  )}
                  <button onClick={() => setViewingId(null)} style={{ background: 'none', border: '1px solid #333', color: '#555', cursor: 'pointer', borderRadius: 4, padding: '6px 12px', fontSize: 12 }}>Close</button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                {[
                  ['Venue', (b.venue as any)?.name],
                  ['Date', new Date(b.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })],
                  ['Arrival time', gp.arrival_time || null],
                  ['Covers', b.covers || null],
                  ['Notes', b.notes || null],
                  ['Guest name', gp.guest_name || null],
                  ['Guest email', gp.guest_email || null],
                  ['Guest phone', gp.guest_phone ? '___WA___' + gp.guest_phone : null],
                  ['How introduced', gp.guest_source ? sourceMap[gp.guest_source] || gp.guest_source : null],
                  ['Nationality', gp.nationality || null],
                  ['Occasion', gp.occasion || null],
                  ['Dietary', gp.dietary || null],
                  ['Spend profile', gp.spend_profile ? spendMap[gp.spend_profile] || gp.spend_profile : null],
                  ['VIP notes', gp.vip_notes || null],
                  ['Status', b.status],
                  ['Commission', b.commission_amount ? fmt(Number(b.commission_amount)) : 'Pending'],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label as string} style={{ padding: '10px 0', borderBottom: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase' }}>{label}</div>
                    <div style={{ fontSize: 13, color: 'var(--cream)' }}>{(value as string).startsWith('___WA___') ? <a href={`https://wa.me/${(value as string).replace('___WA___','').replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer" style={{color:'#25D366',textDecoration:'none'}}>📱 {(value as string).replace('___WA___','')}</a> : value}</div>
                  </div>
                ))}
              </div>
              {gp.guest_email && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #1a1a1a' }}>
                  <button
                    onClick={async () => {
                      setSendingConfirmation(b.id)
                      await fetch('/api/booking/guest-confirmation', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ guestEmail: gp.guest_email, guestName: gp.guest_name, venueId: b.venue_id, conciergeId, date: b.date, covers: b.covers, arrivalTime: gp.arrival_time, bookingId: b.id })
                      })
                      setSendingConfirmation(null)
                    }}
                    disabled={sendingConfirmation === b.id}
                    style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #C9A96E', color: '#C9A96E', borderRadius: 4, fontSize: 11, cursor: 'pointer', fontFamily: 'monospace', opacity: sendingConfirmation === b.id ? 0.5 : 1 }}
                  >
                    {sendingConfirmation === b.id ? 'Sending...' : '✉ Send guest confirmation'}
                  </button>
                </div>
              )}
            </div>
          )
        })()}

        {editingId && (
          <div style={{ background: 'var(--charcoal)', border: '1px solid var(--gold)', borderRadius: 8, padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--cream)', fontWeight: 500 }}>Edit Booking</div>
              <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div className="form-group">
                <label className="form-label">Date of visit</label>
                <input className="form-input" type="date" value={editDate} onChange={e => setEditDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Number of covers</label>
                <input className="form-input" type="number" placeholder="4" value={editCovers} onChange={e => setEditCovers(e.target.value)} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Notes (optional)</label>
                <input className="form-input" placeholder="Birthday dinner, champagne on arrival" value={editNotes} onChange={e => setEditNotes(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Guest name</label>
                <input className="form-input" placeholder="e.g. James & Sarah Wilson" value={guestName} onChange={e => setGuestName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Arrival time</label>
                <input className="form-input" type="time" value={arrivalTime} onChange={e => setArrivalTime(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Guest email</label>
                <input className="form-input" type="email" placeholder="guest@email.com" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Guest phone / WhatsApp</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <select value={countryCode} onChange={e => setCountryCode(e.target.value)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--cream)', fontSize: 12, padding: '8px 6px', width: 90, flexShrink: 0 }}>
                    <option value="+34">🇪🇸 +34</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+31">🇳🇱 +31</option>
                    <option value="+39">🇮🇹 +39</option>
                    <option value="+41">🇨🇭 +41</option>
                    <option value="+7">🇷🇺 +7</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+966">🇸🇦 +966</option>
                    <option value="+974">🇶🇦 +974</option>
                    <option value="+852">🇭🇰 +852</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+55">🇧🇷 +55</option>
                    <option value="+30">🇬🇷 +30</option>
                    <option value="+90">🇹🇷 +90</option>
                  </select>
                  <input className="form-input" placeholder="600 000 000" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} style={{ flex: 1 }} />
                </div>
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">How introduced</label>
                <select className="form-input" value={guestSource} onChange={e => setGuestSource(e.target.value)}>
                  <option value="">Select</option>
                  <option value="hotel_guest">Hotel guest</option>
                  <option value="yacht">Yacht / charter</option>
                  <option value="private_villa">Private villa</option>
                  <option value="returning">Returning client</option>
                  <option value="referral">Personal referral</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div className="mono" style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Guest Profile</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Nationality</label>
                  <input className="form-input" placeholder="e.g. German, Dutch, British" value={nationality} onChange={e => setNationality(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Special occasion</label>
                  <input className="form-input" placeholder="e.g. Birthday, Anniversary" value={occasion} onChange={e => setOccasion(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Dietary requirements</label>
                  <input className="form-input" placeholder="e.g. Halal, Vegan, Nut allergy" value={dietary} onChange={e => setDietary(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Spend profile</label>
                  <select className="form-input" value={spendProfile} onChange={e => setSpendProfile(e.target.value)}>
                    <option value="">Select</option>
                    <option value="standard">Standard — under 2,000</option>
                    <option value="premium">Premium — 2,000 to 5,000</option>
                    <option value="uhnw">UHNW — 5,000+</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ marginTop: 12 }}>
                <label className="form-label">VIP notes — private to venue</label>
                <input className="form-input" placeholder="e.g. Guest is a regular at Nobu. Prefers window table." value={vipNotes} onChange={e => setVipNotes(e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleEdit(editingId)} disabled={editLoading} className="btn btn-gold">{editLoading ? 'Saving...' : 'Save Changes'}</button>
              <button onClick={() => setEditingId(null)} className="btn btn-ghost">Cancel</button>
            </div>
          </div>
        )}

        {showLog && (
          <div style={{ background: 'var(--charcoal)', border: '1px solid var(--border)', borderRadius: 8, padding: 24, marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: 'var(--cream)', fontWeight: 500, marginBottom: 16 }}>Log a Booking</div>
            <form onSubmit={handleLog}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div className="form-group">
                  <label className="form-label">Venue</label>
                  <select className="form-input" value={venueId} onChange={e => setVenueId(e.target.value)} required>
                    <option value="">Select venue</option>
                    {venues.map((v: any) => <option key={v.id} value={v.id}>{v.name} · {v.area}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date of visit</label>
                  <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Number of covers</label>
                  <input className="form-input" type="number" placeholder="4" value={covers} onChange={e => setCovers(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Notes (optional)</label>
                  <input className="form-input" placeholder="Birthday dinner, champagne on arrival" value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Guest Contact</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Guest name</label>
                    <input className="form-input" placeholder="e.g. James & Sarah Wilson" value={guestName} onChange={e => setGuestName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Arrival time</label>
                    <input className="form-input" type="time" value={arrivalTime} onChange={e => setArrivalTime(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Guest email — for confirmation</label>
                    <input className="form-input" type="email" placeholder="guest@email.com" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Guest phone / WhatsApp</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <select value={countryCode} onChange={e => setCountryCode(e.target.value)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--cream)', fontSize: 12, padding: '8px 6px', width: 90, flexShrink: 0 }}>
                        <option value="+34">🇪🇸 +34</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+33">🇫🇷 +33</option>
                        <option value="+49">🇩🇪 +49</option>
                        <option value="+31">🇳🇱 +31</option>
                        <option value="+39">🇮🇹 +39</option>
                        <option value="+41">🇨🇭 +41</option>
                        <option value="+43">🇦🇹 +43</option>
                        <option value="+32">🇧🇪 +32</option>
                        <option value="+46">🇸🇪 +46</option>
                        <option value="+47">🇳🇴 +47</option>
                        <option value="+45">🇩🇰 +45</option>
                        <option value="+358">🇫🇮 +358</option>
                        <option value="+351">🇵🇹 +351</option>
                        <option value="+7">🇷🇺 +7</option>
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+966">🇸🇦 +966</option>
                        <option value="+974">🇶🇦 +974</option>
                        <option value="+965">🇰🇼 +965</option>
                        <option value="+852">🇭🇰 +852</option>
                        <option value="+65">🇸🇬 +65</option>
                        <option value="+81">🇯🇵 +81</option>
                        <option value="+86">🇨🇳 +86</option>
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+55">🇧🇷 +55</option>
                        <option value="+52">🇲🇽 +52</option>
                        <option value="+61">🇦🇺 +61</option>
                        <option value="+27">🇿🇦 +27</option>
                        <option value="+20">🇪🇬 +20</option>
                        <option value="+212">🇲🇦 +212</option>
                        <option value="+30">🇬🇷 +30</option>
                        <option value="+90">🇹🇷 +90</option>
                        <option value="+972">🇮🇱 +972</option>
                      </select>
                      <input className="form-input" placeholder="600 000 000" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} style={{ flex: 1 }} />
                    </div>
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: 12 }}>
                  <label className="form-label">How introduced</label>
                  <select className="form-input" value={guestSource} onChange={e => setGuestSource(e.target.value)}>
                    <option value="">Select</option>
                    <option value="hotel_guest">Hotel guest</option>
                    <option value="yacht">Yacht / charter</option>
                    <option value="private_villa">Private villa</option>
                    <option value="returning">Returning client</option>
                    <option value="referral">Personal referral</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Guest Profile — visible to venue before arrival</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Nationality</label>
                    <input className="form-input" placeholder="e.g. German, Dutch, British" value={nationality} onChange={e => setNationality(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Special occasion</label>
                    <input className="form-input" placeholder="e.g. Birthday, Anniversary, Honeymoon" value={occasion} onChange={e => setOccasion(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dietary requirements</label>
                    <select className="form-input" value={dietary} onChange={e => setDietary(e.target.value)}>
                      <option value="">None / Unknown</option>
                      <option value="Halal">Halal</option>
                      <option value="Kosher">Kosher</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Gluten-free">Gluten-free</option>
                      <option value="Dairy-free">Dairy-free</option>
                      <option value="Nut allergy">Nut allergy</option>
                      <option value="Shellfish allergy">Shellfish allergy</option>
                      <option value="No pork">No pork</option>
                      <option value="No alcohol">No alcohol</option>
                      <option value="Raw fish allergy">Raw fish allergy</option>
                      <option value="Diabetic">Diabetic</option>
                      <option value="Other">Other — add to VIP notes</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Spend profile</label>
                    <select className="form-input" value={spendProfile} onChange={e => setSpendProfile(e.target.value)}>
                      <option value="">Select</option>
                      <option value="standard">Standard — under 2,000</option>
                      <option value="premium">Premium — 2,000 to 5,000</option>
                      <option value="uhnw">UHNW — 5,000+</option>
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: 12 }}>
                  <label className="form-label">VIP notes — private to venue</label>
                  <input className="form-input" placeholder="e.g. Guest is a regular at Nobu. Prefers window table. Has young children." value={vipNotes} onChange={e => setVipNotes(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className="btn btn-gold" disabled={loading}>{loading ? 'Logging...' : 'Log Referral'}</button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowLog(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {bookings.length > 0 ? (
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Guest</th>
                  <th>Covers</th>
                  <th>Commission</th>
                  <th>Approval</th>
                  <th>Payment</th>
                  <th>Chat</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b: any) => (
                  <tr key={b.id}>
                    <td className="td-mono td-muted" style={{ cursor: 'pointer', color: 'var(--gold)', textDecoration: 'underline' }} onClick={() => setViewingId(b.id)}>{new Date(b.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="td-name" style={{ cursor: 'pointer' }} onClick={() => setViewingId(b.id)}>{(b.venue as any)?.name || '—'}</td>
                    <td className="td-muted" style={{ fontSize: 12 }}>{(b as any).guest_profile?.guest_name || (b.venue as any)?.area || '—'}</td>
                    <td className="td-mono">{b.covers || '—'}</td>
                    <td className="td-mono" style={{ color: 'var(--gold)', fontWeight: 600 }}>
                      {b.commission_amount ? fmt(Number(b.commission_amount)) : b.estimated_commission ? '~' + fmt(Number(b.estimated_commission)) : '—'}
                    </td>
                    <td>{badge(b.commission_status || 'pending')}</td>
                    <td>{badge(b.payment_status || 'unpaid')}</td>
                    <td>
                      <BookingChat
                        bookingId={b.id}
                        currentUserId={conciergeId}
                        currentUserRole="concierge"
                        currentUserName="Me"
                        notifyEmail={(b.venue as any)?.contact_email || ''}
                        notifyName={(b.venue as any)?.name || 'Venue'}
                      />
                    </td>
                    <td>
                      {b.status === 'pending' && new Date(b.date) > new Date() ? (
                        <button onClick={() => { const gp = b.guest_profile || {}; setEditingId(b.id); setEditDate(b.date); setEditCovers(b.covers?.toString() || ''); setEditNotes(b.notes || ''); setNationality(gp.nationality || ''); setOccasion(gp.occasion || ''); setDietary(gp.dietary || ''); setVipNotes(gp.vip_notes || ''); setSpendProfile(gp.spend_profile || ''); setGuestName(gp.guest_name || ''); setGuestEmail(gp.guest_email || ''); setGuestPhone(gp.guest_phone || ''); setArrivalTime(gp.arrival_time || ''); setGuestSource(gp.guest_source || '') }} style={{ padding: '4px 10px', background: 'transparent', border: '1px solid #333', color: '#888', borderRadius: 3, fontSize: 10, cursor: 'pointer', fontFamily: 'monospace' }}>Edit</button>
                      ) : null}
                    </td>
                    <td>
                      {b.guest_profile?.guest_email ? (
                        <button
                          onClick={async () => {
                            setSendingConfirmation(b.id)
                            await fetch('/api/booking/guest-confirmation', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                guestEmail: b.guest_profile.guest_email,
                                guestName: b.guest_profile.guest_name,
                                venueId: b.venue_id,
                                conciergeId,
                                date: b.date,
                                covers: b.covers,
                                arrivalTime: b.guest_profile.arrival_time,
                                bookingId: b.id
                              })
                            })
                            setSendingConfirmation(null)
                          }}
                          disabled={sendingConfirmation === b.id}
                          style={{ padding: '4px 10px', background: 'transparent', border: '1px solid #C9A96E', color: '#C9A96E', borderRadius: 3, fontSize: 10, cursor: 'pointer', fontFamily: 'monospace', opacity: sendingConfirmation === b.id ? 0.5 : 1 }}
                        >
                          {sendingConfirmation === b.id ? 'Sending...' : '✉ Guest'}
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totals.totalUnpaid > 0 && (
              <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Total due from ISLA</span>
                <span style={{ color: '#f44336', fontWeight: 600 }}>{fmt(totals.totalUnpaid)}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>&#10022;</div>
            <div style={{ color: 'var(--cream)', fontSize: 15, marginBottom: 8 }}>No referrals yet</div>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>Log your first referral to start tracking commission</div>
            <button onClick={() => setShowLog(true)} className="btn btn-gold">Log Your First Referral</button>
          </div>
        )}
      </div>
    </>
  )
}
