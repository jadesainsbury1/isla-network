"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

const TIERS = ["verified", "preferred", "elite"]
const COLORS: Record<string, string> = { verified: "#555", preferred: "#C9A96E", elite: "#fff" }
const BGS: Record<string, string> = { verified: "#1a1a1a", preferred: "#2a2000", elite: "#1a0a2a" }

export default function ConciergeTierBadge({ profileId, currentTier }: { profileId: string; currentTier: string }) {
  const [tier, setTier] = useState(currentTier || "verified")
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  async function updateTier(t: string) {
    setSaving(true)
    const supabase = createClient()
    await supabase.from("profiles").update({ concierge_tier: t }).eq("id", profileId)
    setTier(t); setOpen(false); setSaving(false)
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setOpen(!open)} style={{ background: BGS[tier], color: COLORS[tier], border: `1px solid ${COLORS[tier]}`, padding: "3px 10px", borderRadius: 4, fontSize: 10, fontFamily: "monospace", letterSpacing: "0.1em", cursor: "pointer", textTransform: "uppercase" }}>
        {saving ? "..." : tier} ▾
      </button>
      {open && (
        <div style={{ position: "absolute", top: "100%", left: 0, background: "#1a1a1a", border: "1px solid #333", borderRadius: 4, zIndex: 10, minWidth: 120, marginTop: 4 }}>
          {TIERS.map(t => (
            <button key={t} onClick={() => updateTier(t)} style={{ display: "block", width: "100%", padding: "8px 12px", background: "transparent", color: COLORS[t], border: "none", fontSize: 10, fontFamily: "monospace", letterSpacing: "0.1em", cursor: "pointer", textAlign: "left", textTransform: "uppercase" }}>{t}</button>
          ))}
        </div>
      )}
    </div>
  )
}
