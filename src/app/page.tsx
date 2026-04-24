'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function HomePage() {
  const [open, setOpen] = useState(null)
  const faqs = [
    ['Is ISLA really free for concierges?', 'Yes. Always. Concierges never pay. Revenue comes from venues.'],
    ['How does the reference number system work?', 'Every referral generates a unique ISLA reference number. The venue records it when taking the booking. ISLA uses it to track confirmation and calculate commission.'],
    ['What if a venue does not pay?', 'ISLA holds signed commission agreements. Non-payment triggers suspension of venue visibility. You have documentation and leverage.'],
    ['We already use SevenRooms. Why do we need ISLA?', 'SevenRooms manages reservations. ISLA manages concierge attribution and commission tracking. They work together.'],
    ['How is commission calculated?', 'As a fixed percentage of net F&B spend, agreed in writing before the season. No ambiguity. No negotiation after the fact.'],
    ['When is ISLA expanding beyond Ibiza?', 'Mykonos, St Tropez, and Dubai are next. Founding venue agreements travel with the platform.'],
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
        .nav-btn-s { padding: 10px 20px; border: 1px solid #333; color: #888; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; }
        .hero { padding: 100px 48px 80px; max-width: 900px; }
        .hero-tag { font-size: 10px; letter-spacing: 0.3em; color: #C9A96E; text-transform: uppercase; margin-bottom: 24px; font-family: monospace; }
        .hero-title { font-size: 56px; line-height: 1.1; font-weight: 400; margin-bottom: 24px; }
        .hero-title em { font-style: italic; color: #C9A96E; }
        .hero-sub { font-size: 18px; line-height: 1.6; color: #888; max-width: 600px; margin-bottom: 40px; }
        .hero-ctas { display: flex; gap: 16px; flex-wrap: wrap; }
        .btn-p { padding: 16px 32px; background: #C9A96E; color: #0a0a0a; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; font-weight: 700; display: inline-block; }
        .btn-s { padding: 16px 32px; border: 1px solid #333; color: #888; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none; display: inline-block; }
        .divider { border: none; border-top: 1px solid #1e1e1e; margin: 0 48px; }
        .problem { padding: 80px 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
        .lbl { font-size: 10px; letter-spacing: 0.3em; color: #555; text-transform: uppercase; margin-bottom: 20px; font-family: monospace; }
        .problem-title { font-size: 36px; line-height: 1.2; font-weight: 400; margin-bottom: 24px; }
        .problem-title em { font-style: italic; color: #C9A96E; }
        .txt { font-size: 15px; line-height: 1.7; color: #888; }
        .plist { list-style: none; margin-top: 24px; }
        .plist li { font-family: monospace; font-size: 12px; color: #666; padding: 10px 0; border-bottom: 1px solid #1a1a1a; display: flex; gap: 12px; }
        .plist li span { color: #C9A96E; }
        .auth-box { background: #111; border: 1px solid #222; padding: 32px; margin-top: 32px; }
        .auth-text { font-size: 14px; line-height: 1.6; color: #888; font-style: italic; }
        .auth-attr { font-family: monospace; font-size: 10px; letter-spacing: 0.2em; color: #555; text-transform: uppercase; margin-top: 12px; }
        .how { padding: 80px 48px; background: #0d0d0d; }
        .how-title { font-size: 36px; font-weight: 400; margin-bottom: 48px; }
        .how-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; }
        .how-num { font-family: monospace; font-size: 11px; color: #C9A96E; margin-bottom: 12px; }
        .how-st { font-size: 16px; margin-bottom: 8px; }
        .how-sb { font-size: 13px; line-height: 1.6; color: #666; }
        .aud { display: grid; grid-template-columns: 1fr 1fr; }
        .aud-v { background: #0d0d0d; padding: 80px 48px; border-right: 1px solid #1e1e1e; }
        .aud-c { background: #C9A96E; padding: 80px 48px; }
        .aud-lbl { font-family: monospace; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 20px; color: #555; }
        .aud-title { font-size: 32px; line-height: 1.2; font-weight: 400; margin-bottom: 20px; }
        .aud-body { font-size: 14px; line-height: 1.7; color: #888; margin-bottom: 32px; }
        .aud-list { list-style: none; margin-bottom: 32px; }
        .aud-list li { font-family: monospace; font-size: 11px; color: #666; padding: 8px 0; border-bottom: 1px solid #1a1a1a; }
        .aud-c .aud-lbl { color: rgba(0,0,0,0.5); }
        .aud-c .aud-title { color: #0a0a0a; }
        .aud-c .aud-body { color: rgba(0,0,0,0.6); }
        .aud-c .aud-list li { color: #0a0a0a; border-bottom-color: rgba(0,0,0,0.15); }
        .aud-cta-v { display: inline-block; padding: 14px 28px; font-family: monospace; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; font-weight: 700; background: #C9A96E; color: #0a0a0a; }
        .aud-cta-c { display: inline-block; padding: 14px 28px; font-family: monospace; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; font-weight: 700; background: #0a0a0a; color: #C9A96E; }
        .aud-price { font-family: monospace; font-size: 11px; color: #555; margin-left: 12px; }
        .scar { padding: 80px 48px; border-top: 1px solid #1e1e1e; border-bottom: 1px solid #1e1e1e; display: flex; justify-content: space-between; align-items: center; }
        .scar-lbl { font-family: monospace; font-size: 10px; letter-spacing: 0.3em; color: #C9A96E; text-transform: uppercase; margin-bottom: 12px; }
        .scar-title { font-size: 28px; font-weight: 400; }
        .scar-sub { font-size: 14px; color: #666; margin-top: 8px; }
        .faq { padding: 80px 48px; background: #0d0d0d; }
        .faq-title { font-size: 36px; font-weight: 400; margin-bottom: 48px; }
        .faq-item { border-bottom: 1px solid #1e1e1e; }
        .faq-q { width: 100%; text-align: left; background: none; border: none; color: #f0ece4; font-family: Georgia, serif; font-size: 16px; padding: 20px 0; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
        .faq-icon { color: #C9A96E; font-size: 18px; margin-left: 16px; }
        .faq-a { font-size: 14px; line-height: 1.7; color: #888; padding-bottom: 20px; max-width: 700px; }
        .cls { padding: 100px 48px; text-align: center; }
        .cls-title { font-size: 48px; font-weight: 400; margin-bottom: 16px; }
        .cls-title em { font-style: italic; color: #C9A96E; }
        .cls-sub { font-size: 16px; color: #666; margin-bottom: 40px; }
        .cls-ctas { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .foot { background: #050505; padding: 32px 48px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #1a1a1a; }
        .foot-logo { font-size: 16px; letter-spacing: 0.15em; color: #C9A96E; }
        .foot-meta { font-family: monospace; font-size: 9px; letter-spacing: 0.15em; color: #333; text-transform: uppercase; }
        @media (max-width: 768px) {
          .nav { padding: 16px 20px; } .nav-btn-s { display: none; }
          .hero { padding: 60px 20px 48px; } .hero-title { font-size: 36px; }
          .problem { grid-template-columns: 1fr; gap: 40px; padding: 48px 20px; }
          .how { padding: 48px 20px; } .how-steps { grid-template-columns: 1fr 1fr; gap: 24px; }
          .aud { grid-template-columns: 1fr; }
          .aud-v { border-right: none; border-bottom: 1px solid #1e1e1e; padding: 48px 20px; }
          .aud-c { padding: 48px 20px; }
          .scar { flex-direction: column; gap: 24px; padding: 48px 20px; text-align: center; }
          .faq { padding: 48px 20px; } .cls { padding: 60px 20px; } .cls-title { font-size: 32px; }
          .foot { flex-direction: column; gap: 12px; text-align: center; padding: 24px 20px; }
        }
      `}</style>
      <nav className="nav">
        <div><div className="nav-logo">ISLA</div><div className="nav-sub">The Concierge Network</div></div>
        <div className="nav-actions">
          <Link href="/demo" className="nav-btn-s">See Demo</Link>
          <Link href="/auth/signup" className="nav-btn-p">Apply as Venue</Link>
        </div>
      </nav>
      <section className="hero">
        <div className="hero-tag">Verified · Ibiza 2026 · Expanding Globally</div>
        <h1 className="hero-title">Track every concierge booking.<br/><em>Eliminate commission chaos.</em></h1>
        <p className="hero-sub">ISLA turns unstructured referrals into trackable revenue so venues never lose visibility, bookings, or commissions again.</p>
        <div className="hero-ctas">
          <Link href="/auth/signup" className="btn-p">Apply as a Founding Venue</Link>
          <Link href="/demo" className="btn-s">See the Platform</Link>
        </div>
      </section>
      <hr className="divider" />
      <section className="problem">
        <div>
          <div className="lbl">The Problem</div>
          <h2 className="problem-title">Concierge bookings are <em>invisible.</em></h2>
          <p className="txt">Today, most concierge-driven bookings are untracked, miscommunicated, and lost between teams. Commissions are inconsistent, relationships are unclear, and revenue slips through the cracks. Every season.</p>
          <ul className="plist">
            <li><span>-</span>No record of who referred the booking</li>
            <li><span>-</span>Commission terms agreed verbally, disputed later</li>
            <li><span>-</span>Payments chased on WhatsApp, often never received</li>
            <li><span>-</span>Staff turnover wipes out venue relationships</li>
            <li><span>-</span>No data on which concierges drive real revenue</li>
          </ul>
        </div>
        <div>
          <div className="auth-box">
            <p className="auth-text">Built by an Ibiza hospitality operator, not a tech startup. Every problem ISLA solves is one we lived from the inside.</p>
            <p className="auth-attr">ISLA — The Concierge Network · Ibiza 2026</p>
          </div>
          <div className="lbl" style={{marginTop: 32}}>The Solution</div>
          <p className="txt">ISLA creates a structured layer between concierges and venues. Every referral is tracked, documented, and reconciled automatically.</p>
        </div>
      </section>
      <section className="how">
        <div className="lbl">How It Works</div>
        <h2 className="how-title">Four steps. Zero manual tracking.</h2>
        <div className="how-steps">
          <div><div className="how-num">01</div><div className="how-st">Concierge refers</div><div className="how-sb">A verified concierge submits a referral through ISLA with guest details and venue.</div></div>
          <div><div className="how-num">02</div><div className="how-st">Reference generated</div><div className="how-sb">A unique ISLA reference number is created and sent to the venue GM via WhatsApp.</div></div>
          <div><div className="how-num">03</div><div className="how-st">Booking confirmed</div><div className="how-sb">The venue records the reference. ISLA tracks confirmation and final bill value.</div></div>
          <div><div className="how-num">04</div><div className="how-st">Commission calculated</div><div className="how-sb">Commission is calculated from the signed agreement. No disputes. No chasing.</div></div>
        </div>
      </section>
      <div className="aud">
        <div className="aud-v">
          <div className="aud-lbl">For Venues and Operators</div>
          <h2 className="aud-title">More bookings. Full control.</h2>
          <p className="aud-body">Capture every concierge-driven booking. Track attribution clearly. Eliminate manual commission tracking entirely.</p>
          <ul className="aud-list">
            <li>Verified concierge directory</li>
            <li>Every referral documented with a signed agreement</li>
            <li>Payment reliability scores per concierge</li>
            <li>Survives staff changes</li>
            <li>Priority placement for founding venues</li>
          </ul>
          <Link href="/auth/signup" className="aud-cta-v">Apply as Founding Venue</Link>
          <span className="aud-price">From 500 per year</span>
        </div>
        <div className="aud-c">
          <div className="aud-lbl">For Concierges and GRMs</div>
          <h2 className="aud-title">Never lose a commission again.</h2>
          <p className="aud-body">See every venue rate live. Log referrals in seconds. Know who has paid and who has not.</p>
          <ul className="aud-list">
            <li>Full venue directory with live commission rates</li>
            <li>Every referral logged with a unique reference number</li>
            <li>Payment tracking confirmed, pending, overdue</li>
            <li>Signed agreements mean you have leverage</li>
            <li>Always free</li>
          </ul>
          <Link href="/auth/signup" className="aud-cta-c">Join Free</Link>
        </div>
      </div>
      <section className="scar">
        <div>
          <div className="scar-lbl">Founding Venues - Limited Places</div>
          <h2 className="scar-title">Ibiza 2026 season now open.</h2>
          <p className="scar-sub">ISLA is onboarding a limited number of founding venues per market. Founding venues receive priority placement and locked rates.</p>
        </div>
        <Link href="/auth/signup" className="btn-p">Apply Now</Link>
      </section>
      <section className="faq">
        <div className="lbl">Questions and Answers</div>
        <h2 className="faq-title">Everything you need to know.</h2>
        {faqs.map(([q, a], i) => (
          <div key={i} className="faq-item">
            <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
              {q}<span className="faq-icon">{open === i ? "-" : "+"}</span>
            </button>
            {open === i && <p className="faq-a">{a}</p>}
          </div>
        ))}
      </section>
      <section className="cls">
        <h2 className="cls-title">The season is <em>already here.</em></h2>
        <p className="cls-sub">Every week without ISLA is a week where bookings go untracked and commissions go unpaid.</p>
        <div className="cls-ctas">
          <Link href="/auth/signup" className="btn-p">Apply as a Founding Venue</Link>
          <Link href="/auth/signup" className="btn-s">Join as Concierge Free</Link>
        </div>
      </section>
      <footer className="foot">
        <div className="foot-logo">ISLA</div>
        <div className="foot-meta">The Concierge Network · islanetwork.es · Ibiza 2026 · hello@islanetwork.es · <a href="/admin" style={{color: "inherit", opacity: 0.4, textDecoration: "none"}}>admin</a></div>
      </footer>
    </>
  )
}
