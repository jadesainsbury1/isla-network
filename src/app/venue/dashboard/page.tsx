import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BookingConfirm from '@/components/BookingConfirm'
import BookingMessage from '@/components/BookingMessage'
import VenuePayButton from '@/components/VenuePayButton'
import BillUpload from '@/components/BillUpload'
import BookingChat from '@/components/BookingChat'
import type { Booking, Profile } from '@/lib/types'

export default async function VenueDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: venue } = await supabase
    .from('venues')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!venue) {
    return (
      <>
        <div className="topbar"><div className="page-title">Dashboard</div></div>
        <div className="body">
          <div className="empty-state">
            <div className="empty-state-icon">✦</div>
            <div className="empty-state-title">Set up your venue listing</div>
            <div className="empty-state-sub">Complete your listing so concierges can find and refer your venue</div>
            <a href="/venue/listing" className="btn btn-gold" style={{ marginTop: 16, display: "inline-flex" }}>Set Up Listing →</a>
          </div>
        </div>
      </>
    )
  }

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, concierge:profiles(*)")
    .eq("venue_id", venue.id)
    .order("date", { ascending: false })

  const all: Booking[] = bookings || []
  const pending = all.filter(b => b.status === "pending")
  const confirmed = all.filter(b => b.status === "confirmed")
  const conciergeIds = new Set(all.map(b => b.concierge_id))

  const totalCommissionOwed = all
    .filter(b => b.commission_status === "approved" && b.payment_status !== "paid")
    .reduce((s, b) => s + (Number(b.commission_amount) || 0), 0)

  const totalCommissionPaid = all
    .filter(b => b.payment_status === "paid")
    .reduce((s, b) => s + (Number(b.commission_amount) || 0), 0)

  const totalRevenue = all
    .filter(b => b.bill_amount)
    .reduce((s, b) => s + (Number(b.bill_amount) || 0), 0)

  const fmt = (n: number) => "€" + n.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  return (
    <>
      <div className="topbar"><div className="page-title">Dashboard</div></div>
      <div className="body">

        {/* Stats */}
        <div className="money-header" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
          <div className="money-box">
            <span className="money-val gold">{pending.length}</span>
            <span className="money-label gold">Awaiting confirmation</span>
          </div>
          <div className="money-box">
            <span className="money-val green">{confirmed.length}</span>
            <span className="money-label green">Confirmed bookings</span>
          </div>
          <div className="money-box">
            <span className="money-val" style={{ color: "var(--cream)" }}>{conciergeIds.size}</span>
            <span className="money-label" style={{ color: "var(--muted)" }}>Concierges</span>
          </div>
          <div className="money-box">
            <span className="money-val" style={{ color: "var(--cream)" }}>{fmt(totalRevenue)}</span>
            <span className="money-label" style={{ color: "var(--muted)" }}>Total F&B</span>
          </div>
          <div className="money-box">
            <span className="money-val" style={{ color: totalCommissionOwed > 0 ? "#f44336" : "#4caf50" }}>{fmt(totalCommissionOwed)}</span>
            <span className="money-label" style={{ color: "var(--muted)" }}>Commission owed</span>
          </div>
        </div>

        {/* ISLA attribution */}
        <div style={{ marginBottom: 16, marginTop: -8 }}>
          <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "#555", textTransform: "uppercase" }}>
            Revenue generated via ISLA concierge network
          </span>
        </div>

        {/* Priority this week */}
        {(() => {
          const topUnpaid = (() => {
            const map = new Map<string, { name: string, amount: number, id: string, bookings: number }>()
            all
              .filter((b: any) => b.commission_status === "approved" && b.payment_status !== "paid" && b.concierge)
              .forEach((b: any) => {
                const c = b.concierge as any
                const existing = map.get(b.concierge_id) || { name: c.full_name, amount: 0, id: b.concierge_id, bookings: 0 }
                existing.amount += Number(b.commission_amount) || 0
                existing.bookings += 1
                map.set(b.concierge_id, existing)
              })
            return Array.from(map.values()).sort((a, b) => b.amount - a.amount)[0] || null
          })()

          const topEarner = (() => {
            const map = new Map<string, { name: string, amount: number, id: string, bookings: number }>()
            all
              .filter((b: any) => b.bill_amount && b.concierge)
              .forEach((b: any) => {
                const c = b.concierge as any
                const existing = map.get(b.concierge_id) || { name: c.full_name, amount: 0, id: b.concierge_id, bookings: 0 }
                existing.amount += Number(b.bill_amount) || 0
                existing.bookings += 1
                map.set(b.concierge_id, existing)
              })
            return Array.from(map.values()).sort((a, b) => b.amount - a.amount)[0] || null
          })()

          if (!topUnpaid && !topEarner) return null

          return (
            <div style={{ background: "#0d0d0d", border: "1px solid #2a2000", borderRadius: 8, padding: "16px 20px", marginBottom: 24 }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.3em", color: "#C9A96E", textTransform: "uppercase", marginBottom: 14 }}>Priority this week</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {topUnpaid && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: 13, color: "var(--cream)", fontWeight: 500 }}>{topUnpaid.name}</span>
                      <span style={{ fontSize: 11, color: "#888", marginLeft: 10, fontFamily: "monospace" }}>payment overdue — delaying risks the relationship</span>
                    </div>
                    <a href={`/venue/concierge/${topUnpaid.id}`} style={{ fontSize: 11, color: "#f44336", fontFamily: "monospace", textDecoration: "none", letterSpacing: "0.1em" }}>{fmt(topUnpaid.amount)} due →</a>
                  </div>
                )}
                {topEarner && topEarner.id !== topUnpaid?.id && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: 13, color: "var(--cream)", fontWeight: 500 }}>{topEarner.name}</span>
                      <span style={{ fontSize: 11, color: "#888", marginLeft: 10, fontFamily: "monospace" }}>your highest-value concierge this season</span>
                    </div>
                    <a href={`/venue/concierge/${topEarner.id}`} style={{ fontSize: 11, color: "#C9A96E", fontFamily: "monospace", textDecoration: "none", letterSpacing: "0.1em" }}>{fmt(topEarner.amount)} driven →</a>
                  </div>
                )}
              </div>
            </div>
          )
        })()}

        {/* Commission owed banner */}
        {totalCommissionOwed > 0 && (
          <div style={{ background: "#1a0f0f", border: "1px solid #f44336", borderRadius: 8, padding: "16px 20px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: "#f44336", fontWeight: 600 }}>
                  {all.filter((b: any) => b.commission_status === "approved" && b.payment_status === "unpaid").length} concierges awaiting payment — {fmt(totalCommissionOwed)} outstanding
                </div>
                <div style={{ fontSize: 11, color: "#888", fontFamily: "monospace" }}>Delayed payment risks losing your best concierges</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(() => {
                  const owedMap = new Map<string, { name: string, amount: number, id: string }>()
                  all
                    .filter((b: any) => b.commission_status === "approved" && b.payment_status === "unpaid")
                    .forEach((b: any) => {
                      const c = (b.concierge as any)
                      if (!c) return
                      const existing = owedMap.get(b.concierge_id) || { name: c.full_name, amount: 0, id: b.concierge_id }
                      existing.amount += Number(b.commission_amount) || 0
                      owedMap.set(b.concierge_id, existing)
                    })
                  return Array.from(owedMap.values()).map(({ name, amount, id }) => (
                    <div key={id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(244,67,54,0.06)", borderRadius: 4, border: "1px solid rgba(244,67,54,0.15)" }}>
                      <a href={`/venue/concierge/${id}`} style={{ fontSize: 12, color: "var(--cream)", textDecoration: "none", fontWeight: 500 }}>{name}</a>
                      <span style={{ fontSize: 12, color: "#f44336", fontFamily: "monospace", fontWeight: 600 }}>{fmt(amount)}</span>
                    </div>
                  ))
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Pending referrals */}
        <div style={{ marginBottom: 24 }}>
          <div className="mono" style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>Pending referrals — action required</div>
          {pending.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "32px 24px" }}>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>No referrals awaiting confirmation</div>
            </div>
          ) : (
            pending.map(b => {
              const concierge = b.concierge as Profile
              const gp = (b as any).guest_profile || {}
              const spendMap: Record<string,string> = { standard: 'Under €2k', premium: '€2k–5k', uhnw: '€5k+' }
              const sourceMap: Record<string,string> = { hotel_guest: 'Hotel', yacht: 'Yacht', private_villa: 'Villa', returning: 'Returning', referral: 'Referral', other: 'Other' }
              return (
                <div key={b.id} style={{ background: 'var(--charcoal)', border: '1px solid var(--border)', borderRadius: 8, padding: '16px 20px', marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--cream)', marginBottom: 2 }}>{concierge?.full_name || "Concierge"}{concierge?.property ? ` · ${concierge.property}` : ""}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'monospace' }}>
                        {new Date(b.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                        {gp.arrival_time ? ` · ${gp.arrival_time}` : ""}
                        {b.covers ? ` · ${b.covers} covers` : ""}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <BookingConfirm bookingId={b.id} venueId={venue.id} conciergeEmail={(b.concierge as any)?.email || ''} conciergeName={concierge?.full_name || 'Concierge'} />
                      <BillUpload bookingId={b.id} venueName={venue.name} venueEmail={venue.contact_email || ""} commissionRate={venue.commission_rate || "10%"} concierge={concierge?.full_name || "Concierge"} />
                      <BookingChat
                        bookingId={b.id}
                        currentUserId={user.id}
                        currentUserRole="venue"
                        currentUserName={venue.name}
                        notifyEmail={(b.concierge as any)?.email || ''}
                        notifyName={concierge?.full_name || 'Concierge'}
                      />
                    </div>
                  </div>
                  {(gp.guest_name || gp.guest_email || gp.guest_phone || gp.nationality || gp.occasion || gp.spend_profile || gp.dietary || gp.vip_notes || gp.guest_source) && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border)', marginTop: 4 }}>
                      {gp.guest_name && <div><div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', marginBottom: 2 }}>Guest</div><div style={{ fontSize: 12, color: 'var(--cream)' }}>{gp.guest_name}</div></div>}
                      {gp.guest_phone && <div><div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', marginBottom: 2 }}>Phone</div><a href={`https://wa.me/${gp.guest_phone.replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#25D366', textDecoration: 'none' }}>📱 {gp.guest_phone}</a></div>}
                      {gp.guest_email && <div><div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', marginBottom: 2 }}>Email</div><div style={{ fontSize: 12, color: 'var(--cream)' }}>{gp.guest_email}</div></div>}
                      {gp.arrival_time && <div><div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', marginBottom: 2 }}>Arrival</div><div style={{ fontSize: 12, color: 'var(--cream)' }}>{gp.arrival_time}</div></div>}
                      {gp.nationality && <div><div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', marginBottom: 2 }}>Nationality</div><div style={{ fontSize: 12, color: '#aaa' }}>{gp.nationality}</div></div>}
                      {gp.occasion && <div><div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', marginBottom: 2 }}>Occasion</div><div style={{ fontSize: 12, color: '#aaa' }}>{gp.occasion}</div></div>}
                      {gp.dietary && gp.dietary !== 'None' && <div><div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', marginBottom: 2 }}>Dietary</div><div style={{ fontSize: 12, color: '#f44336' }}>{gp.dietary}</div></div>}
                      {gp.spend_profile && <div><div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', marginBottom: 2 }}>Spend</div><div style={{ fontSize: 12, color: '#C9A96E' }}>{spendMap[gp.spend_profile] || gp.spend_profile}</div></div>}
                      {gp.guest_source && <div><div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', marginBottom: 2 }}>Via</div><div style={{ fontSize: 12, color: '#aaa' }}>{sourceMap[gp.guest_source] || gp.guest_source}</div></div>}
                      {gp.vip_notes && <div style={{ gridColumn: '1 / -1' }}><div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', marginBottom: 2 }}>VIP notes</div><div style={{ fontSize: 12, color: '#C9A96E', fontStyle: 'italic' }}>{gp.vip_notes}</div></div>}
                      {b.notes && <div style={{ gridColumn: '1 / -1' }}><div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', textTransform: 'uppercase', marginBottom: 2 }}>Booking notes</div><div style={{ fontSize: 12, color: '#aaa' }}>{b.notes}</div></div>}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* All bookings table */}
        {all.length > 0 && (
          <div className="table-card">
            <div className="table-header">
              <span className="table-title">All Referrals & Commission</span>
              <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>{all.length} total</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Concierge</th>
                  <th>Property</th>
                  <th>Covers</th>
                  <th>F&B Spend</th>
                  <th>Commission</th>
                  <th>Commission Status</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {all.map(b => {
                  const concierge = b.concierge as Profile
                  const commAmt = Number(b.commission_amount) || 0
                  return (
                    <tr key={b.id}>
                      <td className="td-mono td-muted">{new Date(b.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</td>
                      <td className="td-name">{concierge?.full_name || "—"}</td>
                      <td className="td-muted">{concierge?.property || "—"}</td>
                      <td className="td-mono">{b.covers || "—"}</td>
                      <td className="td-mono">{b.bill_amount ? fmt(Number(b.bill_amount)) : "—"}</td>
                      <td className="td-mono" style={{ color: "var(--gold)", fontWeight: 600 }}>{commAmt > 0 ? fmt(commAmt) : "—"}</td>
                      <td><span className={b.commission_status ? "badge badge-" + b.commission_status : ""}>{b.commission_status || "pending"}</span></td>
                      <td>
                        {b.payment_status === "paid"
                          ? <span className="badge badge-paid">Paid to concierge ✓</span>
                          : commAmt > 0 && b.commission_status === "approved"
                            ? <VenuePayButton bookingId={b.id} />
                            : commAmt > 0
                              ? <span className="badge badge-pending">Awaiting approval</span>
                              : <span style={{ color: "var(--muted)", fontSize: 11 }}>—</span>
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {totalCommissionPaid > 0 && (
              <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", fontSize: 12, color: "var(--muted)", display: "flex", justifyContent: "space-between" }}>
                <span>Total paid to concierge to date</span>
                <span style={{ color: "#4caf50", fontWeight: 600 }}>{fmt(totalCommissionPaid)}</span>
              </div>
            )}
          </div>
        )}

        {/* Commission Forecast */}
        {(() => {
          const months: Record<string, { label: string, projected: number, count: number }> = {}
          const now = new Date()
          all
            .filter(b => b.status === "confirmed" && b.commission_amount && b.date)
            .forEach(b => {
              const d = new Date(b.date)
              if (d >= now) {
                const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
                const label = d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
                if (!months[key]) months[key] = { label, projected: 0, count: 0 }
                months[key].projected += Number(b.commission_amount) || 0
                months[key].count += 1
              }
            })
          const sorted = Object.keys(months).sort()
          if (sorted.length === 0) return null
          return (
            <div style={{ background: "var(--charcoal)", border: "1px solid var(--border)", borderRadius: 8, padding: "20px 24px", marginBottom: 24 }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>Commission forecast</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {sorted.map(key => (
                  <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#0d0d0d", borderRadius: 6, border: "1px solid var(--border)" }}>
                    <div>
                      <div style={{ fontSize: 13, color: "var(--cream)", fontWeight: 500 }}>{months[key].label}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "monospace", marginTop: 2 }}>{months[key].count} confirmed {months[key].count === 1 ? "booking" : "bookings"}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#C9A96E", fontFamily: "monospace" }}>{fmt(months[key].projected)}</div>
                      <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "monospace", marginTop: 2 }}>projected</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 12, fontStyle: "italic" }}>Based on confirmed bookings with bills submitted. Subject to change.</div>
            </div>
          )
        })()}



      </div>
    </>
  )
}
