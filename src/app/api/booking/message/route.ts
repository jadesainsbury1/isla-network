export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  const { bookingId, senderId, senderRole, senderName, message, notifyEmail, notifySubject } = await req.json()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  await supabase.from("booking_messages").insert({
    booking_id: bookingId,
    sender_id: senderId,
    sender_role: senderRole,
    sender_name: senderName,
    message,
  })

  if (notifyEmail && notifySubject) {
    const html = `
      <div style="background:#0a0a0a;color:#f0ece4;font-family:Georgia,serif;padding:40px;max-width:560px;">
        <div style="font-family:monospace;font-size:10px;letter-spacing:0.3em;color:#C9A96E;text-transform:uppercase;margin-bottom:20px;">ISLA · New Message</div>
        <p style="font-size:15px;margin:0 0 20px;">${senderName} sent you a message:</p>
        <div style="background:#111;border-left:3px solid ${senderRole === "venue" ? "#C9A96E" : "#4caf50"};padding:16px 20px;border-radius:4px;font-size:14px;line-height:1.6;margin-bottom:24px;">${message}</div>
        <a href="https://islanetwork.es/${senderRole === "venue" ? "concierge/revenue" : "venue/dashboard"}" style="background:#C9A96E;color:#000;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block;font-family:monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-weight:700;">View in ISLA</a>
        <p style="font-size:11px;color:#555;margin-top:24px;font-family:monospace;">ISLA · islanetwork.es</p>
      </div>
    `
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.RESEND_API_KEY}` },
      body: JSON.stringify({ from: "ISLA <hello@islanetwork.es>", to: notifyEmail, subject: notifySubject, html })
    })
  }

  return NextResponse.json({ ok: true })
}
