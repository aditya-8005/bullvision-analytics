import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../../services/api'
import { searchStocks, type Instrument } from '../../services/marketService'
import { SearchDropdown } from './SearchDropdown'

const SEARCH_DEBOUNCE_MS = 300

function StockSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Instrument[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      return undefined
    }

    let isCurrentRequest = true
    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await searchStocks(trimmedQuery)

        if (isCurrentRequest) {
          setResults(response.data)
        }
      } catch (requestError) {
        if (isCurrentRequest) {
          setResults([])
          setError(
            requestError instanceof ApiError ? requestError.message : 'Unable to search stocks.',
          )
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false)
        }
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      isCurrentRequest = false
      window.clearTimeout(timeoutId)
    }
  }, [query])

  function handleSelect(instrument: Instrument) {
    setQuery('')
    setResults([])
    const baseSymbol = instrument.symbol.replace('-EQ', '')
    navigate(`/analysis/${encodeURIComponent(baseSymbol)}`)
  }

  const isOpen = query.trim().length > 0

  return (
    <div className="relative w-full min-w-0 sm:max-w-md">
      <label htmlFor="stock-search" className="sr-only">
        Search stocks to analyze
      </label>
      <div className="flex min-h-11 items-center rounded-xl border border-border bg-surface/80 shadow-border transition focus-within:border-border-strong focus-within:shadow-glow">
        <span aria-hidden="true" className="ml-4 text-analytics">
          ⌕
        </span>
        <input
          id="stock-search"
          type="search"
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value
            setQuery(nextQuery)
            setResults([])
            setError(null)

            if (!nextQuery.trim()) {
              setIsLoading(false)
            }
          }}
          placeholder="Search a stock to analyze"
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls={isOpen ? 'stock-search-results' : undefined}
          className="w-full bg-transparent px-3 py-3 text-sm text-text-primary outline-none placeholder:text-text-tertiary"
        />
      </div>

      {isOpen ? (
        <div id="stock-search-results">
          <SearchDropdown
            query={query.trim()}
            results={results}
            isLoading={isLoading}
            error={error}
            onSelect={handleSelect}
          />
        </div>
      ) : null}
    </div>
  )
}

export { StockSearch }
