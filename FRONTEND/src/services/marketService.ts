import { api, getResponseData } from './api'

export interface ApiEnvelope<T> {
  success: boolean
  message?: string
  data: T
}

export interface Instrument {
  name: string
  symbol: string
  exch_seg: string
  token: string
  [key: string]: unknown
}

export interface HistoricalCandle {
  date: string
  open: number | null
  high: number | null
  low: number | null
  close: number
  volume: number | null
}

export interface MarketQuote {
  symbol: string
  tradingSymbol: string
  exchange: string
  price: number
  open: number
  high: number
  low: number
  previousClose: number
  change: number
  changePercent: number
  averagePrice: number
  volume: number
  lastTradeQuantity: number
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
  lowerCircuit: number
  upperCircuit: number
  totalBuyQuantity: number
  totalSellQuantity: number
  marketDepth: unknown
  exchangeFeedTime: string
  exchangeTradeTime: string
  profile?: {
    sector: string
    industry: string
    description: string
    marketCap: number | null
    dividendYield: number | null
    peRatio: number | null
  } | null
}

export interface SearchStocksResponse extends ApiEnvelope<Instrument[]> {
  count: number
}

export interface HistoryResponse extends ApiEnvelope<HistoricalCandle[]> {
  count: number
}

export interface HistoryParams {
  symbol: string
  from?: string
  to?: string
  range?: string
}

export async function searchStocks(query: string): Promise<SearchStocksResponse> {
  return getResponseData(api.get<SearchStocksResponse>('/market/search', { params: { q: query } }))
}

export async function getQuote(symbol: string): Promise<ApiEnvelope<MarketQuote>> {
  return getResponseData(api.get<ApiEnvelope<MarketQuote>>('/market/quote', { params: { symbol } }))
}

export async function getHistory(params: HistoryParams): Promise<HistoryResponse> {
  return getResponseData(api.get<HistoryResponse>('/market/history', { params }))
}

export async function getHistoricalPrice(
  symbol: string,
  date: string,
): Promise<ApiEnvelope<HistoricalCandle>> {
  return getResponseData(
    api.get<ApiEnvelope<HistoricalCandle>>('/market/price', { params: { symbol, date } }),
  )
}
