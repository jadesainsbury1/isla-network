export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 })

    const { name, contact, type, note } = await req.json()
    if (!name?.trim() || !contact?.trim()) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role, email')
      .eq('id', user.id)
      .single()

    const referrerName = profile?.full_name || 'Unknown'
    const referrerEmail = profile?.email || user.email || ''
    const referrerRole = profile?.role || ''

    await resend.emails.send({
      from: 'ISLA <hello@islanetwork.es>',
      to: 'hello@islanetwork.es',
      replyTo: referrerEmail || undefined,
      subject: `New referral: ${name} (${type})`,
      html: `<div style="font-family: Georgia, serif; color: #1a1a1a; max-width: 560px;"><h2 style="color: #c9a96e; font-weight: 400;">New Referral</h2><p><strong>${referrerName}</strong> (${referrerRole}) referred:</p><table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-family: Helvetica, sans-serif; font-size: 14px;"><tr><td style="padding: 6px 0; color: #666;">Name</td><td style="text-align: right;"><strong>${name}</strong></td></tr><tr><td style="padding: 6px 0; color: #666;">Type</td><td style="text-align: right;">${type}</td></tr><tr><td style="padding: 6px 0; color: #666;">Contact</td><td style="text-align: right;">${contact}</td></tr>${note ? `<tr><td style="padding: 6px 0; color: #666;">Note</td><td style="text-align: right;">${note}</td></tr>` : ''}<tr><td style="padding: 6px 0; color: #666;">From</td><td style="text-align: right;">${referrerName} (${referrerEmail || 'no email'})</td></tr></table><p style="color: #888; font-size: 12px;">Reach out within 24 hours.</p></div>`
    })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || 'Server error' }, { status: 500 })
  }
}
