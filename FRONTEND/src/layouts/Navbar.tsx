import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { useAuth } from '../hooks/useAuth'
import { BullVisionLogo } from '../components/branding/BullVisionMark'

const navigationLinks = [
  { label: 'Hero', href: '#hero' },
  { label: 'Features', href: '#features' },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isLandingPage = location.pathname === '/'

  const sectionLinkClass = (href: string) => {
    const active = isLandingPage && location.hash === href

    return [
      'inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm transition-colors',
      active
        ? 'bg-surface text-text-primary shadow-border'
        : 'text-text-secondary hover:bg-surface hover:text-text-primary',
    ]
      .filter(Boolean)
      .join(' ')
  }

  const dashboardLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors',
      isActive
        ? 'border-border-strong bg-surface text-text-primary shadow-border'
        : 'border-border bg-surface/60 text-text-secondary hover:border-border-strong hover:bg-surface hover:text-text-primary',
    ]
      .filter(Boolean)
      .join(' ')

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur-xl">
      <Container maxWidth="2xl">
        <div className="flex min-h-16 items-center justify-between gap-3 py-2 sm:gap-4 sm:py-0">
          <Link to="/" className="flex items-center gap-2 text-text-primary sm:gap-3">
            <BullVisionLogo compact className="text-text-primary">
              <span className="hidden flex-col leading-none sm:flex">
                <span className="text-sm font-semibold tracking-wide text-text-primary">BullVision</span>
                <span className="text-xs text-text-secondary">Analytics</span>
              </span>
            </BullVisionLogo>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navigationLinks.map((link) => (
              <a key={link.label} href={link.href} className={sectionLinkClass(link.href)}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={dashboardLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/portfolio" className={dashboardLinkClass}>
                  Portfolio
                </NavLink>
                <div className="ml-4 flex items-center gap-3 border-l border-border pl-4">
                  <span className="text-sm font-medium text-text-secondary">{user?.email}</span>
                  <Button variant="ghost" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Log in
                </Button>
                <Button variant="primary" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            className="min-h-11 px-4 md:hidden"
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            Menu
          </Button>
        </div>

        {isMenuOpen ? (
          <div id="mobile-navigation" className="pb-4 md:hidden">
            <div className="grid gap-1 rounded-2xl border border-border bg-surface p-2 shadow-border">
              {navigationLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={sectionLinkClass(link.href)}
                >
                  {link.label}
                </a>
              ))}
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      [
                        'rounded-xl px-3 py-3 text-sm transition-colors',
                        isActive
                          ? 'bg-surface text-text-primary shadow-border'
                          : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary',
                      ]
                        .filter(Boolean)
                        .join(' ')
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/portfolio"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      [
                        'rounded-xl px-3 py-3 text-sm transition-colors',
                        isActive
                          ? 'bg-surface text-text-primary shadow-border'
                          : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary',
                      ]
                        .filter(Boolean)
                        .join(' ')
                    }
                  >
                    Portfolio
                  </NavLink>
                  <div className="mt-2 flex flex-col gap-2 border-t border-border pt-2">
                    <span className="break-all px-3 py-2 text-sm font-medium text-text-secondary">
                      {user?.email}
                    </span>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="min-h-11 justify-start px-3"
                    >
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="mt-2 flex flex-col gap-2 border-t border-border pt-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate('/login')
                      setIsMenuOpen(false)
                    }}
                    className="min-h-11 justify-start px-3"
                  >
                    Log in
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      navigate('/register')
                      setIsMenuOpen(false)
                    }}
                    className="min-h-11 justify-start px-3"
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </Container>
    </header>
  )
}

export { Navbar }