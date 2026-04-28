export type Role = 'concierge' | 'venue'

export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'paid' | 'overdue'

export interface Profile {
  id: string
  full_name: string
  role: Role
  property: string | null
  created_at: string
}

export interface Venue {
  id: string
  user_id: string
  name: string
  category: string
  area: string | null
  commission_rate: string
  commission_basis: string
  contact: string | null
  booking_instructions: string | null
  is_verified: boolean
  is_active: boolean
  created_at: string
}

export interface Booking {
  id: string
  concierge_id: string
  venue_id: string
  date: string
  covers: number | null
  notes: string | null
  status: BookingStatus
  estimated_commission: number | null
  actual_commission: number | null
  bill_amount: number | null
  bill_photo_url: string | null
  commission_amount: number | null
  commission_status: string | null
  payment_status: string | null
  payment_due_at: string | null
  created_at: string
  venue?: Venue
  concierge?: Profile
}
