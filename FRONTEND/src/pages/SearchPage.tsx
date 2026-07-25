import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { searchStocks, type Instrument } from '../services/marketService'

const popularStocks = [
  'RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK',
  'SBIN', 'ITC', 'LT', 'ASIANPAINT', 'BAJFINANCE',
]

export function SearchPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Instrument[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('bv_recent_searches')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return []
      }
    }
    return []
  })

  useEffect(() => {
    if (!searchQuery.trim()) {
      const t = setTimeout(() => setSearchResults([]), 0)
      return () => clearTimeout(t)
    }

    const timer = setTimeout(() => {
      let isCurrent = true
      setIsSearching(true)
      searchStocks(searchQuery.trim())
        .then((res) => {
          if (isCurrent) {
            setSearchResults(res.data)
            setIsSearching(false)
          }
        })
        .catch(() => {
          if (isCurrent) {
            setSearchResults([])
            setIsSearching(false)
          }
        })

      return () => {
        isCurrent = false
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (searchResults.length > 0) {
      handleQuickSearch(searchResults[0].symbol.replace('-EQ', ''))
    } else {
      const symbol = searchQuery.trim().toUpperCase()
      if (!symbol) return
      handleQuickSearch(symbol)
    }
  }

  const handleQuickSearch = (symbol: string) => {
    const normalized = symbol.replace('-EQ', '').toUpperCase()
    const existing = JSON.parse(localStorage.getItem('bv_recent_searches') ?? '[]') as string[]
    const updated = [normalized, ...existing.filter((t: string) => t !== normalized)].slice(0, 5)
    localStorage.setItem('bv_recent_searches', JSON.stringify(updated))

    navigate(`/analysis/${normalized}`)
  }

  return (
    <div className="overflow-x-hidden py-8 lg:py-10">
      <Container maxWidth="2xl" className="space-y-8">
        <section className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-text-secondary">
              Stock Search
            </p>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              Search NSE Stocks
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-text-secondary">
              Enter a company name or stock symbol to open its analysis workspace.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
          >
            ← Back to Dashboard
          </Link>
        </section>

        <Card variant="glass" className="space-y-6 p-6 lg:p-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <label className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4 shadow-border relative">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-text-tertiary">
                <path
                  d="M21 21l-4.3-4.3m1.8-5.2a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <input
                id="search-input"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter company name or symbol (e.g., Tata, Infosys, RELIANCE)..."
                className="w-full bg-transparent text-base text-text-primary outline-none placeholder:text-text-tertiary"
                autoFocus
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                   <div className="h-4 w-4 animate-spin rounded-full border-2 border-analytics border-t-transparent"></div>
                </div>
              )}
            </label>

            {searchResults.length > 0 && (
              <div className="rounded-xl border border-border bg-surface p-2 shadow-sm">
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">Results</p>
                <div className="flex flex-col gap-1 max-h-80 overflow-y-auto">
                  {searchResults.map(result => (
                     <button
                       key={result.token}
                       type="button"
                       onClick={() => handleQuickSearch(result.symbol.replace('-EQ', ''))}
                       className="flex items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface-elevated hover:text-text-primary"
                     >
                        <div>
                          <p className="text-sm font-medium text-text-primary">{result.name}</p>
                          <p className="text-xs text-text-secondary">{result.symbol.replace('-EQ', '')} • {result.exch_seg}</p>
                        </div>
                     </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
              <p className="text-xs uppercase tracking-[0.22em] text-text-tertiary">
                Press Enter or click Analyze to open the top result
              </p>
              <Button type="submit" className="w-full sm:w-auto" disabled={!searchQuery.trim()}>
                Analyze Stock
              </Button>
            </div>
          </form>

          {!searchQuery && recentSearches.length > 0 && (
            <div>
              <p className="text-sm font-medium text-text-secondary">Recent Searches</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {recentSearches.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleQuickSearch(item)}
                    className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-text-primary transition-colors hover:border-border-strong hover:bg-surface-elevated"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!searchQuery && (
            <div>
              <p className="text-sm font-medium text-text-secondary">Popular Stocks</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {popularStocks.map((symbol) => (
                  <button
                    key={symbol}
                    type="button"
                    onClick={() => handleQuickSearch(symbol)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-text-primary transition-colors hover:border-analytics hover:bg-analytics/10 hover:text-analytics"
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>
      </Container>
    </div>
  )
}
