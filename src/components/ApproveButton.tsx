"use client"
import { useRouter } from 'next/navigation'

export default function ApproveButton({ profileId, email, name }: { profileId: string, email: string, name: string }) {
  const router = useRouter()
  return (
    <button
      onClick={async () => {
        await fetch('/api/admin/approve-concierge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId, email, name })
        })
        router.refresh()
      }}
      style={{ padding: "8px 16px", background: "#C9A96E", color: "#000", border: "none", borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: "pointer" }}
    >Approve</button>
  )
}
