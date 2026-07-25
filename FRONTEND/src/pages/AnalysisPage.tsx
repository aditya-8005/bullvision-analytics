import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { ApiError } from '../services/api'
import { getEvents, type HistoricalEvent } from '../services/eventService'
import { getHistory, getQuote, type HistoricalCandle, type MarketQuote } from '../services/marketService'
import { getAllEventAnalytics, type EventAnalysis } from '../services/analysisService'

const timeFilters = ['1D', '5D', '1M', '3M', '6M', '1Y', '2Y', '5Y', 'MAX']

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

function toErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback
}

function formatPercentage(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

function formatEventCategory(category: string) {
  return category
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ')
}

function buildChartPath(points: number[]) {
  if (points.length === 0) return ''
  const min = Math.min(...points)
  const max = Math.max(...points)
  const width = 960
  const height = 420
  const xStep = width / Math.max(points.length - 1, 1)

  return points
    .map((point, index) => {
      const x = index * xStep
      const normalized = (point - min) / Math.max(max - min, 1)
      const y = height - normalized * (height - 48) - 18
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

function AnalysisPage() {
  const { symbol } = useParams()
  const navigate = useNavigate()
  const [quote, setQuote] = useState<MarketQuote | null>(null)
  const [history, setHistory] = useState<HistoricalCandle[] | null>(null)
  const [isQuoteLoading, setIsQuoteLoading] = useState(true)
  const [isHistoryLoading, setIsHistoryLoading] = useState(true)
  const [activeTimeFilter, setActiveTimeFilter] = useState('1Y')
  const [quoteError, setQuoteError] = useState<string | null>(null)
  const [historyError, setHistoryError] = useState<string | null>(null)
  
  const [events, setEvents] = useState<HistoricalEvent[] | null>(null)
  const [isEventsLoading, setIsEventsLoading] = useState(true)
  const [eventsError, setEventsError] = useState<string | null>(null)
  
  const [eventAnalytics, setEventAnalytics] = useState<Record<string, EventAnalysis | null>>({})

  const marketSymbol = symbol ?? 'UNKNOWN'

  useEffect(() => {
    let isCurrentRequest = true

    async function loadMarketData() {
      setQuote(null)
      setHistory(null)
      setQuoteError(null)
      setHistoryError(null)
      setIsQuoteLoading(true)
      setIsHistoryLoading(true)

      try {
        const response = await getQuote(marketSymbol)
        if (isCurrentRequest) {
          setQuote(response.data)
        }
      } catch (error) {
        if (isCurrentRequest) {
          setQuoteError(toErrorMessage(error, 'Unable to load the latest market quote.'))
        }
      } finally {
        if (isCurrentRequest) {
          setIsQuoteLoading(false)
        }
      }

      try {
        const response = await getHistory({ symbol: marketSymbol, range: activeTimeFilter })
        if (isCurrentRequest) {
          setHistory(response.data)
        }
      } catch (error) {
        if (isCurrentRequest) {
          setHistoryError(toErrorMessage(error, 'Unable to load historical prices.'))
        }
      } finally {
        if (isCurrentRequest) {
          setIsHistoryLoading(false)
        }
      }
    }

    void loadMarketData()
    return () => { isCurrentRequest = false }
  }, [marketSymbol, activeTimeFilter])

  useEffect(() => {
    let isCurrentRequest = true

    async function loadEvents() {
      try {
        const response = await getEvents()
        if (isCurrentRequest) {
          setEvents(response.data)
        }
      } catch (error) {
        if (isCurrentRequest) {
          setEventsError(toErrorMessage(error, 'Unable to load historical events.'))
        }
      } finally {
        if (isCurrentRequest) {
          setIsEventsLoading(false)
        }
      }
    }

    void loadEvents()
    return () => { isCurrentRequest = false }
  }, [])

  useEffect(() => {
    if (!events || isHistoryLoading) return

    let isCurrentRequest = true
    async function fetchAnalytics() {
      try {
        const res = await getAllEventAnalytics(marketSymbol)
        if (!isCurrentRequest) return

        if (res.success && res.data) {
          const resultsMap: Record<string, EventAnalysis> = {}
          res.data.forEach((analysis) => {
            if (analysis.event?.id) {
              resultsMap[analysis.event.id] = analysis
            }
          })
          setEventAnalytics(resultsMap)
        }
      } catch (error) {
        console.error('Failed to load event analytics:', error)
      }
    }
    fetchAnalytics()
    return () => { isCurrentRequest = false }
  }, [events, isHistoryLoading, marketSymbol])

  const selectedEventAnalysis = events && events.length > 0 ? eventAnalytics[events[0].id] : null
  const selectedEventStatus = selectedEventAnalysis?.status ?? null
  const selectedEventMessage = selectedEventAnalysis?.message ?? null

  const displayName = quote?.symbol ?? marketSymbol
  const displaySymbol = quote?.tradingSymbol ?? marketSymbol
  const displayExchange = quote?.exchange ?? 'NSE'
  const displayPrice = quote ? inrFormatter.format(quote.price) : '—'
  const displayChange = quote ? formatPercentage(quote.changePercent) : '—'
  const displayUpdated = quote?.exchangeFeedTime || '—'
  
  const sector = quote?.profile?.sector || '—'
  const industry = quote?.profile?.industry || '—'
  const description = quote?.profile?.description || `Analysis workspace for ${displayName}.`

  const headerDetails = [
    { label: 'Exchange', value: displayExchange },
    { label: 'Sector', value: sector },
    { label: 'Industry', value: industry },
    { label: 'Current Price', value: displayPrice },
    { label: "Today's Change", value: displayChange },
    { label: 'Last Updated', value: displayUpdated },
  ]

  const summaryMetrics = [
    {
      label: 'Current Price',
      value: displayPrice,
      helper: quote ? `${quote.change} (${quote.changePercent}%) today` : '—',
      trend: quote ? quote.changePercent : '',
    },
    {
      label: '52 Week High',
      value: quote?.fiftyTwoWeekHigh ? inrFormatter.format(quote.fiftyTwoWeekHigh) : '—',
      helper: 'Highest price in the last 52 weeks',
      trend: '',
    },
    {
      label: '52 Week Low',
      value: quote?.fiftyTwoWeekLow ? inrFormatter.format(quote.fiftyTwoWeekLow) : '—',
      helper: 'Lowest price in the last 52 weeks',
      trend: '',
    },
    {
      label: 'Market Cap',
      value: quote?.profile?.marketCap ? inrFormatter.format(quote.profile.marketCap) : '—',
      helper: 'Current market capitalization',
      trend: '',
    },
    {
      label: 'P/E Ratio',
      value: quote?.profile?.peRatio ? quote.profile.peRatio.toFixed(2) : '—',
      helper: 'Price to Earnings Ratio',
      trend: '',
    },
    {
      label: 'Dividend Yield',
      value: quote?.profile?.dividendYield ? formatPercentage(quote.profile.dividendYield * 100) : '—',
      helper: 'Annual dividend yield',
      trend: '',
    },
  ]

  function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {}
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

let analyticsCards = [
    { label: 'Drawdown', value: '—' },
    { label: 'Recovery Time', value: '—' },
    { label: 'Recovery Score', value: '—' },
    { label: 'Volatility', value: '—' },
    { label: 'CAGR', value: '—' },
    { label: 'Risk Level', value: '—' },
  ]
  if (selectedEventAnalysis?.status === 'SUCCESS' && selectedEventAnalysis.analytics) {
    const analysis = selectedEventAnalysis
    const analytics = analysis.analytics || ({} as NonNullable<EventAnalysis['analytics']>)
    const drawdown = asRecord(analytics.drawdown)
    const recovery = asRecord(analytics.recovery)
    const scores = asRecord(analytics.scores)
    const recoveryAbility = asRecord(scores.recoveryAbility)
    const resilience = asRecord(scores.resilience)
    const volatility = asRecord(analytics.volatility)
    const returns = asRecord(analytics.returns)
    
    analyticsCards = [
      { label: 'Drawdown', value: `${asNumber(drawdown.drawdownPercentage)?.toFixed(1) ?? '—'}%` },
      { label: 'Recovery Time', value: `${asNumber(recovery.recoveryDays) ?? '—'} days` },
      { label: 'Recovery Score', value: `${asNumber(recoveryAbility.score) ?? '—'} / 100` },
      { label: 'Volatility', value: `${((asNumber(volatility.volatility) ?? 0) * 100).toFixed(1)}%` },
      { label: 'CAGR', value: `${((asNumber(returns.cagr) ?? 0) * 100).toFixed(1)}%` },
      { label: 'Risk Level', value: typeof resilience.interpretation === 'string' ? resilience.interpretation : '—' },
    ]
  }

  const timelineEvents = events && events.length > 0
    ? events.map((event) => {
        const analysis = eventAnalytics[event.id]
        let analysisText = ''
        if (analysis?.status === 'SUCCESS' && analysis.analytics) {
           const analytics = analysis.analytics || ({} as NonNullable<EventAnalysis['analytics']>)
           const recovery = asRecord(analytics.recovery)
           const drawdown = asRecord(analytics.drawdown)
           analysisText = recovery.recovered 
             ? `Recovered in ${asNumber(recovery.recoveryDays)} trading days (Drawdown: ${asNumber(drawdown.drawdownPercentage)?.toFixed(1)}%)`
             : `Not recovered as of latest available market data (Drawdown: ${asNumber(drawdown.drawdownPercentage)?.toFixed(1)}%)`
        } else if (analysis?.status === 'NOT_LISTED') {
          analysisText = 'This stock was not publicly listed during the event.'
        } else if (analysis?.status === 'NO_DATA') {
          analysisText = analysis.message ?? 'Historical data is unavailable for this event window.'
        }
        return {
          id: event.id,
          year: event.startDate.slice(0, 4),
          title: event.name,
          description: event.description ?? 'Historical market event.',
          impact: formatEventCategory(event.category),
          href: `/historical/${encodeURIComponent(event.id)}`,
          analysisText
        }
      })
    : []

  const chartPoints = history && history.length > 1
    ? history.map((candle) => candle.close)
    : null
  const chartPath = chartPoints ? buildChartPath(chartPoints) : ''
  const chartState = historyError
    ? 'error'
    : isHistoryLoading
      ? 'loading'
      : chartPath
        ? 'ready'
        : 'empty'

  return (
    <div className="overflow-x-hidden py-8 lg:py-10">
      <Container maxWidth="2xl" className="space-y-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
          >
            ← Back
          </button>
          <Link
            to="/dashboard"
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
          >
            Dashboard
          </Link>
        </div>

        <section className="space-y-6 rounded-3xl border border-border bg-surface/40 p-5 shadow-border sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-text-tertiary">
                <span className="rounded-full border border-border bg-background px-3 py-1 text-analytics">
                  Premium Stock Workspace
                </span>
                <span>{isQuoteLoading ? 'Loading market quote' : quote ? 'Live quote data' : 'Authentic data loading...'}</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
                  {displayName}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base">
                  <span className="rounded-full border border-border bg-background px-3 py-1 font-medium text-text-primary">
                    {displaySymbol}
                  </span>
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-text-secondary">
                    {displayExchange}
                  </span>
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-text-secondary">
                    {sector}
                  </span>
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-text-secondary">
                    {industry}
                  </span>
                </div>
              </div>

              <p className="max-w-3xl text-base leading-relaxed text-text-secondary sm:text-lg">
                {description}
              </p>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-2 xl:max-w-[30rem] xl:grid-cols-3">
              {headerDetails.map((item) => (
                <Card key={item.label} className="min-w-0 space-y-2 p-4 transition-transform duration-fast ease-standard hover:-translate-y-0.5 hover:border-border-strong">
                  <p className="text-xs uppercase tracking-[0.22em] text-text-tertiary">{item.label}</p>
                  <p className="break-words text-sm font-medium text-text-primary">{item.value}</p>
                </Card>
              ))}
            </div>
          </div>

          {quoteError ? (
            <p className="text-sm text-error">
              Latest quote unavailable. Displaying incomplete snapshot. {quoteError}
            </p>
          ) : null}

        </section>

        <section className="grid gap-6 xl:grid-cols-4">
          {summaryMetrics.map((metric) => (
            <Card key={metric.label} className="space-y-2 p-5 transition-transform duration-fast ease-standard hover:-translate-y-1 hover:border-border-strong">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.22em] text-text-tertiary">{metric.label}</p>
                {metric.trend && (
                  <span
                    className={`text-xs font-medium ${Number(metric.trend) >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {Number(metric.trend) > 0 ? '↑' : '↓'}
                  </span>
                )}
              </div>
              <p className="text-2xl font-semibold tracking-tight text-text-primary">{metric.value}</p>
              <p className="text-sm text-text-secondary">{metric.helper}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card variant="elevated" className="space-y-5 p-6 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
              <div className="space-y-2">
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-text-secondary">
                  Interactive Chart
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
                  10-Year Price History
                </h2>
              </div>
              <div className="flex gap-2">
                {timeFilters.map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setActiveTimeFilter(tf)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      activeTimeFilter === tf
                        ? 'bg-surface text-text-primary shadow-border'
                        : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative mt-8 h-[22rem] w-full lg:h-[26rem]">
              {chartState === 'loading' ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-text-secondary">Loading dynamic price history...</p>
                </div>
              ) : chartState === 'error' ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-error">History unavailable. {historyError}</p>
                </div>
              ) : chartState === 'ready' ? (
                <svg
                  viewBox="0 0 960 420"
                  className="h-full w-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="chart-gradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-analytics)" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="var(--color-analytics)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  <path
                    d={`${chartPath} L 960 420 L 0 420 Z`}
                    fill="url(#chart-gradient)"
                  />
                  <path
                    d={chartPath}
                    fill="none"
                    stroke="var(--color-analytics)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-text-secondary">
                    No historical data is available for this stock and time range.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card variant="elevated" className="space-y-5 p-6 lg:p-8">
            <div className="space-y-2 border-b border-border pb-4">
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-text-secondary">
                Historical Event Timeline
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
                Market events that shaped the stock
              </h2>
            </div>

              <div className="relative pl-4 sm:pl-6">
              <div className="absolute left-2.5 top-2 bottom-2 w-px bg-border" />
              {isEventsLoading ? (
                <p className="mb-4 text-sm text-text-secondary">Loading historical events...</p>
              ) : null}
              {eventsError ? (
                <p className="mb-4 text-sm text-error">
                  Historical events are unavailable. {eventsError}
                </p>
              ) : null}
              {selectedEventStatus === 'NOT_LISTED' ? (
                <p className="mb-4 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-text-secondary">
                  {selectedEventMessage ?? 'This company was not publicly listed during the selected event.'}
                </p>
              ) : null}
              {selectedEventStatus === 'NO_DATA' ? (
                <p className="mb-4 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-text-secondary">
                  {selectedEventMessage ?? 'Historical data is incomplete for the selected event.'}
                </p>
              ) : null}
              {timelineEvents.length > 0 ? (
                <div className="space-y-4">
                  {timelineEvents.map((event) => (
                    <Link
                      key={event.year + event.title}
                      to={event.href}
                      state={{ symbol: marketSymbol }}
                      className="group relative block cursor-pointer rounded-2xl border border-border bg-background/60 p-4 shadow-border transition-transform duration-fast ease-standard hover:-translate-y-1 hover:border-border-strong hover:shadow-raised"
                    >
                      <span className="absolute -left-[1.55rem] top-5 h-3 w-3 rounded-full bg-analytics ring-4 ring-background" />

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{event.year}</p>
                          <h3 className="mt-1 text-base font-semibold text-text-primary">{event.title}</h3>
                        </div>

                        <span className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-text-tertiary transition-colors group-hover:border-border-strong group-hover:text-text-primary">
                          {event.impact}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-text-secondary">{event.description}</p>
                      {event.analysisText && (
                        <p className={`mt-2 text-sm font-medium ${event.analysisText.startsWith('Recovered') ? 'text-green-500' : 'text-red-500'}`}>{event.analysisText}</p>
                      )}

                      <div className="mt-4 flex items-center justify-end text-sm font-medium text-analytics opacity-0 transition-opacity duration-fast group-hover:opacity-100">
                        View Analysis →
                      </div>
                    </Link>
                  ))}
                </div>
              ) : !isEventsLoading ? (
                <p className="text-sm text-text-secondary">No timeline events available for this stock.</p>
              ) : null}
            </div>
          </Card>

          <div className="space-y-6">
            <Card variant="glass" className="space-y-5 p-6 lg:p-8">
              <div className="space-y-2 border-b border-border pb-4">
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-text-secondary">
                  Analytics Summary
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
                  Dynamic risk and recovery metrics
                </h2>
                {events && events.length > 0 && <p className="text-sm text-text-secondary">Based on most recent event: {events[0].name}</p>}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {analyticsCards.map((metric) => (
                  <Card key={metric.label} className="space-y-2 p-4 transition-transform duration-fast ease-standard hover:-translate-y-1 hover:border-border-strong">
                    <p className="text-xs uppercase tracking-[0.22em] text-text-tertiary">{metric.label}</p>
                    <p className="text-2xl font-semibold tracking-tight text-text-primary">{metric.value}</p>
                  </Card>
                ))}
              </div>
            </Card>

            <Card variant="elevated" className="space-y-4 p-6 lg:p-8">
              <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-text-secondary">
                    Snapshot Notes
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">
                    Workbench summary
                  </h2>
                </div>
                <span className="rounded-full border border-border bg-background px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-text-tertiary">
                  Dynamic
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Stock', value: displaySymbol },
                  { label: 'Exchange', value: displayExchange },
                  { label: 'Sector', value: sector },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border bg-surface/50 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-text-tertiary">{item.label}</p>
                    <p className="mt-2 text-sm font-medium text-text-primary">{item.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>
      </Container>
    </div>
  )
}

export { AnalysisPage }
