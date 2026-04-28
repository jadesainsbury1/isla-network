import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function AdminPage() {
  const cookieStore = await cookies()
  const adminAuth = cookieStore.get("admin_auth")
  if (!adminAuth || adminAuth.value !== "islaibiza26") redirect("/admin/login")

  const supabase = await createClient()

  const { data: venues } = await supabase.from("venues").select("*").order("created_at", { ascending: false })
  const allVenues = venues || []
  const pending = allVenues.filter(v => !v.is_active)
  const active = allVenues.filter(v => v.is_active)

  const { data: concierges } = await supabase.from("profiles").select("*").eq("role", "concierge").eq("is_approved", false).order("created_at", { ascending: false })
  const pendingConcierges = concierges || []

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px", color: "#fff" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: "#C9A96E", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 4 }}>ISLA Admin</div>
        <div style={{ fontSize: 28, fontWeight: 700 }}>Approvals</div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, color: "#C9A96E", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 16 }}>Concierge Applications - {pendingConcierges.length}</div>
        {pendingConcierges.length === 0 && <div style={{ padding: 24, background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, color: "#888", textAlign: "center" }}>No pending concierge applications</div>}
        {pendingConcierges.map(concierge => (
          <div key={concierge.id} style={{ background: "#1a1a1a", border: "1px solid #444", borderRadius: 8, padding: 20, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{concierge.full_name || "No name"}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{concierge.email}</div>
              {concierge.property && <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{concierge.property}</div>}
            </div>
            <form action="/api/admin/approve-concierge" method="POST">
              <input type="hidden" name="profileId" value={concierge.id} />
              <input type="hidden" name="email" value={concierge.email || ""} />
              <input type="hidden" name="name" value={concierge.full_name || ""} />
              <button style={{ padding: "8px 16px", background: "#C9A96E", color: "#000", border: "none", borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Approve</button>
            </form>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 16 }}>Venue Applications - {pending.length}</div>
        {pending.length === 0 && <div style={{ padding: 24, background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, color: "#888", textAlign: "center" }}>No pending venues</div>}
        {pending.map(venue => (
          <div key={venue.id} style={{ background: "#1a1a1a", border: "1px solid #444", borderRadius: 8, padding: 20, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{venue.name}</div>
              <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase" }}>{venue.category} - {venue.area} - {venue.commission_rate}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <form action="/api/admin/approve" method="POST">
                <input type="hidden" name="venueId" value={venue.id} />
                <button style={{ padding: "8px 16px", background: "#C9A96E", color: "#000", border: "none", borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Approve</button>
              </form>
              <form action="/api/admin/reject" method="POST">
                <input type="hidden" name="venueId" value={venue.id} />
                <button style={{ padding: "8px 16px", background: "transparent", color: "#888", border: "1px solid #333", borderRadius: 4, fontSize: 11, cursor: "pointer" }}>Reject</button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 16 }}>Live Venues - {active.length}</div>
        {active.map(venue => (
          <div key={venue.id} style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 8, padding: "14px 20px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{venue.name}</div>
              <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase" }}>{venue.category} - {venue.area}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {venue.agreement_signed && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, border: "1px solid #C9A96E", color: "#C9A96E" }}>Agreement Signed</span>}
              <form action="/api/admin/toggle-agreement" method="POST">
                <input type="hidden" name="venueId" value={venue.id} />
                <input type="hidden" name="value" value={venue.agreement_signed ? "false" : "true"} />
                <button style={{ padding: "6px 12px", background: "transparent", color: "#888", border: "1px solid #333", borderRadius: 4, fontSize: 10, cursor: "pointer" }}>Toggle Agreement</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
