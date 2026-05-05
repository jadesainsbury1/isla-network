export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { logBookingEvent } from '@/lib/audit'

export async function POST(req: NextRequest) {
  const supabaseUser = await createServerClient()
  const { data: { user } } = await supabaseUser.auth.getUser()
  if (!user) return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 })

  const body = await req.json()
  const { bookingId, note } = body
  if (!bookingId) return NextResponse.json({ ok: false, error: 'Missing bookingId' }, { status: 400 })

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, concierge_id, payment_status, commission_amount')
    .eq('id', bookingId)
    .single()

  if (!booking) return NextResponse.json({ ok: false, error: 'Booking not found' }, { status: 404 })
  if (booking.concierge_id !== user.id) {
    return NextResponse.json({ ok: false, error: 'Only the concierge on this booking can confirm receipt' }, { status: 403 })
  }
  if (booking.payment_status !== 'paid') {
    return NextResponse.json({ ok: false, error: 'Cannot confirm receipt before venue marks paid' }, { status: 400 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  const confirmedAt = new Date().toISOString()
  const { error: updateError } = await supabase
    .from('bookings')
    .update({ concierge_confirmed_at: confirmedAt })
    .eq('id', bookingId)

  if (updateError) return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 })

  await logBookingEvent(supabase, {
    booking_id: bookingId,
    event_type: 'receipt_confirmed',
    actor_id: user.id,
    actor_role: 'concierge',
    actor_name: profile?.full_name || user.email || 'Unknown',
    metadata: {
      amount: booking.commission_amount,
      note: note || null
    }
  })

  return NextResponse.json({ ok: true, confirmedAt })
}
