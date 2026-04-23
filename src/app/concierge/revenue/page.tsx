import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RevenueClient from './RevenueClient'

export default async function RevenuePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Fetch bookings with venue info
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, venue:venues(*)')
    .eq('concierge_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch all venues for the log booking modal
  const { data: venues } = await supabase
    .from('venues')
    .select('*')
    .eq('is_active', true)
    .order('name')

  const allBookings = bookings || []
  const allVenues = venues || []

  // Calculate totals
  const owed = allBookings
    .filter(b => ['pending', 'confirmed'].includes(b.status))
    .reduce((sum, b) => sum + (b.estimated_commission || 0), 0)

  const confirmed = allBookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.estimated_commission || 0), 0)

  const overdue = allBookings
    .filter(b => b.status === 'overdue')
    .reduce((sum, b) => sum + (b.estimated_commission || 0), 0)

  return (
    <RevenueClient
      bookings={allBookings}
      venues={allVenues}
      conciergeId={user.id}
      totals={{ owed, confirmed, overdue }}
    />
  )
}
