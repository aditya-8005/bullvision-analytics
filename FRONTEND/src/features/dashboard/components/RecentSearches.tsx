import { forwardRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-text-tertiary">
      <path
        d="M21 21l-4.3-4.3m1.8-5.2a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export const RecentSearches = forwardRef<HTMLInputElement>(function RecentSearches(_props, ref) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('bv_recent_searches')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return []
      }
    }
    return ['RELIANCE', 'TCS', 'INFY']
  })

  const saveSearch = (term: string) => {
    const termUpper = term.toUpperCase()
    const updated = [termUpper, ...recentSearches.filter((t) => t !== termUpper)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('bv_recent_searches', JSON.stringify(updated))
  }

  const handleAnalyzeStock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const symbol = searchQuery.trim().toUpperCase()
    if (!symbol) return

    saveSearch(symbol)
    navigate(`/analysis/${symbol}`)
  }

  return (
    <>
      <form
        className="space-y-4 rounded-2xl border border-border bg-background/60 p-4 shadow-border"
        onSubmit={handleAnalyzeStock}
      >
        <label className="flex items-center gap-3 text-text-secondary">
          <SearchIcon />
          <input
            ref={ref}
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search NSE / BSE stocks..."
            className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs uppercase tracking-[0.22em] text-text-tertiary">
            Press Enter to open the workspace
          </p>
          <Button type="submit" className="w-full sm:w-auto">
            Analyze Stock
          </Button>
        </div>
      </form>

      {recentSearches.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-medium text-text-secondary">Recent Searches</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {recentSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setSearchQuery(item)
                  saveSearch(item)
                  navigate(`/analysis/${item}`)
                }}
                className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-text-primary transition-colors hover:border-border-strong hover:bg-surface-elevated"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
})
