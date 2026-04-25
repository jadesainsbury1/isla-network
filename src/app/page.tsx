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
  const [demoStep, setDemoStep] = useState(0)

  useEffect(() => {
    if (demoStep === 0 || demoStep >= 6) return
    const t = setTimeout(() => setDemoStep(s => s + 1), 1600)
    return () => clearTimeout(t)
  }, [demoStep])

  const spend = 3200
  const rate = 0.12
  const commission = spend * rate
  const iva = commission * 0.21
  const total = commission + iva

  const faqs = [
    ['Is ISLA really free for concierges?', 'Yes. Always. Concierges never pay. Revenue comes from venues who pay to be listed and verified.'],
    ['Will venues be able to contact me or see my details?', 'No. Your identity is never shared without your permission. Venues see referral data, not personal information.'],
    ['How does ISLA make money if concierges are free?', 'Venues pay an annual listing fee to be visible and verified on the platform. Concierges are always free because they are the network.'],
    ['We already use SevenRooms. Why do we need ISLA?', 'SevenRooms manages reservations internally. ISLA manages the concierge relationship layer — attribution, commission agreements, and payment tracking across venues.'],
    ['What if a venue does not pay?', 'ISLA holds signed commission agreements. Non-payment triggers suspension of venue visibility. You have documentation and leverage.'],
    ['When is ISLA expanding beyond Ibiza?', 'Mykonos, St Tropez, and Dubai are next. Founding venue agreements travel with the platform.'],
    ['How do I get listed or join?', 'Venues apply via the site and go through an approval process. Concierges sign up free and are verified before accessing the full directory.'],
  ]
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; color: #f0ece4; font-family: 'Cormorant Garamond', Georgia, serif; }
        .fullhero { min-height: 100vh; background: #0a0a0a; display: flex; flex-direction: column; justify-content: space-between; padding: 48px 60px; position: relative; overflow: hidden; }
        .fullhero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 70% at 75% 25%, rgba(185,148,74,0.06), transparent 55%); pointer-events: none; }
        .fh-top { display: flex; justify-content: space-between; align-items: flex-start; position: relative; z-index: 1; }
        .fh-logo { font-size: 12px; letter-spacing: 0.35em; color: #C9A96E; text-transform: uppercase; font-family: monospace; }
        .fh-nav { display: flex; gap: 12px; }
        .fh-btn-p { padding: 10px 20px; background: #C9A96E; color: #0a0a0a; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; font-weight: 600; font-family: monospace; }
        .fh-btn-s { padding: 10px 20px; border: 1px solid #333; color: #aaa; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; font-family: monospace; }
        .fh-body { position: relative; z-index: 1; }
        .fh-eyebrow { font-size: 10px; letter-spacing: 0.4em; color: #C9A96E; text-transform: uppercase; margin-bottom: 28px; display: block; font-family: monospace; }
        .fh-title { font-size: clamp(64px, 11vw, 128px); font-weight: 300; line-height: 0.92; letter-spacing: -0.02em; color: #f0ece4; margin-bottom: 28px; }
        .fh-title em { font-style: italic; color: #C9A96E; }
        .fh-sub { font-size: 17px; font-weight: 300; color: #888; max-width: 520px; line-height: 1.65; font-style: italic; margin-bottom: 48px; }
        .fh-sub strong { color: #C9A96E; font-weight: 400; font-style: normal; }
        .fh-ctas { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 8px; }
        .fh-btn-primary { padding: 16px 36px; background: #C9A96E; color: #0a0a0a; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; font-weight: 700; display: inline-block; font-family: monospace; }
        .fh-btn-secondary { padding: 16px 36px; background: #1a1a1a; border: 1px solid #333; color: #aaa; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; display: inline-block; font-family: monospace; }
        .fh-foot { display: flex; justify-content: space-between; align-items: flex-end; position: relative; z-index: 1; }
        .fh-tagline { font-family: monospace; font-size: 9px; letter-spacing: 0.25em; color: #333; text-transform: uppercase; }
        .fh-scroll { font-family: monospace; font-size: 9px; letter-spacing: 0.3em; color: #333; text-transform: uppercase; }
        .season-bar { display: flex; justify-content: center; gap: 64px; padding: 18px 48px; border-bottom: 1px solid #1e1e1e; background: #0d0d0d; }
        .season-item { text-align: center; }
        .season-val { font-family: monospace; font-size: 11px; letter-spacing: 0.2em; color: #C9A96E; text-transform: uppercase; }
        .season-lbl { font-family: monospace; font-size: 9px; letter-spacing: 0.2em; color: #444; text-transform: uppercase; margin-top: 3px; }
        .problem { padding: 80px 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; background: #F5EFE6; }
        .lbl { font-size: 10px; letter-spacing: 0.3em; color: #9A8A78; text-transform: uppercase; margin-bottom: 20px; font-family: monospace; }
        .problem-title { font-size: 36px; line-height: 1.2; font-weight: 400; margin-bottom: 24px; color: #12100E; }
        .problem-title em { font-style: italic; color: #8A6A2E; }
        .txt { font-size: 15px; line-height: 1.7; color: #5A4A38; }
        .plist { list-style: none; margin-top: 24px; }
        .plist li { font-family: monospace; font-size: 12px; color: #7A6A5A; padding: 10px 0; border-bottom: 1px solid #E0D8C8; display: flex; gap: 12px; }
        .plist li span { color: #B8944A; }
        .auth-box { background: #12100E; border: 1px solid #2A2018; padding: 32px; margin-top: 32px; }
        .auth-text { font-size: 14px; line-height: 1.6; color: #B0A090; font-style: italic; }
        .auth-attr { font-family: monospace; font-size: 10px; letter-spacing: 0.2em; color: #555; text-transform: uppercase; margin-top: 12px; }
        .how { padding: 80px 48px; background: #0d0d0d; }
        .how-lbl { font-size: 10px; letter-spacing: 0.3em; color: #555; text-transform: uppercase; margin-bottom: 20px; font-family: monospace; }
        .how-title { font-size: 36px; font-weight: 400; margin-bottom: 48px; color: #f0ece4; }
        .how-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; }
        .how-num { font-family: monospace; font-size: 11px; color: #C9A96E; margin-bottom: 12px; }
        .how-st { font-size: 16px; margin-bottom: 8px; color: #f0ece4; }
        .how-sb { font-size: 13px; line-height: 1.6; color: #777; }
        .demo { padding: 80px 48px; background: #0a0a0a; border-top: 1px solid #1a1a1a; }
        .demo-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
        .demo-lbl { font-size: 10px; letter-spacing: 0.3em; color: #555; text-transform: uppercase; margin-bottom: 20px; font-family: monospace; }
        .demo-title { font-size: 36px; font-weight: 400; margin-bottom: 16px; color: #f0ece4; }
        .demo-title em { font-style: italic; color: #C9A96E; }
        .demo-sub { font-size: 15px; line-height: 1.7; color: #777; margin-bottom: 32px; }
        .demo-btn { padding: 14px 28px; background: #C9A96E; color: #0a0a0a; font-family: monospace; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; border: none; cursor: pointer; font-weight: 700; }
        .demo-btn:disabled { opacity: 0.4; cursor: default; }
        .demo-reset { padding: 14px 28px; background: none; border: 1px solid #333; color: #666; font-family: monospace; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; margin-left: 12px; }
        .demo-card { background: #111; border: 1px solid #222; overflow: hidden; }
        .demo-status-bar { display: flex; }
        .demo-status-step { flex: 1; padding: 8px 4px; text-align: center; font-family: monospace; font-size: 8px; letter-spacing: 0.1em; text-transform: uppercase; background: #1a1a1a; color: #333; border-right: 1px solid #222; transition: all 0.4s ease; }
        .demo-status-step:last-child { border-right: none; }
        .demo-status-step.active { background: #C9A96E; color: #0a0a0a; }
        .demo-status-step.done { background: #1e1e12; color: #C9A96E; }
        .demo-card-header { background: #1a1a1a; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #222; }
        .demo-card-title { font-family: monospace; font-size: 10px; letter-spacing: 0.25em; color: #555; text-transform: uppercase; }
        .demo-ref { font-family: monospace; font-size: 11px; color: #C9A96E; letter-spacing: 0.1em; }
        .demo-body { padding: 4px 0; }
        .demo-field { display: flex; justify-content: space-between; align-items: center; padding: 11px 20px; border-bottom: 1px solid #1a1a1a; }
        .demo-field:last-child { border-bottom: none; }
        .demo-field-label { font-family: monospace; font-size: 10px; letter-spacing: 0.15em; color: #555; text-transform: uppercase; }
        .demo-field-value { font-size: 14px; color: #f0ece4; }
        .demo-field-value.gold { color: #C9A96E; font-family: monospace; }
        .demo-field-value.green { color: #4ade80; font-family: monospace; }
        .demo-divider { border: none; border-top: 1px solid #2a2a2a; margin: 4px 20px; }
        .demo-total { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: #1a1a1a; border-top: 2px solid #C9A96E; }
        .demo-total-label { font-family: monospace; font-size: 10px; letter-spacing: 0.2em; color: #888; text-transform: uppercase; }
        .demo-total-value { font-size: 20px; color: #C9A96E; }
        .demo-idle { font-family: monospace; font-size: 12px; color: #333; padding: 48px 20px; text-align: center; }
        .aud { padding: 80px 48px; background: #0d0d0d; }
        .aud-lbl { font-size: 10px; letter-spacing: 0.3em; color: #555; text-transform: uppercase; margin-bottom: 20px; font-family: monospace; }
        .aud-tabs { display: flex; margin-bottom: 48px; border-bottom: 1px solid #1e1e1e; }
        .aud-tab { padding: 14px 32px; font-family: monospace; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; background: none; border: none; color: #555; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; }
        .aud-tab.active { color: #C9A96E; border-bottom-color: #C9A96E; }
        .aud-content { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
        .aud-title { font-size: 36px; line-height: 1.2; font-weight: 400; margin-bottom: 20px; color: #f0ece4; }
        .aud-body { font-size: 15px; line-height: 1.7; color: #aaa; margin-bottom: 32px; }
        .aud-list { list-style: none; margin-bottom: 32px; }
        .aud-list li { font-family: monospace; font-size: 12px; color: #777; padding: 10px 0; border-bottom: 1px solid #1a1a1a; display: flex; gap: 12px; }
        .aud-list li span { color: #C9A96E; }
        .aud-cta { display: inline-block; padding: 14px 28px; font-family: monospace; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; font-weight: 700; background: #C9A96E; color: #0a0a0a; }
        .aud-price { font-family: monospace; font-size: 11px; color: #555; margin-top: 12px; display: block; }
        .aud-panel { background: #111; border: 1px solid #1e1e1e; overflow: hidden; }
        .aud-panel-header { background: #1a1a1a; padding: 14px 20px; border-bottom: 1px solid #222; font-family: monospace; font-size: 10px; letter-spacing: 0.2em; color: #555; text-transform: uppercase; }
        .aud-stat { padding: 14px 20px; border-bottom: 1px solid #1a1a1a; display: flex; justify-content: space-between; align-items: center; }
        .aud-stat:last-child { border-bottom: none; }
        .aud-stat-label { font-size: 13px; color: #aaa; }
        .aud-stat-value { font-family: monospace; font-size: 13px; color: #C9A96E; }
        .aud-stat-value.overdue { color: #ef4444; }
        .aud-stat-value.paid { color: #4ade80; }
        .scar { padding: 80px 48px; background: #F5EFE6; display: flex; justify-content: space-between; align-items: center; }
        .scar-lbl { font-family: monospace; font-size: 10px; letter-spacing: 0.3em; color: #B8944A; text-transform: uppercase; margin-bottom: 12px; }
        .scar-title { font-size: 28px; font-weight: 400; color: #12100E; }
        .scar-sub { font-size: 14px; color: #7A6A5A; margin-top: 8px; max-width: 500px; }
        .scar-btn { padding: 16px 32px; background: #12100E; color: #C9A96E; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; font-weight: 700; display: inline-block; font-family: monospace; white-space: nowrap; }
        .faq { padding: 80px 48px; background: #F5EFE6; border-top: 1px solid #E0D8C8; }
        .faq-lbl { font-size: 10px; letter-spacing: 0.3em; color: #9A8A78; text-transform: uppercase; margin-bottom: 20px; font-family: monospace; }
        .faq-title { font-size: 36px; font-weight: 400; margin-bottom: 48px; color: #12100E; }
        .faq-item { border-bottom: 1px solid #D8D0C0; }
        .faq-q { width: 100%; text-align: left; background: none; border: none; color: #12100E; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 17px; padding: 22px 0; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
        .faq-icon { color: #B8944A; font-size: 24px; margin-left: 16px; flex-shrink: 0; font-family: monospace; font-weight: 300; line-height: 1; }
        .faq-a { font-size: 14px; line-height: 1.8; color: #5A4A38; padding-bottom: 20px; max-width: 700px; }
        .cls { padding: 100px 48px; text-align: center; background: #0d0d0d; }
        .cls-title { font-size: 48px; font-weight: 400; margin-bottom: 16px; color: #f0ece4; }
        .cls-title em { font-style: italic; color: #C9A96E; }
        .cls-sub { font-size: 16px; color: #666; margin-bottom: 40px; max-width: 500px; margin-left: auto; margin-right: auto; }
        .cls-ctas { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .btn-p { padding: 16px 32px; background: #C9A96E; color: #0a0a0a; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; font-weight: 700; display: inline-block; font-family: monospace; }
        .btn-s { padding: 16px 32px; border: 1px solid #333; color: #888; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; display: inline-block; font-family: monospace; }
        .foot { background: #050505; padding: 32px 48px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #1a1a1a; }
        .foot-logo { font-size: 16px; letter-spacing: 0.15em; color: #C9A96E; font-family: monospace; }
        .foot-meta { font-family: monospace; font-size: 10px; letter-spacing: 0.12em; color: #999; text-transform: uppercase; }
        @media (max-width: 768px) {
          .fullhero { padding: 32px 20px; }
          .fh-title { font-size: clamp(48px, 14vw, 80px); }
          .fh-nav .fh-btn-s { display: none; }
          .fh-foot { flex-direction: column; gap: 8px; }
          .season-bar { gap: 24px; padding: 16px 20px; flex-wrap: wrap; }
          .problem { grid-template-columns: 1fr; gap: 40px; padding: 48px 20px; }
          .how { padding: 48px 20px; }
          .how-steps { grid-template-columns: 1fr 1fr; gap: 24px; }
          .demo { padding: 48px 20px; }
          .demo-inner { grid-template-columns: 1fr; gap: 32px; }
          .demo-status-step { font-size: 7px; padding: 6px 2px; }
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
          .foot-meta { font-size: 10px; line-height: 1.9; }
        }
      \`}</style>
      <div className="fullhero">
        <div className="fh-top">
          <div className="fh-logo">ISLA · The Concierge Network · Ibiza 2026</div>
          <div className="fh-nav">
            <Link href="/auth/signup" className="fh-btn-s">Join Free</Link>
            <Link href="/auth/signup" className="fh-btn-p">List Your Venue</Link>
          </div>
        </div>
        <div className="fh-body">
          <span className="fh-eyebrow">Ibiza 2026 · Early Access Live · Expanding Globally</span>
          <h1 className="fh-title">You are already<br/>losing <em>money.</em></h1>
          <p className="fh-sub">The average Ibiza concierge loses <strong>€4,200 per season</strong> in untracked commissions. ISLA stops that.</p>
          <div className="fh-ctas">
            <Link href="/auth/signup" className="fh-btn-primary">Start Tracking — Free</Link>
            <Link href="/auth/signup" className="fh-btn-secondary">List Your Venue</Link>
          </div>
        </div>
        <div className="fh-foot">
          <div className="fh-tagline">islanetwork.es · hello@islanetwork.es · Ibiza 2026</div>
          <div className="fh-scroll">Explore the platform ↓</div>
        </div>
      </div>

      <div className="season-bar">
        <div className="season-item"><div className="season-val">Founding Season</div><div className="season-lbl">Ibiza 2026</div></div>
        <div className="season-item"><div className="season-val">Early Access</div><div className="season-lbl">Now Open</div></div>
        <div className="season-item"><div className="season-val">Expanding</div><div className="season-lbl">Mykonos · Dubai · St Tropez</div></div>
      </div>

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
          <p className="txt">ISLA creates a structured layer between concierges and venues. Every referral is tracked, documented, and reconciled automatically. Payments go direct — ISLA is the record layer that enforces everything.</p>
        </div>
      </section>

      <section className="how">
        <div className="how-lbl">How It Works</div>
        <h2 className="how-title">Four steps. Zero manual tracking.</h2>
        <div className="how-steps">
          <div><div className="how-num">01</div><div className="how-st">Concierge refers</div><div className="how-sb">A verified concierge submits a referral through ISLA with guest details and venue selection.</div></div>
          <div><div className="how-num">02</div><div className="how-st">Reference generated</div><div className="how-sb">A unique ISLA reference is created instantly and shared with the venue via the platform.</div></div>
          <div><div className="how-num">03</div><div className="how-st">Booking confirmed</div><div className="how-sb">The venue records the reference. ISLA tracks confirmation, covers, and final spend.</div></div>
          <div><div className="how-num">04</div><div className="how-st">Commission calculated</div><div className="how-sb">Commission calculated from the signed agreement including IVA. No disputes. No chasing.</div></div>
        </div>
      </section>

      <section className="demo">
        <div className="demo-inner">
          <div>
            <div className="demo-lbl">Live Demo</div>
            <h2 className="demo-title">Watch a commission <em>get tracked.</em></h2>
            <p className="demo-sub">From referral to payment in six steps. A real booking including the commission breakdown and IVA calculation.</p>
            <button className="demo-btn" onClick={() => setDemoStep(1)} disabled={demoStep > 0 && demoStep < 6}>
              {demoStep === 0 ? 'Run Demo' : demoStep < 6 ? 'Processing...' : 'Complete'}
            </button>
            {demoStep >= 6 && <button className="demo-reset" onClick={() => setDemoStep(0)}>Reset</button>}
          </div>
          <div className="demo-card">
            <div className="demo-status-bar">
              {['Submitted','Reference','Confirmed','Spend','Commission','Due'].map((s, i) => (
                <div key={i} className={`demo-status-step ${demoStep > i + 1 ? 'done' : demoStep === i + 1 ? 'active' : ''}`}>{s}</div>
              ))}
            </div>
            {demoStep === 0 ? (
              <div className="demo-idle">Press Run Demo to see a real referral tracked</div>
            ) : (
              <>
                <div className="demo-card-header">
                  <span className="demo-card-title">ISLA Referral Record</span>
                  {demoStep >= 2 && <span className="demo-ref">ISLA-2026-0041</span>}
                </div>
                <div className="demo-body">
                  {demoStep >= 1 && <div className="demo-field"><span className="demo-field-label">Venue</span><span className="demo-field-value">Casa Jondal</span></div>}
                  {demoStep >= 1 && <div className="demo-field"><span className="demo-field-label">Date</span><span className="demo-field-value">Sat 14 June 2026</span></div>}
                  {demoStep >= 1 && <div className="demo-field"><span className="demo-field-label">Party</span><span className="demo-field-value">4 guests · Dinner</span></div>}
                  {demoStep >= 2 && <div className="demo-field"><span className="demo-field-label">Reference</span><span className="demo-field-value gold">ISLA-2026-0041</span></div>}
                  {demoStep >= 3 && <div className="demo-field"><span className="demo-field-label">Status</span><span className="demo-field-value green">Booking Confirmed ✓</span></div>}
                  {demoStep >= 4 && <div className="demo-field"><span className="demo-field-label">Total Spend</span><span className="demo-field-value gold">€{spend.toLocaleString()}</span></div>}
                  {demoStep >= 5 && (<>
                    <div className="demo-divider" />
                    <div className="demo-field"><span className="demo-field-label">Commission Rate</span><span className="demo-field-value">12% (agreed)</span></div>
                    <div className="demo-field"><span className="demo-field-label">Commission</span><span className="demo-field-value gold">€{commission.toFixed(2)}</span></div>
                    <div className="demo-field"><span className="demo-field-label">IVA 21%</span><span className="demo-field-value">€{iva.toFixed(2)}</span></div>
                  </>)}
                </div>
                {demoStep >= 6 && (
                  <div className="demo-total">
                    <span className="demo-total-label">Total Due to Concierge</span>
                    <span className="demo-total-value">€{total.toFixed(2)}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <section className="aud">
        <div className="aud-lbl">Who It Is For</div>
        <div className="aud-tabs">
          <button className={`aud-tab ${tab === 'concierge' ? 'active' : ''}`} onClick={() => setTab('concierge')}>For Concierges and GRMs</button>
          <button className={`aud-tab ${tab === 'venue' ? 'active' : ''}`} onClick={() => setTab('venue')}>For Venues and Operators</button>
        </div>
        {tab === 'concierge' && (
          <div className="aud-content">
            <div>
              <h2 className="aud-title">Make more money. Starting today.</h2>
              <p className="aud-body">See every venue rate live. Log referrals in seconds. Know exactly who has paid and who has not — with full commission breakdowns including IVA. Always free.</p>
              <ul className="aud-list">
                <li><span>—</span>Full venue directory with live commission rates</li>
                <li><span>—</span>Every referral logged with a unique ISLA reference</li>
                <li><span>—</span>Commission tracked with IVA breakdown</li>
                <li><span>—</span>Payment status — confirmed, pending, overdue</li>
                <li><span>—</span>Signed agreements give you legal leverage</li>
                <li><span>—</span>Always free</li>
              </ul>
              <Link href="/auth/signup" className="aud-cta">Join Free</Link>
            </div>
            <div className="aud-panel">
              <div className="aud-panel-header">Your Commission Dashboard · Season 2026</div>
              <div className="aud-stat"><span className="aud-stat-label">Venue A · 12%</span><span className="aud-stat-value">€464 pending</span></div>
              <div className="aud-stat"><span className="aud-stat-label">Venue B · 10%</span><span className="aud-stat-value paid">€254 paid</span></div>
              <div className="aud-stat"><span className="aud-stat-label">Venue C · 8%</span><span className="aud-stat-value">€194 pending</span></div>
              <div className="aud-stat"><span className="aud-stat-label">Venue D · 15%</span><span className="aud-stat-value overdue">€653 overdue</span></div>
              <div className="aud-stat" style={{background:'#1a1a1a'}}><span className="aud-stat-label" style={{color:'#777'}}>Season total tracked</span><span className="aud-stat-value" style={{fontSize:'16px'}}>€1,565</span></div>
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
              <span className="aud-price">From €500 per year · Less than one table booking</span>
            </div>
            <div className="aud-panel">
              <div className="aud-panel-header">Venue Dashboard · June 2026</div>
              <div className="aud-stat"><span className="aud-stat-label">Referrals this month</span><span className="aud-stat-value">23</span></div>
              <div className="aud-stat"><span className="aud-stat-label">Total tracked spend</span><span className="aud-stat-value">€48,200</span></div>
              <div className="aud-stat"><span className="aud-stat-label">Commissions due</span><span className="aud-stat-value">€5,780</span></div>
              <div className="aud-stat"><span className="aud-stat-label">Top concierge</span><span className="aud-stat-value">12 referrals</span></div>
              <div className="aud-stat"><span className="aud-stat-label">Gone quiet this week</span><span className="aud-stat-value overdue">3 concierges</span></div>
            </div>
          </div>
        )}
      </section>

      <section className="scar">
        <div>
          <div className="scar-lbl">Founding Venues — Limited Places</div>
          <h2 className="scar-title">Ibiza 2026 season now open.</h2>
          <p className="scar-sub">ISLA is onboarding a limited number of founding venues. Priority placement, locked rates, and early access to the full concierge network. Less than one table booking per year.</p>
        </div>
        <Link href="/auth/signup" className="scar-btn">Apply Now</Link>
      </section>

      <section className="faq">
        <div className="faq-lbl">Questions and Answers</div>
        <h2 className="faq-title">Everything you need to know.</h2>
        {faqs.map(([q, a], i) => (
          <div key={i} className="faq-item">
            <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
              {q}<span className="faq-icon">{open === i ? '−' : '+'}</span>
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
        <div className="foot-meta">The Concierge Network · islanetwork.es · Ibiza 2026 · hello@islanetwork.es · <a href="/admin" style={{color: 'inherit', opacity: 0.6, textDecoration: 'none'}}>admin</a></div>
      </footer>
    </>
  )
}
