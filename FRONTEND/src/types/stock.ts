export interface Stock {
  symbol: string
  name: string

  exchange: string
  sector: string
  industry: string

  currentPrice: string
  change: string
  changePercent: string

  marketCap: string
  peRatio: string
  dividendYield: string

  high52Week: string
  low52Week: string

  lastUpdated: string

  description: string
}