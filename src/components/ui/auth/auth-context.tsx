import { createContext, useContext, type Accessor, type JSX, createSignal, createEffect } from "solid-js"
import { createStore } from "solid-js/store"

export type AuthProvider = "google" | "github" | "facebook"

export type AuthFormData = {
  email: string
  username: string
  password: string
  confirmPassword: string
  rememberMe: boolean
}

type AuthContextValue = {
  formData: Accessor<AuthFormData>
  setFormData: (data: Partial<AuthFormData>) => void
  resetFormData: () => void
  isLoading: Accessor<boolean>
  setIsLoading: (loading: boolean) => void
  error: Accessor<string | null>
  setError: (error: string | null) => void
  showPassword: Accessor<boolean>
  toggleShowPassword: () => void
  onOAuth: (provider: AuthProvider) => void
  onEmailPassword: (data: { email: string; password: string }) => void
}

const defaultFormData: AuthFormData = {
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  rememberMe: false,
}

const AuthContext = createContext<AuthContextValue>()

export const useAuthForm = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuthForm must be used within AuthProvider")
  }
  return ctx
}

type AuthProviderProps = {
  onOAuth?: (provider: AuthProvider) => void
  onEmailPassword?: (data: { email: string; password: string }) => void
  children?: JSX.Element
}

export const AuthProvider = (props: AuthProviderProps) => {
  const [formData, setFormDataState] = createSignal<AuthFormData>({ ...defaultFormData })
  const [isLoading, setIsLoading] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)
  const [showPassword, setShowPassword] = createSignal(false)

  const setFormData = (data: Partial<AuthFormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }))
  }

  const resetFormData = () => {
    setFormDataState({ ...defaultFormData })
  }

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  const onOAuth = (provider: AuthProvider) => {
    props.onOAuth?.(provider)
  }

  const onEmailPassword = (data: { email: string; password: string }) => {
    props.onEmailPassword?.(data)
  }

  const value: AuthContextValue = {
    formData,
    setFormData,
    resetFormData,
    isLoading,
    setIsLoading,
    error,
    setError,
    showPassword,
    toggleShowPassword,
    onOAuth,
    onEmailPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  )
}
