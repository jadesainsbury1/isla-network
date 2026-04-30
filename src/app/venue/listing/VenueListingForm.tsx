'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Venue } from '@/lib/types'
import VenuePackages from '@/components/VenuePackages'
import VenueDocuments from '@/components/VenueDocuments'

interface Props {
  userId: string
  existingVenue: Venue | null
  defaultName: string
}

const CATEGORIES = ['Restaurant', 'Beach Club', 'Beach Restaurant', 'Nightclub', 'Rooftop Bar', 'Hotel F&B', 'Charter', 'Wellness', 'Steakhouse', 'Other']
const BASES = [
  'Net F&B · excl. service charge & IVA',
  'Net F&B · excl. IVA only',
  'Gross total',
  'Flat fee per booking',
]

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>{title}</div>
      {children}
    </div>
  )
}

export default function VenueListingForm({ userId, existingVenue, defaultName }: Props) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(existingVenue?.name || defaultName)
  const [category, setCategory] = useState(existingVenue?.category || 'Restaurant')
  const [area, setArea] = useState(existingVenue?.area || '')
  const [description, setDescription] = useState((existingVenue as any)?.description || '')
  const [website, setWebsite] = useState((existingVenue as any)?.website || '')
  const [instagram, setInstagram] = useState((existingVenue as any)?.instagram || '')
  const [coverImageUrl, setCoverImageUrl] = useState((existingVenue as any)?.cover_image_url || '')

  const [contactName, setContactName] = useState((existingVenue as any)?.contact_name || '')
  const [whatsapp, setWhatsapp] = useState((existingVenue as any)?.whatsapp || '')
  const [contact, setContact] = useState(existingVenue?.contact || '')
  const [invoiceEmail, setInvoiceEmail] = useState((existingVenue as any)?.invoice_email || '')
  const [instructions, setInstructions] = useState(existingVenue?.booking_instructions || '')
  const [seasonalNotes, setSeasonalNotes] = useState((existingVenue as any)?.seasonal_notes || '')

  const [commRate, setCommRate] = useState(existingVenue?.commission_rate || '10%')
  const [commBasis, setCommBasis] = useState(existingVenue?.commission_basis || BASES[0])
  const [tier2Rate, setTier2Rate] = useState((existingVenue as any)?.commission_tier_2_rate || '')
  const [tier2Threshold, setTier2Threshold] = useState((existingVenue as any)?.commission_tier_2_threshold || '')
  const [tier3Rate, setTier3Rate] = useState((existingVenue as any)?.commission_tier_3_rate || '')
  const [tier3Threshold, setTier3Threshold] = useState((existingVenue as any)?.commission_tier_3_threshold || '')

  const [minSpend, setMinSpend] = useState((existingVenue as any)?.min_spend || '')
  const [maxGroup, setMaxGroup] = useState((existingVenue as any)?.max_group_size || '')
  const [agePolicy, setAgePolicy] = useState((existingVenue as any)?.age_policy || '')
  const [dressCode, setDressCode] = useState((existingVenue as any)?.dress_code || '')

  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `covers/${userId}-${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from('bill-photos').upload(path, file, { upsert: true })
    if (upErr) { setError(upErr.message); setUploading(false); return }
    const { data } = supabase.storage.from('bill-photos').getPublicUrl(path)
    setCoverImageUrl(data.publicUrl)
    setUploading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSaved(false)

    const supabase = createClient()
    const payload = {
      user_id: userId,
      name, category, area, description, website, instagram, cover_image_url: coverImageUrl,
      contact_name: contactName, whatsapp, contact, invoice_email: invoiceEmail,
      booking_instructions: instructions, seasonal_notes: seasonalNotes,
      commission_rate: commRate, commission_basis: commBasis,
      commission_tier_2_rate: tier2Rate, commission_tier_2_threshold: tier2Threshold,
      commission_tier_3_rate: tier3Rate, commission_tier_3_threshold: tier3Threshold,
      min_spend: minSpend, max_group_size: maxGroup, age_policy: agePolicy, dress_code: dressCode,
    }

    let err
    if (existingVenue) {
      const res = await supabase.from('venues').update(payload).eq('id', existingVenue.id)
      err = res.error
    } else {
      const res = await supabase.from('venues').insert({ ...payload, is_active: false })
      err = res.error
    }

    if (err) { setError(err.message) } else { setSaved(true); router.refresh() }
    setLoading(false)
  }

  const inp: React.CSSProperties = { width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px', color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }
  const twoCol: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 0 }

  return (
    <div className="card" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: 'var(--cream)', marginBottom: 4 }}>Your Venue Profile</div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>This is how your venue appears to every concierge on the network. Make it count.</div>
      </div>

      <form onSubmit={handleSave}>

        <Section title="Identity">
          <div style={{ marginBottom: 12 }}>
            <label className="form-label">Cover Photo</label>
            <div
              onClick={() => fileRef.current?.click()}
              style={{ width: '100%', height: 160, background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', marginBottom: 4, position: 'relative' }}
            >
              {coverImageUrl
                ? <img src={coverImageUrl} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>+</div>
                    <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em' }}>{uploading ? 'UPLOADING...' : 'UPLOAD COVER IMAGE'}</div>
                  </div>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            {coverImageUrl && <button type="button" onClick={() => fileRef.current?.click()} style={{ fontSize: 11, color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "'DM Mono', monospace" }}>{uploading ? 'Uploading...' : 'Change photo'}</button>}
          </div>

          <div className="form-group">
            <label className="form-label">Venue Name</label>
            <input style={inp} value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div style={twoCol}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select style={inp} value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Area / Location</label>
              <input style={inp} value={area} onChange={e => setArea(e.target.value)} placeholder="Marina Botafoch, Ibiza" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Venue Description</label>
            <textarea style={{ ...inp, height: 90, resize: 'vertical' }} value={description} onChange={e => setDescription(e.target.value)} placeholder="Write 2–3 sentences that capture the essence of your venue — atmosphere, food style, what makes it special for guests." />
          </div>

          <div style={twoCol}>
            <div className="form-group">
              <label className="form-label">Website</label>
              <input style={inp} value={website} onChange={e => setWebsite(e.target.value)} placeholder="beachhouse.es" />
            </div>
            <div className="form-group">
              <label className="form-label">Instagram</label>
              <input style={inp} value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="@beachhouseibiza" />
            </div>
          </div>
        </Section>

        <Section title="Bookings & Contact">
          <div style={twoCol}>
            <div className="form-group">
              <label className="form-label">Booking Contact Name</label>
              <input style={inp} value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Isabella Ruiz, Reservations Manager" />
            </div>
            <div className="form-group">
              <label className="form-label">Direct WhatsApp Number</label>
              <input style={inp} value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+34 971 000 000" />
            </div>
          </div>

          <div style={twoCol}>
            <div className="form-group">
              <label className="form-label">Booking Email</label>
              <input style={inp} type="email" value={contact} onChange={e => setContact(e.target.value)} placeholder="reservations@venue.es" />
            </div>
            <div className="form-group">
              <label className="form-label">Invoice / Finance Email</label>
              <input style={inp} type="email" value={invoiceEmail} onChange={e => setInvoiceEmail(e.target.value)} placeholder="accounts@venue.es" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Booking Instructions <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(visible to concierges only)</span></label>
            <textarea style={{ ...inp, height: 80, resize: 'vertical' }} value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Always book via WhatsApp min 24hrs ahead. Groups 8+ require 48hrs. Mention ISLA when booking." />
          </div>

          <div className="form-group">
            <label className="form-label">Seasonal Notes <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span></label>
            <input style={inp} value={seasonalNotes} onChange={e => setSeasonalNotes(e.target.value)} placeholder="Open May–Oct only. Peak season Jul–Aug fully booked 2 weeks ahead." />
          </div>
        </Section>

        <Section title="Commission Structure">
          <div style={twoCol}>
            <div className="form-group">
              <label className="form-label">Base Commission Rate</label>
              <input style={inp} value={commRate} onChange={e => setCommRate(e.target.value)} placeholder="10%" required />
            </div>
            <div className="form-group">
              <label className="form-label">Commission Basis</label>
              <select style={inp} value={commBasis} onChange={e => setCommBasis(e.target.value)}>
                {BASES.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div style={{ background: 'var(--charcoal)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>Tiered commission (optional) — reward concierges for higher spend tables</div>
            <div style={twoCol}>
              <div className="form-group" style={{ marginBottom: 8 }}>
                <label className="form-label">Tier 2 — From spend of</label>
                <input style={inp} value={tier2Threshold} onChange={e => setTier2Threshold(e.target.value)} placeholder="€2,000" />
              </div>
              <div className="form-group" style={{ marginBottom: 8 }}>
                <label className="form-label">Tier 2 Commission Rate</label>
                <input style={inp} value={tier2Rate} onChange={e => setTier2Rate(e.target.value)} placeholder="12%" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Tier 3 — From spend of</label>
                <input style={inp} value={tier3Threshold} onChange={e => setTier3Threshold(e.target.value)} placeholder="€5,000" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Tier 3 Commission Rate</label>
                <input style={inp} value={tier3Rate} onChange={e => setTier3Rate(e.target.value)} placeholder="15%" />
              </div>
            </div>
          </div>
        </Section>

        <Section title="Policies">
          <div style={twoCol}>
            <div className="form-group">
              <label className="form-label">Minimum Spend</label>
              <input style={inp} value={minSpend} onChange={e => setMinSpend(e.target.value)} placeholder="€150 per person" />
            </div>
            <div className="form-group">
              <label className="form-label">Maximum Group Size</label>
              <input style={inp} value={maxGroup} onChange={e => setMaxGroup(e.target.value)} placeholder="20 guests" />
            </div>
            <div className="form-group">
              <label className="form-label">Age Policy</label>
              <input style={inp} value={agePolicy} onChange={e => setAgePolicy(e.target.value)} placeholder="18+ only" />
            </div>
            <div className="form-group">
              <label className="form-label">Dress Code</label>
              <input style={inp} value={dressCode} onChange={e => setDressCode(e.target.value)} placeholder="Smart casual. No sportswear." />
            </div>
          </div>
        </Section>

        {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}
        {saved && <div style={{ color: '#4caf50', fontSize: 12, fontFamily: "'DM Mono', monospace", marginBottom: 16 }}>✓ Profile saved successfully</div>}

        <button type="submit" className="btn btn-gold" disabled={loading || uploading} style={{ width: '100%', padding: '14px', fontSize: 12 }}>
          {loading ? 'Saving…' : 'Save Venue Profile'}
        </button>
      </form>

      {existingVenue && (
        <div style={{ marginTop: 28 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>Packages & Offers</div>
          <VenuePackages venueId={existingVenue.id} initial={(existingVenue as any).packages || []} />
        </div>
      )}

      {existingVenue && (
        <div style={{ marginTop: 28 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>Documents for Concierges</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.6 }}>Upload menus, bed packages, rate cards, or floor plans. Concierges will see these when viewing your venue profile.</div>
          <VenueDocuments venueId={existingVenue.id} userId={userId} initial={(existingVenue as any).documents || []} />
        </div>
      )}

      <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--charcoal)', border: '1px solid var(--gold-dim)', borderRadius: 'var(--radius)' }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>ISLA Venue Verification</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>Every venue is reviewed by ISLA before going live. Once approved, your ISLA Verified badge signals quality to the entire concierge community.</div>
      </div>
    </div>
  )
}
