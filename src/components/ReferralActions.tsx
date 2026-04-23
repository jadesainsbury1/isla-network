'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Props {
  bookingId: string
}

export default function ReferralActions({ bookingId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<'confirm' | 'reject' | null>(null)

  async function updateStatus(status: 'confirmed' | 'rejected') {
    setLoading(status === 'confirmed' ? 'confirm' : 'reject')
    const supabase = createClient()
    await supabase.from('bookings').update({ status }).eq('id', bookingId)
    router.refresh()
    setLoading(null)
  }

  return (
    <div className="confirm-actions">
      <button
        className="btn btn-green btn-sm"
        onClick={() => updateStatus('confirmed')}
        disabled={loading !== null}
      >
        {loading === 'confirm' ? '…' : 'Confirm'}
      </button>
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => updateStatus('rejected')}
        disabled={loading !== null}
      >
        {loading === 'reject' ? '…' : 'Reject'}
      </button>
    </div>
  )
}
