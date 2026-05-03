import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { inviterName, inviterEmail, inviteeEmail, role } = await req.json()
  
  const inviteLink = role === 'concierge'
    ? 'https://islanetwork.es/auth/signup?role=concierge'
    : 'https://islanetwork.es/auth/signup?role=venue'

  const subject = role === 'concierge'
    ? `${inviterName} invited you to join ISLA — free for concierges`
    : `${inviterName} invited your venue to join ISLA`

  const body = role === 'concierge'
    ? `${inviterName} thinks you should be on ISLA — the concierge commission tracking network for luxury hospitality. It's free, always. Track every referral, every commission, every payment in one place.`
    : `${inviterName} thinks your venue should be on ISLA — the concierge network for luxury hospitality. Get found by every verified concierge and GRM, and track every commission automatically.`

  await resend.emails.send({
    from: 'ISLA Network <hello@islanetwork.es>',
    to: inviteeEmail,
    subject,
    html: `
      <div style="background:#0a0908;padding:40px;font-family:monospace;color:#d0c8b8;max-width:560px;margin:0 auto">
        <div style="font-size:10px;letter-spacing:0.3em;color:#c9a96e;text-transform:uppercase;margin-bottom:24px">ISLA · The Concierge Network</div>
        <h1 style="font-size:22px;font-weight:400;color:#f2ede4;margin-bottom:16px">${inviterName} invited you to ISLA</h1>
        <p style="font-size:13px;color:#8a8070;line-height:1.7;margin-bottom:24px">${body}</p>
        <a href="${inviteLink}" style="display:inline-block;padding:12px 28px;background:#c9a96e;color:#0a0908;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;border-radius:4px;font-weight:600">Request Access →</a>
        <p style="font-size:11px;color:#3a3028;margin-top:32px">ISLA · islanetwork.es · hello@islanetwork.es</p>
      </div>
    `
  })

  return NextResponse.json({ ok: true })
}
