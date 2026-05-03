'use client'
import { useState } from 'react'
import InviteModal from './InviteModal'

export default function VenueInviteButton({ venueName }: { venueName: string }) {
  const [show, setShow] = useState(false)
  return (
    <>
      <div style={{ margin: '24px 0 8px', padding: '20px 24px', background: '#161410', border: '1px solid #2a2620', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 12, color: '#f2ede4', fontWeight: 500, marginBottom: 4 }}>Grow the network, grow your reach</div>
          <div style={{ fontSize: 11, color: '#8a8070' }}>Invite another venue — the more venues on ISLA, the more concierges refer to everyone</div>
        </div>
        <button onClick={() => setShow(true)} style={{ padding: '8px 18px', background: '#c9a96e', border: 'none', borderRadius: 4, color: '#0a0908', fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
          Invite a venue →
        </button>
      </div>
      {show && <InviteModal role="venue" inviterName={venueName} inviterEmail="" onClose={() => setShow(false)} />}
    </>
  )
}
