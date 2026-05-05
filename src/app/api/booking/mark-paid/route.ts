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
  const { bookingId, paidMethod, paidReference, paidAt } = body
  if (!bookingId || !paidMethod) {
    return NextResponse.json({ ok: false, error: 'Missing bookingId or paidMethod' }, { status: 400 })
  }

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, venue_id, commission_amount, payment_status')
    .eq('id', bookingId)
    .single()

  if (!booking) return NextResponse.json({ ok: false, error: 'Booking not found' }, { status: 404 })

  const { data: venue } = await supabase
    .from('venues')
    .select('id, name, user_id')
    .eq('id', booking.venue_id)
    .single()

  if (!venue || venue.user_id !== user.id) {
    return NextResponse.json({ ok: false, error: 'Not authorised for this booking' }, { status: 403 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  const paidTimestamp = paidAt ? new Date(paidAt).toISOString() : new Date().toISOString()
  const { error: updateError } = await supabase
    .from('bookings')
    .update({
      payment_status: 'paid',
      paid_at: paidTimestamp,
      paid_method: paidMethod,
      paid_reference: paidReference || null,
      paid_by_user_id: user.id
    })
    .eq('id', bookingId)

  if (updateError) {
    return NextResponse.json({ ok: false, error: updateError.message }, { status: 500 })
  }

  await logBookingEvent(supabase, {
    booking_id: bookingId,
    event_type: 'payment_marked_paid',
    actor_id: user.id,
    actor_role: profile?.role || 'venue',
    actor_name: profile?.full_name || user.email || 'Unknown',
    metadata: {
      amount: booking.commission_amount,
      method: paidMethod,
      reference: paidReference || null,
      venue_name: venue.name
    }
  })

  return NextResponse.json({ ok: true, paidAt: paidTimestamp })
}
