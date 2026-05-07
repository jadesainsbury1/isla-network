import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import VenueListingForm from './VenueListingForm'
import VenuePackages from '@/components/VenuePackages'

export default async function VenueListingPage({ searchParams }: { searchParams: Promise<{ venue?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const sp = await searchParams
  const cookieStore = await cookies()
  const cookieVenueId = cookieStore.get('selected_venue_id')?.value

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: venues } = await supabase
    .from('venues')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  const allVenues = venues || []
  let venue = null
  if (sp?.venue) venue = allVenues.find(v => v.id === sp.venue) || null
  if (!venue && cookieVenueId) venue = allVenues.find(v => v.id === cookieVenueId) || null
  if (!venue) venue = allVenues[0] || null

  return (
    <>
      <div className="topbar">
        <div className="page-title">Edit Listing</div>
      </div>
      <div className="body">
        <div style={{ maxWidth: 580 }}>
          <VenueListingForm
            userId={user.id}
            existingVenue={venue}
            defaultName={profile?.full_name || ''}
          />
        </div>
      </div>
    </>
  )
}
