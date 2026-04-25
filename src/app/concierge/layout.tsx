import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SignOutButton from '@/components/SignOutButton'

const navItems = [
  { id: 'revenue', href: '/concierge/revenue', icon: '—', label: 'My Revenue' },
  { id: 'opportunities', href: '/concierge/opportunities', icon: '—', label: 'Opportunities' },
  { id: 'venues', href: '/concierge/venues', icon: '—', label: 'All Venues' },
]

export default async function ConciergeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'venue') redirect('/venue/dashboard')

  const initials = profile?.full_name?.charAt(0).toUpperCase() || 'C'

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-top">
          <Link href="/" className="logo" style={{ fontSize: 18 }}>ISLA</Link>
          <span className="logo-sub">The Concierge Network</span>
        </div>

        <div className="sidebar-user">
          <div className="avatar" style={{ background: '#1a1a1a' }}>
            {initials}
          </div>
          <div>
            <div className="user-name">{profile?.full_name || 'Concierge'}</div>
            <div className="user-role">{profile?.property || 'GRM · ISLA'}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">Menu</div>
          {navItems.map(item => (
            <NavItem key={item.id} href={item.href} icon={item.icon} label={item.label} />
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

function NavItem({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link href={href} className="nav-item">
      <span className="nav-icon">{icon}</span>
      {label}
    </Link>
  )
}
