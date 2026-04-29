"use client"
import { useState } from "react"

export default function VenueApproveButton({ venueId }: { venueId: string }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function approve() {
    setLoading(true)
    const res = await fetch("/api/admin/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ venueId })
    })
    const data = await res.json()
    if (data.ok) {
      setDone(true)
      setTimeout(() => window.location.reload(), 600)
    }
    setLoading(false)
  }

  if (done) return <span style={{ color: "#4caf50", fontSize: 11, fontFamily: "monospace" }}>Approved ✓</span>

  return (
    <button
      onClick={approve}
      disabled={loading}
      style={{ padding: "8px 16px", background: "#C9A96E", color: "#000", border: "none", borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.6 : 1 }}
    >
      {loading ? "..." : "Approve"}
    </button>
  )
}
