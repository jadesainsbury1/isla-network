export default function PendingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          letterSpacing: '0.25em',
          color: 'var(--gold)',
          textTransform: 'uppercase',
          marginBottom: 24
        }}>ISLA · The Concierge Network</div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 32,
          fontWeight: 300,
          color: 'var(--cream)',
          marginBottom: 16,
          lineHeight: 1.2
        }}>Application received.</h1>

        <p style={{
          color: 'var(--muted)',
          fontSize: 14,
          lineHeight: 1.8,
          marginBottom: 32
        }}>
          We personally review every concierge application to maintain the quality of the network.
          You will hear from us within 24 hours.
        </p>

        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '20px 24px',
          textAlign: 'left'
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            letterSpacing: '0.2em',
            color: 'var(--gold)',
            textTransform: 'uppercase',
            marginBottom: 12
          }}>What happens next</div>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 8 }}>1. We review your profile and background</p>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 8 }}>2. You receive an approval email from ISLA</p>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>3. Full access to venues, bookings and commissions</p>
        </div>

        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 24 }}>
          Questions? <a href="mailto:hello@islanetwork.es" style={{ color: 'var(--gold)', textDecoration: 'none' }}>hello@islanetwork.es</a>
        </p>
        <a href="/" style={{ display: 'inline-block', marginTop: 20, color: 'var(--gold)', fontSize: 11, fontFamily: "monospace", textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none' }}>&larr; Back to home</a>
      </div>
    </div>
  )
}
