import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { Card } from '../components/ui/Card'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <Container maxWidth="sm">
        <Card variant="glass" className="text-center p-8 lg:p-12 space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-analytics">
            404 Error
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            Page Not Found
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">
            Sorry, we couldn't find the page you're looking for. It might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <div className="pt-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-xl bg-text-primary px-6 py-3 text-sm font-medium text-background transition-transform duration-fast ease-standard hover:-translate-y-0.5 hover:bg-text-secondary hover:shadow-raised"
            >
              Back to Dashboard
            </Link>
          </div>
        </Card>
      </Container>
    </div>
  )
}
