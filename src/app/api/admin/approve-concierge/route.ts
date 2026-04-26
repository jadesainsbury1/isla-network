import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const data = await req.formData()
  const profileId = data.get('profileId') as string
  const email = data.get('email') as string
  const name = data.get('name') as string

  await supabase
    .from('profiles')
    .update({ is_approved: true })
    .eq('id', profileId)

  const subject = 'You are approved - Welcome to ISLA'
  const html = [
    '<div style="background:#0a0a0a;color:#fff;padding:40px;font-family:sans-serif;max-width:560px;">',
    '<div style="font-family:monospace;font-size:10px;letter-spacing:3px;color:#c9a84c;text-transform:uppercase;margin-bottom:24px;">ISLA - The Concierge Network</div>',
    '<h2 style="font-family:Georgia,serif;font-size:28px;font-weight:300;color:#f5f0e8;margin-bottom:16px;">Welcome to the network, ' + name + '.</h2>',
    '<p style="color:#888;font-size:14px;line-height:1.8;margin-bottom:32px;">Your application has been approved. You now have full access to ISLA venues, live booking opportunities, and commission tracking.</p>',
    '<a href="https://islanetwork.es/dashboard" style="background:#c9a84c;color:#000;padding:14px 28px;text-decoration:none;border-radius:4px;display:inline-block;font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Access Your Dashboard</a>',
    '<p style="color:#555;font-size:12px;margin-top:32px;">Questions? Reply to this email or contact hello@islanetwork.es</p>',
    '</div>'
  ].join('')

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'ISLA Network <hello@islanetwork.es>',
      to: email,
      subject,
      html,
    }),
  })

  return NextResponse.redirect(new URL('/admin', req.url))
}
