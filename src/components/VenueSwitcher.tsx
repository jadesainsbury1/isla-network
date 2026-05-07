'use client'
import { useRouter, useSearchParams } from 'next/navigation'

interface Venue { id: string; name: string }
interface Props { venues: Venue[]; currentId: string }

export default function VenueSwitcher({ venues, currentId }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('venue', e.target.value)
    router.push(`/venue/dashboard?${params.toString()}`)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase' }}>Venue</span>
      <select
        value={currentId}
        onChange={handleChange}
        style={{ padding: '6px 10px', background: 'var(--charcoal)', border: '1px solid #2a2620', borderRadius: 4, color: 'var(--cream)', fontSize: 12, fontFamily: 'monospace', cursor: 'pointer' }}
      >
        {venues.map(v => (<option key={v.id} value={v.id}>{v.name}</option>))}
      </select>
    </div>
  )
}
