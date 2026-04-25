import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const AMOUNT_TO_PLAN: Record<number, string> = {
  50000:  'essential',
  120000: 'premium',
  370000: 'elite',
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const customerEmail = session.customer_details?.email
    const amountTotal = session.amount_total
    const plan = amountTotal ? AMOUNT_TO_PLAN[amountTotal] : null

    if (!customerEmail || !plan) {
      console.error('Missing email or unrecognised amount:', { customerEmail, amountTotal })
      return NextResponse.json({ error: 'Unrecognised payment' }, { status: 400 })
    }

    const expiresAt = new Date()
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)

    const { error } = await supabase
      .from('venues')
      .update({
        is_paid: true,
        plan,
        plan_expires_at: expiresAt.toISOString(),
        stripe_customer_email: customerEmail,
      })
      .eq('contact_email', customerEmail)

    if (error) {
      console.error('Supabase update failed:', error)
      return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
    }

    console.log(`✅ Venue ${customerEmail} activated on ${plan} plan`)
  }

  return NextResponse.json({ received: true })
}
