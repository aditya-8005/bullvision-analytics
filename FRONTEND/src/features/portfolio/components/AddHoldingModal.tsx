import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../../../components/ui/Button'
import type { AddHoldingInput, Exchange } from '../../../services/portfolioService'

interface AddHoldingModalProps {
  isOpen: boolean
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (input: AddHoldingInput) => void
}

export function AddHoldingModal({ isOpen, isSubmitting, onClose, onSubmit }: AddHoldingModalProps) {
  const [symbol, setSymbol] = useState('')
  const [exchange, setExchange] = useState<Exchange>('NSE')
  const [quantity, setQuantity] = useState('')
  const [averageBuyPrice, setAverageBuyPrice] = useState('')
  const [purchaseDate, setPurchaseDate] = useState('')
  const [notes, setNotes] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({
      symbol: symbol.toUpperCase(),
      exchange,
      quantity: Number(quantity),
      averageBuyPrice: Number(averageBuyPrice),
      purchaseDate,
      notes,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm sm:items-center">
      <div className="my-8 max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-surface p-5 shadow-glow sm:p-6">
        <h3 className="text-xl font-semibold text-text-primary">Add Holding</h3>
        <p className="mt-1 text-sm text-text-secondary">Enter the details of your stock purchase.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary">Symbol</label>
            <input
              type="text"
              required
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-analytics focus:ring-1 focus:ring-analytics"
              placeholder="e.g. RELIANCE"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary">Exchange</label>
            <select
              value={exchange}
              onChange={(e) => setExchange(e.target.value as Exchange)}
              className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-analytics focus:ring-1 focus:ring-analytics"
            >
              <option value="NSE">NSE</option>
              <option value="BSE">BSE</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-text-secondary">Quantity</label>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-analytics focus:ring-1 focus:ring-analytics"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary">Avg Buy Price</label>
              <input
                type="number"
                required
                min="0"
                step="any"
                value={averageBuyPrice}
                onChange={(e) => setAverageBuyPrice(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-analytics focus:ring-1 focus:ring-analytics"
                placeholder="2500.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary">Purchase Date</label>
            <input
              type="date"
              required
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-analytics focus:ring-1 focus:ring-analytics"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none focus:border-analytics focus:ring-1 focus:ring-analytics"
              placeholder="e.g. Long term hold"
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting} className="w-full sm:w-auto">
              Save Holding
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
