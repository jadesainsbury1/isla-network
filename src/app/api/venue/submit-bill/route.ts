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



  return NextResponse.json({ ok: true, commissionAmount })
}
