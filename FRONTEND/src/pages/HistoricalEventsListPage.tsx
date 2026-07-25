import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { Card } from '../components/ui/Card'
import { getEvents, type HistoricalEvent } from '../services/eventService'
import { BullVisionLoader } from '../components/branding/BullVisionMark'

function formatEventCategory(category: string) {
  return category
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ')
}

export function HistoricalEventsListPage() {
  const [events, setEvents] = useState<HistoricalEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCurrent = true

    async function loadEvents() {
      try {
        const res = await getEvents()
        if (isCurrent && res.success && res.data) {
          setEvents(res.data)
        }
      } catch (err: unknown) {
        if (isCurrent) {
          setError(err instanceof Error ? err.message : 'Failed to load historical events.')
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }

    loadEvents()
    return () => {
      isCurrent = false
    }
  }, [])

  return (
    <div className="overflow-x-hidden py-8 lg:py-10">
      <Container maxWidth="2xl" className="space-y-8">
        <section className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-text-secondary">
              Market History
            </p>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              Historical Events
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-text-secondary">
              Explore major market events and their impact on Indian equities.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
          >
            ← Back to Dashboard
          </Link>
        </section>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <BullVisionLoader label="Loading events" description="Fetching historical market events" />
          </div>
        ) : error ? (
          <Card variant="elevated" className="border-error/50 bg-error/10 p-6 text-error">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </Card>
        ) : events.length === 0 ? (
          <Card variant="elevated" className="p-8 text-center">
            <p className="text-lg font-medium text-text-primary">No historical events found</p>
            <p className="mt-2 text-sm text-text-secondary">
              Historical market events will appear here once available.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <Link key={event.id} to={`/historical/${encodeURIComponent(event.id)}`}>
                <Card className="group h-full space-y-3 p-5 transition-all duration-fast ease-standard hover:-translate-y-1 hover:border-border-strong hover:shadow-raised">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-text-primary group-hover:text-analytics">
                      {event.name}
                    </p>
                    <span className="shrink-0 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] uppercase tracking-[0.22em] text-text-tertiary">
                      {new Date(event.startDate).getFullYear()}
                    </span>
                  </div>

                  <span className="inline-block rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] uppercase tracking-[0.22em] text-text-tertiary">
                    {formatEventCategory(event.category)}
                  </span>

                  {event.description ? (
                    <p className="text-sm leading-relaxed text-text-secondary line-clamp-3">
                      {event.description}
                    </p>
                  ) : null}

                  <p className="text-xs text-text-tertiary">
                    {event.startDate} — {event.endDate}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}
