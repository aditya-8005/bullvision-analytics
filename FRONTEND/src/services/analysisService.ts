import { api, getResponseData } from './api'
import type { HistoricalEvent } from './eventService'
import type { HistoricalCandle } from './marketService'
import type { ApiEnvelope } from './marketService'

export interface EventAnalysis {
  symbol: string
  event: HistoricalEvent
  status: 'SUCCESS' | 'NOT_LISTED' | 'NO_DATA'
  message: string | null
  history: HistoricalCandle[]
  analytics?: {
    returns: Record<string, unknown>
    statistics: Record<string, unknown>
    drawdown: Record<string, unknown>
    volatility: Record<string, unknown>
    recovery: Record<string, unknown>
    relativePerformance: Record<string, unknown> | null
    scores: Record<string, unknown>
    insights: Record<string, unknown>
  }
}

export async function getEventAnalysis(
  symbol: string,
  eventId: string,
): Promise<ApiEnvelope<EventAnalysis>> {
  return getResponseData(
    api.get<ApiEnvelope<EventAnalysis>>(
      `/api/event-analysis/${encodeURIComponent(symbol)}/${encodeURIComponent(eventId)}`,
    ),
  )
}
export async function getAllEventAnalytics(
  symbol: string,
): Promise<ApiEnvelope<EventAnalysis[]>> {
  return getResponseData(
    api.get<ApiEnvelope<EventAnalysis[]>>(
      `/api/event-analysis/${encodeURIComponent(symbol)}/all`,
    ),
  )
}
