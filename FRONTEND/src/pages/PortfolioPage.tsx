import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { getPortfolio, addHolding, updateHolding, deleteHolding } from '../services/portfolioService'
import type { Holding, AddHoldingInput, UpdateHoldingInput } from '../services/portfolioService'
import { PortfolioSummary } from '../features/portfolio/components/PortfolioSummary'
import { PortfolioTable } from '../features/portfolio/components/PortfolioTable'
import { EmptyPortfolio } from '../features/portfolio/components/EmptyPortfolio'
import { AddHoldingModal } from '../features/portfolio/components/AddHoldingModal'
import { EditHoldingModal } from '../features/portfolio/components/EditHoldingModal'
import { DeleteHoldingDialog } from '../features/portfolio/components/DeleteHoldingDialog'
import { BullVisionLoader } from '../components/branding/BullVisionMark'

export function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null)
  const [deletingHolding, setDeletingHolding] = useState<Holding | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchPortfolio = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Using 'me' as placeholder routeId since the backend derives the user from the JWT
      const response = await getPortfolio('me')
      setHoldings(response.holdings)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load portfolio.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPortfolio()
  }, [])

  const handleAddHolding = async (input: AddHoldingInput) => {
    setIsSubmitting(true)
    try {
      const response = await addHolding(input)
      setHoldings((prev) => [...prev, response.holding])
      setIsAddModalOpen(false)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to add holding.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditHolding = async (id: string, input: UpdateHoldingInput) => {
    setIsSubmitting(true)
    try {
      const response = await updateHolding(id, input)
      setHoldings((prev) => prev.map((h) => (h.id === id ? response.holding : h)))
      setEditingHolding(null)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update holding.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteHolding = async (id: string) => {
    setIsSubmitting(true)
    try {
      await deleteHolding(id)
      setHoldings((prev) => prev.filter((h) => h.id !== id))
      setDeletingHolding(null)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete holding.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-text-primary">
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="space-y-8">
          <section className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-text-secondary">
                My Holdings
              </p>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
                Portfolio
              </h1>
            </div>

            <Button onClick={() => setIsAddModalOpen(true)}>Add Holding</Button>
          </section>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <BullVisionLoader label="Loading portfolio" description="Fetching holdings and summary data" />
            </div>
          ) : error ? (
            <Card variant="elevated" className="border-error/50 bg-error/10 p-6 text-error">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
              <Button variant="ghost" onClick={fetchPortfolio} className="mt-4 border border-error/20 text-error hover:bg-error/20">
                Retry
              </Button>
            </Card>
          ) : holdings.length === 0 ? (
            <EmptyPortfolio onAddFirst={() => setIsAddModalOpen(true)} />
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="space-y-6">
                <PortfolioTable
                  holdings={holdings}
                  onEdit={setEditingHolding}
                  onDelete={setDeletingHolding}
                />
              </div>
              <div className="space-y-6">
                <PortfolioSummary holdings={holdings} />
              </div>
            </div>
          )}
        </div>
      </main>

      <AddHoldingModal
        isOpen={isAddModalOpen}
        isSubmitting={isSubmitting}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddHolding}
      />

      {editingHolding && (
        <EditHoldingModal
          key={editingHolding.id}
          holding={editingHolding}
          isOpen={true}
          isSubmitting={isSubmitting}
          onClose={() => setEditingHolding(null)}
          onSubmit={handleEditHolding}
        />
      )}

      {deletingHolding && (
        <DeleteHoldingDialog
          holding={deletingHolding}
          isOpen={true}
          isDeleting={isSubmitting}
          onClose={() => setDeletingHolding(null)}
          onConfirm={handleDeleteHolding}
        />
      )}
    </div>
  )
}
