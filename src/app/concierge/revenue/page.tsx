import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RevenueClient from './RevenueClient'

export default async function RevenuePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, venue:venues(*)')
    .eq('concierge_id', user.id)
    .order('date', { ascending: false })

  const { data: venues } = await supabase
    .from('venues')
    .select('*')
    .eq('is_active', true)
    .order('name')

  const all = bookings || []
  const allVenues = venues || []

  const totalEarned = all
    .filter(b => b.commission_status === 'approved')
    .reduce((s, b) => s + (Number(b.commission_amount) || 0), 0)

  const totalPaid = all
    .filter(b => b.payment_status === 'paid')
    .reduce((s, b) => s + (Number(b.commission_amount) || 0), 0)

  const totalPending = all
    .filter(b => b.commission_status === 'pending' && b.commission_amount)
    .reduce((s, b) => s + (Number(b.commission_amount) || 0), 0)

  const totalUnpaid = totalEarned - totalPaid

  return (
    <RevenueClient
      bookings={all}
      venues={allVenues}
      conciergeId={user.id}
      totals={{ totalEarned, totalPaid, totalPending, totalUnpaid }}
    />
  )
}
