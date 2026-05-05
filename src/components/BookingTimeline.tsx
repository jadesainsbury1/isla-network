'use client'
import { useEffect, useState } from 'react'

interface BookingEvent {
  id: string
  event_type: string
  actor_name: string | null
  actor_role: string | null
  metadata: any
  created_at: string
}

interface Props {
  bookingId: string
}

const EVENT_LABELS: Record<string, { icon: string; label: string; color: string }> = {
  booking_logged:        { icon: '○', label: 'Booking logged',         color: '#888' },
  bill_submitted:        { icon: '◔', label: 'Bill submitted',         color: '#d4a548' },
  commission_calculated: { icon: '◐', label: 'Commission calculated',  color: '#d4a548' },
  below_threshold:       { icon: '◑', label: 'Below threshold',        color: '#666' },
  payment_marked_paid:   { icon: '◕', label: 'Marked paid by venue',   color: '#C9A96E' },
  receipt_confirmed:     { icon: '●', label: 'Receipt confirmed',      color: '#4ade80' },
  dispute_raised:        { icon: '!',  label: 'Dispute raised',         color: '#ff8888' },
  dispute_resolved:      { icon: '✓',  label: 'Dispute resolved',       color: '#4ade80' },
}

export default function BookingTimeline({ bookingId }: Props) {
  const [events, setEvents] = useState<BookingEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`/api/booking/${bookingId}/events`)
        const data = await res.json()
        if (cancelled) return
        if (!data.ok) {
          setError(data.error || 'Failed to load timeline')
        } else {
          setEvents(data.events || [])
        }
      } catch (e) {
        if (!cancelled) setError('Network error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [bookingId])

  if (loading) return <div style={{ color: '#666', fontSize: 12, fontFamily: 'monospace' }}>Loading timeline...</div>
  if (error)   return <div style={{ color: '#ff8888', fontSize: 12, fontFamily: 'monospace' }}>{error}</div>
  if (events.length === 0) {
    return <div style={{ color: '#666', fontSize: 12, fontFamily: 'monospace', fontStyle: 'italic' }}>No audit events recorded for this booking yet.</div>
  }

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })

  const fmtAmount = (n: number | null | undefined) =>
    n != null ? 'EUR ' + Number(n).toLocaleString('en-GB', { maximumFractionDigits: 0 }) : null

  return (
    <div style={{ background: '#0a0a0a', border: '1px solid #2a2620', borderRadius: 8, padding: 20 }}>
      <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.2em', color: '#888', textTransform: 'uppercase', marginBottom: 16 }}>
        Booking Audit Trail
      </div>

      <div style={{ position: 'relative' }}>
        {events.map((e, idx) => {
          const meta = EVENT_LABELS[e.event_type] || { icon: '·', label: e.event_type, color: '#888' }
          const amount = fmtAmount(e.metadata?.amount)
          const method = e.metadata?.method
          const reference = e.metadata?.reference
          const venue = e.metadata?.venue_name
          const isLast = idx === events.length - 1

          return (
            <div key={e.id} style={{ display: 'flex', gap: 14, paddingBottom: isLast ? 0 : 18, position: 'relative' }}>
              {!isLast && (
                <div style={{ position: 'absolute', left: 11, top: 24, bottom: 0, width: 1, background: '#2a2620' }} />
              )}
              <div style={{
                width: 24, height: 24, borderRadius: '50%', background: '#1a1a1a',
                border: `1px solid ${meta.color}`, color: meta.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, flexShrink: 0, zIndex: 1
              }}>
                {meta.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--cream)', fontSize: 13, fontFamily: 'Georgia, serif' }}>
                  {meta.label}
                </div>
                <div style={{ color: '#888', fontSize: 11, fontFamily: 'monospace', marginTop: 2 }}>
                  {fmtTime(e.created_at)}
                  {e.actor_name && <span> · {e.actor_name}</span>}
                  {e.actor_role && <span style={{ color: '#666' }}> ({e.actor_role})</span>}
                </div>
                {(amount || method || reference) && (
                  <div style={{ color: '#aaa', fontSize: 11, fontFamily: 'monospace', marginTop: 4 }}>
                    {amount && <span>{amount}</span>}
                    {method && <span> · {String(method).replace('_', ' ')}</span>}
                    {reference && <span> · ref {reference}</span>}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
