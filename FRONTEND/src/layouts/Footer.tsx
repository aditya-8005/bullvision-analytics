import { Container } from '../components/ui/Container'

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <Container maxWidth="2xl">
        <div className="grid gap-3 py-6 text-sm text-text-secondary sm:grid-cols-2 sm:items-center">
          <p>BullVision Analytics</p>
          <p className="sm:text-right">Premium financial intelligence foundation</p>
        </div>
      </Container>
    </footer>
  )
}

export { Footer }