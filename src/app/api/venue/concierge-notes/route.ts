import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { concierge_id, notes, is_blocked } = await req.json()

  const { data: venue } = await supabase
    .from('venues')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!venue) return NextResponse.json({ error: 'Not a venue' }, { status: 403 })

  const { error } = await admin
    .from('venue_concierge_notes')
    .upsert(
      { venue_id: venue.id, concierge_id, notes, is_blocked },
      { onConflict: 'venue_id,concierge_id' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const concierge_id = req.nextUrl.searchParams.get('concierge_id')

  const { data: venue } = await supabase
    .from('venues')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!venue) return NextResponse.json({ error: 'Not a venue' }, { status: 403 })

  const { data } = await admin
    .from('venue_concierge_notes')
    .select('notes, is_blocked')
    .eq('venue_id', venue.id)
    .eq('concierge_id', concierge_id)
    .maybeSingle()

  return NextResponse.json(data || { notes: '', is_blocked: false })
}
