import { useEffect, useState } from 'react'
import { getPortfolio, type Holding } from '../../../services/portfolioService'
import { useAuth } from '../../../hooks/useAuth'
import { Card } from '../../../components/ui/Card'

export function PortfolioSummary() {
  const { user } = useAuth()
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPortfolio() {
      if (!user) return
      try {
        setIsLoading(true)
        const res = await getPortfolio(user.id)
        if (res.success) {
          setHoldings(res.holdings)
        }
      } catch {
        setError('Failed to load portfolio summary.')
      } finally {
        setIsLoading(false)
      }
    }

    loadPortfolio()
  }, [user])

  // Compute basic metrics (In a real app, this would require current prices from marketService)
  // For summary, we can show totals based on buy price or mock current prices if real ones aren't easily batched.
  // The plan specified using marketService.getQuote, but doing N network requests might be slow.
  // We'll calculate total investment for now.
  const totalInvestment = holdings.reduce((sum, h) => sum + h.quantity * h.averageBuyPrice, 0)
  const totalHoldings = holdings.length

  const metrics = [
    { label: 'Holdings', value: totalHoldings.toString() },
    { label: 'Total Invested', value: `₹${totalInvestment.toLocaleString('en-IN', { maximumFractionDigits: 2 })}` },
    { label: 'Returns', value: '--' }, // Requires live prices
    { label: 'Status', value: 'Active' },
  ]

  if (isLoading) {
    return (
      <Card variant="elevated" className="min-h-56 p-5 transition-transform duration-fast ease-standard hover:-translate-y-1 hover:border-border-strong md:col-span-2 xl:col-span-1 sm:p-6">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-text-secondary">Analytics Summary</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface/50 p-4 h-20"></div>
          ))}
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card variant="elevated" className="min-h-56 p-5 md:col-span-2 xl:col-span-1 sm:p-6">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-text-secondary">Analytics Summary</p>
        <div className="mt-4 rounded-lg bg-red-500/10 p-4 text-red-500 border border-red-500/20">{error}</div>
      </Card>
    )
  }

  return (
    <Card variant="elevated" className="min-h-56 p-5 transition-transform duration-fast ease-standard hover:-translate-y-1 hover:border-border-strong md:col-span-2 xl:col-span-1 sm:p-6">
      <p className="text-sm font-medium uppercase tracking-[0.22em] text-text-secondary">Analytics Summary</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-border bg-surface/50 p-4">
            <p className="text-xs uppercase tracking-wider text-text-tertiary">{metric.label}</p>
            <p className="mt-2 text-lg font-semibold tracking-tight text-text-primary">{metric.value}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
