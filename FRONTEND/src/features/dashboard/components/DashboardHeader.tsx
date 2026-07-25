import { useAuth } from '../../../hooks/useAuth'

export function DashboardHeader() {
  const { user } = useAuth()
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Derive a display name from email if name is missing (for flexibility)
  const displayName = user && 'name' in user && user.name ? user.name : user?.email?.split('@')[0] || 'User'

  return (
    <section className="flex flex-col gap-4 border-b border-border pb-6 sm:gap-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-text-secondary">
            Dashboard
          </p>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl lg:text-6xl">
            Good Morning, {displayName}
            <span className="block text-analytics">Welcome back to BullVision.</span>
          </h1>
        </div>

        <div className="rounded-2xl border border-border bg-surface/60 px-4 py-3 text-sm text-text-secondary shadow-border">
          {today}
        </div>
      </div>

      <p className="max-w-3xl text-base leading-relaxed text-text-secondary sm:text-lg">
        Start exploring historical stock intelligence.
      </p>
    </section>
  )
}
