'use client'
import BillPhotoModal from './BillPhotoModal'
import MarkPaidButton from './MarkPaidButton'
import BookingTimeline from './BookingTimeline'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import BillUpload from './BillUpload'
import BookingChat from './BookingChat'

interface Props {
  bookings: any[]
  venue: any
  userId: string
}

export default function VenueBookingPanel({ bookings, venue, userId }: Props) {
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [filterMonth, setFilterMonth] = useState<string>('all')
  const [filterPayment, setFilterPayment] = useState<string>('all')
  const [filterCommission, setFilterCommission] = useState<string>('all')

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      if (filterMonth !== 'all') {
        const m = new Date(b.date).toISOString().slice(0, 7)
        if (m !== filterMonth) return false
      }
      if (filterPayment !== 'all' && (b.payment_status || 'pending') !== filterPayment) return false
      if (filterCommission !== 'all' && (b.commission_status || 'pending') !== filterCommission) return false
      return true
    })
  }, [bookings, filterMonth, filterPayment, filterCommission])

  const months = useMemo(() => {
    const set = new Set<string>()
    bookings.forEach(b => set.add(new Date(b.date).toISOString().slice(0, 7)))
    return Array.from(set).sort().reverse()
  }, [bookings])

  const fmt = (n: number) => '€' + Number(n).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  const spendMap: Record<string,string> = { standard: 'Under €2k', premium: '€2k–5k', uhnw: '€5k+' }
  const sourceMap: Record<string,string> = { hotel_guest: 'Hotel', yacht: 'Yacht', private_villa: 'Villa', returning: 'Returning', referral: 'Referral', other: 'Other' }

  const viewing = viewingId ? bookings.find(b => b.id === viewingId) : null

  return (
    <div>
      {viewing && (() => {
        const gp = viewing.guest_profile || {}
        const concierge = viewing.concierge || {}
        return (
          <div style={{ background: 'var(--charcoal)', border: '1px solid var(--gold)', borderRadius: 8, padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--cream)' }}>{concierge.full_name} · {new Date(viewing.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace', marginTop: 2 }}>
                  {viewing.covers ? viewing.covers + ' covers' : ''}{gp.arrival_time ? ' · ' + gp.arrival_time : ''}
                  {viewing.status === 'confirmed' ? ' · ✓ Confirmed' : ' · Pending'}
                </div>
              </div>
              <button onClick={() => setViewingId(null)} style={{ background: 'none', border: '1px solid #333', color: '#555', cursor: 'pointer', borderRadius: 4, padding: '6px 12px', fontSize: 12 }}>Close</button>
            </div>
            {(gp.guest_name || gp.guest_phone || gp.guest_email) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                {gp.guest_name && <div><div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', marginBottom: 3 }}>Guest</div><div style={{ fontSize: 13, color: 'var(--cream)' }}>{gp.guest_name}</div></div>}
                {gp.guest_phone && <div><div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', marginBottom: 3 }}>Phone</div><a href={'https://wa.me/' + gp.guest_phone.replace(/[^0-9]/g,'')} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#25D366', textDecoration: 'none' }}>📱 {gp.guest_phone}</a></div>}
                {gp.guest_email && <div><div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', marginBottom: 3 }}>Email</div><div style={{ fontSize: 13, color: 'var(--cream)' }}>{gp.guest_email}</div></div>}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
              {gp.nationality && <div><div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', marginBottom: 3 }}>Nationality</div><div style={{ fontSize: 12, color: '#aaa' }}>{gp.nationality}</div></div>}
              {gp.occasion && <div><div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', marginBottom: 3 }}>Occasion</div><div style={{ fontSize: 12, color: '#aaa' }}>{gp.occasion}</div></div>}
              {gp.dietary && gp.dietary !== 'None' && <div><div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', marginBottom: 3 }}>Dietary</div><div style={{ fontSize: 12, color: '#f44336' }}>{gp.dietary}</div></div>}
              {gp.spend_profile && <div><div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', marginBottom: 3 }}>Spend</div><div style={{ fontSize: 12, color: '#C9A96E' }}>{spendMap[gp.spend_profile] || gp.spend_profile}</div></div>}
              {gp.guest_source && <div><div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', marginBottom: 3 }}>Via</div><div style={{ fontSize: 12, color: '#aaa' }}>{sourceMap[gp.guest_source] || gp.guest_source}</div></div>}
              {viewing.notes && <div style={{ gridColumn: '1 / -1' }}><div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', marginBottom: 3 }}>Notes</div><div style={{ fontSize: 12, color: '#aaa' }}>{viewing.notes}</div></div>}
              {gp.vip_notes && <div style={{ gridColumn: '1 / -1' }}><div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', marginBottom: 3 }}>VIP notes</div><div style={{ fontSize: 12, color: '#C9A96E', fontStyle: 'italic' }}>{gp.vip_notes}</div></div>}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <BillUpload bookingId={viewing.id} venueId={venue.id} venueName={venue.name} venueEmail={venue.contact_email || ''} commissionRate={venue.commission_rate || '10'} commissionBasis={venue.commission_basis || 'net'} minSpend={Number(venue.min_spend) || 0} minSpendBasis={venue.min_spend_basis || 'gross'} concierge={concierge.full_name || 'Concierge'} />
              <BookingChat bookingId={viewing.id} currentUserId={userId} currentUserRole="venue" currentUserName={venue.name} notifyEmail={concierge.email || ''} notifyName={concierge.full_name || 'Concierge'} />
            </div>

            {/* Trust layer: bill viewer + payment workflow */}
            {viewing.bill_amount && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #2a2620' }}>
                <div style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.3em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 12 }}>Bill verification & payment</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <BillPhotoModal billPhotoUrl={viewing.bill_photo_url || null} billAmount={viewing.bill_amount} ticketNumber={viewing.ticket_number || null} />
                  {viewing.payment_status !== 'paid' && Number(viewing.commission_amount || 0) > 0 && (
                    <MarkPaidButton bookingId={viewing.id} commissionAmount={Number(viewing.commission_amount)} conciergeName={concierge.full_name || 'Concierge'} />
                  )}
                  {viewing.payment_status === 'paid' && (
                    <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#4ade80', padding: '6px 12px', border: '1px solid #2a4a2a', borderRadius: 4, background: '#0d2218' }}>
                      ✓ Paid
                      {viewing.paid_at && ' · ' + new Date(viewing.paid_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      {viewing.paid_method && ' · ' + String(viewing.paid_method).replace('_', ' ')}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Audit trail */}
            <div style={{ marginTop: 16 }}>
              <BookingTimeline bookingId={viewing.id} />
            </div>

            <div style={{ display: 'none' }}>
            </div>
          </div>
        )
      })()}

      <div className="table-card">
        {/* Commission terms reminder + filter bar */}
        <div style={{ background: 'var(--charcoal)', border: '1px solid #2a2620', borderRadius: 8, padding: 16, marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--muted)' }}>Commission Terms</span>
            <span style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>{String(venue?.commission_rate || '—').replace(/%/g, '')}% {venue?.commission_basis === 'gross' ? 'on gross' : venue?.commission_basis === 'net' ? 'on net' : 'per booking'}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} style={{ padding: '6px 10px', background: 'var(--bg)', border: '1px solid #2a2620', borderRadius: 4, color: 'var(--cream)', fontSize: 11, fontFamily: 'monospace' }}>
              <option value="all">All months</option>
              {months.map(m => (<option key={m} value={m}>{new Date(m + '-01').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</option>))}
            </select>
            <select value={filterPayment} onChange={e => setFilterPayment(e.target.value)} style={{ padding: '6px 10px', background: 'var(--bg)', border: '1px solid #2a2620', borderRadius: 4, color: 'var(--cream)', fontSize: 11, fontFamily: 'monospace' }}>
              <option value="all">All payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
            <select value={filterCommission} onChange={e => setFilterCommission(e.target.value)} style={{ padding: '6px 10px', background: 'var(--bg)', border: '1px solid #2a2620', borderRadius: 4, color: 'var(--cream)', fontSize: 11, fontFamily: 'monospace' }}>
              <option value="all">All commissions</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Concierge</th>
              <th>Guest</th>
              <th>Covers</th>
              <th>Status</th>
              <th>F&B</th>
              <th>Ticket</th>
              <th>Commission</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => {
              const concierge = b.concierge || {}
              const gp = b.guest_profile || {}
              const commAmt = Number(b.commission_amount) || 0
              return (
                <tr key={b.id} onClick={() => setViewingId(b.id)} style={{ cursor: 'pointer' }} className={viewingId === b.id ? 'tr-active' : ''}>
                  <td className="td-mono td-muted" style={{ color: 'var(--gold)' }}>{new Date(b.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}{gp.arrival_time ? <><br/><span style={{fontSize:10,color:'var(--muted)'}}>{gp.arrival_time}</span></> : null}</td>
                  <td className="td-name" onClick={(e) => e.stopPropagation()}><Link href={`/venue/concierge/${concierge.id || ''}`} style={{ color: 'var(--cream)', textDecoration: 'none', borderBottom: '1px dotted var(--muted)' }}>{concierge.full_name || '—'}</Link></td>
                  <td className="td-muted" style={{ fontSize: 12 }}>{gp.guest_name || '—'}</td>
                  <td className="td-mono">{b.covers || '—'}</td>
                  <td><span className={'badge ' + (b.status === 'confirmed' ? 'badge-paid' : 'badge-pending')}>{b.status}</span></td>
                  <td className="td-mono">{b.bill_amount ? fmt(Number(b.bill_amount)) : '—'}</td>
                  <td className="td-mono td-muted" style={{ fontSize: 11 }}>{b.ticket_number || '—'}</td>
                  <td className="td-mono" style={{ color: 'var(--gold)', fontWeight: 600 }}>{commAmt > 0 ? fmt(commAmt) : '—'}</td>
                  <td>{b.payment_status === 'paid' ? <span className="badge badge-paid">Paid ✓</span> : commAmt > 0 ? <span className="badge badge-pending">Due</span> : <span style={{ color: 'var(--muted)', fontSize: 11 }}>—</span>}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
