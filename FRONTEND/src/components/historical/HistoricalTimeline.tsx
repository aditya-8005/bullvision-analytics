import { Link } from 'react-router-dom'
import { Card } from '../ui/Card'

type HistoricalTimelineItem = {
  date: string
  title: string
  description: string
  href: string
}

type HistoricalTimelineProps = {
  title: string
  subtitle: string
  items: HistoricalTimelineItem[]
}

function HistoricalTimeline({ title, subtitle, items }: HistoricalTimelineProps) {
  return (
    <Card variant="elevated" className="space-y-5 p-6 lg:p-8">
      <div className="space-y-2 border-b border-border pb-4">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-text-secondary">{subtitle}</p>
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary">{title}</h2>
      </div>

      <div className="relative pl-4 sm:pl-6">
        <div className="absolute left-2.5 top-2 bottom-2 w-px bg-border" />
        <div className="space-y-4">
          {items.map((item) => (
            <Link
              key={`${item.date}-${item.title}`}
              to={item.href}
              className="group relative block rounded-2xl border border-border bg-background/60 p-4 shadow-border transition-transform duration-fast ease-standard hover:-translate-y-1 hover:border-border-strong hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-analytics/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="absolute -left-[1.55rem] top-5 h-3 w-3 rounded-full bg-analytics ring-4 ring-background" />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary">{item.date}</p>
                  <h3 className="mt-1 text-base font-semibold text-text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.description}</p>
                </div>

                <div className="flex w-fit shrink-0 items-center gap-2 self-start rounded-full border border-border bg-surface px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-text-tertiary transition-colors group-hover:border-border-strong group-hover:text-text-primary">
                  <span>View Analysis</span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className="h-3.5 w-3.5 transition-transform duration-fast ease-standard group-hover:translate-x-0.5"
                    fill="none"
                  >
                    <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Card>
  )
}

export type { HistoricalTimelineItem, HistoricalTimelineProps }
export { HistoricalTimeline }