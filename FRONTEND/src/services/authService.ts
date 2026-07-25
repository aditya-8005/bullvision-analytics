import { api, clearAuthToken, getResponseData, setAuthToken } from './api'

export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterResponse {
  message: string
}

export interface LoginResponse {
  success: true
  user: User
  accessToken: string
  expiresIn: string
}

export interface AuthenticatedProfile {
  id: string
  email: string
  role: User['role']
}

export interface ProfileResponse {
  success: true
  user: AuthenticatedProfile
}

export async function register(
  credentials: RegisterCredentials,
): Promise<RegisterResponse> {
  return getResponseData(api.post<RegisterResponse>('/auth/register', credentials))
}

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await getResponseData(
    api.post<Omit<LoginResponse, 'success'>>('/auth/login', credentials)
  )

  setAuthToken(response.accessToken)

  return {
    success: true,
    ...response,
  }
}

export async function profile(): Promise<ProfileResponse> {
  return getResponseData(api.get<ProfileResponse>('/auth/profile'))
}

export async function logout(): Promise<string> {
  try {
    return await getResponseData(api.post<string>('/auth/logout'))
  } finally {
    clearAuthToken()
  }
}