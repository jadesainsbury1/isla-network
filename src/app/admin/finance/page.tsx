import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function FinancePage() {
  const cookieStore = await cookies()
  const adminAuth = cookieStore.get("admin_auth")
  if (!adminAuth || adminAuth.value !== "islaibiza26") redirect("/admin/login")

  const supabase = await createClient()

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, venues(name, area)")
    .order("date", { ascending: false })

  const all = bookings || []

  const totalRevenue = all.reduce((s, b) => s + (b.bill_amount || 0), 0)
  const totalCommission = all.reduce((s, b) => s + (b.commission_amount || 0), 0)
  const totalPaid = all.filter(b => b.payment_status === "paid").reduce((s, b) => s + (b.commission_amount || 0), 0)
  const totalUnpaid = all.filter(b => b.payment_status !== "paid").reduce((s, b) => s + (b.commission_amount || 0), 0)
  const totalPending = all.filter(b => b.commission_status === "pending").reduce((s, b) => s + (b.commission_amount || 0), 0)

  // Group by concierge name (extracted from notes)
  const byConcierge: Record<string, { bookings: number, commission: number, paid: number }> = {}
  for (const b of all) {
    const name = b.notes?.split(" · ")[0] || "Unknown"
    if (!byConcierge[name]) byConcierge[name] = { bookings: 0, commission: 0, paid: 0 }
    byConcierge[name].bookings++
    byConcierge[name].commission += b.commission_amount || 0
    if (b.payment_status === "paid") byConcierge[name].paid += b.commission_amount || 0
  }

  // Group by venue
  const byVenue: Record<string, { bookings: number, revenue: number, commission: number }> = {}
  for (const b of all) {
    const name = (b.venues as any)?.name || "Unknown"
    if (!byVenue[name]) byVenue[name] = { bookings: 0, revenue: 0, commission: 0 }
    byVenue[name].bookings++
    byVenue[name].revenue += b.bill_amount || 0
    byVenue[name].commission += b.commission_amount || 0
  }

  const fmt = (n: number) => "€" + n.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })

  const statCard = (label: string, value: string, sub?: string, color?: string) => (
    <div style={{ background: "#111", border: "1px solid #222", borderRadius: 8, padding: "20px 24px" }}>
      <div style={{ fontSize: 11, color: "#555", fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: color || "#f0ece4", marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#555" }}>{sub}</div>}
    </div>
  )

  const badge = (status: string) => {
    const map: Record<string, [string, string]> = {
      paid: ["#1a3a1a", "#4caf50"],
      unpaid: ["#3a1a1a", "#f44336"],
      pending: ["#2a2a1a", "#C9A96E"],
      approved: ["#1a2a3a", "#64b5f6"],
    }
    const [bg, color] = map[status] || ["#1a1a1a", "#888"]
    return <span style={{ background: bg, color, fontSize: 10, fontFamily: "monospace", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>{status}</span>
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px", color: "#fff" }}>
      <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 11, color: "#C9A96E", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 4, fontFamily: "monospace" }}>ISLA Admin</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>Finance Overview</div>
          <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>April 2026</div>
        </div>
        <a href="/admin" style={{ fontSize: 11, color: "#555", fontFamily: "monospace", letterSpacing: "0.1em", textDecoration: "none" }}>← Back to Admin</a>
      </div>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 32 }}>
        {statCard("Total F&B Revenue", fmt(totalRevenue), `${all.length} bookings`)}
        {statCard("Total Commission", fmt(totalCommission), "across all venues")}
        {statCard("Commission Paid", fmt(totalPaid), "to concierges", "#4caf50")}
        {statCard("Commission Unpaid", fmt(totalUnpaid), "outstanding", "#f44336")}
        {statCard("Pending Approval", fmt(totalPending), "awaiting sign-off", "#C9A96E")}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* By Concierge */}
        <div style={{ background: "#111", border: "1px solid #222", borderRadius: 8, padding: 24 }}>
          <div style={{ fontSize: 11, color: "#C9A96E", fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Commission by Concierge</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #222" }}>
                <th style={{ textAlign: "left", padding: "6px 0", color: "#555", fontWeight: 400, fontSize: 11 }}>Concierge</th>
                <th style={{ textAlign: "right", padding: "6px 0", color: "#555", fontWeight: 400, fontSize: 11 }}>Bookings</th>
                <th style={{ textAlign: "right", padding: "6px 0", color: "#555", fontWeight: 400, fontSize: 11 }}>Commission</th>
                <th style={{ textAlign: "right", padding: "6px 0", color: "#555", fontWeight: 400, fontSize: 11 }}>Paid</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(byConcierge).sort((a, b) => b[1].commission - a[1].commission).map(([name, data]) => (
                <tr key={name} style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <td style={{ padding: "10px 0", color: "#f0ece4" }}>{name}</td>
                  <td style={{ padding: "10px 0", textAlign: "right", color: "#888" }}>{data.bookings}</td>
                  <td style={{ padding: "10px 0", textAlign: "right", color: "#C9A96E", fontWeight: 600 }}>{fmt(data.commission)}</td>
                  <td style={{ padding: "10px 0", textAlign: "right", color: data.paid === data.commission ? "#4caf50" : "#f44336" }}>{fmt(data.paid)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* By Venue */}
        <div style={{ background: "#111", border: "1px solid #222", borderRadius: 8, padding: 24 }}>
          <div style={{ fontSize: 11, color: "#C9A96E", fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Revenue by Venue</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #222" }}>
                <th style={{ textAlign: "left", padding: "6px 0", color: "#555", fontWeight: 400, fontSize: 11 }}>Venue</th>
                <th style={{ textAlign: "right", padding: "6px 0", color: "#555", fontWeight: 400, fontSize: 11 }}>Bookings</th>
                <th style={{ textAlign: "right", padding: "6px 0", color: "#555", fontWeight: 400, fontSize: 11 }}>F&B Revenue</th>
                <th style={{ textAlign: "right", padding: "6px 0", color: "#555", fontWeight: 400, fontSize: 11 }}>Commission</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(byVenue).sort((a, b) => b[1].revenue - a[1].revenue).map(([name, data]) => (
                <tr key={name} style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <td style={{ padding: "10px 0", color: "#f0ece4" }}>{name}</td>
                  <td style={{ padding: "10px 0", textAlign: "right", color: "#888" }}>{data.bookings}</td>
                  <td style={{ padding: "10px 0", textAlign: "right", color: "#888" }}>{fmt(data.revenue)}</td>
                  <td style={{ padding: "10px 0", textAlign: "right", color: "#C9A96E", fontWeight: 600 }}>{fmt(data.commission)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All bookings */}
      <div style={{ background: "#111", border: "1px solid #222", borderRadius: 8, padding: 24 }}>
        <div style={{ fontSize: 11, color: "#C9A96E", fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>All Bookings — {all.length} records</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #222" }}>
              {["Date", "Concierge", "Venue", "Covers", "F&B Spend", "Commission", "Status", "Payment"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: "#555", fontWeight: 400, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {all.map(b => (
              <tr key={b.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
                <td style={{ padding: "10px 8px", color: "#888", whiteSpace: "nowrap" }}>{new Date(b.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</td>
                <td style={{ padding: "10px 8px", color: "#f0ece4" }}>{b.notes?.split(" · ")[0] || "—"}</td>
                <td style={{ padding: "10px 8px", color: "#888" }}>{(b.venues as any)?.name || "—"}</td>
                <td style={{ padding: "10px 8px", color: "#888", textAlign: "center" }}>{b.covers}</td>
                <td style={{ padding: "10px 8px", color: "#f0ece4" }}>{b.bill_amount ? fmt(b.bill_amount) : "—"}</td>
                <td style={{ padding: "10px 8px", color: "#C9A96E", fontWeight: 600 }}>{b.commission_amount ? fmt(b.commission_amount) : "—"}</td>
                <td style={{ padding: "10px 8px" }}>{badge(b.commission_status || "pending")}</td>
                <td style={{ padding: "10px 8px" }}>{badge(b.payment_status || "unpaid")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
