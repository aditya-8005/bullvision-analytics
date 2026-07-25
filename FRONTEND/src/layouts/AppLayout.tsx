import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

type AppLayoutProps = {
  children: ReactNode
}

function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-text-primary">
      {!isAuthPage && <Navbar />}
      <main className="min-w-0 overflow-x-clip motion-safe:animate-fade-in">{children}</main>
      <Footer />
    </div>
  )
}

export { AppLayout }