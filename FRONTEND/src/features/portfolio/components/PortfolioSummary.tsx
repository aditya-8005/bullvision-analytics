import type { Holding } from '../../../services/portfolioService'
import { Card } from '../../../components/ui/Card'

interface PortfolioSummaryProps {
  holdings: Holding[]
}

export function PortfolioSummary({ holdings }: PortfolioSummaryProps) {
  const totalInvested = holdings.reduce(
    (acc, holding) => acc + holding.quantity * holding.averageBuyPrice,
    0
  )
  const totalHoldings = holdings.length

  const metrics = [
    { label: 'Total Invested', value: `₹${totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}` },
    { label: 'Holdings Count', value: totalHoldings.toString() },
  ]

  return (
    <Card variant="elevated" className="p-6 transition-transform duration-fast ease-standard hover:-translate-y-1 hover:border-border-strong">
      <p className="text-sm font-medium uppercase tracking-[0.22em] text-text-secondary">
        Portfolio Summary
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-border bg-surface/50 p-4">
            <p className="text-xs uppercase tracking-wider text-text-tertiary">{metric.label}</p>
            <p className="mt-2 text-lg font-semibold tracking-tight text-text-primary">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </Card>
  )
}
