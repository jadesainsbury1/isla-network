export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { name, area, category, contact } = await req.json()

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'ISLA Network <hello@islanetwork.es>',
      to: 'hello@islanetwork.es',
      subject: `New Venue Application — ${name}`,
      html: `
        <div style="background:#0a0a0a;color:#fff;padding:40px;font-family:sans-serif;">
          <h2 style="color:#c9a84c;">New Venue Application</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Area:</strong> ${area}</p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Contact:</strong> ${contact}</p>
          <a href="https://islanetwork.es/admin" style="background:#c9a84c;color:#000;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block;margin-top:20px;">Review in Admin</a>
        </div>
      `,
    }),
  })

  return NextResponse.json({ ok: true })
}
