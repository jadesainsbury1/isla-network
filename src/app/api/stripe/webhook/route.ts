export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const AMOUNT_TO_PLAN: Record<number, string> = {
  50000:  'essential',
  120000: 'premium',
  370000: 'elite',
}

async function sendEmail(to: string, subject: string, html: string) {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: 'ISLA Network <hello@islanetwork.es>', to, subject, html }),
  })
}

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-04-22.dahlia' as any,
  })

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const customerEmail = session.customer_details?.email
    const amountTotal = session.amount_total
    const plan = amountTotal ? AMOUNT_TO_PLAN[amountTotal] : null

    if (!customerEmail || !plan) {
      return NextResponse.json({ error: 'Unrecognised payment' }, { status: 400 })
    }

    const expiresAt = new Date()
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)

    const { data: venue } = await supabase
      .from('venues')
      .update({ is_paid: true, plan, plan_expires_at: expiresAt.toISOString(), stripe_customer_email: customerEmail })
      .eq('contact_email', customerEmail)
      .select('name')
      .single()

    const venueName = venue?.name || customerEmail
    const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1)
    const amount = plan === 'essential' ? '€500' : plan === 'premium' ? '€1,200' : '€3,700'

    await sendEmail(customerEmail, "Welcome to ISLA — You're Live", `
      <div style="background:#0a0a0a;color:#fff;padding:40px;font-family:sans-serif;">
        <h2 style="color:#c9a84c;">Welcome to ISLA Network</h2>
        <p>Your listing is now live on the ISLA concierge network.</p>
        <p><strong>Plan:</strong> ${planLabel}</p>
        <p><strong>Valid until:</strong> ${expiresAt.toLocaleDateString('en-GB')}</p>
        <a href="https://islanetwork.es/venue/dashboard" style="background:#c9a84c;color:#000;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block;margin-top:20px;">View Your Dashboard</a>
      </div>
    `)

    await sendEmail('hello@islanetwork.es', `${venueName} just paid — ${planLabel} Plan`, `
      <div style="background:#0a0a0a;color:#fff;padding:40px;font-family:sans-serif;">
        <h2 style="color:#c9a84c;">New Payment Received</h2>
        <p><strong>Venue:</strong> ${venueName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Plan:</strong> ${planLabel} (${amount}/yr)</p>
        <p><strong>Expires:</strong> ${expiresAt.toLocaleDateString('en-GB')}</p>
      </div>
    `)
  }

  return NextResponse.json({ received: true })
}
