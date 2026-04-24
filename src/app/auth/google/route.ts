import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: "https://isla-network.vercel.app/auth/callback" }
  })
  return NextResponse.redirect(data.url ?? "/")
}
