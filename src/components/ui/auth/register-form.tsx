import { type JSX } from "solid-js"
import { useNavigate } from "@solidjs/router"
import { AuthProvider, useAuthForm } from "./auth-context"

export type AuthRegisterFormProps = {
  children?: JSX.Element
}

const AuthRegisterFormContent = (props: AuthRegisterFormProps) => {
  const navigate = useNavigate()
  const { formData, setIsLoading, setError } = useAuthForm()

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData().email,
          username: formData().username || null,
          password: formData().password
        })
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.message || "Registration failed")
        return
      }

      navigate("/verify-email")
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

export const AuthRegisterForm = (props: AuthRegisterFormProps) => {
  return (
    <AuthProvider>
      <AuthRegisterFormContent {...props} />
    </AuthProvider>
  )
}
