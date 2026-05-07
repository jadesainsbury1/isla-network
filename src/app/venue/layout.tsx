import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SignOutButton from '@/components/SignOutButton'

const navItems = [
  { href: '/venue/dashboard', icon: '◎', label: 'Dashboard' },
  { href: '/venue/listing', icon: '✦', label: 'Edit Listing' },
]

export default async function VenueLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'concierge') redirect('/concierge/revenue')

  const { data: venues } = await supabase
    .from('venues')
    .select('name, parent_group')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  const allVenues = venues || []
  const groupName = allVenues.find(v => v.parent_group)?.parent_group || null
  const displayName = groupName || allVenues[0]?.name || profile?.full_name || 'Venue'
  const displayRole = groupName ? `${allVenues.length} venues · ISLA` : 'Venue · ISLA'
  const initials = displayName.charAt(0).toUpperCase()

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
            <div className="user-name">{displayName}</div>
            <div className="user-role">{displayRole}</div>
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
