"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Package {
  id: string
  name: string
  price: string
  min_spend: string
  description: string
  type: string
}

export default function VenuePackages({ venueId, initial }: { venueId: string, initial: Package[] }) {
  const [packages, setPackages] = useState<Package[]>(initial || [])
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: "", price: "", min_spend: "", description: "", type: "table" })
  const [saving, setSaving] = useState(false)

  const TYPES = ["Table", "Bed", "Cabana", "Private dining", "Day pass", "Package", "Other"]

  async function addPackage() {
    if (!form.name) return
    setSaving(true)
    const newPkg: Package = { ...form, id: Date.now().toString() }
    const updated = [...packages, newPkg]
    const supabase = createClient()
    await supabase.from("venues").update({ packages: updated }).eq("id", venueId)
    setPackages(updated)
    setForm({ name: "", price: "", min_spend: "", description: "", type: "table" })
    setEditing(false)
    setSaving(false)
  }

  async function removePackage(id: string) {
    const updated = packages.filter(p => p.id !== id)
    const supabase = createClient()
    await supabase.from("venues").update({ packages: updated }).eq("id", venueId)
    setPackages(updated)
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.3em", color: "var(--muted)", textTransform: "uppercase" }}>Packages & Offers</div>
        <button onClick={() => setEditing(true)} className="btn btn-ghost" style={{ fontSize: 10, padding: "5px 12px" }}>+ Add</button>
      </div>

      {packages.length === 0 && !editing && (
        <div style={{ fontSize: 12, color: "var(--muted)", fontStyle: "italic" }}>No packages added yet. Add beds, tables, minimum spends, or day passes.</div>
      )}

      {packages.map(pkg => (
        <div key={pkg.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: "var(--cream)", fontWeight: 500 }}>{pkg.name}</span>
              <span style={{ background: "#1a1a2a", border: "1px solid #2a2a4a", borderRadius: 3, padding: "2px 6px", fontSize: 9, fontFamily: "monospace", color: "#888", textTransform: "uppercase" }}>{pkg.type}</span>
            </div>
            {pkg.description && <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{pkg.description}</div>}
            <div style={{ display: "flex", gap: 12 }}>
              {pkg.price && <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--gold)" }}>€{pkg.price}</span>}
              {pkg.min_spend && <span style={{ fontSize: 11, fontFamily: "monospace", color: "#888" }}>Min spend €{pkg.min_spend}</span>}
            </div>
          </div>
          <button onClick={() => removePackage(pkg.id)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16, padding: "0 4px" }}>×</button>
        </div>
      ))}

      {editing && (
        <div style={{ background: "var(--charcoal)", border: "1px solid var(--border)", borderRadius: 8, padding: 20, marginTop: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" placeholder="e.g. VIP Bed, Private Table" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                {TYPES.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Price (€)</label>
              <input className="form-input" placeholder="350" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Min spend (€)</label>
              <input className="form-input" placeholder="1500" value={form.min_spend} onChange={e => setForm({...form, min_spend: e.target.value})} />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">Description</label>
            <input className="form-input" placeholder="Includes bottle service, priority check-in, dedicated host" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={addPackage} className="btn btn-gold" disabled={saving}>{saving ? "Saving..." : "Add Package"}</button>
            <button onClick={() => setEditing(false)} className="btn btn-ghost">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
