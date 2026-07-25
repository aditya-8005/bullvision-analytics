import type { Instrument } from '../../services/marketService'

type SearchResultProps = {
  instrument: Instrument
  onSelect: (instrument: Instrument) => void
}

function SearchResult({ instrument, onSelect }: SearchResultProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected="false"
      onClick={() => onSelect(instrument)}
      className="flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-left transition-colors hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-analytics/50"
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-text-primary">{instrument.name}</span>
        <span className="mt-1 block text-xs text-text-secondary">{instrument.symbol}</span>
      </span>
      <span className="shrink-0 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-text-secondary">
        {instrument.exch_seg}
      </span>
    </button>
  )
}

export { SearchResult }
