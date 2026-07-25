import { api, getResponseData } from './api'

export type Exchange = 'NSE' | 'BSE'

export interface Holding {
  id: string
  user: string
  symbol: string
  exchange: Exchange
  quantity: number
  averageBuyPrice: number
  purchaseDate: string
  notes: string
  createdAt: string
  updatedAt: string
}

export interface AddHoldingInput {
  symbol: string
  exchange: Exchange
  quantity: number
  averageBuyPrice: number
  purchaseDate: string
  notes?: string
}

export interface UpdateHoldingInput {
  quantity?: number
  averageBuyPrice?: number
  purchaseDate?: string
  notes?: string
}

export interface HoldingResponse {
  success: true
  message: string
  holding: Holding
}

export interface PortfolioResponse {
  success: true
  holdings: Holding[]
}

export interface DeleteHoldingResponse {
  success: true
  message: string
}

export async function addHolding(input: AddHoldingInput): Promise<HoldingResponse> {
  return getResponseData(api.post<HoldingResponse>('/portfolio', input))
}

// The current backend requires a path parameter even though it derives the
// portfolio owner from the JWT and returns all of that user's holdings.
export async function getPortfolio(routeId: string): Promise<PortfolioResponse> {
  return getResponseData(api.get<PortfolioResponse>(`/portfolio/${encodeURIComponent(routeId)}`))
}

export async function updateHolding(
  holdingId: string,
  input: UpdateHoldingInput,
): Promise<HoldingResponse> {
  return getResponseData(api.put<HoldingResponse>(`/portfolio/${encodeURIComponent(holdingId)}`, input))
}

export async function deleteHolding(holdingId: string): Promise<DeleteHoldingResponse> {
  return getResponseData(api.delete<DeleteHoldingResponse>(`/portfolio/${encodeURIComponent(holdingId)}`))
}
