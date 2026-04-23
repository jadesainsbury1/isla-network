'use client'
import { useState } from 'react'
import Link from 'next/link'

const FAQ_LEFT = [
  {
    q: 'Is ISLA really free for concierges?',
    a: 'Yes. Free for concierges. Always. No hidden costs, no premium tier required to access commission data or log referrals. Venues pay — concierges never do. That\'s the model and it doesn\'t change.',
  },
  {
    q: 'I already know all my venues. Why do I need ISLA?',
    a: 'You know the venues you\'ve built relationships with. But new venues open every season — and right now you only find out when the brown envelope arrives. ISLA alerts you the moment a new venue goes live. Plus your commission history, outstanding payments, and reliability scores — all in one place you open every morning.',
  },
  {
    q: 'Will venues be able to contact me or see my details?',
    a: 'No. Your WhatsApp and email are never shown to venues. Concierges contact venues — not the other way around. Venues only see your name and tier when you have sent them a referral. There is no spam. ISLA is built to protect the concierge community.',
  },
  {
    q: 'We already use SevenRooms. Why do we need ISLA on top?',
    a: 'SevenRooms tracks your guests. The concierge who sent them is completely invisible in that system — they\'re not a guest, they\'re not a vendor. They exist in a gap between every tool you already have. ISLA fills that gap. SevenRooms tells you what happened at your tables. ISLA tells you why they\'re half empty.',
  },
  {
    q: 'Can venues offer different rates to different concierges?',
    a: 'Yes. ISLA supports private, individually negotiated commission rates per concierge. A senior partner can have a privately negotiated rate that others don\'t see. Each concierge sees only their own rate. This mirrors exactly how the industry already works.',
  },
]

const FAQ_RIGHT = [
  {
    q: 'How does commission tracking work for restaurants?',
    a: 'At launch, restaurants set a flat fee per cover or per booking — e.g. €25/cover or €80/table. No access to the final bill is required. This keeps it simple and unambiguous. Full percentage-of-bill commission tracking for restaurants comes in Phase 2 via SevenRooms and CoverManager integration.',
  },
  {
    q: 'Is my commission data private?',
    a: 'Completely. Commission rates are only visible to verified ISLA members — not the public, not Google, not competitor venues. The platform is closed and private by design. Your competitive information stays within the professional community it\'s intended for.',
  },
  {
    q: 'What if a payment dispute arises?',
    a: 'ISLA is a platform provider only — not a party to any commission agreement. All payment obligations exist directly between the venue and the concierge. ISLA provides the verified record of the agreement. Payment goes direct as it always has — ISLA is the record and trust layer, not the financial processor.',
  },
  {
    q: 'When is ISLA expanding beyond Ibiza?',
    a: 'Mykonos and St Tropez are next — launching before the end of 2026 season. Dubai and London in 2027. Marbella and Madrid to follow. Your ISLA profile and commission history travels with you to every market automatically.',
  },
  {
    q: 'How do I get listed or join?',
    a: 'Concierges: tap "Request Access" and complete your profile. Verification takes 24–48 hours. Venues: email hello@islanetwork.es and we\'ll set up your listing. Founding venues get locked-in pricing regardless of future price changes.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="lp-qa-item">
      <button className="lp-qa-question" onClick={() => setOpen(o => !o)}>
        <span className="lp-qa-q-text">{q}</span>
        <span className={`lp-qa-arrow${open ? ' open' : ''}`}>▶</span>
      </button>
      {open && <div className="lp-qa-answer">{a}</div>}
    </div>
  )
}

export default function LandingPage() {
  const [bannerVisible, setBannerVisible] = useState(false)

  return (
    <div className="lp">

      {/* ══ JOIN BANNER ══ */}
      {bannerVisible && (
        <div className="lp-banner">
          <div className="lp-banner-logo">ISLA · The Concierge Network</div>
          <h1 className="lp-banner-headline">
            
          </h1>
          <p className="lp-banner-sub">
            Track every euro you&apos;re owed. Find the highest-paying booking{' '}
            <strong>right now.</strong> Free for concierges. Always.
          </p>
          <div className="lp-banner-btns">
            <Link href="/auth/signup?role=concierge" className="lp-btn-primary" onClick={() => setBannerVisible(false)}>
              Join as Concierge — Free
            </Link>
            <Link href="/auth/signup?role=venue" className="lp-btn-secondary" onClick={() => setBannerVisible(false)}>
              List Your Venue
            </Link>
          </div>
          <button className="lp-banner-dismiss" onClick={() => setBannerVisible(false)}>
            Explore the platform ↓
          </button>
        </div>
      )}

      {/* ══ NAV ══ */}
      <nav className="lp-nav">
        <div>
          <Link href="/" className="lp-logo">ISLA</Link>
          <span className="lp-logo-sub">The Concierge Network</span>
        </div>
        <div className="lp-nav-links">
          <a className="lp-nav-link" href="#concierges">Concierges</a>
          <a className="lp-nav-link" href="#venues">Venues</a>
          <a className="lp-nav-link" href="#leaderboard">Leaderboard</a>
          <a className="lp-nav-link" href="#faq">FAQ</a>
          <a className="lp-nav-link" href="#pricing">Pricing</a>
          <button className="lp-nav-btn" onClick={() => setBannerVisible(true)}>Join Now</button><a href="/demo" style={{padding:"9px 20px",background:"transparent",color:"#B8944A",fontFamily:"DM Mono,monospace",fontSize:"10px",letterSpacing:"0.15em",textTransform:"uppercase",border:"1px solid #B8944A44",textDecoration:"none",marginLeft:"8px"}}>See Demo</a>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <div className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-tag">Verified · Ibiza 2026 · Expanding Globally</div>
          <h1>
            
          </h1>
          <p className="lp-hero-sub">
            Track every euro you&apos;re owed. Know who&apos;s paid. Know who hasn&apos;t.
            Find the highest-paying booking <strong>right now.</strong>
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 44 }}>
            {['Live commission rates', 'Payment tracking', 'Real-time opportunities'].map(p => (
              <span key={p} className="lp-pill active">{p}</span>
            ))}
            <span className="lp-pill">Free for concierges</span>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 72 }}>
            <button className="lp-btn-primary" onClick={() => setBannerVisible(true)}>Request Access — Free</button>
            <Link href="/auth/login" className="lp-btn-secondary">Sign In</Link>
          </div>
          <div className="lp-hero-stats">
            {[
              { val: '2026', label: 'Founding season' },
              { val: 'Island', label: 'Built for the commission economy' },
              { val: '€0', label: 'Cost for concierges · always' },
            ].map(({ val, label }) => (
              <div key={label}>
                <span className="lp-stat-val">{val}</span>
                <span className="lp-stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ FOR CONCIERGES ══ */}
      <div id="concierges" style={{ borderTop: '1px solid var(--lp-border)' }}>
        <div className="lp-section">
          <div className="lp-two-col">
            <div>
              <span className="lp-section-tag">For Concierges &amp; GRMs · Always Free</span>
              <h2 className="lp-headline">
                Know where the money is.<br /><em>Right now. Today.</em>
              </h2>
              <p className="lp-body">
                Not to organise. Not to manage. To make more money — today, not eventually.
                Open ISLA the way a trader checks markets — to find the best opportunity available right now and act on it.
              </p>
              <ul className="lp-feature-list">
                {[
                  { title: 'The fastest way to find the highest-paying booking', desc: 'Every venue\'s commission rate, live. When a guest asks where to go tonight, you know in seconds — not after three WhatsApps.' },
                  { title: 'Your personal revenue dashboard', desc: 'Total owed, confirmed, overdue at a glance. Every outstanding payment visible. Chase overdue commissions in one tap.' },
                  { title: 'Live opportunities — last-minute, high-spend', desc: 'Venues post elevated commissions and last-minute availability directly to ISLA. You hear about them first.' },
                  { title: 'Your income is protected', desc: 'Every venue verified. Commission terms documented upfront. Payment reliability scores before you refer. No more surprises.' },
                  { title: 'Your profile travels with you', desc: 'Ibiza today. Dubai, London, Mykonos tomorrow. One verified profile. Every market. Season to season.' },
                ].map(({ title, desc }, i) => (
                  <li key={title} className="lp-feature-item">
                    <span className="lp-fi-num">{i + 1}</span>
                    <div>
                      <div className="lp-fi-title">{title}</div>
                      <div className="lp-fi-desc">{desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="lp-btn-primary" style={{ marginTop: 28 }} onClick={() => setBannerVisible(true)}>
                Join Free →
              </button>
            </div>
            <div>
              <div className="lp-mock">
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#7A5E32,#2A5F78)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: '#F2EDE4', flexShrink: 0 }}>S</div>
                  <div>
                    <div className="lp-mock-name">Sofia Reyes</div>
                    <div className="lp-mock-role">Elite · Gran Hotel Montesol</div>
                  </div>
                </div>
                <div className="lp-mock-stat-grid">
                  <div className="lp-mock-stat"><span className="lp-mock-stat-val">€14,820</span><span className="lp-mock-stat-label">Total owed</span></div>
                  <div className="lp-mock-stat"><span className="lp-mock-stat-val green">€11,140</span><span className="lp-mock-stat-label">Confirmed</span></div>
                  <div className="lp-mock-stat"><span className="lp-mock-stat-val red">€3,680</span><span className="lp-mock-stat-label">Overdue</span></div>
                </div>
                <div className="lp-mock-row"><span className="lp-mock-label">Nobu Ibiza Bay · 4 covers</span><span className="lp-mock-val green">€120 ✓</span></div>
                <div className="lp-mock-row"><span className="lp-mock-label">Ocean Beats · 6hr charter</span><span className="lp-mock-val green">€350 ✓</span></div>
                <div className="lp-mock-row"><span className="lp-mock-label">Sa Caleta · 8 covers</span><span className="lp-mock-val red">€200 overdue</span></div>
                <div className="lp-mock-row"><span className="lp-mock-label">Ushuaïa VIP · 12 guests</span><span className="lp-mock-val" style={{ color: '#C9A96E' }}>€480 pending</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ LEADERBOARD ══ */}
      <div id="leaderboard" style={{ background: 'var(--lp-bone)', borderTop: '1px solid var(--lp-border)' }}>
        <div className="lp-section">
          <span className="lp-section-tag">Competition · Season Leaderboard</span>
          <h2 className="lp-headline">
            The island&apos;s top earners.<br /><em>Every week.</em>
          </h2>
          <p className="lp-body" style={{ marginBottom: 40 }}>
            ISLA tracks performance anonymously across the concierge community. Venues can run private leaderboards within their team. Healthy competition. Real rewards.
          </p>
          <div className="lp-two-col">
            <div>
              <div className="lp-leaderboard">
                <div className="lp-lb-header">
                  <span className="lp-lb-title">Island Leaderboard · This Week</span>
                  <span className="lp-lb-badge">Live</span>
                </div>
                {[
                  { rank: '1', rankColor: '#FFD700', name: 'Anonymous · Hotel Concierge', prop: 'Marina Botafoch', amount: '€3,240' },
                  { rank: '2', rankColor: '#C0C0C0', name: 'Anonymous · Villa Manager', prop: 'North Ibiza', amount: '€2,180' },
                  { rank: '3', rankColor: '#CD7F32', name: 'Anonymous · GRM', prop: 'Ibiza Town', amount: '€1,920' },
                  { rank: '4', rankColor: 'var(--lp-gold)', name: 'Anonymous · Hotel Concierge', prop: 'Santa Eulalia', amount: '€1,640' },
                ].map(({ rank, rankColor, name, prop, amount }) => (
                  <div key={rank} className="lp-lb-row">
                    <span className="lp-lb-rank" style={{ color: rankColor }}>{rank}</span>
                    <div className="lp-lb-info">
                      <div className="lp-lb-name">{name}</div>
                      <div className="lp-lb-property">{prop}</div>
                    </div>
                    <span className="lp-lb-amount">{amount}</span>
                  </div>
                ))}
                <div className="lp-lb-row lp-lb-you">
                  <span className="lp-lb-rank" style={{ color: 'var(--lp-gold)' }}>?</span>
                  <div className="lp-lb-info">
                    <div className="lp-lb-name" style={{ color: 'var(--lp-gold-light)' }}>Your position</div>
                    <div className="lp-lb-property" style={{ color: '#5A4A3A' }}>Join to see where you rank</div>
                  </div>
                  <button className="lp-lb-amount" style={{ color: 'var(--lp-gold)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 300 }} onClick={() => setBannerVisible(true)}>
                    Join →
                  </button>
                </div>
              </div>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 300, color: 'var(--lp-ink)', marginBottom: 16 }}>
                For venues — team competition
              </h3>
              <p style={{ fontSize: 14, color: 'var(--lp-muted)', lineHeight: 1.7, marginBottom: 20 }}>
                Create private leaderboards within your concierge team. Track who&apos;s sending the most business, reward top performers, and create healthy competition between your GRMs.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Private team leaderboards',
                  'Weekly and seasonal rankings',
                  'Commission volume and conversion tracking',
                  'Opt-in for concierges — private by default',
                  'Available on Premium and Elite tiers',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--lp-text)' }}>
                    <span style={{ color: 'var(--lp-gold)' }}>→</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ══ FOR VENUES ══ */}
      <div id="venues" style={{ borderTop: '1px solid var(--lp-border)', background: 'var(--lp-ink)' }}>
        <div className="lp-section">
          <span className="lp-section-tag" style={{ color: 'var(--lp-gold)' }}>For Venues · From €500/yr</span>
          <h2 className="lp-headline" style={{ color: 'var(--lp-sand)' }}>
            Stop losing your network<br /><em>every October.</em>
          </h2>
          <div className="lp-two-col" style={{ marginTop: 40 }}>
            <ul className="lp-feature-list" style={{ marginTop: 0 }}>
              {[
                { title: 'In front of the whole community — day one', desc: 'Your listing is visible to every verified concierge on the island immediately. No coffee meetings. No brown envelopes.' },
                { title: 'See who stopped referring', desc: 'Know exactly which concierges went quiet. The revenue you\'re losing is invisible without ISLA. With it, you see the change before thirty tables disappear.' },
                { title: 'One source of truth for all departments', desc: 'GRM, reservations, and finance all see the same thing. The communication breakdown that costs you commissions disappears.' },
                { title: 'Handover notes that survive October', desc: 'Store everything about each concierge. Your next GRM walks in on day one with the full picture — not a blank WhatsApp.' },
                { title: 'Pay reliably. Get recommended first.', desc: 'Your payment reliability score is visible to every concierge. It becomes your competitive advantage.' },
              ].map(({ title, desc }, i) => (
                <li key={title} className="lp-feature-item" style={{ borderColor: '#2A2018', ...(i === 4 ? { borderBottom: 'none' } : {}) }}>
                  <span className="lp-fi-num">{i + 1}</span>
                  <div>
                    <div className="lp-fi-title" style={{ color: '#F2EDE4' }}>{title}</div>
                    <div className="lp-fi-desc">{desc}</div>
                  </div>
                </li>
              ))}
            </ul>
            <div>
              <div className="lp-mock">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <div className="lp-mock-name">Nobu Ibiza Bay</div>
                    <div className="lp-mock-role">Premium · Restaurant</div>
                  </div>
                  <span style={{ padding: '3px 10px', background: '#B8944A22', border: '1px solid #B8944A44', fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'var(--lp-gold-light)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Verified</span>
                </div>
                <div className="lp-mock-stat-grid">
                  <div className="lp-mock-stat"><span className="lp-mock-stat-val">34</span><span className="lp-mock-stat-label">Concierges</span></div>
                  <div className="lp-mock-stat"><span className="lp-mock-stat-val">187</span><span className="lp-mock-stat-label">Covers sent</span></div>
                  <div className="lp-mock-stat"><span className="lp-mock-stat-val green">€9.2K</span><span className="lp-mock-stat-label">Paid out</span></div>
                </div>
                <div style={{ fontSize: 11, color: '#5A4A3A', fontFamily: "'DM Mono',monospace", letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Pending confirmation</div>
                <div className="lp-mock-row" style={{ background: '#1E1C18', border: '1px solid #B8944A44' }}>
                  <div>
                    <div className="lp-mock-name" style={{ fontSize: 12 }}>Sofia Reyes · Table of 8 · Tonight</div>
                    <div style={{ fontSize: 10, color: '#5A4A3A' }}>Est. €240 · net F&amp;B · 10%</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ padding: '5px 12px', background: 'var(--lp-gold)', color: 'var(--lp-ink)', fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.1em' }}>Confirm</span>
                    <span style={{ padding: '5px 12px', background: 'transparent', color: '#5A4A3A', border: '1px solid #2A2018', fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.1em' }}>Reject</span>
                  </div>
                </div>
              </div>
              <a href="mailto:hello@islanetwork.es" className="lp-btn-secondary" style={{ marginTop: 16, width: '100%', textAlign: 'center', borderColor: 'var(--lp-gold)', color: 'var(--lp-gold)', boxSizing: 'border-box' }}>
                List Your Venue → hello@islanetwork.es
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ══ PULL QUOTE ══ */}
      <div className="lp-pull-quote">
        <p className="lp-pull-quote-text">
          &ldquo;The concierge doesn&apos;t cancel on you. They don&apos;t leave a bad review.
          They just <em>quietly become someone else&apos;s best partner.</em>&rdquo;
        </p>
        <div className="lp-pull-quote-attr">ISLA · The Concierge Network · Ibiza 2026</div>
      </div>

      {/* ══ PRICING ══ */}
      <div id="pricing" style={{ borderTop: '1px solid var(--lp-border)' }}>
        <div className="lp-section-full">
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <span className="lp-section-tag">Pricing</span>
            <h2 className="lp-headline">Simple. <em>Transparent.</em></h2>
            <div className="lp-pricing-grid">
              {/* Concierge */}
              <div className="lp-pricing-col">
                <span className="lp-price-tier">For Concierges</span>
                <span className="lp-price-val"><sup>€</sup>0</span>
                <span className="lp-price-period">Always free · no hidden costs</span>
                <ul className="lp-price-features">
                  {['Full venue directory access', 'Commission rates and basis', 'Referral logging and tracking', 'Revenue dashboard', 'Verified professional profile', 'Leaderboard participation'].map(f => (
                    <li key={f}><span className="lp-check">✓</span><span style={{ color: 'var(--lp-text)' }}>{f}</span></li>
                  ))}
                </ul>
                <button className="lp-price-btn lp-price-btn-dark" onClick={() => setBannerVisible(true)}>Join Now →</button>
              </div>
              {/* Premium */}
              <div className="lp-pricing-col featured">
                <span className="lp-price-tier">Venue · Premium</span>
                <span className="lp-price-val"><sup>€</sup>1,200</span>
                <span className="lp-price-period">per year + 1.5% tracked commissions</span>
                <ul className="lp-price-features">
                  {['Verified venue listing', 'Referral confirmation dashboard', 'Full analytics and tracking', 'Handover notes per concierge', 'Payment reliability score', 'Team leaderboard feature', 'Priority placement'].map(f => (
                    <li key={f}><span className="lp-check">✓</span>{f}</li>
                  ))}
                </ul>
                <a href="mailto:hello@islanetwork.es" className="lp-price-btn lp-price-btn-gold" style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}>Start Premium →</a>
              </div>
              {/* Essential */}
              <div className="lp-pricing-col">
                <span className="lp-price-tier">Venue · Essential</span>
                <span className="lp-price-val"><sup>€</sup>500</span>
                <span className="lp-price-period">per year · no transaction fee</span>
                <ul className="lp-price-features">
                  {['Verified listing', 'Commission info published', 'Booking contact visible', 'Seasonal hours and notes', 'New opening announcement'].map(f => (
                    <li key={f}><span className="lp-check">✓</span><span style={{ color: 'var(--lp-text)' }}>{f}</span></li>
                  ))}
                  {['Referral tracking', 'Leaderboard feature'].map(f => (
                    <li key={f}><span className="lp-cross">—</span><span style={{ color: 'var(--lp-muted)' }}>{f}</span></li>
                  ))}
                </ul>
                <a href="mailto:hello@islanetwork.es" className="lp-price-btn lp-price-btn-dark" style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}>Get Listed →</a>
              </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--lp-muted)', fontStyle: 'italic' }}>
              Payment always goes direct from venue to concierge. ISLA is the record layer — not a payment processor.
            </p>
          </div>
        </div>
      </div>

      {/* ══ FAQ ══ */}
      <div id="faq" className="lp-qa-section">
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <span className="lp-section-tag">Questions &amp; Answers</span>
          <h2 className="lp-headline">Everything you need<br />to <em>know.</em></h2>
          <div className="lp-qa-grid">
            <div>{FAQ_LEFT.map(({ q, a }) => <FAQItem key={q} q={q} a={a} />)}</div>
            <div>{FAQ_RIGHT.map(({ q, a }) => <FAQItem key={q} q={q} a={a} />)}</div>
          </div>
        </div>
      </div>

      {/* ══ CLOSING ══ */}
      <div className="lp-closing">
        <h2>The season is<br /><em>already here.</em></h2>
        <p>Every week you&apos;re not on ISLA is a week where opportunities are going to someone else. Join the island&apos;s private network.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="lp-btn-primary" onClick={() => setBannerVisible(true)}>Request Access — Free</button>
          <a href="mailto:hello@islanetwork.es" className="lp-btn-secondary" style={{ borderColor: 'var(--lp-border)', color: 'var(--lp-muted)' }}>List Your Venue</a>
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <div className="lp-footer">
        <div className="lp-footer-logo">ISLA</div>
        <div className="lp-footer-meta">The Concierge Network · islanetwork.es · Ibiza 2026 · hello@islanetwork.es</div>
      </div>

    </div>
  )
}
