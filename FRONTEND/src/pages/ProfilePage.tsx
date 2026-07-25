import { useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'

export function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          Profile
        </h1>
        <p className="text-text-secondary">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card variant="glass" className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider text-text-tertiary">
              Account Information
            </h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm text-text-secondary">Email</label>
                <p className="mt-1 font-medium text-text-primary">{user.email}</p>
              </div>
              {'name' in user && user.name && (
                <div>
                  <label className="text-sm text-text-secondary">Name</label>
                  <p className="mt-1 font-medium text-text-primary">{String(user.name)}</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <Button variant="ghost" onClick={handleLogout} className="text-error hover:text-error hover:bg-error/10">
              Logout
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
