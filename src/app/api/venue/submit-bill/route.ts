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
  const netAmount = parseFloat(formData.get('netAmount') as string || '0')
  const grossAmount = parseFloat(formData.get('grossAmount') as string || '0')
  const file = formData.get('billPhoto') as File | null
  const venueEmail = formData.get('venueEmail') as string
  const venueName = formData.get('venueName') as string
  const venueId = formData.get('venueId') as string
  const ticketNumber = (formData.get('ticket_number') as string) || ''

  let billPhotoUrl: string | null = null
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

  const { data: venue } = await supabase
    .from('venues')
    .select('commission_rate, commission_basis, min_spend, min_spend_basis')
    .eq('id', venueId)
    .single()

  const rate = parseFloat(String(venue?.commission_rate || '10').replace('%', '')) || 10
  const basis = venue?.commission_basis || 'net'
  const minSpend = parseFloat(String(venue?.min_spend || '0')) || 0
  const minSpendBasis = venue?.min_spend_basis || 'gross'

  const thresholdAmount = minSpendBasis === 'net' ? netAmount : grossAmount
  const meetsThreshold = minSpend === 0 || thresholdAmount >= minSpend
  const commissionBaseAmount = basis === 'gross' ? grossAmount : netAmount
  const commissionAmount = meetsThreshold ? (commissionBaseAmount * rate) / 100 : 0
  const billAmount = commissionBaseAmount

  const paymentDue = new Date()
  paymentDue.setDate(paymentDue.getDate() + 30)

  await supabase.from('bookings').update({
    bill_amount: billAmount,
    bill_photo_url: billPhotoUrl,
    commission_amount: commissionAmount,
    commission_status: meetsThreshold ? 'confirmed_by_venue' : 'below_threshold',
    payment_status: meetsThreshold ? 'pending' : 'no_commission',
    payment_due_at: meetsThreshold ? paymentDue.toISOString() : null,
    status: 'confirmed',
    ticket_number: ticketNumber || null
  }).eq('id', bookingId)

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, date, covers, concierge_id, guest_profile')
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

  const fmt = (n: number) => 'EUR ' + n.toLocaleString('en-GB', { maximumFractionDigits: 2 })
  const guestName = (booking?.guest_profile as any)?.guest_name || ''
  const dateStr = booking?.date ? new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : ''
  const dueDateStr = paymentDue.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  if (venueEmail) {
    try {
      await resend.emails.send({
        from: 'ISLA <hello@islanetwork.es>',
        to: venueEmail,
        cc: 'hello@islanetwork.es',
        subject: meetsThreshold
          ? `Commission confirmed - ${fmt(commissionAmount)} for ${conciergeName}`
          : `Bill submitted - below threshold, no commission`,
        html: `<div style="font-family:Georgia,serif;color:#1a1a1a;max-width:560px;margin:0 auto;padding:24px;">
          <h2 style="color:#c9a96e;font-weight:400;">${meetsThreshold ? 'Commission Confirmed' : 'Bill Below Threshold'}</h2>
          <p>Hi ${venueName},</p>
          <p>Booking referred by <strong>${conciergeName}</strong> on ${dateStr}${guestName ? ' (' + guestName + ')' : ''}.</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;font-family:Helvetica,sans-serif;font-size:14px;">
            <tr><td style="padding:6px 0;color:#666;">Net F&B</td><td style="text-align:right;">${fmt(netAmount)}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Gross total</td><td style="text-align:right;">${fmt(grossAmount)}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Threshold (${minSpendBasis})</td><td style="text-align:right;">${fmt(minSpend)}${meetsThreshold ? ' met' : ' not met'}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Commission rule</td><td style="text-align:right;">${rate}% of ${basis}</td></tr>
            <tr><td style="padding:6px 0;color:#666;"><strong>Commission Owed</strong></td><td style="text-align:right;color:#c9a96e;font-weight:600;">${fmt(commissionAmount)}</td></tr>
            ${ticketNumber ? `<tr><td style="padding:6px 0;color:#666;">Ticket</td><td style="text-align:right;font-family:monospace;">${ticketNumber}</td></tr>` : ''}
            ${meetsThreshold ? `<tr><td style="padding:6px 0;color:#666;">Payment Due By</td><td style="text-align:right;">${dueDateStr}</td></tr>` : ''}
          </table>
          ${meetsThreshold ? `<p>Please settle directly with ${conciergeName} within 30 days. ISLA holds the full record.</p>` : `<p>This booking did not meet your minimum spend threshold, so no commission applies. The booking is still logged for your records.</p>`}
        </div>`
      })
    } catch (e) { console.error('venue email failed', e) }
  }

  if (conciergeEmail) {
    try {
      await resend.emails.send({
        from: 'ISLA <hello@islanetwork.es>',
        to: conciergeEmail,
        cc: 'hello@islanetwork.es',
        subject: meetsThreshold
          ? `Commission confirmed - ${fmt(commissionAmount)} from ${venueName}`
          : `Booking logged - below ${venueName} threshold`,
        html: `<div style="font-family:Georgia,serif;color:#1a1a1a;max-width:560px;margin:0 auto;padding:24px;">
          <h2 style="color:#c9a96e;font-weight:400;">${meetsThreshold ? 'You have a commission confirmed' : 'Booking logged - below threshold'}</h2>
          <p>Hi ${conciergeName},</p>
          <p><strong>${venueName}</strong> has submitted the bill for ${dateStr}${guestName ? ' (' + guestName + ')' : ''}.</p>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;font-family:Helvetica,sans-serif;font-size:14px;">
            <tr><td style="padding:6px 0;color:#666;">Venue</td><td style="text-align:right;">${venueName}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Bill total (gross)</td><td style="text-align:right;">${fmt(grossAmount)}</td></tr>
            <tr><td style="padding:6px 0;color:#666;">Threshold</td><td style="text-align:right;">${fmt(minSpend)} ${minSpendBasis}${meetsThreshold ? '' : ' not met'}</td></tr>
            <tr><td style="padding:6px 0;color:#666;"><strong>Your Commission</strong></td><td style="text-align:right;color:#c9a96e;font-weight:600;">${fmt(commissionAmount)}</td></tr>
            ${ticketNumber ? `<tr><td style="padding:6px 0;color:#666;">Ticket</td><td style="text-align:right;font-family:monospace;">${ticketNumber}</td></tr>` : ''}
          </table>
          ${meetsThreshold ? `<p>The venue will settle this commission with you directly within 30 days.</p>` : `<p>This booking did not meet ${venueName}'s minimum spend, so no commission applies on this one. It's still logged in your history.</p>`}
        </div>`
      })
    } catch (e) { console.error('concierge email failed', e) }
  }

  return NextResponse.json({
    ok: true,
    commissionAmount,
    meetsThreshold,
    netAmount,
    grossAmount,
    basis,
    rate
  })
}
