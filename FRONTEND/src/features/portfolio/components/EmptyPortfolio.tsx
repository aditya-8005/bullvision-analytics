import { Button } from '../../../components/ui/Button'

interface EmptyPortfolioProps {
  onAddFirst: () => void
}

export function EmptyPortfolio({ onAddFirst }: EmptyPortfolioProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/30 p-6 text-center shadow-border sm:p-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface text-text-tertiary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-8 w-8" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
      <h3 className="mt-6 text-xl font-semibold text-text-primary">No holdings yet</h3>
      <p className="mt-2 max-w-sm text-sm text-text-secondary">
        Get started by adding your first stock holding to track your portfolio performance.
      </p>
      <div className="mt-8 w-full sm:w-auto">
        <Button onClick={onAddFirst} variant="primary" className="w-full sm:w-auto">
          Add your first holding
        </Button>
      </div>
    </div>
  )
}
