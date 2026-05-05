import { SupabaseClient } from '@supabase/supabase-js'

export type AuditEventType =
  | 'booking_logged'
  | 'bill_submitted'
  | 'commission_calculated'
  | 'below_threshold'
  | 'payment_marked_paid'
  | 'receipt_confirmed'
  | 'dispute_raised'
  | 'dispute_resolved'

export interface AuditEvent {
  booking_id: string
  event_type: AuditEventType
  actor_id?: string | null
  actor_role?: string | null
  actor_name?: string | null
  metadata?: Record<string, any>
}

export async function logBookingEvent(
  supabase: SupabaseClient,
  event: AuditEvent
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from('booking_events').insert({
    booking_id: event.booking_id,
    event_type: event.event_type,
    actor_id: event.actor_id || null,
    actor_role: event.actor_role || null,
    actor_name: event.actor_name || null,
    metadata: event.metadata || {}
  })
  if (error) {
    console.error('logBookingEvent failed:', error)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}
