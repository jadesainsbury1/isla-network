export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { venueId } = await req.json()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase
    .from('venues')
    .update({ is_active: true })
    .eq('id', venueId)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const { data: venue } = await supabase
    .from('venues')
    .select('*')
    .eq('id', venueId)
    .single()

  const email = venue?.contact_email
  if (!email) return NextResponse.json({ ok: true, warning: 'No email found' })

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.RESEND_API_KEY
    },
    body: JSON.stringify({
      from: 'ISLA <hello@islanetwork.es>',
      to: email,
      subject: 'Welcome to ISLA — choose your plan to go live',
      html: `
        <div style="background:#0a0a0a;color:#f0ece4;font-family:Georgia,serif;padding:48px 40px;max-width:580px;margin:0 auto;">
          <div style="font-family:monospace;font-size:10px;letter-spacing:0.3em;color:#C9A96E;text-transform:uppercase;margin-bottom:24px;">ISLA · The Concierge Network</div>
          <h1 style="font-size:28px;font-weight:300;margin:0 0 16px;">You're approved.</h1>
          <p style="color:#aaa;font-size:15px;line-height:1.7;margin-bottom:32px;">
            ${venue?.name} has been approved to join ISLA. To go live and become visible to every verified concierge on the network, select your annual plan below.
          </p>

          <div style="margin-bottom:12px;border:1px solid #222;border-radius:8px;padding:20px 24px;">
            <div style="font-family:monospace;font-size:10px;letter-spacing:0.2em;color:#888;text-transform:uppercase;margin-bottom:6px;">Essential</div>
            <div style="font-size:22px;font-weight:500;color:#f0ece4;margin-bottom:4px;">€75<span style="font-size:13px;color:#888;">/month · €900/year</span></div>
            <p style="font-size:13px;color:#888;line-height:1.6;margin:8px 0 16px;">Verified listing, referral tracking, in-platform booking confirmation, AI bill scanning, commission management, messaging with concierges.</p>
            <a href="https://buy.stripe.com/eVqaEXdVS3ewfw16Vp5EY04" style="display:inline-block;padding:10px 24px;background:#333;color:#f0ece4;font-family:monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;">Select Essential →</a>
          </div>

          <div style="margin-bottom:12px;border:2px solid #C9A96E;border-radius:8px;padding:20px 24px;position:relative;">
            <div style="position:absolute;top:-10px;left:20px;background:#C9A96E;color:#000;font-family:monospace;font-size:9px;letter-spacing:0.15em;padding:3px 10px;text-transform:uppercase;font-weight:700;">Most Popular</div>
            <div style="font-family:monospace;font-size:10px;letter-spacing:0.2em;color:#C9A96E;text-transform:uppercase;margin-bottom:6px;">Premium</div>
            <div style="font-size:22px;font-weight:500;color:#f0ece4;margin-bottom:4px;">€150<span style="font-size:13px;color:#888;">/month · €1,800/year</span></div>
            <p style="font-size:13px;color:#888;line-height:1.6;margin:8px 0 16px;">Everything in Essential plus priority placement when concierges browse venues, monthly performance report, and dedicated WhatsApp support during season (Jun–Sep).</p>
            <a href="https://buy.stripe.com/cNieVd052g1i83za7B5EY05" style="display:inline-block;padding:10px 24px;background:#C9A96E;color:#000;font-family:monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;font-weight:700;">Select Premium →</a>
          </div>

          <div style="margin-bottom:32px;border:1px solid #333;border-radius:8px;padding:20px 24px;">
            <div style="font-family:monospace;font-size:10px;letter-spacing:0.2em;color:#888;text-transform:uppercase;margin-bottom:6px;">Elite</div>
            <div style="font-size:22px;font-weight:500;color:#f0ece4;margin-bottom:4px;">€290<span style="font-size:13px;color:#888;">/month · €3,480/year</span></div>
            <p style="font-size:13px;color:#888;line-height:1.6;margin:8px 0 16px;">Everything in Premium plus featured placement in ISLA concierge communications, quarterly strategy call with Jade, co-branded social content, and first invitation to the ISLA annual concierge event.</p>
            <a href="https://buy.stripe.com/14AdR9dVS16o2Jf5Rl5EY06" style="display:inline-block;padding:10px 24px;background:#333;color:#f0ece4;font-family:monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;">Select Elite →</a>
          </div>

          <p style="font-size:12px;color:#555;line-height:1.7;margin-bottom:24px;">
            Questions? Reply to this email or WhatsApp us. We'll help you get set up and introduce you to the concierge team.
          </p>
          <p style="font-size:11px;color:#444;font-family:monospace;">ISLA · islanetwork.es · hello@islanetwork.es</p>
        </div>
      `
    })
  })

  return NextResponse.json({ ok: true })
}
