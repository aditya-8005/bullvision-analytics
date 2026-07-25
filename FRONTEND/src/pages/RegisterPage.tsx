import { Link, Navigate } from 'react-router-dom'
import { RegisterForm } from '../features/auth/components/RegisterForm'
import { useAuth } from '../hooks/useAuth'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { BullVisionLoader, BullVisionWordmark } from '../components/branding/BullVisionMark'

export function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <BullVisionLoader label="Loading BullVision" description="Creating your account workspace" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-center overflow-x-hidden bg-background px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <Container maxWidth="sm">
        <div className="mx-auto w-full max-w-md">
          <BullVisionWordmark compact showTagline={false} className="mx-auto max-w-sm bg-background/70" />
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Or{' '}
            <Link to="/login" className="font-medium text-analytics hover:text-analytics-strong">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className="mt-8 mx-auto w-full max-w-md">
          <Card variant="elevated" className="px-4 py-6 sm:px-8 sm:py-8">
            <RegisterForm />
          </Card>
        </div>
      </Container>
    </div>
  )
}
