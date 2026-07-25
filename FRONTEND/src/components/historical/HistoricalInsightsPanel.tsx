import { Card } from '../ui/Card'

type HistoricalInsightsPanelProps = {
  title: string
  subtitle: string
  insights: string[]
}

function HistoricalInsightsPanel({ title, subtitle, insights }: HistoricalInsightsPanelProps) {
  return (
    <Card variant="elevated" className="space-y-5 p-6 lg:p-8">
      <div className="space-y-2 border-b border-border pb-4">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-text-secondary">{subtitle}</p>
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary">{title}</h2>
      </div>

      <ul className="space-y-3 text-sm leading-relaxed text-text-secondary">
        {insights.map((insight) => (
          <li key={insight} className="flex gap-3 rounded-2xl border border-border bg-background/60 p-4 shadow-border">
            <span className="mt-1 h-2 w-2 rounded-full bg-analytics" aria-hidden="true" />
            <span>{insight}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export type { HistoricalInsightsPanelProps }
export { HistoricalInsightsPanel }