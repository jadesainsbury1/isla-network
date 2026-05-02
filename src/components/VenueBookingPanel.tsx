'use client'
import { useState } from 'react'
import BillUpload from './BillUpload'
import BookingChat from './BookingChat'

interface Props {
  bookings: any[]
  venue: any
  userId: string
}

export default function VenueBookingPanel({ bookings, venue, userId }: Props) {
  const [viewingId, setViewingId] = useState<string | null>(null)

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
              <BillUpload bookingId={viewing.id} venueName={venue.name} venueEmail={venue.contact_email || ''} commissionRate={venue.commission_rate || '10%'} concierge={concierge.full_name || 'Concierge'} />
              <BookingChat bookingId={viewing.id} currentUserId={userId} currentUserRole="venue" currentUserName={venue.name} notifyEmail={concierge.email || ''} notifyName={concierge.full_name || 'Concierge'} />
            </div>
          </div>
        )
      })()}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Concierge</th>
              <th>Guest</th>
              <th>Covers</th>
              <th>Status</th>
              <th>F&B</th>
              <th>Commission</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => {
              const concierge = b.concierge || {}
              const gp = b.guest_profile || {}
              const commAmt = Number(b.commission_amount) || 0
              return (
                <tr key={b.id} onClick={() => setViewingId(b.id)} style={{ cursor: 'pointer' }} className={viewingId === b.id ? 'tr-active' : ''}>
                  <td className="td-mono td-muted" style={{ color: 'var(--gold)' }}>{new Date(b.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}{gp.arrival_time ? <><br/><span style={{fontSize:10,color:'var(--muted)'}}>{gp.arrival_time}</span></> : null}</td>
                  <td className="td-name">{concierge.full_name || '—'}</td>
                  <td className="td-muted" style={{ fontSize: 12 }}>{gp.guest_name || '—'}</td>
                  <td className="td-mono">{b.covers || '—'}</td>
                  <td><span className={'badge ' + (b.status === 'confirmed' ? 'badge-paid' : 'badge-pending')}>{b.status}</span></td>
                  <td className="td-mono">{b.bill_amount ? fmt(Number(b.bill_amount)) : '—'}</td>
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
