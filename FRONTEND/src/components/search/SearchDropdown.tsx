import type { Instrument } from '../../services/marketService'
import { SearchResult } from './SearchResult'
import { BullVisionIcon } from '../branding/BullVisionMark'

type SearchDropdownProps = {
  query: string
  results: Instrument[]
  isLoading: boolean
  error: string | null
  onSelect: (instrument: Instrument) => void
}

function SearchDropdown({ query, results, isLoading, error, onSelect }: SearchDropdownProps) {
  return (
    <div
      role="listbox"
      aria-label="Stock search results"
      className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 max-h-80 overflow-y-auto overflow-x-hidden rounded-2xl border border-border-strong bg-surface-overlay p-2 shadow-raised backdrop-blur-xl supports-[backdrop-filter]:bg-surface-overlay sm:max-h-96"
    >
      {isLoading ? (
        <div className="flex items-center gap-3 px-4 py-3 text-sm text-text-secondary">
          <BullVisionIcon animated surface={false} className="h-4 w-4 shrink-0" />
          Searching stocks…
        </div>
      ) : null}

      {!isLoading && error ? <p className="px-4 py-3 text-sm text-error">{error}</p> : null}

      {!isLoading && !error && results.length === 0 ? (
        <p className="px-4 py-3 text-sm text-text-secondary">No results for “{query}”.</p>
      ) : null}

      {!isLoading && !error
        ? results.map((instrument) => (
            <SearchResult
              key={`${instrument.exch_seg}-${instrument.symbol}`}
              instrument={instrument}
              onSelect={onSelect}
            />
          ))
        : null}
    </div>
  )
}

export { SearchDropdown }
