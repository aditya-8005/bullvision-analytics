import { Card } from '../ui/Card'

type HistoricalSummaryCard = {
  label: string
  value: string
  description: string
}

type HistoricalSummaryCardsProps = {
  cards: HistoricalSummaryCard[]
}

function HistoricalSummaryCards({ cards }: HistoricalSummaryCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label} className="space-y-3 p-5 transition-transform duration-fast ease-standard hover:-translate-y-1 hover:border-border-strong">
          <p className="text-xs uppercase tracking-[0.22em] text-text-tertiary">{card.label}</p>
          <p className="text-2xl font-semibold tracking-tight text-text-primary">{card.value}</p>
          <p className="text-sm leading-relaxed text-text-secondary">{card.description}</p>
        </Card>
      ))}
    </section>
  )
}

export type { HistoricalSummaryCard, HistoricalSummaryCardsProps }
export { HistoricalSummaryCards }