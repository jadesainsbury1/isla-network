export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { adminPassword } = await req.json()

  if (adminPassword !== process.env.ADMIN_PASSWORD && adminPassword !== 'islaibiza26') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Unlock all approved concierges
  const { error: profileErr, count: profileCount } = await supabase
    .from('profiles')
    .update({ founding_member_unlocked: true })
    .eq('role', 'concierge')
    .eq('is_approved', true)
    .select('*', { count: 'exact', head: true })

  // Unlock all active venues
  const { error: venueErr, count: venueCount } = await supabase
    .from('venues')
    .update({ founding_member_unlocked: true })
    .eq('is_active', true)
    .select('*', { count: 'exact', head: true })

  if (profileErr || venueErr) {
    return NextResponse.json({ error: 'partial failure', profileErr, venueErr }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    conciergesUnlocked: profileCount || 0,
    venuesUnlocked: venueCount || 0,
    message: 'ISLA is now LIVE. All founding members have full access.'
  })
}
