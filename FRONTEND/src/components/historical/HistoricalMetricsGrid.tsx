import { Card } from '../ui/Card'

type HistoricalMetric = {
  label: string
  value: string
  description: string
}

type HistoricalMetricsGridProps = {
  title: string
  subtitle: string
  metrics: HistoricalMetric[]
}

function HistoricalMetricsGrid({ title, subtitle, metrics }: HistoricalMetricsGridProps) {
  return (
    <Card variant="glass" className="space-y-5 p-6 lg:p-8">
      <div className="space-y-2 border-b border-border pb-4">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-text-secondary">{subtitle}</p>
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary">{title}</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-border bg-surface/50 p-5 shadow-border">
            <p className="text-xs uppercase tracking-[0.22em] text-text-tertiary">{metric.label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">{metric.value}</p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{metric.description}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

export type { HistoricalMetric, HistoricalMetricsGridProps }
export { HistoricalMetricsGrid }