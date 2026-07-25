import { Button } from '../../../components/ui/Button'
import type { Holding } from '../../../services/portfolioService'

interface DeleteHoldingDialogProps {
  holding: Holding
  isOpen: boolean
  isDeleting: boolean
  onClose: () => void
  onConfirm: (id: string) => void
}

export function DeleteHoldingDialog({
  holding,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteHoldingDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm sm:items-center">
      <div className="my-8 w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-glow sm:p-6">
        <h3 className="text-xl font-semibold text-text-primary">Delete Holding</h3>
        <p className="mt-2 text-sm text-text-secondary">
          Are you sure you want to delete your holding of{' '}
          <span className="font-semibold text-text-primary">{holding.quantity}</span> shares of{' '}
          <span className="font-semibold text-text-primary">{holding.symbol}</span>? This action cannot be undone.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose} disabled={isDeleting} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => onConfirm(holding.id)}
            loading={isDeleting}
            className="w-full bg-error hover:bg-error/90 focus-visible:ring-error/40 sm:w-auto"
          >
            Delete Holding
          </Button>
        </div>
      </div>
    </div>
  )
}
