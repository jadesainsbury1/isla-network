export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { userId, venueName, venueCategory, venueLocation, email } = body
  
  if (!userId) return NextResponse.json({ error: 'No userId' }, { status: 400 })
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  const { error } = await supabase.from('venues').insert({
    user_id: userId,
    name: venueName || 'New Venue',
    category: venueCategory || 'Restaurant',
    area: venueLocation || '',
    is_active: false,
    commission_rate: '10%',
    contact_email: email || ''
  })
  
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
