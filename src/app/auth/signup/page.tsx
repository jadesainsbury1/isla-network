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
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: fullName, role, property }
      }
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Create the profile record
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        role,
        property: property || null,
      })

      if (profileError && !profileError.message.includes('duplicate')) {
        setError(profileError.message)
        setLoading(false)
        return
      }

      // If email confirmation is disabled, go straight to dashboard
      if (data.session) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setSuccess(true)
      }
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: 'var(--cream)', marginBottom: 12 }}>Check your email</h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>
          We sent a confirmation link to <strong style={{ color: 'var(--text)' }}>{email}</strong>.
          Click it to activate your account and access your dashboard.
        </p>
        <Link href="/auth/login" className="btn btn-ghost">Back to Sign In</Link>
      </div>
    )
  }

  return (
    <>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: 'var(--cream)', marginBottom: 6 }}>Join ISLA</h1>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>Create your account below</p>

      {/* Role selector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24, background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 4 }}>
        {(['concierge', 'venue'] as const).map(r => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            style={{
              padding: '8px 0', borderRadius: 4, border: 'none', cursor: 'pointer',
              background: role === r ? 'var(--gold)' : 'transparent',
              color: role === r ? 'var(--ink)' : 'var(--muted)',
              fontFamily: "'DM Mono', monospace", fontSize: 10,
              letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            {r === 'concierge' ? '◉ Concierge / GRM' : '✦ Venue'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label className="form-label">Full name</label>
          <input
            className="form-input"
            type="text"
            placeholder={role === 'concierge' ? 'Sofia Reyes' : 'Nobu Ibiza Bay'}
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">{role === 'concierge' ? 'Hotel / Property' : 'Venue location / area'}</label>
          <input
            className="form-input"
            type="text"
            placeholder={role === 'concierge' ? 'Gran Hotel Montesol' : 'Marina Botafoch, Ibiza'}
            value={property}
            onChange={e => setProperty(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email address</label>
          <input
            className="form-input"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>

        {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

        <button type="submit" className="btn btn-gold btn-full" disabled={loading}>
          {loading ? 'Creating account…' : role === 'concierge' ? 'Request Access — Free →' : 'List Your Venue →'}
        </button>

        <p style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', marginTop: 14, lineHeight: 1.6 }}>
          By joining you agree to ISLA&apos;s terms. {role === 'concierge' ? 'Free for concierges, always.' : 'Venue plans from €500/yr.'}
        </p>
      </form>
    </>
  )
}

export default function SignupPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" className="logo" style={{ fontSize: 28, display: 'inline-block' }}>ISLA</Link>
          <span className="logo-sub" style={{ textAlign: 'center' }}>The Concierge Network</span>
        </div>
        <div style={{ background: 'var(--charcoal)', border: '1px solid var(--border)', borderRadius: 12, padding: 32 }}>
          <Suspense fallback={<div style={{ color: 'var(--muted)' }}>Loading…</div>}>
            <SignupForm />
          </Suspense>
        </div>
        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--muted)', fontSize: 13 }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
