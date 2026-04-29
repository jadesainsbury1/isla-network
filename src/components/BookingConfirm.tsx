"use client"
import { useState } from "react"

interface Props {
  bookingId: string
  venueId: string
  currentStatus: string
}

export default function BookingConfirm({ bookingId, venueId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  async function act(action: string) {
    setLoading(true)
    const res = await fetch("/api/booking/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, venueId, action })
    })
    const data = await res.json()
    if (data.ok) setStatus(data.status)
    setLoading(false)
  }

  if (status === "confirmed") return (
    <span style={{ background: "#1a3a1a", color: "#4caf50", fontSize: 10, fontFamily: "monospace", padding: "4px 10px", borderRadius: 4, letterSpacing: "0.1em" }}>CONFIRMED ✓</span>
  )
  if (status === "rejected") return (
    <span style={{ background: "#3a1a1a", color: "#f44336", fontSize: 10, fontFamily: "monospace", padding: "4px 10px", borderRadius: 4, letterSpacing: "0.1em" }}>REJECTED</span>
  )

  return (
    <div style={{ display: "flex", gap: 6 }}>
      <button onClick={() => act("confirm")} disabled={loading} style={{ padding: "6px 14px", background: "#1a3a1a", border: "1px solid #2a5a2a", color: "#4caf50", borderRadius: 4, fontSize: 10, fontFamily: "monospace", letterSpacing: "0.1em", cursor: "pointer", fontWeight: 700 }}>
        {loading ? "..." : "CONFIRM"}
      </button>
      <button onClick={() => act("reject")} disabled={loading} style={{ padding: "6px 14px", background: "#3a1a1a", border: "1px solid #5a2a2a", color: "#f44336", borderRadius: 4, fontSize: 10, fontFamily: "monospace", letterSpacing: "0.1em", cursor: "pointer" }}>
        {loading ? "..." : "REJECT"}
      </button>
    </div>
  )
}
