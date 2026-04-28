export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'

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

  let billPhotoUrl = null

  // Upload photo to Supabase storage if provided
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

  const commissionAmount = (billAmount * commissionRate) / 100
  const paymentDue = new Date()
  paymentDue.setDate(paymentDue.getDate() + 30)

  await supabase.from('bookings').update({
    bill_amount: billAmount,
    bill_photo_url: billPhotoUrl,
    commission_amount: commissionAmount,
    commission_status: 'pending_approval',
    payment_due_at: paymentDue.toISOString(),
    status: 'confirmed'
  }).eq('id', bookingId)

  // Get booking details for notification
  const { data: booking } = await supabase
    .from('bookings')
    .select('*, concierge:profiles(*)')
    .eq('id', bookingId)
    .single()

  const concierge = booking?.concierge as any

  // Notify you (ISLA admin) for GRM approval
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'ISLA Network <hello@islanetwork.es>',
      to: 'hello@islanetwork.es',
      subject: 'Bill submitted — GRM approval required · ' + venueName,
      html: [
        '<div style="background:#0a0a0a;color:#fff;padding:40px;font-family:sans-serif;max-width:560px;">',
        '<div style="font-family:monospace;font-size:10px;letter-spacing:3px;color:#c9a84c;text-transform:uppercase;margin-bottom:24px;">ISLA — Commission Review</div>',
        '<h2 style="color:#c9a84c;margin-bottom:24px;">Bill Submitted — Approval Required</h2>',
        '<p style="margin-bottom:8px;"><strong>Venue:</strong> ' + venueName + '</p>',
        '<p style="margin-bottom:8px;"><strong>Concierge:</strong> ' + (concierge?.full_name || 'Unknown') + '</p>',
        '<p style="margin-bottom:8px;"><strong>Total Bill:</strong> €' + billAmount.toFixed(2) + '</p>',
        '<p style="margin-bottom:8px;"><strong>Commission Rate:</strong> ' + commissionRate + '%</p>',
        '<p style="margin-bottom:8px;"><strong>Commission Amount:</strong> €' + commissionAmount.toFixed(2) + '</p>',
        '<p style="margin-bottom:24px;"><strong>Payment Due:</strong> ' + paymentDue.toLocaleDateString('en-GB') + '</p>',
        billPhotoUrl ? '<p style="margin-bottom:24px;"><a href="' + billPhotoUrl + '" style="color:#c9a84c;">View Bill Photo</a></p>' : '',
        '<a href="https://islanetwork.es/admin/login" style="background:#c9a84c;color:#000;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block;font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Approve in Admin</a>',
        '</div>'
      ].join(''),
    }),
  })

  return NextResponse.json({ ok: true, commissionAmount })
}
