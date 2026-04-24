import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const data = await req.formData()
  const venueId = data.get('venueId') as string
  await supabase.from('venues').delete().eq('id', venueId)
  return NextResponse.redirect(new URL('/admin', req.url))
}
