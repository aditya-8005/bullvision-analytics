import axios, { type AxiosError, type AxiosResponse } from 'axios'

const TOKEN_STORAGE_KEY = 'bullvision_auth_token'
const baseURL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000').replace(/\/$/, '')

export interface ApiErrorPayload {
  message?: string
  code?: string
  details?: unknown
}

export class ApiError extends Error {
  readonly status?: number
  readonly code?: string
  readonly details?: unknown

  constructor(message: string, options: Omit<ApiError, 'name' | 'message'> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = options.status
    this.code = options.code
    this.details = options.details
  }
}

let onUnauthorized: (() => void) | null = null

export function registerUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler
}

function getStoredToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setAuthToken(token: string): void {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearAuthToken(): void {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
}

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const axiosError = error as AxiosError<ApiErrorPayload>
    const payload = axiosError.response?.data

    let message = payload?.message ?? axiosError.message ?? 'Request failed.'

    if (axiosError.code === 'ERR_NETWORK') {
      message = 'Backend unavailable'
    } else if (axiosError.response?.status === 401 && !payload?.message) {
      message = 'Invalid credentials'
    } else if (axiosError.response?.status === 409 && !payload?.message) {
      message = 'Duplicate email'
    }

    return new ApiError(message, {
      status: axiosError.response?.status,
      code: payload?.code,
      details: payload?.details,
    })
  }

  return new ApiError('An unexpected error occurred.')
}

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error)

    if (apiError.status === 401) {
      clearAuthToken()

      if (onUnauthorized) {
        onUnauthorized()
      }
    }

    return Promise.reject(apiError)
  },
)

export async function getResponseData<T>(
  request: Promise<AxiosResponse<T>>,
): Promise<T> {
  const response = await request
  return response.data
}

export default api