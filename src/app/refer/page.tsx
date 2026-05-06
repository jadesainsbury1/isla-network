import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ReferForm from './ReferForm'

export const dynamic = 'force-dynamic'

export default async function ReferPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  const referrerName = profile?.full_name || ''
  const backHref = profile?.role === 'venue' ? '/welcome/venue' : '/welcome/concierge'

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f2ede4', fontFamily: 'Helvetica, sans-serif', padding: '40px 24px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <Link href={backHref} style={{ color: '#8a8070', fontSize: 11, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em', textDecoration: 'none' }}>
          &larr; Back
        </Link>

        <div style={{ textAlign: 'center', margin: '32px 0 24px' }}>
          <div style={{ fontSize: 10, letterSpacing: '0.25em', color: '#c9a96e', textTransform: 'uppercase', marginBottom: 16 }}>Refer a friend</div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 300, fontSize: 32, lineHeight: 1.2, margin: '0 0 12px', color: '#f2ede4' }}>
            Bring someone you trust.
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: '#c5bfb5', margin: 0 }}>
            ISLA grows on trust, not lists. Tell us who should be on the network and we will reach out personally.
          </p>
        </div>

        <ReferForm referrerName={referrerName} />
      </div>
    </div>
  )
}
