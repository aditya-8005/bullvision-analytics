/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  login as apiLogin,
  register as apiRegister,
  profile as apiProfile,
  logout as apiLogout,
  type User,
  type AuthenticatedProfile,
  type LoginCredentials,
  type RegisterCredentials,
} from '../services/authService'

import {
  clearAuthToken,
  registerUnauthorizedHandler,
} from '../services/api'

type AuthUser = User | AuthenticatedProfile

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  const [user, setUser] = useState<AuthUser | null>(null)

  const [isLoading, setIsLoading] = useState(() => {
    return !!window.localStorage.getItem('bullvision_auth_token')
  })

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      setUser(null)
      clearAuthToken()
      navigate('/login', { replace: true })
    })
  }, [navigate])

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await apiProfile()

        if (response.success && response.user) {
          setUser(response.user)
        } else {
          clearAuthToken()
          setUser(null)
        }
      } catch {
        clearAuthToken()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    const token = window.localStorage.getItem('bullvision_auth_token')

    if (token) {
      loadProfile()
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (credentials: LoginCredentials) => {
    const response = await apiLogin(credentials)

    if (response.success) {
      setUser(response.user)
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    await apiRegister(credentials)
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch {
      // Ignore logout errors
    } finally {
      clearAuthToken()
      setUser(null)
      navigate('/login', { replace: true })
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}