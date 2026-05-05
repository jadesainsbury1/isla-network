export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { email, location, role } = await req.json()

  if (!email || !location) {
    return NextResponse.json({ error: 'email and location required' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 })
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase.from('waitlist').insert({
    email: email.toLowerCase().trim(),
    location,
    role: role || null,
    source: 'homepage'
  })

  // Ignore duplicate-key errors (user already on list)
  if (error && !error.message.includes('duplicate') && !error.message.includes('unique')) {
    console.error('waitlist insert error', error)
    return NextResponse.json({ error: 'failed to save' }, { status: 500 })
  }

  // Notify admin
  try {
    await resend.emails.send({
      from: 'ISLA <hello@islanetwork.es>',
      to: 'hello@islanetwork.es',
      subject: `Waitlist: ${location} - ${email}`,
      html: `
        <div style="font-family: Georgia, serif; color: #1a1a1a; padding: 20px;">
          <h2 style="color: #c9a96e;">New ${location} Waitlist Signup</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Source:</strong> Homepage locations section</p>
        </div>
      `
    })
  } catch (e) {
    console.error('admin email failed', e)
  }

  // Confirmation to the user
  try {
    await resend.emails.send({
      from: 'ISLA <hello@islanetwork.es>',
      to: email,
      subject: `You are on the list - ISLA ${location}`,
      html: `
        <div style="font-family: Georgia, serif; color: #1a1a1a; max-width: 560px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #c9a96e; font-weight: 400;">You are on the list.</h2>
          <p>Thank you for your interest in ISLA <strong>${location}</strong>.</p>
          <p>We are launching the network in Ibiza on 1 June 2026, and ${location} is next on our list. We will notify you the moment ${location} opens for founding members.</p>
          <p>In the meantime, follow us on Instagram <a href="https://instagram.com/islanetwork.es" style="color: #c9a96e;">@islanetwork.es</a> for launch updates.</p>
          <p style="color: #888; font-size: 12px; margin-top: 32px;">ISLA - The Concierge Network<br/>islanetwork.es</p>
        </div>
      `
    })
  } catch (e) {
    console.error('confirmation email failed', e)
  }

  return NextResponse.json({ ok: true })
}
