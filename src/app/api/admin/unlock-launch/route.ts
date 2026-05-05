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

  // Count approved concierges before unlock
  const { count: profileCount } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'concierge')
    .eq('is_approved', true)

  // Count active venues before unlock
  const { count: venueCount } = await supabase
    .from('venues')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true)

  // Unlock all approved concierges
  const { error: profileErr } = await supabase
    .from('profiles')
    .update({ founding_member_unlocked: true })
    .eq('role', 'concierge')
    .eq('is_approved', true)

  // Unlock all active venues
  const { error: venueErr } = await supabase
    .from('venues')
    .update({ founding_member_unlocked: true })
    .eq('is_active', true)

  if (profileErr || venueErr) {
    return NextResponse.json({
      error: 'partial failure',
      profileErr: profileErr?.message,
      venueErr: venueErr?.message
    }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    conciergesUnlocked: profileCount || 0,
    venuesUnlocked: venueCount || 0,
    message: 'ISLA is now LIVE. All founding members have full access.'
  })
}
