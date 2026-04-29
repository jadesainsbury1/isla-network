import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BookingConfirm from '@/components/BookingConfirm'
import BookingMessage from '@/components/BookingMessage'
import VenuePayButton from '@/components/VenuePayButton'
import BillUpload from '@/components/BillUpload'
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
            <span className="money-label gold">Pending referrals</span>
          </div>
          <div className="money-box">
            <span className="money-val green">{confirmed.length}</span>
            <span className="money-label green">Confirmed</span>
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

        {/* Commission owed banner */}
        {totalCommissionOwed > 0 && (
          <div style={{ background: "#1a0f0f", border: "1px solid #f44336", borderRadius: 8, padding: "16px 20px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, color: "#f44336", fontWeight: 600, marginBottom: 4 }}>Commission outstanding: {fmt(totalCommissionOwed)}</div>
              <div style={{ fontSize: 12, color: "#888" }}>Please transfer this amount to ISLA. Invoice will be sent to your finance email.</div>
            </div>
            <a href="mailto:hello@islanetwork.es?subject=Commission Payment" style={{ background: "#C9A96E", color: "#000", padding: "8px 16px", borderRadius: 4, fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", fontWeight: 700, whiteSpace: "nowrap" }}>Contact ISLA</a>
          </div>
        )}

        {/* Pending referrals */}
        <div style={{ marginBottom: 24 }}>
          <div className="mono" style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>Pending referrals — action required</div>
          {pending.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "32px 24px" }}>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>No pending referrals right now</div>
            </div>
          ) : (
            pending.map(b => {
              const concierge = b.concierge as Profile
              return (
                <div key={b.id} className="confirm-card">
                  <div>
                    <div className="confirm-title">{concierge?.full_name || "Concierge"} · {concierge?.property || ""}</div>
                    <div className="confirm-sub">
                      {b.covers ? `${b.covers} covers · ` : ""}
                      {new Date(b.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
                      {b.notes ? ` · ${b.notes}` : ""}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    <ReferralActions bookingId={b.id} />
                    <BillUpload bookingId={b.id} venueName={venue.name} venueEmail={venue.contact_email || ""} commissionRate={venue.commission_rate || "10%"} concierge={concierge?.full_name || "Concierge"} />
                  </div>
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
                  <th>Payment to ISLA</th>
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
                          ? <span className="badge badge-paid">Paid to ISLA ✓</span>
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
                <span>Total paid to ISLA to date</span>
                <span style={{ color: "#4caf50", fontWeight: 600 }}>{fmt(totalCommissionPaid)}</span>
              </div>
            )}
          </div>
        )}

      </div>
    </>
  )
}
