export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  const { bookingId, action, venueId } = await req.json()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const newStatus = action === "confirm" ? "confirmed" : "rejected"

  const { error } = await supabase
    .from("bookings")
    .update({ status: newStatus })
    .eq("id", bookingId)
    .eq("venue_id", venueId)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Send email notification to concierge
  const { data: booking } = await supabase
    .from("bookings")
    .select("*, concierge:profiles(*), venue:venues(name)")
    .eq("id", bookingId)
    .single()

  if (booking?.concierge?.email) {
    const isConfirmed = action === "confirm"
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + process.env.RESEND_API_KEY },
      body: JSON.stringify({
        from: "ISLA <hello@islanetwork.es>",
        to: booking.concierge.email,
        subject: isConfirmed ? `Booking confirmed — ${(booking.venue as any)?.name}` : `Booking update — ${(booking.venue as any)?.name}`,
        html: `<div style="background:#0a0a0a;color:#f0ece4;font-family:Georgia,serif;padding:40px;max-width:560px;">
          <div style="font-family:monospace;font-size:10px;letter-spacing:0.3em;color:#C9A96E;text-transform:uppercase;margin-bottom:20px;">ISLA · The Concierge Network</div>
          <h2 style="font-weight:300;font-size:24px;margin-bottom:12px;">${isConfirmed ? "Booking confirmed." : "Booking not available."}</h2>
          <p style="color:#aaa;font-size:14px;line-height:1.7;margin-bottom:24px;">
            ${isConfirmed
              ? `Your referral to <strong style="color:#f0ece4">${(booking.venue as any)?.name}</strong> on ${new Date(booking.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} has been confirmed for ${booking.covers} covers.`
              : `Unfortunately ${(booking.venue as any)?.name} is unable to accommodate your referral on ${new Date(booking.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}. Please contact the venue directly or try an alternative date.`
            }
          </p>
          <a href="https://islanetwork.es/concierge/revenue" style="display:inline-block;padding:12px 28px;background:#C9A96E;color:#000;font-family:monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;font-weight:700;">View Dashboard</a>
          <p style="font-size:11px;color:#555;margin-top:28px;font-family:monospace;">ISLA · islanetwork.es · hello@islanetwork.es</p>
        </div>`
      })
    })
  }

  return NextResponse.json({ ok: true, status: newStatus })
}
