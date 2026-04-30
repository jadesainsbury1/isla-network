export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  const { venueId, conciergeId, date, covers, notes } = await req.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch venue contact email and name
  const { data: venue } = await supabase
    .from("venues")
    .select("name, contact_email")
    .eq("id", venueId)
    .single()

  // Fetch concierge name
  const { data: concierge } = await supabase
    .from("profiles")
    .select("full_name, property")
    .eq("id", conciergeId)
    .single()

  const venueEmail = venue?.contact_email
  if (!venueEmail) {
    return NextResponse.json({ ok: false, reason: "no contact_email on venue" })
  }

  const conciergeName = concierge?.full_name || "An ISLA concierge"
  const conciergeProperty = concierge?.property || ""
  const venueName = venue?.name || "your venue"
  const formattedDate = date ? new Date(date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "—"
  const coversText = covers ? `${covers} covers` : "covers not specified"

  const html = `
    <div style="background:#0a0a0a;color:#f0ece4;padding:40px;font-family:sans-serif;max-width:560px;margin:0 auto;">
      <div style="font-family:monospace;font-size:10px;letter-spacing:0.25em;color:#C9A96E;text-transform:uppercase;margin-bottom:24px;">ISLA · The Concierge Network</div>
      <h2 style="font-size:22px;font-weight:700;margin:0 0 8px;">New referral logged</h2>
      <p style="font-size:13px;color:#888;margin:0 0 32px;font-family:monospace;">${venueName}</p>

      <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;font-size:11px;color:#888;font-family:monospace;width:40%;">CONCIERGE</td>
          <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;font-size:13px;color:#f0ece4;">${conciergeName}${conciergeProperty ? ' · ' + conciergeProperty : ''}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;font-size:11px;color:#888;font-family:monospace;">DATE</td>
          <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;font-size:13px;color:#f0ece4;">${formattedDate}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;font-size:11px;color:#888;font-family:monospace;">COVERS</td>
          <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;font-size:13px;color:#f0ece4;">${coversText}</td>
        </tr>
        ${notes ? `<tr>
          <td style="padding:10px 0;font-size:11px;color:#888;font-family:monospace;">NOTES</td>
          <td style="padding:10px 0;font-size:13px;color:#f0ece4;font-style:italic;">${notes}</td>
        </tr>` : ''}
      </table>

      <p style="font-size:12px;color:#666;margin-bottom:28px;line-height:1.6;">
        Please confirm this booking in your ISLA dashboard. Once confirmed, commission will be calculated and tracked automatically.
      </p>

      <a href="https://islanetwork.es/venue/dashboard" style="display:inline-block;padding:12px 28px;background:#C9A96E;color:#000;font-family:monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;font-weight:700;">View in Dashboard</a>

      <p style="font-size:10px;color:#444;margin-top:32px;font-family:monospace;">ISLA · hello@islanetwork.es · islanetwork.es</p>
    </div>
  `

  const resendKey = process.env.RESEND_API_KEY
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${resendKey}`
    },
    body: JSON.stringify({
      from: "ISLA <hello@islanetwork.es>",
      to: venueEmail,
      subject: `New referral logged — ${venueName} · ${formattedDate}`,
      html
    })
  })

  return NextResponse.json({ ok: true })
}
