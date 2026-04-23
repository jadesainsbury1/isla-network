import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── NAV ── */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '24px 48px', borderBottom: '1px solid var(--border)'
      }}>
        <div>
          <div className="logo">ISLA</div>
          <span className="logo-sub">The Concierge Network</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/auth/login" className="btn btn-ghost btn-sm">Sign In</Link>
          <Link href="/auth/signup" className="btn btn-gold btn-sm">Request Access</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center', padding: '80px 48px 48px',
        position: 'relative',
        background: 'radial-gradient(ellipse 60% 50% at 50% 30%, #C9A96E0A, transparent 60%), radial-gradient(ellipse 40% 60% at 20% 80%, #4A8A5A06, transparent 60%)'
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.4em',
          color: 'var(--gold-dim)', textTransform: 'uppercase', marginBottom: 28,
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--gold-dim)' }} />
          Verified · Ibiza 2026 · Expanding Globally
          <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--gold-dim)' }} />
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(44px, 8vw, 96px)',
          fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.02em',
          color: 'var(--cream)', marginBottom: 24
        }}>
          Never lose a<br />commission <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>again.</em>
        </h1>

        <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'var(--muted)', maxWidth: 500, lineHeight: 1.7, marginBottom: 12 }}>
          Track every euro you&apos;re owed. Know who&apos;s paid. Know who hasn&apos;t.
          Find the highest-paying booking <strong style={{ color: 'var(--text)' }}>right now.</strong>
        </p>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
          {['💰 Live commission rates', '✓ Payment tracking', '⚡ Real-time opportunities', 'Free for concierges'].map((pill, i) => (
            <span key={pill} style={{
              padding: '6px 14px', borderRadius: 20,
              fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.15em',
              color: i < 3 ? 'var(--gold)' : 'var(--muted)',
              border: `1px solid ${i < 3 ? 'var(--gold-dim)' : 'var(--border)'}`,
              background: i < 3 ? '#C9A96E0A' : 'transparent'
            }}>{pill}</span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
          <Link href="/auth/signup?role=concierge" className="btn btn-gold">Request Access — Free</Link>
          <Link href="/auth/signup?role=venue" className="btn btn-ghost">List Your Venue</Link>
        </div>

        {/* Money preview card */}
        <div style={{
          background: 'var(--charcoal)', border: '1px solid var(--border)', borderRadius: 12,
          padding: '24px 28px', maxWidth: 520, width: '100%'
        }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20, textAlign: 'left' }}>
            Your season at a glance · Sofia Reyes · Gran Hotel Montesol
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { val: '€14,820', label: 'Total owed', color: 'var(--gold)', labelColor: 'var(--gold-dim)' },
              { val: '€11,140', label: 'Confirmed', color: 'var(--green-bright)', labelColor: 'var(--green)' },
              { val: '€3,680', label: 'Overdue', color: 'var(--red-bright)', labelColor: 'var(--red)' },
            ].map(({ val, label, color, labelColor }) => (
              <div key={label} style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '16px 12px', textAlign: 'center' }}>
                <span className="serif" style={{ fontSize: 28, fontWeight: 300, color, display: 'block', lineHeight: 1, marginBottom: 4 }}>{val}</span>
                <span className="mono" style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: labelColor }}>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { name: '🍣 Nobu Ibiza Bay · 4 covers · Apr 17', val: '€120 ✓', color: 'var(--green-bright)' },
              { name: '🛥 Ocean Beats Charter · 6hr · Apr 16', val: '€350 ✓', color: 'var(--green-bright)' },
              { name: '🍽 Sa Caleta · 8 covers · Apr 14', val: '€200 overdue', color: 'var(--red-bright)' },
              { name: '🎉 Ushuaïa VIP · 12 guests · Apr 12', val: '€480 pending', color: 'var(--gold)' },
            ].map(({ name, val, color }) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--surface)', borderRadius: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--text)' }}>{name}</span>
                <span className="mono" style={{ fontSize: 12, color }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES STRIP ── */}
      <div style={{ background: 'var(--charcoal)', borderTop: '1px solid var(--border)', padding: '40px 48px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
        {[
          { icon: '💰', title: 'Your revenue dashboard', desc: 'Total owed, confirmed, overdue — at a glance. Every commission tracked from the moment you log it. Never lose money because you forgot to chase.' },
          { icon: '⚡', title: 'Live opportunities', desc: 'Last-minute tables, elevated commissions, high-spend experiences — posted live by venues. You hear about them first. Not after everyone else.' },
          { icon: '🔒', title: 'Verified. Protected.', desc: 'Every venue verified. Commission terms agreed upfront. Payment reliability scores before you commit. Your income is protected before you pick up the phone.' },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{ paddingRight: 32, borderRight: '1px solid var(--border)' }} className="last:border-none">
            <span style={{ fontSize: 24, display: 'block', marginBottom: 12 }}>{icon}</span>
            <div style={{ fontSize: 14, color: 'var(--cream)', fontWeight: 500, marginBottom: 8 }}>{title}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* ── FOR CONCIERGES ── */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '64px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
        <div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: 16, display: 'block' }}>For Concierges &amp; GRMs · Always Free</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1, marginBottom: 24 }}>
            Know where the money is.<br /><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Right now. Today.</em>
          </h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'See which venues pay the highest commissions — sorted by rate, not alphabet',
              'Your personal revenue dashboard: owed, confirmed, overdue, paid',
              'Log a booking in 10 seconds. Track every euro from referral to payout.',
              'Live opportunities — last-minute tables, elevated commissions, priority access',
              'Payment reliability scores — know who pays before you refer',
            ].map(item => (
              <li key={item} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
                <span style={{ color: 'var(--gold)', marginTop: 2 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 24 }}>
            <Link href="/auth/signup?role=concierge" className="btn btn-gold">Request Access — Free →</Link>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Top opportunities right now</div>
          {[
            { name: '🔥 Nobu Ibiza Bay — Last-minute tables', sub: 'Tonight only · Tables of 4+ · Limited', comm: '15%', basis: 'Net F&B · boosted', hot: true },
            { name: 'Ocean Beats Charter', sub: 'Weekend availability · Full day · Any group', comm: '12%', basis: 'Gross charter value', hot: false },
            { name: 'Atzaró Spa & Wellness', sub: 'Weekend packages · 2 pax min · All inclusive', comm: '15%', basis: 'Gross package price', hot: false },
          ].map(({ name, sub, comm, basis, hot }) => (
            <div key={name} className={`opp-card${hot ? ' hot' : ''}`}>
              <div>
                <div className="opp-title">{name}</div>
                <div className="opp-sub">{sub}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span className="opp-comm">{comm}</span>
                <span className="opp-basis">{basis}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOR VENUES ── */}
      <div style={{ background: 'var(--charcoal)', borderTop: '1px solid var(--border)', padding: '64px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
        <div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: 16, display: 'block' }}>For Venues · From €500/yr</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1, marginBottom: 24 }}>
            If you&apos;re not on ISLA,<br />the best concierges<br /><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>won&apos;t find you.</em>
          </h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'When a top concierge asks "where tonight?" — you\'re the answer they see',
              'Post live opportunities: last-minute tables, elevated commissions, special events',
              'See exactly who referred, what was confirmed, and who went quiet',
              'One source of truth for GRM, reservations and finance — no more gaps',
              'Pay reliably. Build your reputation. Get recommended first.',
            ].map(item => (
              <li key={item} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
                <span style={{ color: 'var(--gold)', marginTop: 2 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 24 }}>
            <Link href="/auth/signup?role=venue" className="btn btn-ghost">List Your Venue →</Link>
          </div>
        </div>
        <div>
          <div className="confirm-card">
            <div>
              <div className="confirm-title">Sofia Reyes · Gran Hotel Montesol</div>
              <div className="confirm-sub">Table of 8 · Tonight · Dinner · Est. commission €240</div>
            </div>
            <div className="confirm-actions">
              <span className="btn btn-green btn-sm">Confirm</span>
              <span className="btn btn-ghost btn-sm">Reject</span>
            </div>
          </div>
          <div className="confirm-card" style={{ borderColor: 'var(--border)' }}>
            <div>
              <div className="confirm-title">Marco Delgado · Atzaró Hotel</div>
              <div className="confirm-sub">Table of 4 · Tomorrow lunch · Est. commission €120</div>
            </div>
            <div className="confirm-actions">
              <span className="btn btn-green btn-sm">Confirm</span>
              <span className="btn btn-ghost btn-sm">Reject</span>
            </div>
          </div>
          <div style={{ padding: '16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginTop: 2 }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Your season so far</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center' }}>
              {[{ val: '34', label: 'Concierges' }, { val: '187', label: 'Covers sent' }, { val: '⭐⭐⭐⭐⭐', label: 'Payout score' }].map(({ val, label }) => (
                <div key={label}>
                  <div className="serif" style={{ fontSize: 24, color: 'var(--gold)', fontWeight: 300 }}>{val}</div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CLOSER ── */}
      <div style={{ textAlign: 'center', padding: '80px 48px', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1, marginBottom: 16 }}>
          If you&apos;re not in ISLA,<br />you&apos;re <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>missing money.</em>
        </h2>
        <p style={{ color: 'var(--muted)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
          The island&apos;s top concierges open ISLA to find tonight&apos;s best opportunity. If you&apos;re not listed, you don&apos;t exist in that moment.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth/signup?role=concierge" className="btn btn-gold">Request Access — Free</Link>
          <Link href="/auth/signup?role=venue" className="btn btn-ghost">List Your Venue</Link>
        </div>
        <div className="mono" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--muted)', marginTop: 48 }}>
          ISLA · Never Lose a Commission Again · Ibiza 2026 → Dubai · London · Mykonos
        </div>
      </div>

    </div>
  )
}
