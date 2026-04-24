'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function HomePage() {
  const [open, setOpen] = useState<number | null>(null)
  const [tab, setTab] = useState<'concierge' | 'venue'>('concierge')
  const [stats, setStats] = useState({ venues: 0, concierges: 0 })
  const [demoStep, setDemoStep] = useState(0)

  useEffect(() => {
    async function fetchStats() {
      const [{ count: venues }, { count: concierges }] = await Promise.all([
        supabase.from('venues').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ])
      setStats({ venues: venues || 0, concierges: concierges || 0 })
    }
    fetchStats()
  }, [])

  useEffect(() => {
    if (demoStep === 0 || demoStep >= 4) return
    const t = setTimeout(() => setDemoStep(s => s + 1), 1800)
    return () => clearTimeout(t)
  }, [demoStep])

  const faqs = [
    ['Is ISLA really free for concierges?', 'Yes. Always. Concierges never pay. Revenue comes from venues who pay to be listed and verified.'],
    ['Will venues be able to contact me or see my details?', 'No. Your identity is never shared without your permission. Venues see referral data, not personal information.'],
    ['How does ISLA make money if concierges are free?', 'Venues pay an annual listing fee to be visible and verified on the platform. Concierges are always free because they are the network.'],
    ['We already use SevenRooms. Why do we need ISLA?', 'SevenRooms manages reservations internally. ISLA manages the concierge relationship layer — attribution, commission agreements, and payment tracking across venues.'],
    ['What if a venue does not pay?', 'ISLA holds signed commission agreements. Non-payment triggers suspension of venue visibility. You have documentation and leverage.'],
    ['When is ISLA expanding beyond Ibiza?', 'Mykonos, St Tropez, and Dubai are next. Founding venue agreements travel with the platform.'],
    ['How do I get listed or join?', 'Venues apply via the site and go through an approval process. Concierges sign up free and are verified before accessing the full directory.'],
  ]

  const demoSteps = [
    { label: 'Referral submitted', detail: 'Casa Jondal · 4 guests · dinner', color: '#C9A96E' },
    { label: 'Reference generated', detail: 'ISLA-2026-0041', color: '#C9A96E' },
    { label: 'Booking confirmed', detail: '€3,200 spend · 12% commission', color: '#4ade80' },
    { label: 'Commission tracked', detail: '€384 pending payment', color: '#facc15' },
  ]

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; color: #f0ece4; font-family: Georgia, serif; }
        .nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 48px; border-bottom: 1px solid #1e1e1e; position: sticky; top: 0; background: #0a0a0a; z-index: 100; }
        .nav-logo { font-size: 20px; letter-spacing: 0.15em; color: #C9A96E; text-decoration: none; }
        .nav-sub { font-size: 9px; letter-spacing: 0.2em; color: #555; text-transform: uppercase; margin-top: 2px; }
        .nav-actions { display: flex; gap: 12px; }
        .nav-btn-p { padding: 10px 20px; background: #C9A96E; color: #0a0a0a; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; font-weight: 600; }
        .nav-btn-s { padding: 10px 20px; border: 1px solid #333; color: #aaa; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; }
        .stats-bar { display: flex; justify-content: center; gap: 64px; padding: 20px 48px; border-bottom: 1px solid #1e1e1e; background: #0d0d0d; }
        .stat-item { text-align: center; }
        .stat-num { font-size: 22px; color: #C9A96E; font-weight: 400; }
        .stat-lbl { font-family: monospace; font-size: 9px; letter-spacing: 0.2em; color: #555; text-transform: uppercase; margin-top: 2px; }
        .hero { padding: 100px 48px 80px; max-width: 900px; }
        .hero-tag { font-size: 10px; letter-spacing: 0.3em; color: #C9A96E; text-transform: uppercase; margin-bottom: 24px; font-family: monospace; }
        .hero-title { font-size: 56px; line-height: 1.1; font-weight: 400; margin-bottom: 24px; }
        .hero-title em { font-style: italic; color: #C9A96E; }
        .hero-sub { font-size: 18px; line-height: 1.6; color: #aaa; max-width: 600px; margin-bottom: 40px; }
        .hero-ctas { display: flex; gap: 16px; flex-wrap: wrap; }
        .btn-p { padding: 16px 32px; background: #C9A96E; color: #0a0a0a; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; font-weight: 700; display: inline-block; }
        .btn-s { padding: 16px 32px; border: 1px solid #444; color: #aaa; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; display: inline-block; }
        .divider { border: none; border-top: 1px solid #1e1e1e; margin: 0 48px; }
        .problem { padding: 80px 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
        .lbl { font-size: 10px; letter-spacing: 0.3em; color: #555; text-transform: uppercase; margin-bottom: 20px; font-family: monospace; }
        .problem-title { font-size: 36px; line-height: 1.2; font-weight: 400; margin-bottom: 24px; }
        .problem-title em { font-style: italic; color: #C9A96E; }
        .txt { font-size: 15px; line-height: 1.7; color: #aaa; }
        .plist { list-style: none; margin-top: 24px; }
        .plist li { font-family: monospace; font-size: 12px; color: #777; padding: 10px 0; border-bottom: 1px solid #1a1a1a; display: flex; gap: 12px; }
        .plist li span { color: #C9A96E; }
        .auth-box { background: #111; border: 1px solid #222; padding: 32px; margin-top: 32px; }
        .auth-text { font-size: 14px; line-height: 1.6; color: #aaa; font-style: italic; }
        .auth-attr { font-family: monospace; font-size: 10px; letter-spacing: 0.2em; color: #555; text-transform: uppercase; margin-top: 12px; }
        .how { padding: 80px 48px; background: #0d0d0d; }
        .how-title { font-size: 36px; font-weight: 400; margin-bottom: 48px; }
        .how-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; }
        .how-num { font-family: monospace; font-size: 11px; color: #C9A96E; margin-bottom: 12px; }
        .how-st { font-size: 16px; margin-bottom: 8px; }
        .how-sb { font-size: 13px; line-height: 1.6; color: #777; }
        .demo { padding: 80px 48px; border-top: 1px solid #1e1e1e; border-bottom: 1px solid #1e1e1e; }
        .demo-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .demo-title { font-size: 36px; font-weight: 400; margin-bottom: 16px; }
        .demo-title em { font-style: italic; color: #C9A96E; }
        .demo-sub { font-size: 15px; line-height: 1.7; color: #aaa; margin-bottom: 32px; }
        .demo-btn { padding: 14px 28px; background: #C9A96E; color: #0a0a0a; font-family: monospace; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; border: none; cursor: pointer; font-weight: 700; }
        .demo-btn:disabled { opacity: 0.5; cursor: default; }
        .demo-reset { padding: 14px 28px; background: none; border: 1px solid #444; color: #aaa; font-family: monospace; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; margin-left: 12px; }
        .demo-panel { background: #111; border: 1px solid #222; padding: 24px; }
        .demo-panel-title { font-family: monospace; font-size: 10px; letter-spacing: 0.2em; color: #555; text-transform: uppercase; margin-bottom: 20px; }
        .demo-row { display: flex; align-items: center; gap: 16px; padding: 14px 0; border-bottom: 1px solid #1a1a1a; opacity: 0; transition: opacity 0.5s ease; }
        .demo-row.visible { opacity: 1; }
        .demo-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; background: #333; transition: background 0.5s ease; }
        .demo-row-label { font-size: 14px; flex: 1; }
        .demo-row-detail { font-family: monospace; font-size: 11px; color: #666; }
        .demo-idle { font-family: monospace; font-size: 12px; color: #444; padding: 20px 0; text-align: center; }
        .aud { padding: 80px 48px; background: #0d0d0d; }
        .aud-tabs { display: flex; margin-bottom: 48px; border-bottom: 1px solid #1e1e1e; }
        .aud-tab { padding: 14px 32px; font-family: monospace; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; background: none; border: none; color: #555; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; }
        .aud-tab.active { color: #C9A96E; border-bottom-color: #C9A96E; }
        .aud-content { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
        .aud-title { font-size: 36px; line-height: 1.2; font-weight: 400; margin-bottom: 20px; }
        .aud-body { font-size: 15px; line-height: 1.7; color: #aaa; margin-bottom: 32px; }
        .aud-list { list-style: none; margin-bottom: 32px; }
        .aud-list li { font-family: monospace; font-size: 12px; color: #777; padding: 10px 0; border-bottom: 1px solid #1a1a1a; display: flex; gap: 12px; }
        .aud-list li span { color: #C9A96E; }
        .aud-cta { display: inline-block; padding: 14px 28px; font-family: monospace; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; font-weight: 700; background: #C9A96E; color: #0a0a0a; }
        .aud-price { font-family: monospace; font-size: 11px; color: #555; margin-top: 12px; display: block; }
        .aud-panel { background: #111; border: 1px solid #1e1e1e; padding: 32px; }
        .aud-panel-title { font-family: monospace; font-size: 10px; letter-spacing: 0.2em; color: #555; text-transform: uppercase; margin-bottom: 20px; }
        .aud-stat { padding: 16px 0; border-bottom: 1px solid #1a1a1a; display: flex; justify-content: space-between; align-items: center; }
        .aud-stat-label { font-size: 13px; color: #aaa; }
        .aud-stat-value { font-family: monospace; font-size: 13px; color: #C9A96E; }
        .scar { padding: 80px 48px; border-top: 1px solid #1e1e1e; border-bottom: 1px solid #1e1e1e; display: flex; justify-content: space-between; align-items: center; }
        .scar-lbl { font-family: monospace; font-size: 10px; letter-spacing: 0.3em; color: #C9A96E; text-transform: uppercase; margin-bottom: 12px; }
        .scar-title { font-size: 28px; font-weight: 400; }
        .scar-sub { font-size: 14px; color: #777; margin-top: 8px; max-width: 500px; }
        .faq { padding: 80px 48px; }
        .faq-title { font-size: 36px; font-weight: 400; margin-bottom: 48px; }
        .faq-item { border-bottom: 1px solid #1e1e1e; }
        .faq-q { width: 100%; text-align: left; background: none; border: none; color: #f0ece4; font-family: Georgia, serif; font-size: 16px; padding: 20px 0; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
        .faq-icon { color: #C9A96E; font-size: 18px; margin-left: 16px; flex-shrink: 0; }
        .faq-a { font-size: 14px; line-height: 1.7; color: #aaa; padding-bottom: 20px; max-width: 700px; }
        .cls { padding: 100px 48px; text-align: center; background: #0d0d0d; }
        .cls-title { font-size: 48px; font-weight: 400; margin-bottom: 16px; }
        .cls-title em { font-style: italic; color: #C9A96E; }
        .cls-sub { font-size: 16px; color: #888; margin-bottom: 40px; max-width: 500px; margin-left: auto; margin-right: auto; }
        .cls-ctas { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .foot { background: #050505; padding: 32px 48px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #1a1a1a; }
        .foot-logo { font-size: 16px; letter-spacing: 0.15em; color: #C9A96E; }
        .foot-meta { font-family: monospace; font-size: 10px; letter-spacing: 0.12em; color: #777; text-transform: uppercase; }
        @media (max-width: 768px) {
          .nav { padding: 16px 20px; }
          .nav-btn-s { display: none; }
          .stats-bar { gap: 32px; padding: 16px 20px; }
          .hero { padding: 60px 20px 48px; }
          .hero-title { font-size: 36px; }
          .hero-sub { font-size: 16px; }
          .problem { grid-template-columns: 1fr; gap: 40px; padding: 48px 20px; }
          .how { padding: 48px 20px; }
          .how-steps { grid-template-columns: 1fr 1fr; gap: 24px; }
          .demo { padding: 48px 20px; }
          .demo-inner { grid-template-columns: 1fr; gap: 32px; }
          .aud { padding: 48px 20px; }
          .aud-content { grid-template-columns: 1fr; gap: 32px; }
          .aud-tabs { overflow-x: auto; }
          .scar { flex-direction: column; gap: 24px; padding: 48px 20px; text-align: center; }
          .scar-sub { margin: 8px auto 0; }
          .faq { padding: 48px 20px; }
          .faq-q { font-size: 15px; }
          .cls { padding: 60px 20px; }
          .cls-title { font-size: 32px; }
          .foot { flex-direction: column; gap: 16px; text-align: center; padding: 28px 20px; }
          .foot-meta { font-size: 10px; line-height: 1.8; }
          .divider { margin: 0 20px; }
        }
      `}</style>

      <nav className="nav">
        <div><div className="nav-logo">ISLA</div><div className="nav-sub">The Concierge Network</div></div>
        <div className="nav-actions">
          <Link href="/auth/signup" className="nav-btn-s">Join Free</Link>
          <Link href="/auth/signup" className="nav-btn-p">List Your Venue</Link>
        </div>
      </nav>

      <div className="stats-bar">
        <div className="stat-item"><div className="stat-num">{stats.venues}</div><div className="stat-lbl">Venues Live</div></div>
        <div className="stat-item"><div className="stat-num">{stats.concierges}</div><div className="stat-lbl">Concierges</div></div>
        <div className="stat-item"><div className="stat-num">Ibiza</div><div className="stat-lbl">2026 Season</div></div>
      </div>

      <section className="hero">
        <div className="hero-tag">Verified · Ibiza 2026 · Expanding Globally</div>
        <h1 className="hero-title">Never lose a commission <em>again.</em></h1>
        <p className="hero-sub">Track every euro you are owed. Know who has paid and who has not. Find the highest-paying bookings in seconds.</p>
        <div className="hero-ctas">
          <Link href="/auth/signup" className="btn-p">Join Free — Concierges</Link>
          <Link href="/auth/signup" className="btn-s">List Your Venue</Link>
        </div>
      </section>

      <hr className="divider" />

      <section className="problem">
        <div>
          <div className="lbl">The Problem</div>
          <h2 className="problem-title">Concierge bookings are <em>invisible.</em></h2>
          <p className="txt">Most concierge-driven bookings are untracked, miscommunicated, and lost between teams. Commissions are inconsistent, relationships unclear, and revenue slips through every season.</p>
          <ul className="plist">
            <li><span>—</span>No record of who referred the booking</li>
            <li><span>—</span>Commission terms agreed verbally, disputed later</li>
            <li><span>—</span>Payments chased on WhatsApp, often never received</li>
            <li><span>—</span>Staff turnover wipes out venue relationships</li>
            <li><span>—</span>No data on which concierges drive real revenue</li>
          </ul>
        </div>
        <div>
          <div className="auth-box">
            <p className="auth-text">Built by an Ibiza hospitality operator, not a tech startup. Every problem ISLA solves is one we lived from the inside.</p>
            <p className="auth-attr">ISLA — The Concierge Network · Ibiza 2026</p>
          </div>
          <div className="lbl" style={{marginTop: 32}}>The Solution</div>
          <p className="txt">ISLA creates a structured layer between concierges and venues. Every referral is tracked, documented, and reconciled automatically. Payments go direct — ISLA is the record layer.</p>
        </div>
      </section>

      <section className="how">
        <div className="lbl">How It Works</div>
        <h2 className="how-title">Four steps. Zero manual tracking.</h2>
        <div className="how-steps">
          <div><div className="how-num">01</div><div className="how-st">Concierge refers</div><div className="how-sb">A verified concierge submits a referral through ISLA with guest details and venue.</div></div>
          <div><div className="how-num">02</div><div className="how-st">Reference generated</div><div className="how-sb">A unique ISLA reference number is created and sent to the venue instantly.</div></div>
          <div><div className="how-num">03</div><div className="how-st">Booking confirmed</div><div className="how-sb">The venue records the reference. ISLA tracks confirmation and final bill value.</div></div>
          <div><div className="how-num">04</div><div className="how-st">Commission calculated</div><div className="how-sb">Commission is calculated from the signed agreement. No disputes. No chasing.</div></div>
        </div>
      </section>

      <section className="demo">
        <div className="demo-inner">
          <div>
            <div className="lbl">Live Demo</div>
            <h2 className="demo-title">See a referral <em>happen.</em></h2>
            <p className="demo-sub">Watch what happens from the moment a concierge submits a booking to the moment commission is tracked. No manual steps. No WhatsApp chains.</p>
            <button className="demo-btn" onClick={() => setDemoStep(1)} disabled={demoStep > 0 && demoStep < 4}>
              {demoStep === 0 ? 'Run Demo' : demoStep < 4 ? 'Running...' : 'Done'}
            </button>
            {demoStep === 4 && <button className="demo-reset" onClick={() => setDemoStep(0)}>Reset</button>}
          </div>
          <div className="demo-panel">
            <div className="demo-panel-title">ISLA · Referral Flow</div>
            {demoStep === 0 && <div className="demo-idle">Press Run Demo to start</div>}
            {demoSteps.map((s, i) => (
              <div key={i} className={`demo-row ${demoStep > i ? 'visible' : ''}`}>
                <div className="demo-dot" style={{background: demoStep > i ? s.color : '#333'}} />
                <div className="demo-row-label">{s.label}</div>
                <div className="demo-row-detail">{s.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="aud">
        <div className="lbl">Who It Is For</div>
        <div className="aud-tabs">
          <button className={`aud-tab ${tab === 'concierge' ? 'active' : ''}`} onClick={() => setTab('concierge')}>For Concierges and GRMs</button>
          <button className={`aud-tab ${tab === 'venue' ? 'active' : ''}`} onClick={() => setTab('venue')}>For Venues and Operators</button>
        </div>
        {tab === 'concierge' && (
          <div className="aud-content">
            <div>
              <h2 className="aud-title">Make more money. Starting today.</h2>
              <p className="aud-body">See every venue rate live. Log referrals in seconds. Know exactly who has paid and who has not — all in one place. Always free.</p>
              <ul className="aud-list">
                <li><span>—</span>Full venue directory with live commission rates</li>
                <li><span>—</span>Every referral logged with a unique reference</li>
                <li><span>—</span>Payment tracking — confirmed, pending, overdue</li>
                <li><span>—</span>Signed agreements give you leverage</li>
                <li><span>—</span>Always free</li>
              </ul>
              <Link href="/auth/signup" className="aud-cta">Join Free</Link>
            </div>
            <div className="aud-panel">
              <div className="aud-panel-title">Example · Commission Dashboard</div>
              <div className="aud-stat"><span className="aud-stat-label">Casa Jondal · 12%</span><span className="aud-stat-value">€384 pending</span></div>
              <div className="aud-stat"><span className="aud-stat-label">Nobu Ibiza · 10%</span><span className="aud-stat-value">€210 paid</span></div>
              <div className="aud-stat"><span className="aud-stat-label">Beachhouse · 8%</span><span className="aud-stat-value">€160 pending</span></div>
              <div className="aud-stat"><span className="aud-stat-label">Heart Ibiza · 15%</span><span className="aud-stat-value">€540 overdue</span></div>
            </div>
          </div>
        )}
        {tab === 'venue' && (
          <div className="aud-content">
            <div>
              <h2 className="aud-title">Turn concierge relationships into tracked revenue.</h2>
              <p className="aud-body">Stop losing bookings to invisible referrals. ISLA gives your whole team one source of truth — bookings, attribution, commissions — that survives every October.</p>
              <ul className="aud-list">
                <li><span>—</span>Verified concierge directory</li>
                <li><span>—</span>Every referral documented with a signed agreement</li>
                <li><span>—</span>Payment reliability scores per concierge</li>
                <li><span>—</span>Relationships survive staff changes</li>
                <li><span>—</span>Priority placement for founding venues</li>
              </ul>
              <Link href="/auth/signup" className="aud-cta">Apply as Founding Venue</Link>
              <span className="aud-price">From €500 per year</span>
            </div>
            <div className="aud-panel">
              <div className="aud-panel-title">Example · Venue Dashboard</div>
              <div className="aud-stat"><span className="aud-stat-label">Referrals this month</span><span className="aud-stat-value">23</span></div>
              <div className="aud-stat"><span className="aud-stat-label">Total tracked spend</span><span className="aud-stat-value">€48,200</span></div>
              <div className="aud-stat"><span className="aud-stat-label">Commissions due</span><span className="aud-stat-value">€5,780</span></div>
              <div className="aud-stat"><span className="aud-stat-label">Top concierge</span><span className="aud-stat-value">12 referrals</span></div>
            </div>
          </div>
        )}
      </section>

      <section className="scar">
        <div>
          <div className="scar-lbl">Founding Venues — Limited Places</div>
          <h2 className="scar-title">Ibiza 2026 season now open.</h2>
          <p className="scar-sub">ISLA is onboarding a limited number of founding venues. Founding venues receive priority placement, locked rates, and early access to the full concierge network.</p>
        </div>
        <Link href="/auth/signup" className="btn-p">Apply Now</Link>
      </section>

      <section className="faq">
        <div className="lbl">Questions and Answers</div>
        <h2 className="faq-title">Everything you need to know.</h2>
        {faqs.map(([q, a], i) => (
          <div key={i} className="faq-item">
            <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
              {q}<span className="faq-icon">{open === i ? '-' : '+'}</span>
            </button>
            {open === i && <p className="faq-a">{a}</p>}
          </div>
        ))}
      </section>

      <section className="cls">
        <h2 className="cls-title">The season is <em>already here.</em></h2>
        <p className="cls-sub">Every week you are not on ISLA is a week where opportunities go to someone else.</p>
        <div className="cls-ctas">
          <Link href="/auth/signup" className="btn-p">Join Free — Concierges</Link>
          <Link href="/auth/signup" className="btn-s">List Your Venue</Link>
        </div>
      </section>

      <footer className="foot">
        <div className="foot-logo">ISLA</div>
        <div className="foot-meta">The Concierge Network · islanetwork.es · Ibiza 2026 · hello@islanetwork.es · <a href="/admin" style={{color: 'inherit', opacity: 0.5, textDecoration: 'none'}}>admin</a></div>
      </footer>
    </>
  )
}
