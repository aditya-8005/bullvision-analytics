import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import {
  HistoricalInsightsPanel,
  HistoricalMetricsGrid,
  HistoricalPageHeader,
  HistoricalSummaryCards,
  HistoricalPerformanceChart,
} from '../components/historical'
import { getEventAnalysis, type EventAnalysis } from '../services/analysisService'
import { ApiError } from '../services/api'
import { getEvent, type HistoricalEvent } from '../services/eventService'

function toErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {}
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function asStrings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

function formatPercentage(value: number | null) {
  return value === null ? '—' : `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

function formatEventCategory(category: string) {
  return category
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ')
}

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

function HistoricalEventPage() {
  const { eventId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const targetSymbol = location.state?.symbol || 'UNKNOWN'

  const [event, setEvent] = useState<HistoricalEvent | null>(null)
  const [analysis, setAnalysis] = useState<EventAnalysis | null>(null)
  const [isEventLoading, setIsEventLoading] = useState(true)
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false)
  const [eventError, setEventError] = useState<string | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  useEffect(() => {
    let isCurrentRequest = true

    async function loadEvent() {
      if (!eventId) {
        setEventError('No historical event was selected.')
        setIsEventLoading(false)
        return
      }

      try {
        const eventResponse = await getEvent(eventId)

        if (!isCurrentRequest) {
          return
        }

        setEvent(eventResponse.data)
        setIsAnalysisLoading(true)

        try {
          if (targetSymbol !== 'UNKNOWN') {
             const analysisResponse = await getEventAnalysis(targetSymbol, eventResponse.data.id)
             if (isCurrentRequest) {
               setAnalysis(analysisResponse.data)
             }
          }
        } catch (error) {
          if (isCurrentRequest) {
            setAnalysisError(toErrorMessage(error, 'Unable to load event analytics.'))
          }
        } finally {
          if (isCurrentRequest) {
            setIsAnalysisLoading(false)
          }
        }
      } catch (error) {
        if (isCurrentRequest) {
          setEventError(toErrorMessage(error, 'Unable to load historical event details.'))
        }
      } finally {
        if (isCurrentRequest) {
          setIsEventLoading(false)
        }
      }
    }

    void loadEvent()

    return () => {
      isCurrentRequest = false
    }
  }, [eventId, targetSymbol])

  const analytics = analysis?.analytics || ({} as NonNullable<EventAnalysis['analytics']>)
  const drawdown = asRecord(analytics.drawdown)
  const recovery = asRecord(analytics.recovery)
  const volatility = asRecord(analytics.volatility)
  const returns = asRecord(analytics.returns)
  const insightData = asRecord(analytics.insights)
  const isAnalysisReady = analysis?.status === 'SUCCESS' && Boolean(analysis.analytics)
  const analysisStatusMessage = analysis?.status === 'NOT_LISTED'
    ? analysis.message ?? 'This company was not publicly listed during this historical event.'
    : analysis?.status === 'NO_DATA'
      ? analysis.message ?? 'Historical data is incomplete for this event window.'
      : null

  const dynamicSummaryCards = [
    {
      label: 'Event Category',
      value: event ? formatEventCategory(event.category) : '—',
      description: event?.description ?? 'Market event context loaded from BullVision.',
    },
    {
      label: 'Maximum Drawdown',
      value: isAnalysisReady ? formatPercentage(asNumber(drawdown.drawdownPercentage)) : '—',
      description: 'Peak-to-trough decline calculated for the selected event window.',
    },
    {
      label: 'Recovery Duration',
      value: isAnalysisReady ? (asNumber(recovery.recoveryDays) === null ? 'Not recovered' : `${recovery.recoveryDays} days`) : '—',
      description: 'Trading days required to recover to the pre-drawdown peak.',
    },
  ]

  const dynamicMetrics = [
    {
      label: 'Pre-Event Price',
      value: isAnalysisReady ? inrFormatter.format(asNumber(returns.startPrice) ?? 0) : '—',
      description: 'Price immediately before the event impact.',
    },
    {
      label: 'Lowest Price',
      value: isAnalysisReady ? inrFormatter.format(asNumber(asRecord(drawdown.bottom).price) ?? 0) : '—',
      description: 'Minimum price reached during the event window.',
    },
    {
      label: 'Maximum Drawdown',
      value: isAnalysisReady ? formatPercentage(asNumber(drawdown.drawdownPercentage)) : '—',
      description: 'Peak-to-trough decline during the selected event window.',
    },
    {
      label: 'Recovery Date',
      value: isAnalysisReady ? (recovery.recoveryDate ? String(recovery.recoveryDate) : 'Not recovered') : '—',
      description: 'Date when the stock fully recovered its pre-event price.',
    },
    {
      label: 'Recovery Time',
      value: isAnalysisReady ? (asNumber(recovery.recoveryDays) === null ? 'Not recovered' : `${recovery.recoveryDays} days`) : '—',
      description: 'Time required to regain the event-window peak.',
    },
    {
      label: 'Volatility',
      value: isAnalysisReady ? formatPercentage(asNumber(volatility.volatility)) : '—',
      description: 'Average daily price volatility during the event window.',
    },
    {
      label: 'Event Return',
      value: isAnalysisReady ? formatPercentage(asNumber(returns.percentageReturn)) : '—',
      description: 'Total return between the first and final event-window sessions.',
    },
  ]

  const dynamicInsights = analysis
    ? [asRecord(analytics.insights).summary, ...asStrings(insightData.strengths), ...asStrings(insightData.weaknesses)].filter(
        (insight): insight is string => typeof insight === 'string',
      )
    : []

  const eventName = event?.name ?? 'Loading...'
  const eventDateRange = event ? `${event.startDate} - ${event.endDate}` : '—'
  const eventImpact = event ? formatEventCategory(event.category) : '—'

  return (
    <div className="overflow-x-hidden py-8 lg:py-10">
      <Container maxWidth="2xl" className="space-y-8">
        <HistoricalPageHeader
          eventName={eventName}
          subtitle={event ? `${event.country} Market Event` : 'Global Market Event'}
          dateRange={eventDateRange}
          impactLabel={eventImpact}
          onBack={() => navigate(-1)}
          backLabel="Back to analysis"
          description={event?.description ?? undefined}
        />

        {isEventLoading ? <p className="text-sm text-text-secondary">Loading historical event details...</p> : null}
        {eventError ? (
          <p className="text-sm text-error">
            Event details are unavailable. {eventError}
          </p>
        ) : null}
        {isAnalysisLoading ? <p className="text-sm text-text-secondary">Loading event analytics...</p> : null}
        {analysisError ? (
          <p className="text-sm text-error">
            Event analytics are unavailable. {analysisError}
          </p>
        ) : null}
        {analysisStatusMessage ? (
          <div className="rounded-xl border border-warning/50 bg-warning/10 p-6 text-center shadow-sm">
            <h3 className="text-lg font-medium text-text-primary">
              {analysis?.status === 'NOT_LISTED' ? 'Company Not Listed' : 'Historical Data Unavailable'}
            </h3>
            <p className="mt-2 text-text-secondary">{analysisStatusMessage}</p>
          </div>
        ) : null}

        {isAnalysisReady ? (
          <>
            <HistoricalSummaryCards cards={dynamicSummaryCards} />

            {analysis.history.length > 0 && (
              <HistoricalPerformanceChart
                title={`${targetSymbol} Performance`}
                subtitle="Historical Event Simulation"
                points={analysis.history.map(c => c.close)}
                phases={[
                  { label: 'Pre-Event', description: 'Market conditions before impact.', startIndex: 0, endIndex: Math.floor(analysis.history.length * 0.1) },
                  { label: 'Event Impact', description: 'Core duration of the market event.', startIndex: Math.floor(analysis.history.length * 0.1), endIndex: Math.floor(analysis.history.length * 0.6) },
                  { label: 'Recovery', description: 'Post-event market stabilization.', startIndex: Math.floor(analysis.history.length * 0.6), endIndex: analysis.history.length - 1 }
                ]}
                markers={[
                  { label: 'Peak Drawdown', description: 'Lowest point during event', index: Math.floor(analysis.history.length * 0.4) }
                ]}
              />
            )}

            <HistoricalMetricsGrid
              title="Key Metrics"
              subtitle={analysis ? 'Event-window analytics' : 'Risk and recovery'}
              metrics={dynamicMetrics}
            />

            {dynamicInsights.length > 0 && (
              <HistoricalInsightsPanel
                title="Key Insights"
                subtitle={analysis ? 'Event analysis insights' : 'Analyst notes'}
                insights={dynamicInsights}
              />
            )}
          </>
        ) : null}
      </Container>
    </div>
  )
}

export { HistoricalEventPage }
