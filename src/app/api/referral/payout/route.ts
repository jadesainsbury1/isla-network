export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const PLAN_VALUES: Record<string, number> = { essential: 900, premium: 1800, elite: 3480 }

export async function POST(req: NextRequest) {
  const { venueId } = await req.json()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data: venue } = await supabase.from("venues").select("referred_by, plan").eq("id", venueId).single()
  if (!venue?.referred_by || !venue?.plan) return NextResponse.json({ ok: false })
  const payout = Math.round((PLAN_VALUES[venue.plan.toLowerCase()] || 0) * 0.15)
  const { data: referrer } = await supabase.from("profiles").select("id, referral_earnings").eq("referral_code", venue.referred_by).single()
  if (!referrer) return NextResponse.json({ ok: false })
  await supabase.from("profiles").update({ referral_earnings: (referrer.referral_earnings || 0) + payout }).eq("id", referrer.id)
  return NextResponse.json({ ok: true, payout })
}
