"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function VenuePayButton({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function markPaid() {
    if (!confirm("Confirm you have transferred this commission to ISLA?")) return
    setLoading(true)
    const supabase = createClient()
    await supabase
      .from("bookings")
      .update({ payment_status: "paid" })
      .eq("id", bookingId)
    setDone(true)
    setLoading(false)
    setTimeout(() => window.location.reload(), 600)
  }

  if (done) return <span className="badge badge-paid">Paid ✓</span>

  return (
    <button
      onClick={markPaid}
      disabled={loading}
      style={{ background: "transparent", border: "1px solid #C9A96E", color: "#C9A96E", padding: "4px 12px", borderRadius: 4, fontSize: 10, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap" }}
    >
      {loading ? "..." : "Mark Paid to Concierge"}
    </button>
  )
}
