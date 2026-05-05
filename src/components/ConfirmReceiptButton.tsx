'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  bookingId: string
  commissionAmount: number
  venueName: string
}

export default function ConfirmReceiptButton({ bookingId, commissionAmount, venueName }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleConfirm() {
    if (!confirm(`Confirm you received EUR ${commissionAmount.toLocaleString('en-GB', { maximumFractionDigits: 0 })} from ${venueName}?`)) return

    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/booking/confirm-received', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId })
      })
      const data = await res.json()
      if (!data.ok) {
        setError(data.error || 'Failed to confirm')
        setLoading(false)
        return
      }
      router.refresh()
    } catch (e) {
      setError('Network error')
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleConfirm}
        disabled={loading}
        style={{
          padding: '6px 12px',
          background: '#0d2218',
          color: '#4ade80',
          border: '1px solid #2a4a2a',
          borderRadius: 4,
          fontSize: 11,
          fontFamily: 'monospace',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          textTransform: 'uppercase',
          opacity: loading ? 0.5 : 1,
        }}
      >
        {loading ? 'Saving...' : 'Confirm Receipt'}
      </button>
      {error && (
        <div style={{ marginTop: 6, fontSize: 11, color: '#ff8888', fontFamily: 'monospace' }}>{error}</div>
      )}
    </div>
  )
}
