import { api, getCsrfToken, setCsrfToken } from './client'
import type {
  User,
  LoginRequest, LoginResponse,
  RegisterRequest, RegisterResponse,
  PasswordResetRequestRequest, PasswordResetConfirmRequest,
  EmailVerificationRequest,
} from '../types'

const AUTH_BASE = '/auth'

export interface SessionInfo {
  id: string
  deviceType: string | null
  browser: string | null
  os: string | null
  ipAddress: string | null
  lastAccessedAt: string | null
  createdAt: string | null
  isActive: boolean
  isCurrent: boolean
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(`${AUTH_BASE}/login`, credentials)
    
    if (response.csrfToken) {
      setCsrfToken(response.csrfToken)
    }
    
    return response
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>(`${AUTH_BASE}/register`, data)
    
    if (response.csrfToken) {
      setCsrfToken(response.csrfToken)
    }
    
    return response
  },

  logout: async (): Promise<void> => {
    const csrfToken = getCsrfToken()
    await api.post(`${AUTH_BASE}/logout`, {}, csrfToken || undefined)
    setCsrfToken(null)
  },

  me: async (): Promise<User> => {
    return api.get<User>(`${AUTH_BASE}/me`)
  },

  refresh: async (): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(`${AUTH_BASE}/refresh`, {})
    
    if (response.csrfToken) {
      setCsrfToken(response.csrfToken)
    }
    
    return response
  },

  requestPasswordReset: async (data: PasswordResetRequestRequest): Promise<void> => {
    return api.post<void>(`${AUTH_BASE}/password-reset/request`, data)
  },

  confirmPasswordReset: async (data: PasswordResetConfirmRequest): Promise<void> => {
    return api.post<void>(`${AUTH_BASE}/password-reset/confirm`, data)
  },

  verifyEmail: async (data: EmailVerificationRequest): Promise<User> => {
    return api.post<User>(`${AUTH_BASE}/verify-email`, data)
  },

  resendVerification: async (email: string): Promise<void> => {
    return api.post<void>(`${AUTH_BASE}/resend-verification`, { email })
  },
}
