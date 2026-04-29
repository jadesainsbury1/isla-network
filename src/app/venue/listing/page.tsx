import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import VenueListingForm from './VenueListingForm'
import VenuePackages from '@/components/VenuePackages'

export default async function VenueListingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: venue } = await supabase
    .from('venues')
    .select('*')
    .eq('user_id', user.id)
    .single()

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
