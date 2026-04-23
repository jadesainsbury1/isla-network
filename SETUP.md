# ISLA Network — Setup Guide

Follow these steps exactly. No coding required — just copy and paste.

---

## STEP 1 — Install Node.js (the engine that runs your app)

1. Open your browser and go to: **https://nodejs.org**
2. Click the big green button that says **"LTS"** (recommended for most users)
3. Download the file and run it — click through the installer
4. Once installed, open **Terminal** (press Cmd+Space, type "Terminal", press Enter)
5. Type this and press Enter to confirm it worked:
   ```
   node --version
   ```
   You should see something like `v20.x.x`

---

## STEP 2 — Install your app dependencies

1. In Terminal, type this (it navigates to your project folder):
   ```
   cd ~/Downloads/ISLA\ NETWORK
   ```
2. Then type this and press Enter (this installs everything):
   ```
   npm install
   ```
   Wait for it to finish — it takes 1-2 minutes.

---

## STEP 3 — Create your Supabase database (free)

Supabase is the database that stores your users, venues, and bookings.

1. Go to: **https://supabase.com**
2. Click **"Start your project"** → Sign up with GitHub or Google
3. Click **"New Project"**
   - Name it: `isla-network`
   - Set a strong database password (save it somewhere!)
   - Choose region: **Europe West** (or closest to your users)
   - Click **"Create new project"** → wait ~2 minutes for it to set up

4. Once ready, click **"SQL Editor"** in the left menu
5. Click **"New query"**
6. Open the file `supabase-schema.sql` from your ISLA NETWORK folder (you can drag it into TextEdit to read it)
7. Copy the entire contents and paste into the SQL Editor
8. Click **"Run"** (or press Cmd+Enter)
   - You should see "Success" messages

9. Now get your API keys:
   - Click **"Settings"** (gear icon) in the left menu
   - Click **"API"**
   - Copy your **"Project URL"** — it looks like `https://xxxxx.supabase.co`
   - Copy your **"anon/public"** key — it's a long string of letters

---

## STEP 4 — Connect your app to Supabase

1. In your ISLA NETWORK folder, find the file called `.env.local.example`
2. Duplicate it and rename the copy to exactly: `.env.local`
3. Open `.env.local` in TextEdit
4. Replace the placeholder values with your real keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```
5. Save the file

---

## STEP 5 — Turn off email confirmation (recommended for now)

This makes signup instant — users don't need to verify their email first.

1. In Supabase, go to **Authentication → Providers → Email**
2. Toggle **"Enable email confirmations"** to OFF
3. Click **"Save"**

---

## STEP 6 — Test your app locally

1. In Terminal (make sure you're in the ISLA NETWORK folder):
   ```
   npm run dev
   ```
2. Open your browser and go to: **http://localhost:3000**
3. You should see the ISLA landing page!

Test the full flow:
- Click "Request Access" → sign up as a Concierge
- Sign out → Click "List Your Venue" → sign up as a Venue
- Log a booking as a concierge → confirm it as a venue

---

## STEP 7 — Deploy to Vercel (make it live for everyone)

1. First, push your code to GitHub:
   - Go to: **https://github.com** → sign up / sign in
   - Click **"New repository"** → name it `isla-network`
   - Keep it **Private**
   - Click **"Create repository"**
   - Follow the instructions to push your code

2. Then deploy to Vercel:
   - Go to: **https://vercel.com** → sign up with GitHub
   - Click **"Add New Project"**
   - Import your `isla-network` repository
   - In the **"Environment Variables"** section, add:
     - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your Supabase anon key
   - Click **"Deploy"**
   - Wait ~2 minutes → Vercel gives you a live URL like `isla-network.vercel.app`

---

## You're live! 🎉

Your ISLA app is now accessible at your Vercel URL. Share it with:
- Concierges: send them the link, they sign up for free
- Venues: send them the link, they sign up and complete their listing

---

## Troubleshooting

**"Module not found" error**: Run `npm install` again

**"Invalid API key" error**: Double-check your `.env.local` file — no spaces, exact values

**White screen / error**: Open browser console (Cmd+Option+J) and look for red error messages

**Can't log in after signing up**: Make sure email confirmation is turned off in Supabase

---

## Need help?

All your code files are in the `src/` folder. The main pages are in `src/app/`.
- Landing page: `src/app/page.tsx`
- Login: `src/app/auth/login/page.tsx`
- Concierge revenue: `src/app/concierge/revenue/page.tsx`
- Venue dashboard: `src/app/venue/dashboard/page.tsx`
