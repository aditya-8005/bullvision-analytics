import { useEffect, useState } from 'react'
import { getEvents, type HistoricalEvent } from '../../../services/eventService'
import { Card } from '../../../components/ui/Card'
import { Link } from 'react-router-dom'

export function FeaturedEvents() {
  const [events, setEvents] = useState<HistoricalEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await getEvents()
        if (res.success && res.data) {
          const sorted = [...res.data].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
          setEvents(sorted.slice(0, 3))
        }
      } catch {
        // Fallback silently
      } finally {
        setIsLoading(false)
      }
    }
    loadEvents()
  }, [])

  const tones = ['bg-error', 'bg-warning', 'bg-analytics', 'bg-success']

  return (
    <Card variant="elevated" className="min-h-56 p-5 transition-transform duration-fast ease-standard hover:-translate-y-1 hover:border-border-strong sm:p-6">
      <p className="text-sm font-medium uppercase tracking-[0.22em] text-text-secondary">
        Historical Events
      </p>
      <div className="mt-4 rounded-2xl border border-border bg-background/60 p-4 shadow-border">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-2xl border border-border bg-surface/50"></div>
            ))}
          </div>
        ) : (
          <div className="relative pl-6">
            <div className="absolute left-2.5 top-2 bottom-2 w-px bg-border" />
            <div className="space-y-4">
              {events.map((item, idx) => (
                <Link key={item.id} to={`/historical/${item.id}`} className="block group">
                  <div className="relative rounded-2xl border border-border bg-surface/50 p-4 shadow-border transition-colors group-hover:bg-surface-elevated">
                    <span className={`absolute -left-[1.55rem] top-5 h-3 w-3 rounded-full ${tones[idx % tones.length]} ring-4 ring-background`} />
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                      <p className="min-w-0 text-sm font-semibold text-text-primary line-clamp-1">{item.name}</p>
                      <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] uppercase tracking-[0.22em] text-text-tertiary whitespace-nowrap">
                        {new Date(item.startDate).getFullYear()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
              {events.length === 0 && (
                <p className="text-sm text-text-secondary">No historical events available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
