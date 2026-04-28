'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Venue } from '@/lib/types'

interface Props {
  userId: string
  existingVenue: Venue | null
  defaultName: string
}

const CATEGORIES = ['Restaurant', 'Beach Club', 'Charter', 'Nightclub', 'Wellness', 'Steakhouse', 'Hotel', 'Other']
const BASES = [
  'Net F&B · excl. service charge & IVA',
  'Net F&B · excl. IVA only',
  'Gross total',
  'Flat fee per booking',
]

export default function VenueListingForm({ userId, existingVenue, defaultName }: Props) {
  const router = useRouter()
  const [name, setName] = useState(existingVenue?.name || defaultName)
  const [category, setCategory] = useState(existingVenue?.category || 'Restaurant')
  const [area, setArea] = useState(existingVenue?.area || '')
  const [commRate, setCommRate] = useState(existingVenue?.commission_rate || '10%')
  const [commBasis, setCommBasis] = useState(existingVenue?.commission_basis || BASES[0])
  const [contact, setContact] = useState(existingVenue?.contact || '')
  const [instructions, setInstructions] = useState(existingVenue?.booking_instructions || '')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSaved(false)

    const supabase = createClient()
    const payload = {
      user_id: userId,
      name,
      category,
      area,
      commission_rate: commRate,
      commission_basis: commBasis,
      contact,
      booking_instructions: instructions,
      is_active: true,
    }

    let err
    if (existingVenue) {
      const res = await supabase.from('venues').update(payload).eq('id', existingVenue.id)
      err = res.error
    } else {
      const res = await supabase.from('venues').insert(payload)
      err = res.error
    }

    if (err) {
      setError(err.message)
    } else {
      if (!existingVenue) { fetch("/api/notify-venue-application", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ name, area, category, contact }) }).catch(console.error) }
      setSaved(true)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="card">
      <div style={{ fontSize: 15, color: 'var(--cream)', fontWeight: 500, marginBottom: 20 }}>Your Listing</div>

      <form onSubmit={handleSave}>
        <div className="form-group">
          <label className="form-label">Venue Name</label>
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} required placeholder="Your venue name" />
        </div>

        <div className="two-col">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Area / Location</label>
            <input className="form-input" value={area} onChange={e => setArea(e.target.value)} placeholder="Marina Botafoch, Ibiza" />
          </div>
          <div className="form-group">
            <label className="form-label">Commission Rate</label>
            <input className="form-input" value={commRate} onChange={e => setCommRate(e.target.value)} placeholder="10%" required />
          </div>
          <div className="form-group">
            <label className="form-label">Commission Basis</label>
            <select className="form-input" value={commBasis} onChange={e => setCommBasis(e.target.value)}>
              {BASES.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Booking Contact &amp; WhatsApp</label>
          <input className="form-input" value={contact} onChange={e => setContact(e.target.value)} placeholder="Isabella Ruiz · +34 971 xxx xxx" />
        </div>

        <div className="form-group">
          <label className="form-label">Booking Instructions (visible to concierges only)</label>
          <textarea
            className="form-input"
            style={{ height: 80, resize: 'vertical' }}
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            placeholder="Always book via WhatsApp min 24hrs ahead. Groups 8+ require 48hrs. Mention ISLA when booking."
          />
        </div>

        {error && <div className="form-error" style={{ marginBottom: 12 }}>{error}</div>}
        {saved && <div style={{ color: 'var(--green-bright)', fontSize: 12, fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>✓ Listing saved successfully</div>}

        <button type="submit" className="btn btn-gold" disabled={loading}>
          {loading ? 'Saving…' : existingVenue ? 'Save Changes' : 'Create Listing →'}
        </button>
      </form>

      <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--charcoal)', border: '1px solid var(--gold-dim)', borderRadius: 'var(--radius)' }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: 6 }}>ISLA Venue Verification</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
          Every venue is reviewed by ISLA before going live. Once approved, your ISLA Verified badge signals quality to the entire concierge community.
        </div>
      </div>
    </div>
  )
}
