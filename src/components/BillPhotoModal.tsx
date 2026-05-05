'use client'
import { useState } from 'react'

interface Props {
  billPhotoUrl: string | null
  billAmount: number | null
  ticketNumber: string | null
}

export default function BillPhotoModal({ billPhotoUrl, billAmount, ticketNumber }: Props) {
  const [open, setOpen] = useState(false)

  if (!billPhotoUrl) {
    return (
      <span style={{ color: '#666', fontSize: 11, fontFamily: 'monospace', fontStyle: 'italic' }}>
        No bill photo
      </span>
    )
  }

  const fmt = (n: number | null) => n ? 'EUR ' + n.toLocaleString('en-GB', { maximumFractionDigits: 0 }) : '—'

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '6px 12px',
          background: 'transparent',
          color: 'var(--gold)',
          border: '1px solid var(--gold)',
          borderRadius: 4,
          fontSize: 11,
          fontFamily: 'monospace',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          textTransform: 'uppercase',
        }}
      >
        View Bill
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0a0a0a', border: '1px solid #2a2620', borderRadius: 8,
              maxWidth: 900, maxHeight: '90vh', width: '100%', overflow: 'hidden',
              display: 'flex', flexDirection: 'column'
            }}
          >
            <div style={{
              padding: '16px 24px', borderBottom: '1px solid #2a2620',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 4 }}>
                  Bill Receipt
                </div>
                <div style={{ color: 'var(--cream)', fontSize: 14, fontFamily: 'Georgia, serif' }}>
                  {fmt(billAmount)} {ticketNumber && <span style={{ color: '#666', marginLeft: 12 }}>· {ticketNumber}</span>}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'transparent', border: '1px solid #333', color: '#888', padding: '6px 14px', borderRadius: 4, cursor: 'pointer', fontFamily: 'monospace', fontSize: 11 }}
              >
                Close
              </button>
            </div>
            <div style={{ padding: 24, overflow: 'auto', textAlign: 'center', background: '#1a1a1a' }}>
              <img
                src={billPhotoUrl}
                alt="Bill receipt"
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 4 }}
              />
            </div>
            <div style={{ padding: '12px 24px', borderTop: '1px solid #2a2620', fontSize: 11, color: '#666', fontFamily: 'monospace', textAlign: 'center' }}>
              Verify: bill total matches ISLA-recorded amount of {fmt(billAmount)}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
