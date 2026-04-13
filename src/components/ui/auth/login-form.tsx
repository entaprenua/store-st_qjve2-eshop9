import { type JSX } from "solid-js"
import { useNavigate } from "@solidjs/router"
import { AuthProvider, useAuthForm } from "./auth-context"

export type AuthLoginFormProps = {
  children?: JSX.Element
}

const AuthLoginFormContent = (props: AuthLoginFormProps) => {
  const navigate = useNavigate()
  const { formData, setIsLoading, setError } = useAuthForm()

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData().email,
          password: formData().password,
        })
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.message || "Login failed")
        return
      }

      navigate("/admin")
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {props.children}
    </form>
  )
}

export const AuthLoginForm = (props: AuthLoginFormProps) => {
  return (
    <AuthProvider>
      <AuthLoginFormContent {...props} />
    </AuthProvider>
  )
}
