'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [forgotSent, setForgotSent] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleForgotPassword() {
    if (!email) { setError('Please enter your email address first'); return }
    setForgotLoading(true)
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://islanetwork.es/auth/reset-password'
    })
    setForgotSent(true)
    setForgotLoading(false)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" className="logo" style={{ fontSize: 28, display: 'inline-block' }}>ISLA</Link>
          <span className="logo-sub" style={{ textAlign: 'center' }}>The Concierge Network</span>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--charcoal)', border: '1px solid var(--border)', borderRadius: 12, padding: 32 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: 'var(--cream)', marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 28 }}>Sign in to your ISLA account</p>

          <form onSubmit={handleLogin}>
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
                placeholder="Your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {forgotSent && <div style={{ fontSize: 12, color: '#4ade80', marginBottom: 12 }}>Reset link sent — check your email</div>}
          <div style={{ textAlign: 'right', marginBottom: 12, marginTop: -8 }}>
            <button type="button" onClick={handleForgotPassword} disabled={forgotLoading} style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: 12, cursor: 'pointer', padding: 0 }}>
              {forgotLoading ? 'Sending...' : 'Forgot password?'}
            </button>
          </div>
          {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

            <button type="submit" className="btn btn-gold btn-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
        <div style={{ marginTop: 16 }}>
          <div style={{ textAlign: 'center', marginBottom: 12, fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em' }}>OR</div>
          <a href='/auth/google' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '12px 0', background: '#fff', color: '#000', borderRadius: 4, textDecoration: 'none', fontFamily: 'monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <svg width='18' height='18' viewBox='0 0 18 18'><path d='M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z' fill='#4285F4'/><path d='M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z' fill='#34A853'/><path d='M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z' fill='#FBBC05'/><path d='M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z' fill='#EA4335'/></svg>
            Continue with Google
          </a>
        </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--muted)', fontSize: 13 }}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Request access</Link>
        </p>

      </div>
    </div>
  )
}
