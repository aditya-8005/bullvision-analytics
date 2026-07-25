import { useEffect, useState } from 'react'
import { getQuote, type MarketQuote, type ApiEnvelope } from '../../../services/marketService'
import { Card } from '../../../components/ui/Card'

const BENCHMARKS = ['RELIANCE', 'TCS', 'INFY']

export function MarketOverview() {
  const [quotes, setQuotes] = useState<MarketQuote[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadQuotes() {
      try {
        const promises = BENCHMARKS.map((symbol) => getQuote(symbol))
        const results = await Promise.allSettled(promises)
        const validQuotes = results
          .filter((res): res is PromiseFulfilledResult<ApiEnvelope<MarketQuote>> => res.status === 'fulfilled' && res.value.success)
          .map((res) => (res as PromiseFulfilledResult<ApiEnvelope<MarketQuote>>).value.data)
        setQuotes(validQuotes)
      } catch {
        // silent fail
      } finally {
        setIsLoading(false)
      }
    }
    loadQuotes()
  }, [])

  return (
    <Card variant="elevated" className="min-h-56 p-5 transition-transform duration-fast ease-standard hover:-translate-y-1 hover:border-border-strong sm:p-6">
      <p className="text-sm font-medium uppercase tracking-[0.22em] text-text-secondary">
        Market Overview
      </p>
      <div className="mt-4 rounded-2xl border border-border bg-background/60 p-4 shadow-border">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 w-full rounded-xl bg-surface/50"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {quotes.map((quote) => {
              const isPositive = quote.changePercent >= 0
              return (
                <div key={quote.symbol} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface/50 p-3 shadow-sm">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{quote.symbol}</p>
                    <p className="text-xs text-text-secondary">Vol: {quote.volume?.toLocaleString() ?? 0}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text-primary">₹{quote.price?.toFixed(2) ?? '0.00'}</p>
                    <p className={`text-xs font-medium ${isPositive ? 'text-success' : 'text-error'}`}>
                      {isPositive ? '+' : ''}{quote.changePercent?.toFixed(2) ?? '0.00'}%
                    </p>
                  </div>
                </div>
              )
            })}
            {quotes.length === 0 && (
              <p className="text-sm text-text-secondary text-center py-4">Market data unavailable.</p>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
