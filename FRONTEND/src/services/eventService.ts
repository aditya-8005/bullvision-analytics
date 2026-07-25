import { api, getResponseData } from './api'
import type { ApiEnvelope } from './marketService'

export interface HistoricalEvent {
  id: string
  name: string
  category: string
  country: string
  startDate: string
  endDate: string
  description: string | null
  [key: string]: unknown
}

export async function getEvents(): Promise<ApiEnvelope<HistoricalEvent[]>> {
  return getResponseData(api.get<ApiEnvelope<HistoricalEvent[]>>('/events'))
}

export async function getEvent(id: string): Promise<ApiEnvelope<HistoricalEvent>> {
  return getResponseData(api.get<ApiEnvelope<HistoricalEvent>>(`/events/${encodeURIComponent(id)}`))
}

export async function getCategoryEvents(category: string): Promise<ApiEnvelope<HistoricalEvent[]>> {
  return getResponseData(
    api.get<ApiEnvelope<HistoricalEvent[]>>(`/events/category/${encodeURIComponent(category)}`),
  )
}
