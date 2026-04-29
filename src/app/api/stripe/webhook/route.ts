export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const PLAN_MAP: Record<string, string> = {
  "price_essential": "essential",
  "price_premium": "premium", 
  "price_elite": "elite",
}

const PRICE_TO_PLAN: Record<string, string> = {
  "900": "essential",
  "1800": "premium",
  "3480": "elite",
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature") || ""
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
  const stripeKey = process.env.STRIPE_SECRET_KEY!

  // Verify webhook signature
  let event: any
  try {
    const { createHmac } = await import("crypto")
    const parts = sig.split(",")
    const timestamp = parts.find((p: string) => p.startsWith("t="))?.split("=")[1]
    const signature = parts.find((p: string) => p.startsWith("v1="))?.split("=")[1]
    const payload = `${timestamp}.${body}`
    const expected = createHmac("sha256", webhookSecret).update(payload).digest("hex")
    if (expected !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }
    event = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object
  const customerEmail = session.customer_email || session.customer_details?.email
  const amountTotal = session.amount_total // in cents
  const amountEuros = amountTotal / 100

  // Map amount to plan
  let plan = "essential"
  if (amountEuros >= 3480) plan = "elite"
  else if (amountEuros >= 1800) plan = "premium"
  else if (amountEuros >= 900) plan = "essential"

  if (!customerEmail) {
    return NextResponse.json({ error: "No customer email" }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Find venue by email
  const { data: venue } = await supabase
    .from("venues")
    .select("id, name")
    .eq("stripe_customer_email", customerEmail)
    .single()

  // If not found by stripe_customer_email, try contact_email
  let venueId = venue?.id
  if (!venueId) {
    const { data: venue2 } = await supabase
      .from("venues")
      .select("id, name")
      .eq("contact_email", customerEmail)
      .single()
    venueId = venue2?.id
  }

  if (!venueId) {
    // Store for manual review
    console.error("Stripe webhook: no venue found for email", customerEmail)
    return NextResponse.json({ error: "No venue found" }, { status: 404 })
  }

  // Activate venue and set plan
  const expiresAt = new Date()
  expiresAt.setFullYear(expiresAt.getFullYear() + 1)

  await supabase
    .from("venues")
    .update({
      is_paid: true,
      is_active: true,
      plan,
      plan_expires_at: expiresAt.toISOString(),
      stripe_customer_email: customerEmail,
    })
    .eq("id", venueId)

  // Send welcome email to venue
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + process.env.RESEND_API_KEY
    },
    body: JSON.stringify({
      from: "ISLA <hello@islanetwork.es>",
      to: customerEmail,
      subject: "You are live on ISLA",
      html: `<div style="background:#0a0a0a;color:#f0ece4;font-family:Georgia,serif;padding:48px 40px;max-width:580px;">
        <div style="font-family:monospace;font-size:10px;letter-spacing:0.3em;color:#C9A96E;text-transform:uppercase;margin-bottom:24px;">ISLA · The Concierge Network</div>
        <h1 style="font-size:28px;font-weight:300;margin:0 0 16px;">Your venue is live.</h1>
        <p style="color:#aaa;font-size:15px;line-height:1.7;margin-bottom:24px;">
          Payment confirmed. Your <strong style="color:#C9A96E;text-transform:capitalize;">${plan}</strong> listing is now active and visible to every verified concierge on ISLA.
        </p>
        <p style="color:#aaa;font-size:15px;line-height:1.7;margin-bottom:32px;">
          Log in to complete your venue profile — cover photo, booking instructions, commission rates, and seasonal notes. The more complete your profile, the more referrals you will receive.
        </p>
        <a href="https://islanetwork.es/venue/dashboard" style="display:inline-block;padding:12px 28px;background:#C9A96E;color:#000;font-family:monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;font-weight:700;">Go to Dashboard</a>
        <p style="font-size:11px;color:#555;margin-top:28px;font-family:monospace;">Questions? hello@islanetwork.es · islanetwork.es</p>
      </div>`
    })
  })

  return NextResponse.json({ ok: true, plan, venueId })
}
