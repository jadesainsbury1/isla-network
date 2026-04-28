import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const data = await req.formData()
  const venueId = data.get('venueId') as string

  const { data: venue } = await supabase
    .from('venues')
    .select('name, area, category, user_id, contact_email')
    .eq('id', venueId)
    .single()

  await supabase.from('venues').update({ is_active: true, is_verified: true }).eq('id', venueId)

  const venueEmail = venue?.contact_email

  if (venueEmail && venue) {
    const emailHtml = '<div style="background:#0a0a0a;color:#f0ece4;font-family:Georgia,serif;padding:48px;max-width:600px;margin:0 auto;"><div style="font-family:monospace;font-size:11px;letter-spacing:0.3em;color:#C9A96E;text-transform:uppercase;margin-bottom:24px;">ISLA The Concierge Network</div><h1 style="font-size:32px;font-weight:300;margin-bottom:16px;">Your venue is live.</h1><p style="font-size:15px;line-height:1.7;color:#aaa;margin-bottom:24px;">' + venue.name + ' has been approved and is now visible to every verified concierge on ISLA.</p><div style="background:#111;border:1px solid #222;padding:24px;margin-bottom:32px;"><p style="font-family:monospace;font-size:10px;letter-spacing:0.2em;color:#555;text-transform:uppercase;margin-bottom:16px;">What happens next</p><p style="font-size:14px;color:#aaa;line-height:1.7;margin-bottom:10px;">1. We will send you the ISLA Commission Agreement to sign</p><p style="font-size:14px;color:#aaa;line-height:1.7;margin-bottom:10px;">2. Your venue is now visible to every verified concierge on the network</p><p style="font-size:14px;color:#aaa;line-height:1.7;">3. Referrals will arrive with unique ISLA reference numbers</p></div><a href="https://islanetwork.es/dashboard" style="display:inline-block;padding:14px 32px;background:#C9A96E;color:#0a0a0a;font-family:monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;font-weight:700;">Access Your Dashboard</a><p style="font-size:12px;color:#555;margin-top:32px;font-family:monospace;">ISLA · islanetwork.es · hello@islanetwork.es</p></div>'

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: 'ISLA <hello@islanetwork.es>',
        to: venueEmail,
        subject: 'Your venue is live on ISLA',
        html: emailHtml
      })
    })

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: 'ISLA <hello@islanetwork.es>',
        to: 'hello@islanetwork.es',
        subject: 'Venue approved: ' + venue.name,
        html: '<p>You approved <strong>' + venue.name + '</strong> (' + venueEmail + '). Approval email sent.</p>'
      })
    })
  }

  return NextResponse.json({ ok: true })
}
