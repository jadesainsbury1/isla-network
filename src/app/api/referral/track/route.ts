export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  const { venueId, refCode } = await req.json()
  if (!refCode) return NextResponse.json({ ok: false })
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data: referrer } = await supabase.from("profiles").select("id").eq("referral_code", refCode).single()
  if (!referrer) return NextResponse.json({ ok: false, error: "Invalid referral code" })
  await supabase.from("venues").update({ referred_by: refCode }).eq("id", venueId)
  return NextResponse.json({ ok: true })
}
