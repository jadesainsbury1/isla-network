-- ══════════════════════════════════════════
-- ISLA Network — Database Schema
-- Run this entire file in Supabase SQL Editor
-- ══════════════════════════════════════════

-- 1. PROFILES TABLE (one per user)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('concierge', 'venue')),
  property TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. VENUES TABLE (one per venue account)
CREATE TABLE IF NOT EXISTS venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Restaurant',
  area TEXT,
  commission_rate TEXT DEFAULT '10%',
  commission_basis TEXT DEFAULT 'Net F&B · excl. service charge & IVA',
  contact TEXT,
  booking_instructions TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BOOKINGS TABLE (referrals from concierges to venues)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  concierge_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  covers INTEGER,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'paid', 'overdue')),
  estimated_commission NUMERIC(10,2),
  actual_commission NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════
-- ROW LEVEL SECURITY (keeps data private)
-- ══════════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all profiles, but only edit their own
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Venues: everyone can read active venues, only owner can edit
CREATE POLICY "Anyone can view active venues" ON venues FOR SELECT USING (is_active = true);
CREATE POLICY "Venue owners can insert" ON venues FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Venue owners can update" ON venues FOR UPDATE USING (auth.uid() = user_id);

-- Bookings: concierges see their own, venues see bookings for their venue
CREATE POLICY "Concierges see their bookings" ON bookings FOR SELECT
  USING (auth.uid() = concierge_id);

CREATE POLICY "Venues see bookings for their venue" ON bookings FOR SELECT
  USING (
    venue_id IN (SELECT id FROM venues WHERE user_id = auth.uid())
  );

CREATE POLICY "Concierges can create bookings" ON bookings FOR INSERT
  WITH CHECK (auth.uid() = concierge_id);

CREATE POLICY "Venues can update booking status" ON bookings FOR UPDATE
  USING (
    venue_id IN (SELECT id FROM venues WHERE user_id = auth.uid())
  );

-- ══════════════════════════════════════════
-- SEED DATA — The 9 Ibiza venues from the prototype
-- These appear immediately for all concierges
-- ══════════════════════════════════════════

-- First create a system user profile for seed venues
-- (Skip this section if you want venues to only appear when venue owners sign up)

-- NOTE: The venues below are for demo purposes.
-- Real venues will appear when venue owners sign up and create their listing.

-- ══════════════════════════════════════════
-- DONE! Your database is ready.
-- ══════════════════════════════════════════
