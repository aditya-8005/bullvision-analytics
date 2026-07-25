import type { Holding } from '../../../services/portfolioService'
import { Button } from '../../../components/ui/Button'

interface PortfolioTableProps {
  holdings: Holding[]
  onEdit: (holding: Holding) => void
  onDelete: (holding: Holding) => void
}

export function PortfolioTable({ holdings, onEdit, onDelete }: PortfolioTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface/50 shadow-border">
      <table className="min-w-[52rem] w-full text-left text-sm text-text-secondary">
        <thead className="bg-background/80 text-xs uppercase tracking-wider text-text-tertiary">
          <tr>
            <th className="px-4 py-4 font-medium sm:px-6">Symbol</th>
            <th className="px-4 py-4 font-medium sm:px-6">Exchange</th>
            <th className="px-4 py-4 font-medium text-right sm:px-6">Qty</th>
            <th className="px-4 py-4 font-medium text-right sm:px-6">Avg Price</th>
            <th className="px-4 py-4 font-medium text-right sm:px-6">Invested</th>
            <th className="px-4 py-4 font-medium sm:px-6">Date</th>
            <th className="px-4 py-4 font-medium text-center sm:px-6">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {holdings.map((holding) => {
            const invested = holding.quantity * holding.averageBuyPrice
            const date = new Date(holding.purchaseDate).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
            return (
              <tr key={holding.id} className="transition-colors hover:bg-surface-elevated">
                <td className="whitespace-nowrap px-4 py-4 font-medium text-text-primary sm:px-6">
                  {holding.symbol}
                </td>
                <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                  <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium tracking-wide text-text-primary">
                    {holding.exchange}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-right sm:px-6">
                  {holding.quantity}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-right sm:px-6">
                  ₹{holding.averageBuyPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-right sm:px-6">
                  ₹{invested.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                  {date}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-center sm:px-6">
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" className="min-h-10 px-3 py-2 text-xs" onClick={() => onEdit(holding)}>
                      Edit
                    </Button>
                    <Button variant="ghost" className="min-h-10 px-3 py-2 text-xs text-error hover:text-error-strong" onClick={() => onDelete(holding)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
