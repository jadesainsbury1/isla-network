import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SignOutButton from '@/components/SignOutButton'

const navItems = [
  { href: '/venue/dashboard', icon: '◎', label: 'Dashboard' },
  { href: '/venue/listing', icon: '✦', label: 'Edit Listing' },
]

export default async function VenueLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'concierge') redirect('/concierge/revenue')

  const { data: venue } = await supabase
    .from('venues')
    .select('name')
    .eq('user_id', user.id)
    .single()

  const initials = (venue?.name || profile?.full_name || 'V').charAt(0).toUpperCase()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-top">
          <Link href="/" className="logo" style={{ fontSize: 18 }}>ISLA</Link>
          <span className="logo-sub">The Concierge Network</span>
        </div>

        <div className="sidebar-user">
          <div className="avatar" style={{ background: 'linear-gradient(135deg, #C9A96E, #7A5E32)' }}>
            {initials}
          </div>
          <div>
            <div className="user-name">{venue?.name || profile?.full_name || 'Venue'}</div>
            <div className="user-role">Venue · ISLA</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">Menu</div>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className="nav-item">
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <SignOutButton />
        </div>
      </aside>

      <div className="main-col">
        {children}
      </div>
    </div>
  )
}
