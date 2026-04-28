import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const data = await req.formData()
  const venueId = data.get('venueId') as string

  const { data: venue } = await supabase
    .from('venues')
    .select('name, contact_email')
    .eq('id', venueId)
    .single()

  await supabase.from('venues').update({ is_active: true, is_verified: true }).eq('id', venueId)

  const venueEmail = venue?.contact_email

  if (venueEmail && venue) {
    const emailHtml = `
<div style="background:#0a0a0a;color:#f0ece4;font-family:Georgia,serif;padding:48px;max-width:600px;margin:0 auto;">
  <div style="font-family:monospace;font-size:11px;letter-spacing:0.3em;color:#C9A96E;text-transform:uppercase;margin-bottom:24px;">ISLA The Concierge Network</div>
  <h1 style="font-size:32px;font-weight:300;margin-bottom:16px;">Your venue is live.</h1>
  <p style="font-size:15px;line-height:1.7;color:#aaa;margin-bottom:24px;">${venue.name} has been approved and is now visible to every verified concierge on ISLA.</p>
  <div style="background:#111;border:1px solid #222;padding:24px;margin-bottom:32px;">
    <p style="font-family:monospace;font-size:10px;letter-spacing:0.2em;color:#555;text-transform:uppercase;margin-bottom:16px;">What happens next</p>
    <p style="font-size:14px;color:#aaa;line-height:1.7;margin-bottom:10px;">1. Choose your plan below to confirm your listing</p>
    <p style="font-size:14px;color:#aaa;line-height:1.7;margin-bottom:10px;">2. We will send you the ISLA Commission Agreement to sign</p>
    <p style="font-size:14px;color:#aaa;line-height:1.7;">3. Referrals will arrive with unique ISLA reference numbers</p>
  </div>
  <p style="font-family:monospace;font-size:10px;letter-spacing:0.2em;color:#555;text-transform:uppercase;margin-bottom:16px;">Choose your plan</p>
  <div style="margin-bottom:32px;">
    <a href="https://buy.stripe.com/9B65kDbNKbL2dnT7Zt5EY01" style="display:block;margin-bottom:12px;padding:16px 24px;background:#C9A96E;color:#0a0a0a;font-family:monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;font-weight:700;">Elite &mdash; &euro;3,700 / year</a>
    <a href="https://buy.stripe.com/7sY00jbNK16odnT1B55EY02" style="display:block;margin-bottom:12px;padding:16px 24px;background:#C9A96E;color:#0a0a0a;font-family:monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;font-weight:700;">Premium &mdash; &euro;1,200 / year</a>
    <a href="https://buy.stripe.com/3cI8wP1965mE1Fb0x15EY03" style="display:block;margin-bottom:12px;padding:16px 24px;background:#1a1a1a;border:1px solid #333;color:#C9A96E;font-family:monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;font-weight:700;">Essential &mdash; &euro;500 / year</a>
  </div>
  <a href="https://islanetwork.es/venue/dashboard" style="display:inline-block;padding:14px 32px;background:#1a1a1a;border:1px solid #333;color:#C9A96E;font-family:monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;font-weight:700;">Access Your Dashboard</a>
  <p style="font-size:12px;color:#555;margin-top:32px;font-family:monospace;">ISLA · islanetwork.es · hello@islanetwork.es</p>
</div>`

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.RESEND_API_KEY },
      body: JSON.stringify({ from: 'ISLA <hello@islanetwork.es>', to: venueEmail, subject: 'Your venue is live on ISLA', html: emailHtml })
    })

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.RESEND_API_KEY },
      body: JSON.stringify({ from: 'ISLA <hello@islanetwork.es>', to: 'hello@islanetwork.es', subject: 'Venue approved: ' + venue.name, html: '<p>You approved <strong>' + venue.name + '</strong> (' + venueEmail + '). Payment links sent.</p>' })
    })
  }

  return NextResponse.json({ ok: true })
}
