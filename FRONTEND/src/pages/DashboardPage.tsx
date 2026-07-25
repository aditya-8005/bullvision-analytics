import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { DashboardHeader } from '../features/dashboard/components/DashboardHeader'
import { PortfolioSummary } from '../features/dashboard/components/PortfolioSummary'
import { FeaturedEvents } from '../features/dashboard/components/FeaturedEvents'
import { MarketOverview } from '../features/dashboard/components/MarketOverview'
import { QuickActions } from '../features/dashboard/components/QuickActions'
import { RecentSearches } from '../features/dashboard/components/RecentSearches'
import { BullVisionLogo } from '../components/branding/BullVisionMark'
import { useAuth } from '../hooks/useAuth'

const sidebarLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Search', href: '/search' },
  { label: 'Historical Events', href: '/historical' },
  { label: 'Portfolio', href: '/portfolio' },
]

export function DashboardPage() {
  const navigate = useNavigate()
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const { user, logout } = useAuth()
  
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        if (searchInputRef.current) {
          searchInputRef.current.focus()
          searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        } else {
          navigate('/search')
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  const handleSearchShortcutClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
      searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      navigate('/search')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const displayName = user && 'name' in user && user.name ? String(user.name) : user?.email?.split('@')[0] || 'User'

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-text-primary lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-border bg-surface/50 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col gap-6 p-4 sm:p-6">
          <div className="rounded-2xl border border-border bg-background/70 p-4 shadow-border">
            <BullVisionLogo compact className="items-center">
              <div className="leading-none">
                <p className="text-sm font-semibold">BullVision</p>
                <p className="mt-1 text-xs text-text-secondary">Analytics workspace</p>
              </div>
            </BullVisionLogo>
          </div>

          <nav className="grid gap-1">
            {sidebarLinks.map((link) => {
              const isActive = link.href === '/dashboard'

              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={[
                    'rounded-xl px-4 py-3 text-sm transition-colors',
                    isActive
                      ? 'border border-border-strong bg-surface-elevated text-text-primary shadow-border'
                      : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-border bg-background/60 p-4 shadow-border">
            <p className="text-xs uppercase tracking-[0.24em] text-text-tertiary">Workspace</p>
            <p className="mt-2 text-sm text-text-primary">
              Prepared for authenticated market research flows.
            </p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="border-b border-border bg-background/80 backdrop-blur-xl relative z-10">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={handleSearchShortcutClick}
              className="hidden max-w-xl min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-2xl border border-border bg-surface/60 px-4 py-3 text-left transition-colors hover:border-border-strong hover:bg-surface md:flex"
            >
              <span className="text-xs uppercase tracking-[0.24em] text-text-tertiary">
                Search shortcut
              </span>
              <span className="ml-auto rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary">
                Ctrl K
              </span>
            </button>

            <div className="flex items-center gap-3 md:ml-auto relative">
              <div className="relative">
                 <button 
                   onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false) }}
                   className="hidden rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary md:block"
                 >
                   Notifications
                 </button>
                 {isNotificationsOpen && (
                   <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-surface p-4 shadow-raised">
                     <p className="text-sm font-medium text-text-primary">Notifications</p>
                     <p className="mt-2 text-xs text-text-secondary">No new notifications.</p>
                   </div>
                 )}
              </div>

              <div className="relative">
                 <button 
                   onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false) }}
                   className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
                 >
                   {displayName}
                 </button>
                 {isProfileOpen && (
                   <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-border bg-surface p-2 shadow-raised flex flex-col">
                     <div className="px-3 py-2 border-b border-border mb-1">
                       <p className="text-sm font-medium text-text-primary">{displayName}</p>
                       <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                     </div>
                     <button onClick={() => navigate('/profile')} className="text-left rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors">
                       View Profile
                     </button>
                     <button onClick={handleLogout} className="text-left rounded-lg px-3 py-2 text-sm text-error hover:bg-surface-elevated transition-colors">
                       Logout
                     </button>
                   </div>
                 )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8" onClick={() => { setIsProfileOpen(false); setIsNotificationsOpen(false); }}>
          <div className="space-y-8">
            <DashboardHeader />

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_1.1fr]">
              <Card variant="glass" className="space-y-5 p-6 lg:p-7">
                <div className="space-y-2">
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-text-secondary">
                    Search Card
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
                    Search NSE Stocks
                  </h2>
                </div>

                <RecentSearches ref={searchInputRef} />
                <QuickActions />
              </Card>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                <MarketOverview />
                <FeaturedEvents />
                <PortfolioSummary />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
