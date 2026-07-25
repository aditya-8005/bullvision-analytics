import { Card } from '../../../components/ui/Card'
import { Link } from 'react-router-dom'

const quickActionDetails = [
  {
    title: 'Analyze Stock',
    description: 'Open a focused stock workspace for the selected ticker.',
    icon: 'analyze',
    href: '/search',
  },
  {
    title: 'Historical Events',
    description: 'Review crisis timelines and market response patterns.',
    icon: 'events',
    href: '/historical',
  },
] as const

function QuickActionIcon({ kind }: { kind: (typeof quickActionDetails)[number]['icon'] }) {
  if (kind === 'analyze') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-analytics">
        <path d="M4 17l5-5 4 4 7-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 8h4v4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (kind === 'events') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-warning">
        <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-text-secondary">
      <path d="M12 4l2.6 5.2L20 10l-4 3.8 1 5.4L12 16.7 7 19.2l1-5.4L4 10l5.4-.8L12 4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

export function QuickActions() {
  return (
    <div className="mt-6">
      <p className="text-sm font-medium text-text-secondary">Quick Actions</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {quickActionDetails.map((action) => (
          <Link key={action.title} to={action.href}>
            <Card
              className="group h-full p-4 transition-all duration-fast ease-standard hover:-translate-y-1 hover:border-border-strong hover:shadow-raised"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface transition-colors group-hover:border-analytics/30 group-hover:bg-analytics/15">
                  <QuickActionIcon kind={action.icon} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-text-primary">{action.title}</p>

                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                    {action.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
