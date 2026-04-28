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
    ['We already use SevenRooms. Why do we need ISLA?', 'SevenRooms manages reservations internally. ISLA manages the concierge relationship layer.'],
    ['What if a venue does not pay?', 'ISLA holds signed commission agreements. Non-payment triggers suspension of venue visibility. You have documentation and leverage.'],
    ['When is ISLA expanding beyond Ibiza?', 'Marbella is next — launching late 2026. Mykonos and Dubai to follow.'],
    ['How do I get listed or join?', 'Venues apply via the site and go through an approval process. Concierges sign up free and are verified before accessing the full directory.'],
  ]

  const demoSteps = [
    { label: 'Referral submitted', detail: 'Beach Club · 4 guests · dinner', color: '#C9A96E' },
    { label: 'Reference generated', detail: 'ISLA-2026-0041', color: '#C9A96E' },
    { label: 'Booking confirmed', detail: '3200 spend · 12% commission', color: '#4ade80' },
    { label: 'Commission tracked', detail: '384 pending payment', color: '#facc15' },
  ]

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; color: #f0ece4; font-family: Georgia, serif; }
        .urgency-bar { background: #ef4444; padding: 10px 48px; display: flex; justify-content: center; align-items: center; gap: 32px; flex-wrap: wrap; }
        .urgency-bar-text { font-family: monospace; font-size: 10px; letter-spacing: 0.25em; color: #fff; text-transform: uppercase; }
        .urgency-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.4); flex-shrink: 0; }
        .nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 48px; border-bottom: 1px solid #1e1e1e; position: sticky; top: 0; background: #0a0a0a; z-index: 100; }
        .nav-logo { font-size: 20px; letter-spacing: 0.15em; color: #C9A96E; }
        .nav-sub { font-size: 9px; letter-spacing: 0.2em; color: #555; text-transform: uppercase; margin-top: 2px; }
        .nav-actions { display: flex; gap: 12px; }
        .nav-btn-p { padding: 10px 20px; background: #C9A96E; color: #0a0a0a; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; font-weight: 600; }
        .nav-btn-s { padding: 10px 20px; border: 1px solid #333; color: #aaa; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; }
        .stats-bar { display: flex; justify-content: center; gap: 64px; padding: 20px 48px; border-bottom: 1px solid #1e1e1e; background: #0d0d0d; }
        .stat-item { text-align: center; }
        .stat-num { font-size: 22px; color: #C9A96E; font-weight: 400; }
        .stat-lbl { font-family: monospace; font-size: 9px; letter-spacing: 0.2em; color: #555; text-transform: uppercase; margin-top: 2px; }
        .hero { padding: 100px 48px 80px; max-width: 900px; }
        .hero-tag { font-size: 10px; letter-spacing: 0.3em; color: #ef4444; text-transform: uppercase; margin-bottom: 24px; font-family: monospace; }
        .hero-title { font-size: 56px; line-height: 1.1; font-weight: 400; margin-bottom: 24px; }
        .hero-title em { font-style: italic; color: #C9A96E; }
        .hero-sub { font-size: 18px; line-height: 1.6; color: #aaa; max-width: 600px; margin-bottom: 40px; }
        .hero-sub strong { color: #C9A96E; font-weight: 400; }
        .hero-ctas { display: flex; gap: 16px; flex-wrap: wrap; }
        .btn-p { padding: 16px 32px; background: #C9A96E; color: #0a0a0a; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; font-weight: 700; display: inline-block; }
        .btn-s { padding: 16px 32px; border: 1px solid #444; color: #aaa; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; display: inline-block; }
        .divider { border: none; border-top: 1px solid #1e1e1e; margin: 0 48px; }
        .money-block { padding: 56px 48px; background: #111; border-bottom: 1px solid #1e1e1e; }
        .money-inner { max-width: 900px; margin: 0 auto; }
        .money-lbl { font-family: monospace; font-size: 9px; letter-spacing: 0.35em; color: #555; text-transform: uppercase; margin-bottom: 8px; }
        .money-title { font-size: clamp(22px, 3vw, 32px); font-weight: 400; color: #f0ece4; margin-bottom: 6px; }
        .money-title em { font-style: italic; color: #C9A96E; }
        .money-sub { font-size: 14px; color: #555; font-style: italic; margin-bottom: 32px; }
        .money-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        .money-card { padding: 28px 24px; background: #0d0d0d; border: 1px solid #1e1e1e; }
        .money-card-label { font-family: monospace; font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 12px; }
        .money-card-label.pending { color: #C9A96E; }
        .money-card-label.paid { color: #4ade80; }
        .money-card-label.overdue { color: #ef4444; }
        .money-card-amount { font-size: 40px; font-weight: 400; line-height: 1; margin-bottom: 8px; }
        .money-card-amount.pending { color: #C9A96E; }
        .money-card-amount.paid { color: #4ade80; }
        .money-card-amount.overdue { color: #ef4444; }
        .money-card-desc { font-family: monospace; font-size: 10px; color: #444; letter-spacing: 0.1em; }
        .money-cta { margin-top: 24px; font-family: monospace; font-size: 11px; color: #555; letter-spacing: 0.1em; }
        .money-cta strong { color: #C9A96E; }
        .problem { padding: 80px 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
        .lbl { font-size: 10px; letter-spacing: 0.3em; color: #555; text-transform: uppercase; margin-bottom: 20px; font-family: monospace; }
        .problem-title { font-size: 36px; line-height: 1.2; font-weight: 400; margin-bottom: 24px; }
        .problem-title em { font-style: italic; color: #C9A96E; }
        .txt { font-size: 15px; line-height: 1.7; color: #aaa; }
        .plist { list-style: none; margin-top: 24px; }
        .plist li { font-family: monospace; font-size: 12px; color: #777; padding: 10px 0; border-bottom: 1px solid #1a1a1a; display: flex; gap: 12px; }
        .plist li span { color: #C9A96E; }
        .shock-stat { background: #111; border-left: 3px solid #ef4444; padding: 20px 24px; margin: 24px 0; }
        .shock-number { font-size: 52px; font-weight: 400; color: #ef4444; line-height: 1; }
        .shock-label { font-family: monospace; font-size: 10px; letter-spacing: 0.2em; color: #777; text-transform: uppercase; margin-top: 6px; }
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
        .aud-stat:last-child { border-bottom: none; }
        .aud-stat-label { font-size: 13px; color: #aaa; }
        .aud-stat-value { font-family: monospace; font-size: 13px; color: #C9A96E; }
        .aud-stat-value.overdue { color: #ef4444; }
        .aud-stat-value.paid { color: #4ade80; }
        .pricing { padding: 80px 48px; border-top: 1px solid #1e1e1e; }
        .pricing-title { font-size: 36px; font-weight: 400; margin-bottom: 8px; }
        .pricing-title em { font-style: italic; color: #C9A96E; }
        .pricing-sub { font-size: 14px; color: #555; font-style: italic; margin-bottom: 48px; }
        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        .pricing-card { background: #111; border: 1px solid #1e1e1e; padding: 32px 28px; position: relative; }
        .pricing-card.featured { background: #141410; border-color: #C9A96E; }
        .pricing-badge { font-family: monospace; font-size: 8px; letter-spacing: 0.3em; color: #0a0a0a; background: #C9A96E; padding: 4px 10px; text-transform: uppercase; position: absolute; top: -1px; right: 24px; }
        .pricing-tier { font-family: monospace; font-size: 9px; letter-spacing: 0.3em; color: #555; text-transform: uppercase; margin-bottom: 16px; }
        .pricing-price { font-size: 48px; font-weight: 400; color: #f0ece4; line-height: 1; margin-bottom: 4px; }
        .pricing-period { font-family: monospace; font-size: 10px; color: #444; letter-spacing: 0.1em; margin-bottom: 20px; }
        .pricing-hook { font-size: 14px; color: #C9A96E; font-style: italic; margin-bottom: 20px; line-height: 1.5; border-left: 2px solid #C9A96E; padding-left: 12px; }
        .pricing-features { list-style: none; margin-bottom: 28px; }
        .pricing-features li { font-family: monospace; font-size: 11px; color: #666; padding: 8px 0; border-bottom: 1px solid #1a1a1a; display: flex; gap: 10px; }
        .pricing-features li span { color: #C9A96E; }
        .pricing-cta { display: block; padding: 12px 20px; background: #C9A96E; color: #0a0a0a; font-family: monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; font-weight: 700; text-align: center; }
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
        .cls-sub { font-size: 16px; color: #888; margin-bottom: 12px; max-width: 500px; margin-left: auto; margin-right: auto; }
        .cls-urgency { font-family: monospace; font-size: 11px; color: #ef4444; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 40px; }
        .cls-ctas { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .foot { background: #050505; padding: 32px 48px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #1a1a1a; }
        .foot-logo { font-size: 16px; letter-spacing: 0.15em; color: #C9A96E; }
        .foot-meta { font-family: monospace; font-size: 10px; letter-spacing: 0.12em; color: #777; text-transform: uppercase; }
        @media (max-width: 768px) {
          .urgency-bar { gap: 12px; padding: 10px 20px; }
          .nav { padding: 16px 20px; }
          .nav-btn-s { display: none; }
          .stats-bar { gap: 32px; padding: 16px 20px; }
          .hero { padding: 60px 20px 48px; }
          .hero-title { font-size: 36px; }
          .money-block { padding: 40px 20px; }
          .money-cards { grid-template-columns: 1fr; }
          .problem { grid-template-columns: 1fr; gap: 40px; padding: 48px 20px; }
          .how { padding: 48px 20px; }
          .how-steps { grid-template-columns: 1fr 1fr; gap: 24px; }
          .demo { padding: 48px 20px; }
          .demo-inner { grid-template-columns: 1fr; gap: 32px; }
          .aud { padding: 48px 20px; }
          .aud-content { grid-template-columns: 1fr; gap: 32px; }
          .aud-tabs { overflow-x: auto; }
          .pricing { padding: 48px 20px; }
          .pricing-grid { grid-template-columns: 1fr; }
          .scar { flex-direction: column; gap: 24px; padding: 48px 20px; text-align: center; }
          .faq { padding: 48px 20px; }
          .cls { padding: 60px 20px; }
          .cls-title { font-size: 32px; }
          .foot { flex-direction: column; gap: 16px; text-align: center; padding: 28px 20px; }
          .divider { margin: 0 20px; }
        }
      `}</style>

      <div className="urgency-bar">
        <span className="urgency-bar-text">Season is live now</span>
        <span className="urgency-dot" />
        <span className="urgency-bar-text">Every week you wait = lost bookings</span>
        <span className="urgency-dot" />
        <span className="urgency-bar-text">Founding venues — limited places</span>
      </div>

      <nav className="nav">
        <div><div className="nav-logo">ISLA</div><div className="nav-sub">The Concierge Network</div></div>
        <div className="nav-actions">
          <Link href="/auth/signup" className="nav-btn-s">Join Free</Link>
          <Link href="/auth/signup" className="nav-btn-p">Get Access Now</Link>
        </div>
      </nav>


      <section className="hero">
        <div className="hero-tag">Season already running — every week offline costs you</div>
        <h1 className="hero-title">You are already<br/>losing <em>money.</em></h1>
        <p className="hero-sub">The average Ibiza concierge loses <strong>4,200 per season</strong> in commissions nobody tracked. The season is open now. ISLA stops that — free, forever.</p>
        <div className="hero-ctas">
          <Link href="/auth/signup" className="btn-p">Get Access Now — Free</Link>
          <Link href="/auth/signup" className="btn-s">List Your Venue</Link>
        </div>
      </section>

      <hr className="divider" />

      <section className="money-block">
        <div className="money-inner">
          <div className="money-lbl">Without ISLA — right now — this season</div>
          <h2 className="money-title">This is what <em>untracked</em> looks like.</h2>
          <p className="money-sub">Every one of these numbers exists in someones WhatsApp. Not yours.</p>
          <div className="money-cards">
            <div className="money-card">
              <div className="money-card-label pending">Pending</div>
              <div className="money-card-amount pending">2,400</div>
              <div className="money-card-desc">Owed — no record — no leverage</div>
            </div>
            <div className="money-card">
              <div className="money-card-label paid">Paid</div>
              <div className="money-card-amount paid">1,800</div>
              <div className="money-card-desc">Tracked — confirmed — protected</div>
            </div>
            <div className="money-card">
              <div className="money-card-label overdue">Overdue</div>
              <div className="money-card-amount overdue">600</div>
              <div className="money-card-desc">Past due — ISLA flags it — you have proof</div>
            </div>
          </div>
          <p className="money-cta">Inside ISLA you see this in real time. <strong>Without ISLA, you see nothing.</strong></p>
        </div>
      </section>

      <section className="problem">
        <div>
          <div className="lbl">The Problem</div>
          <h2 className="problem-title">4,200. Every season. <em>Gone.</em></h2>
          <p className="txt">The average Ibiza concierge loses 4,200 per season in commissions they earned and never tracked. Not because venues will not pay — because there is no record. No record means no leverage. No leverage means no money.</p>
          <div className="shock-stat">
            <div className="shock-number">4,200</div>
            <div className="shock-label">Lost per concierge per season untracked</div>
          </div>
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
          <div className="lbl" style={{marginTop: 32}}>The Fix</div>
          <p className="txt">ISLA creates a structured layer between concierges and venues. Every referral is tracked, documented, and reconciled. Signed agreements. Payment status in real time. If they do not pay — you have proof.</p>
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
              <h2 className="aud-title">Stop losing money you already earned.</h2>
              <p className="aud-body">You did the work. You sent the client. ISLA makes sure you get paid for it. See every venue rate live. Log referrals in seconds. Chase nothing. Always free.</p>
              <ul className="aud-list">
                <li><span>—</span>Full venue directory with live commission rates</li>
                <li><span>—</span>Every referral logged with a unique ISLA reference</li>
                <li><span>—</span>Payment status — confirmed, pending, overdue</li>
                <li><span>—</span>Signed agreements give you legal leverage</li>
                <li><span>—</span>Always free</li>
              </ul>
              <Link href="/auth/signup" className="aud-cta">Get Access Now — Free</Link>
            </div>
            <div className="aud-panel">
              <div className="aud-panel-title">Your Commission Dashboard · Season 2026</div>
              <div className="aud-stat"><span className="aud-stat-label">Beach Club · 12%</span><span className="aud-stat-value">464 pending</span></div>
              <div className="aud-stat"><span className="aud-stat-label">Restaurant · 10%</span><span className="aud-stat-value paid">254 paid</span></div>
              <div className="aud-stat"><span className="aud-stat-label">Beach Bar · 8%</span><span className="aud-stat-value">194 pending</span></div>
              <div className="aud-stat"><span className="aud-stat-label">Nightclub · 15%</span><span className="aud-stat-value overdue">653 overdue</span></div>
            </div>
          </div>
        )}
        {tab === 'venue' && (
          <div className="aud-content">
            <div>
              <h2 className="aud-title">If you are not visible, someone else is.</h2>
              <p className="aud-body">Every concierge in Ibiza checks ISLA before deciding where to send their client. If your venue is not listed, you do not exist to them. One booking covers the annual cost.</p>
              <ul className="aud-list">
                <li><span>—</span>Visible to every verified concierge on ISLA</li>
                <li><span>—</span>Every referral documented with a signed agreement</li>
                <li><span>—</span>Know exactly which concierges drive your revenue</li>
                <li><span>—</span>Relationships survive staff changes every October</li>
                <li><span>—</span>One booking covers the annual cost</li>
              </ul>
              <Link href="/auth/signup" className="aud-cta">List Your Venue Now</Link>
              <span className="aud-price">From 500/yr · Founding rate locked for life</span>
            </div>
            <div className="aud-panel">
              <div className="aud-panel-title">Venue Dashboard · Season 2026</div>
              <div className="aud-stat"><span className="aud-stat-label">Referrals this month</span><span className="aud-stat-value">23</span></div>
              <div className="aud-stat"><span className="aud-stat-label">Total tracked spend</span><span className="aud-stat-value">48,200</span></div>
              <div className="aud-stat"><span className="aud-stat-label">Commissions due</span><span className="aud-stat-value">5,780</span></div>
              <div className="aud-stat"><span className="aud-stat-label">Top concierge</span><span className="aud-stat-value">12 referrals</span></div>
            </div>
          </div>
        )}
      </section>

      <section className="pricing">
        <div className="lbl">Venue Pricing · Ibiza 2026</div>
        <h2 className="pricing-title">Less than one table booking. <em>Per year.</em></h2>
        <p className="pricing-sub">Every tier pays for itself the moment a concierge sends your first table.</p>
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="pricing-tier">Essential</div>
            <div className="pricing-price">500</div>
            <div className="pricing-period">per year · founding rate locked</div>
            <div className="pricing-hook">One average dinner table covers this. Every booking after is pure upside.</div>
            <ul className="pricing-features">
              <li><span>—</span>Listed in the ISLA concierge directory</li>
              <li><span>—</span>Commission agreements on record</li>
              <li><span>—</span>Referral tracking per concierge</li>
              <li><span>—</span>Payment status dashboard</li>
            </ul>
            <Link href="/auth/signup" className="pricing-cta">Apply Now</Link>
          </div>
          <div className="pricing-card featured">
            <div className="pricing-badge">Most chosen</div>
            <div className="pricing-tier">Premium</div>
            <div className="pricing-price">1,200</div>
            <div className="pricing-period">per year · founding rate locked</div>
            <div className="pricing-hook">Featured placement means concierges see you first. More visibility means more bookings. Pays back in one weekend.</div>
            <ul className="pricing-features">
              <li><span>—</span>Everything in Essential</li>
              <li><span>—</span>Featured placement — seen before others</li>
              <li><span>—</span>Full analytics — top concierges, spend trends</li>
              <li><span>—</span>Priority support</li>
            </ul>
            <Link href="/auth/signup" className="pricing-cta">Apply Now</Link>
          </div>
          <div className="pricing-card">
            <div className="pricing-tier">Elite</div>
            <div className="pricing-price">3,700</div>
            <div className="pricing-period">per year · founding rate locked</div>
            <div className="pricing-hook">Top placement always. Control your commission terms. Every concierge sees you first. Built for venues where one booking is worth thousands.</div>
            <ul className="pricing-features">
              <li><span>—</span>Everything in Premium</li>
              <li><span>—</span>Top of directory — always</li>
              <li><span>—</span>Custom commission term control</li>
              <li><span>—</span>Verified Partner badge</li>
            </ul>
            <Link href="/auth/signup" className="pricing-cta">Apply Now</Link>
          </div>
        </div>
      </section>

      <section className="scar">
        <div>
          <div className="scar-lbl">Founding Venues — Limited Places</div>
          <h2 className="scar-title">Season is already running.</h2>
          <p className="scar-sub">Every week you are not on ISLA is a week where concierges are sending bookings somewhere else. Founding rate locked for life — but the season does not wait.</p>
        </div>
        <Link href="/auth/signup" className="btn-p">List Your Venue Now</Link>
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
        <p className="cls-sub">Every week you are not on ISLA is a week where bookings go somewhere else.</p>
        <p className="cls-urgency">Do not wait — the season is live now</p>
        <div className="cls-ctas">
          <Link href="/auth/signup" className="btn-p">Get Access Now — Free</Link>
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
