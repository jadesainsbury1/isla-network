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

  await supabase
    .from("bookings")
    .update({ status: newStatus })
    .eq("id", bookingId)

  if (action !== "confirm") {
    return NextResponse.json({ ok: true })
  }

  // Fetch full booking details for confirmation email
  const { data: booking } = await supabase
    .from("bookings")
    .select("*, concierge:profiles(full_name, email, property), venue:venues(name, contact_email, area)")
    .eq("id", bookingId)
    .single()

  if (!booking) return NextResponse.json({ ok: true })

  // Fetch message thread for this booking
  const { data: messages } = await supabase
    .from("booking_messages")
    .select("*")
    .eq("booking_id", bookingId)
    .order("created_at", { ascending: true })

  const thread = messages || []
  const concierge = (booking as any).concierge
  const venue = (booking as any).venue

  const dateStr = new Date(booking.date).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  })

  // Build thread HTML
  const threadHtml = thread.length > 0
    ? `<div style="margin-top:24px;border-top:1px solid #222;padding-top:20px;">
        <div style="font-size:10px;font-family:monospace;letter-spacing:0.2em;color:#888;text-transform:uppercase;margin-bottom:16px;">Booking conversation</div>
        ${thread.map((m: any) => `
          <div style="margin-bottom:12px;padding:12px 14px;background:${m.sender_role === 'venue' ? '#1a1500' : '#0d1a0d'};border-radius:6px;border-left:2px solid ${m.sender_role === 'venue' ? '#C9A96E' : '#4caf50'};">
            <div style="font-size:10px;font-family:monospace;color:#888;margin-bottom:6px;">${m.sender_name} · ${m.sender_role} · ${new Date(m.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} ${new Date(m.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</div>
            <div style="font-size:13px;color:#f0ece4;line-height:1.5;">${m.message}</div>
          </div>
        `).join("")}
      </div>`
    : ""

  const emailHtml = `
    <div style="background:#0a0a0a;color:#f0ece4;font-family:Georgia,serif;padding:48px 40px;max-width:580px;">
      <div style="font-family:monospace;font-size:10px;letter-spacing:0.3em;color:#C9A96E;text-transform:uppercase;margin-bottom:24px;">ISLA · The Concierge Network</div>
      <h2 style="font-size:22px;font-weight:400;margin:0 0 8px;color:#fff;">Booking Confirmed</h2>
      <p style="font-size:13px;color:#888;margin:0 0 28px;font-family:monospace;">${dateStr}</p>

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;font-size:12px;color:#888;width:40%;font-family:monospace;">Venue</td>
          <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;font-size:13px;color:#f0ece4;">${venue?.name || "—"}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;font-size:12px;color:#888;font-family:monospace;">Concierge</td>
          <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;font-size:13px;color:#f0ece4;">${concierge?.full_name || "—"} · ${concierge?.property || ""}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;font-size:12px;color:#888;font-family:monospace;">Date</td>
          <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;font-size:13px;color:#f0ece4;">${dateStr}</td>
        </tr>
        ${booking.covers ? `<tr>
          <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;font-size:12px;color:#888;font-family:monospace;">Covers</td>
          <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;font-size:13px;color:#f0ece4;">${booking.covers}</td>
        </tr>` : ""}
        ${booking.notes ? `<tr>
          <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;font-size:12px;color:#888;font-family:monospace;">Notes</td>
          <td style="padding:10px 0;border-bottom:1px solid #1a1a1a;font-size:13px;color:#f0ece4;">${booking.notes}</td>
        </tr>` : ""}
      </table>

      ${threadHtml}

      <p style="font-size:11px;color:#555;margin-top:32px;font-family:monospace;">ISLA · islanetwork.es · hello@islanetwork.es</p>
    </div>
  `

  const resendKey = process.env.RESEND_API_KEY!
  const recipients = []

  // Send to concierge
  if (concierge?.email) {
    recipients.push({
      to: concierge.email,
      subject: `Booking confirmed — ${venue?.name || "your referral"} · ${dateStr}`
    })
  }

  // Send to venue contact email
  if (venue?.contact_email) {
    recipients.push({
      to: venue.contact_email,
      subject: `Booking confirmed — ${concierge?.full_name || "concierge referral"} · ${dateStr}`
    })
  }

  for (const r of recipients) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendKey}`
      },
      body: JSON.stringify({
        from: "ISLA <hello@islanetwork.es>",
        to: r.to,
        subject: r.subject,
        html: emailHtml
      })
    })
  }

  return NextResponse.json({ ok: true })
}
