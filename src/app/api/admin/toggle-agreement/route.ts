import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const data = await req.formData()
  const venueId = data.get('venueId') as string
  const value = data.get('value') === 'true'
  await supabase.from('venues').update({ agreement_signed: value }).eq('id', venueId)
  return NextResponse.redirect(new URL('/admin', req.url))
}
