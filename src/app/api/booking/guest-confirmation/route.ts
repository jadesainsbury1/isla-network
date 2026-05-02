export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  const { guestEmail, guestName, venueId, conciergeId, date, covers, arrivalTime, bookingId } = await req.json()
  if (!guestEmail) return NextResponse.json({ ok: false, error: "No guest email" })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Get venue and concierge details
  const [{ data: venue }, { data: concierge }] = await Promise.all([
    supabase.from("venues").select("name, area, booking_instructions, contact").eq("id", venueId).single(),
    supabase.from("profiles").select("full_name, property").eq("id", conciergeId).single(),
  ])

  const dateStr = new Date(date).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  })

  const ref = bookingId ? "ISLA-" + bookingId.slice(0, 8).toUpperCase() : "ISLA-" + Date.now().toString(36).toUpperCase()

  const html = `
    <div style="background:#0a0a0a;color:#f0ece4;font-family:Georgia,serif;padding:48px 40px;max-width:580px;">
      <div style="font-family:monospace;font-size:10px;letter-spacing:0.3em;color:#C9A96E;text-transform:uppercase;margin-bottom:24px;">ISLA · The Concierge Network</div>

      <h2 style="font-size:24px;font-weight:400;margin:0 0 8px;color:#fff;">Your booking is confirmed.</h2>
      <p style="font-size:13px;color:#888;margin:0 0 32px;font-family:monospace;">Reference: ${ref}</p>

      <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;font-size:12px;color:#888;width:40%;font-family:monospace;">Venue</td>
          <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;font-size:14px;color:#f0ece4;font-weight:500;">${venue?.name || "—"}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;font-size:12px;color:#888;font-family:monospace;">Location</td>
          <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;font-size:13px;color:#f0ece4;">${venue?.area || "—"}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;font-size:12px;color:#888;font-family:monospace;">Date</td>
          <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;font-size:13px;color:#f0ece4;">${dateStr}</td>
        </tr>
        ${arrivalTime ? `<tr>
          <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;font-size:12px;color:#888;font-family:monospace;">Arrival time</td>
          <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;font-size:13px;color:#f0ece4;">${arrivalTime}</td>
        </tr>` : ""}
        ${covers ? `<tr>
          <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;font-size:12px;color:#888;font-family:monospace;">Covers</td>
          <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;font-size:13px;color:#f0ece4;">${covers}</td>
        </tr>` : ""}
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;font-size:12px;color:#888;font-family:monospace;">Arranged by</td>
          <td style="padding:12px 0;border-bottom:1px solid #1a1a1a;font-size:13px;color:#f0ece4;">${concierge?.full_name || "Your concierge"}${concierge?.property ? " · " + concierge.property : ""}</td>
        </tr>
      </table>

      ${venue?.booking_instructions ? `
      <div style="background:#111;border:1px solid #1e1e1e;border-radius:6px;padding:20px;margin-bottom:32px;">
        <div style="font-family:monospace;font-size:10px;letter-spacing:0.2em;color:#888;text-transform:uppercase;margin-bottom:10px;">Booking information</div>
        <p style="font-size:13px;color:#aaa;line-height:1.6;margin:0;">${venue.booking_instructions}</p>
      </div>` : ""}

      <p style="font-size:13px;color:#aaa;line-height:1.7;margin:0 0 32px;">Please quote your reference number <strong style="color:#C9A96E;">${ref}</strong> on arrival. If you have any questions, contact your concierge directly.</p>

      <p style="font-size:11px;color:#555;margin:0;font-family:monospace;">ISLA · The Concierge Network · islanetwork.es</p>
    </div>
  `

  const resendKey = process.env.RESEND_API_KEY!
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${resendKey}` },
    body: JSON.stringify({
      from: "ISLA <hello@islanetwork.es>",
      to: guestEmail,
      subject: `Your booking at ${venue?.name || "the venue"} — ${dateStr}`,
      html
    })
  })

  return NextResponse.json({ ok: true })
}
