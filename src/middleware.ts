import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Redirect logged-in users away from auth pages
  if (user && (path === '/auth/login' || path === '/auth/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protect concierge and venue routes
  if (!user && (path.startsWith('/concierge/') || path === '/concierge' || path.startsWith('/venue/') || path === '/venue' || path === '/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Check approval + founding member unlock status
  if (user && (path.startsWith('/dashboard') || path.startsWith('/concierge/') || path === '/concierge' || path.startsWith('/venue/') || path === '/venue')) {
    const { createClient } = await import('@supabase/supabase-js')
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data: profile } = await adminClient
      .from('profiles')
      .select('role, is_approved, founding_member_unlocked')
      .eq('id', user.id)
      .single()

    // Concierge: pending approval
    if (profile?.role === 'concierge' && !profile?.is_approved && path !== '/pending') {
      return NextResponse.redirect(new URL('/pending', request.url))
    }

    // Concierge: approved but not yet unlocked → welcome page
    if (profile?.role === 'concierge' && profile?.is_approved && !profile?.founding_member_unlocked && path !== '/welcome/concierge') {
      return NextResponse.redirect(new URL('/welcome/concierge', request.url))
    }

    // Venue: check unlock status
    if (profile?.role === 'venue') {
      const { data: venue } = await adminClient
        .from('venues')
        .select('founding_member_unlocked, is_active')
        .eq('user_id', user.id)
        .single()

      if (venue?.is_active && !venue?.founding_member_unlocked && path !== '/welcome/venue') {
        return NextResponse.redirect(new URL('/welcome/venue', request.url))
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
