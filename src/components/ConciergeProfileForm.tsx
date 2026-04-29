"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

const GUEST_PROFILES = ["Ultra-high net worth","Corporate & incentive groups","Sports & entertainment","Superyacht guests","Celebrity & VIP","Families (high-end)","European leisure (premium)"]
const NATIONALITIES = ["British","German","Dutch","French","Scandinavian","Middle Eastern","American","Russian","Asian","Mixed international"]
const LANGUAGES = ["English","Spanish","French","German","Dutch","Italian","Arabic","Russian","Mandarin","Portuguese"]

export default function ConciergeProfileForm({ userId, existingData }: { userId: string; existingData?: any }) {
  const [bio, setBio] = useState(existingData?.bio || "")
  const [guestProfiles, setGuestProfiles] = useState<string[]>(existingData?.guest_profile || [])
  const [groupSize, setGroupSize] = useState(existingData?.typical_group_size || "")
  const [avgSpend, setAvgSpend] = useState(existingData?.avg_spend_per_visit || "")
  const [nationalities, setNationalities] = useState<string[]>(existingData?.guest_nationalities || [])
  const [languages, setLanguages] = useState<string[]>(existingData?.languages_spoken || [])
  const [season, setSeason] = useState(existingData?.season || "")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function toggle(arr: string[], val: string, set: (a: string[]) => void) {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  async function save() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from("profiles").update({ bio, guest_profile: guestProfiles, typical_group_size: groupSize, avg_spend_per_visit: avgSpend, guest_nationalities: nationalities, languages_spoken: languages, season }).eq("id", userId)
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const Tag = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
    <button onClick={onClick} style={{ padding: "6px 12px", background: selected ? "#C9A96E" : "#1a1a1a", color: selected ? "#000" : "#888", border: `1px solid ${selected ? "#C9A96E" : "#333"}`, borderRadius: 4, fontSize: 11, fontFamily: "monospace", cursor: "pointer", marginRight: 6, marginBottom: 6, fontWeight: selected ? 700 : 400 }}>{label}</button>
  )

  return (
    <div style={{ background: "#111", border: "1px solid #222", borderRadius: 8, padding: 24 }}>
      <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.3em", color: "#C9A96E", textTransform: "uppercase", marginBottom: 20 }}>Your Client Profile</div>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 24, lineHeight: 1.6 }}>Tell us about the guests you work with. This helps ISLA match you with venues that will impress your clients.</p>

      <div style={{ marginBottom: 20 }}>
        <label className="form-label" style={{ display: "block", marginBottom: 6 }}>About you & your guests</label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="e.g. Senior concierge at Atzaró Hotel. I work primarily with European UHNW guests — German and Dutch families, corporate groups, and superyacht clients." rows={3} style={{ width: "100%", padding: "10px 12px", background: "#1a1a1a", border: "1px solid #333", borderRadius: 4, color: "#fff", fontSize: 13, boxSizing: "border-box", resize: "vertical", lineHeight: 1.6 }} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label className="form-label" style={{ display: "block", marginBottom: 10 }}>Guest profile — select all that apply</label>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {GUEST_PROFILES.map(p => <Tag key={p} label={p} selected={guestProfiles.includes(p)} onClick={() => toggle(guestProfiles, p, setGuestProfiles)} />)}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <label className="form-label" style={{ display: "block", marginBottom: 6 }}>Typical group size</label>
          <select className="form-input" value={groupSize} onChange={e => setGroupSize(e.target.value)}>
            <option value="">Select</option>
            <option value="small">Small — 2 to 4</option>
            <option value="medium">Medium — 5 to 10</option>
            <option value="large">Large — 10+</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
        <div>
          <label className="form-label" style={{ display: "block", marginBottom: 6 }}>Average spend per visit</label>
          <select className="form-input" value={avgSpend} onChange={e => setAvgSpend(e.target.value)}>
            <option value="">Select</option>
            <option value="under1k">Under €1,000</option>
            <option value="1k-3k">€1,000 – €3,000</option>
            <option value="3k-8k">€3,000 – €8,000</option>
            <option value="8k+">€8,000+</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label className="form-label" style={{ display: "block", marginBottom: 10 }}>Primary guest nationalities</label>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {NATIONALITIES.map(n => <Tag key={n} label={n} selected={nationalities.includes(n)} onClick={() => toggle(nationalities, n, setNationalities)} />)}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label className="form-label" style={{ display: "block", marginBottom: 10 }}>Languages spoken</label>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {LANGUAGES.map(l => <Tag key={l} label={l} selected={languages.includes(l)} onClick={() => toggle(languages, l, setLanguages)} />)}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label className="form-label" style={{ display: "block", marginBottom: 6 }}>Season availability</label>
        <select className="form-input" value={season} onChange={e => setSeason(e.target.value)}>
          <option value="">Select</option>
          <option value="full">Full season — May to October</option>
          <option value="peak">Peak only — July and August</option>
          <option value="yearround">Year round</option>
        </select>
      </div>

      <button onClick={save} disabled={saving} style={{ padding: "10px 24px", background: "#C9A96E", color: "#000", border: "none", borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "monospace", letterSpacing: "0.1em", opacity: saving ? 0.6 : 1 }}>
        {saving ? "Saving..." : saved ? "Saved ✓" : "Save Profile"}
      </button>
    </div>
  )
}
