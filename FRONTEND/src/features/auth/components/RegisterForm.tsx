import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { Button } from '../../../components/ui/Button'
import { ApiError } from '../../../services/api'

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await register({ name, email, password })
      // Redirect to login after successful registration
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-text-primary">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full min-h-11 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary focus:border-analytics focus:outline-none focus:ring-1 focus:ring-analytics"
          placeholder="Enter your full name"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-text-primary">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full min-h-11 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary focus:border-analytics focus:outline-none focus:ring-1 focus:ring-analytics"
          placeholder="Enter your email"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-text-primary">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full min-h-11 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary focus:border-analytics focus:outline-none focus:ring-1 focus:ring-analytics"
          placeholder="Create a password"
        />
      </div>
      <Button type="submit" className="mt-2 w-full" loading={isLoading}>
        Create Account
      </Button>
    </form>
  )
}
