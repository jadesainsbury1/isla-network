'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') || 'concierge'
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'concierge' | 'venue'>(defaultRole as 'concierge' | 'venue')
  const [property, setProperty] = useState('')
  const [venueName, setVenueName] = useState('')
  const [venueCategory, setVenueCategory] = useState('')
  const [venueLocation, setVenueLocation] = useState('')
  const [venueWebsite, setVenueWebsite] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const displayName = role === 'venue' ? venueName : fullName
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + '/auth/callback',
        data: { full_name: displayName, role, property: role === 'concierge' ? property : venueName, venue_category: venueCategory || null, venue_location: venueLocation || null, venue_website: venueWebsite || null }
      }
    })
    if (signupError) { setError(signupError.message); setLoading(false); return }
    if (data.user) {
      if (role === "venue") {
        await fetch("/api/venue/create", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ userId: data.user.id, venueName, venueCategory, venueLocation, email }) })
      }

      if (role === "venue") { setSuccess(true) } else if (data.session) { router.push('/dashboard'); router.refresh() } else { setSuccess(true) }
    }
    setLoading(false)
  }

  if (success && role === 'venue') {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: 'var(--cream)', marginBottom: 12 }}>Application received.</h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: 12, fontSize: 14 }}>Thank you for applying to list <strong style={{ color: 'var(--text)' }}>{venueName}</strong> on ISLA.</p>
        <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: 24, fontSize: 14 }}>We will be in touch at <strong style={{ color: 'var(--text)' }}>{email}</strong> within <strong style={{ color: 'var(--gold)' }}>24 hours</strong>.</p>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 10 }}>What happens next</p>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 8 }}>1. We review your application and verify your venue</p>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 8 }}>2. We send you the ISLA Commission Agreement to sign</p>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 8 }}>3. Your venue goes live to every verified concierge</p>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>4. Referrals arrive with unique ISLA reference numbers</p>
        </div>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>Questions? <a href="mailto:hello@islanetwork.es" style={{ color: 'var(--gold)', textDecoration: 'none' }}>hello@islanetwork.es</a></p>
      </div>
    )
  }

  if (success && role === 'concierge') {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: 'var(--cream)', marginBottom: 12 }}>Check your email</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16, fontSize: 14 }}>A confirmation link has been sent to <strong style={{ color: 'var(--text)' }}>{email}</strong>.</p>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px', textAlign: 'left', marginBottom: 16 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 10 }}>What happens next</div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 6 }}>1. Click the link in your email to verify your address</p>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 6 }}>2. Your application goes to the ISLA team for review</p>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>3. We will be in touch within 24 hours to confirm your access</p>
          </div>
        <Link href="/auth/login" className="btn btn-ghost">Back to Sign In</Link>
      </div>
    )
  }

  return (
    <>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: 'var(--cream)', marginBottom: 6 }}>{role === 'venue' ? 'List Your Venue' : 'Join ISLA'}</h1>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>{role === 'venue' ? 'Apply for a founding listing — reviewed within 24 hours.' : 'Free for concierges. Always.'}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24, background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 4 }}>
        {(['concierge', 'venue'] as const).map(r => (
          <button key={r} type="button" onClick={() => setRole(r)} style={{ padding: '8px 0', borderRadius: 4, border: 'none', cursor: 'pointer', background: role === r ? 'var(--gold)' : 'transparent', color: role === r ? 'var(--ink)' : 'var(--muted)', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500 }}>{r === 'concierge' ? 'Concierge / GRM' : 'Venue'}</button>
        ))}
      </div>
      <form onSubmit={handleSignup}>
        {role === 'concierge' && (<>
          <div className="form-group"><label className="form-label">Full name</label><input className="form-input" type="text" placeholder="Sofia Reyes" value={fullName} onChange={e => setFullName(e.target.value)} required /></div>
          <div className="form-group"><label className="form-label">Hotel / Property</label><input className="form-input" type="text" placeholder="Gran Hotel Montesol" value={property} onChange={e => setProperty(e.target.value)} /></div>
        </>)}
        {role === 'venue' && (<>
          <div className="form-group"><label className="form-label">Venue name</label><input className="form-input" type="text" placeholder="Beachhouse Ibiza" value={venueName} onChange={e => setVenueName(e.target.value)} required /></div>
          <div className="form-group"><label className="form-label">Category</label>
            <select className="form-input" value={venueCategory} onChange={e => setVenueCategory(e.target.value)} required style={{ cursor: 'pointer' }}>
              <option value="">Select category</option>
              <option value="restaurant">Restaurant</option>
              <option value="beach_club">Beach Club</option>
              <option value="nightclub">Nightclub</option>
              <option value="beach_restaurant">Beach Restaurant</option>
              <option value="rooftop">Rooftop Bar</option>
              <option value="hotel_fb">Hotel F&B</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group"><label className="form-label">Location / Area</label><input className="form-input" type="text" placeholder="Marina Botafoch, Ibiza" value={venueLocation} onChange={e => setVenueLocation(e.target.value)} required /></div>
          <div className="form-group"><label className="form-label">Website (optional)</label><input className="form-input" type="text" placeholder="beachhouse.es" value={venueWebsite} onChange={e => setVenueWebsite(e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Your name (authorised signatory)</label><input className="form-input" type="text" placeholder="James Whitfield, GM" value={fullName} onChange={e => setFullName(e.target.value)} required /></div>
        </>)}
        <div className="form-group"><label className="form-label">Email address</label><input className="form-input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" /></div>
        <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" /></div>
        {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}
        <button type="submit" className="btn btn-gold btn-full" disabled={loading}>{loading ? 'Submitting...' : role === 'concierge' ? 'Request Access - Free' : 'Submit Venue Application'}</button>
        <p style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>{role === 'concierge' ? 'Free for concierges, always.' : 'Founding venues from 500/yr. Reviewed within 24 hours.'}</p>
      </form>
    </>
  )
}

export default function SignupPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" className="logo" style={{ fontSize: 28, display: 'inline-block' }}>ISLA</Link>
          <span className="logo-sub" style={{ textAlign: 'center' }}>The Concierge Network</span>
        </div>
        <div style={{ background: 'var(--charcoal)', border: '1px solid var(--border)', borderRadius: 12, padding: 32 }}>
          <Suspense fallback={<div style={{ color: 'var(--muted)' }}>Loading...</div>}>
            <SignupForm />
          </Suspense>
        </div>
        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--muted)', fontSize: 13 }}>Already have an account? <Link href="/auth/login" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Sign in</Link></p>
      </div>
    </div>
  )
}
