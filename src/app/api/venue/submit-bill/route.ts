export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const formData = await req.formData()
  const bookingId = formData.get('bookingId') as string
  const billAmount = parseFloat(formData.get('billAmount') as string)
  const file = formData.get('billPhoto') as File | null
  const venueEmail = formData.get('venueEmail') as string
  const venueName = formData.get('venueName') as string
  const commissionRate = parseFloat(formData.get('commissionRate') as string || '10')
  const ticketNumber = (formData.get('ticket_number') as string) || ''

  let billPhotoUrl = null

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `bills/${bookingId}-${Date.now()}.${file.name.split('.').pop()}`
    const { data: upload, error: uploadError } = await supabase.storage
      .from('bill-photos')
      .upload(filename, buffer, { contentType: file.type, upsert: true })
    if (!uploadError && upload) {
      const { data: { publicUrl } } = supabase.storage.from('bill-photos').getPublicUrl(filename)
      billPhotoUrl = publicUrl
    }
  }

  // Look up venue min_spend threshold (per-booking floor)
  const { data: bookingForVenue } = await supabase
    .from('bookings')
    .select('venue_id')
    .eq('id', bookingId)
    .single()
  let minSpend = 0
  if (bookingForVenue?.venue_id) {
    const { data: venueRow } = await supabase
      .from('venues')
      .select('min_spend')
      .eq('id', bookingForVenue.venue_id)
      .single()
    minSpend = Number(venueRow?.min_spend) || 0
  }

  const meetsThreshold = minSpend === 0 || billAmount >= minSpend
  const commissionAmount = meetsThreshold ? (billAmount * commissionRate) / 100 : 0
  const paymentDue = new Date()
  paymentDue.setDate(paymentDue.getDate() + 30)

  // Save booking with ticket_number
  await supabase.from('bookings').update({
    bill_amount: billAmount,
    bill_photo_url: billPhotoUrl,
    commission_amount: commissionAmount,
    commission_status: 'confirmed_by_venue',
    payment_status: 'pending',
    payment_due_at: paymentDue.toISOString(),
    status: 'confirmed',
    ticket_number: ticketNumber || null
  }).eq('id', bookingId)

  // Fetch concierge email + names for notifications
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, date, covers, concierge_id, guest_profile, venue_id')
    .eq('id', bookingId)
    .single()

  let conciergeEmail = ''
  let conciergeName = ''
  if (booking?.concierge_id) {
    const { data: prof } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', booking.concierge_id)
      .single()
    conciergeEmail = prof?.email || ''
    conciergeName = prof?.full_name || 'Concierge'
  }

  const fmt = (n: number) => 'EUR ' + n.toLocaleString('en-GB', { maximumFractionDigits: 0 })
  const guestName = (booking?.guest_profile as any)?.guest_name || ''
  const dateStr = booking?.date ? new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : ''

  const ticketLine = ticketNumber ? `<p><strong>Ticket / Receipt:</strong> ${ticketNumber}</p>` : ''
  const dueDateStr = paymentDue.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  // Email to venue (confirmation)
  if (venueEmail) {
    try {
      await resend.emails.send({
        from: 'ISLA <hello@islanetwork.es>',
        to: venueEmail,
        cc: 'hello@islanetwork.es',
        subject: `Commission confirmed - ${fmt(commissionAmount)} for ${conciergeName}`,
        html: `
          <div style="font-family: Georgia, serif; color: #1a1a1a; max-width: 560px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #c9a96e; font-weight: 400;">Commission Confirmed</h2>
            <p>Hi ${venueName},</p>
            <p>You have confirmed the bill total for the booking referred by <strong>${conciergeName}</strong>.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-family: 'Helvetica', sans-serif; font-size: 14px;">
              <tr><td style="padding: 6px 0; color: #666;">Date</td><td style="text-align: right;">${dateStr}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Guest</td><td style="text-align: right;">${guestName || '—'}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Covers</td><td style="text-align: right;">${booking?.covers || '—'}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Bill Total</td><td style="text-align: right;">${fmt(billAmount)}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Commission Rate</td><td style="text-align: right;">${commissionRate}%</td></tr>
              <tr><td style="padding: 6px 0; color: #666;"><strong>Commission Owed</strong></td><td style="text-align: right; color: #c9a96e; font-weight: 600;">${fmt(commissionAmount)}</td></tr>
              ${ticketNumber ? `<tr><td style="padding: 6px 0; color: #666;">Ticket / Receipt</td><td style="text-align: right; font-family: monospace;">${ticketNumber}</td></tr>` : ''}
              <tr><td style="padding: 6px 0; color: #666;">Payment Due By</td><td style="text-align: right;">${dueDateStr}</td></tr>
            </table>
            <p>Please settle this commission directly with ${conciergeName} within 30 days. ISLA holds the full record.</p>
            <p style="color: #888; font-size: 12px; margin-top: 32px;">ISLA - The Concierge Network</p>
          </div>
        `
      })
    } catch (e) { console.error('venue email failed', e) }
  }

  // Email to concierge
  if (conciergeEmail) {
    try {
      await resend.emails.send({
        from: 'ISLA <hello@islanetwork.es>',
        to: conciergeEmail,
        cc: 'hello@islanetwork.es',
        subject: `Commission confirmed - ${fmt(commissionAmount)} from ${venueName}`,
        html: `
          <div style="font-family: Georgia, serif; color: #1a1a1a; max-width: 560px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #c9a96e; font-weight: 400;">You have a commission confirmed</h2>
            <p>Hi ${conciergeName},</p>
            <p><strong>${venueName}</strong> has confirmed the bill total for the booking you referred. Your commission has been logged in ISLA.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-family: 'Helvetica', sans-serif; font-size: 14px;">
              <tr><td style="padding: 6px 0; color: #666;">Venue</td><td style="text-align: right;">${venueName}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Date</td><td style="text-align: right;">${dateStr}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Guest</td><td style="text-align: right;">${guestName || '—'}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Covers</td><td style="text-align: right;">${booking?.covers || '—'}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;">Bill Total</td><td style="text-align: right;">${fmt(billAmount)}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;"><strong>Your Commission</strong></td><td style="text-align: right; color: #c9a96e; font-weight: 600;">${fmt(commissionAmount)}</td></tr>
              ${ticketNumber ? `<tr><td style="padding: 6px 0; color: #666;">Ticket Reference</td><td style="text-align: right; font-family: monospace;">${ticketNumber}</td></tr>` : ''}
              <tr><td style="padding: 6px 0; color: #666;">Expected Payment By</td><td style="text-align: right;">${dueDateStr}</td></tr>
            </table>
            <p>The venue will settle this commission with you directly. View your full earnings dashboard at <a href="https://islanetwork.es/concierge/revenue" style="color: #c9a96e;">islanetwork.es</a>.</p>
            <p style="color: #888; font-size: 12px; margin-top: 32px;">ISLA - The Concierge Network</p>
          </div>
        `
      })
    } catch (e) { console.error('concierge email failed', e) }
  }

  return NextResponse.json({ ok: true, commissionAmount })
}
