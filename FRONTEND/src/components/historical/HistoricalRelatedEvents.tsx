import { Card } from '../ui/Card'

type HistoricalRelatedEvent = {
  year: string
  title: string
  description: string
}

type HistoricalRelatedEventsProps = {
  title: string
  subtitle: string
  events: HistoricalRelatedEvent[]
}

function HistoricalRelatedEvents({ title, subtitle, events }: HistoricalRelatedEventsProps) {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-text-secondary">{subtitle}</p>
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary">{title}</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card
            key={event.year}
            className="space-y-3 p-5 transition-transform duration-fast ease-standard hover:-translate-y-1 hover:border-border-strong hover:shadow-raised"
          >
            <p className="text-xs uppercase tracking-[0.22em] text-text-tertiary">{event.year}</p>
            <h3 className="text-lg font-semibold tracking-tight text-text-primary">{event.title}</h3>
            <p className="text-sm leading-relaxed text-text-secondary">{event.description}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}

export type { HistoricalRelatedEvent, HistoricalRelatedEventsProps }
export { HistoricalRelatedEvents }