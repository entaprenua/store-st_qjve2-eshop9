import { Show, type JSX } from "solid-js"
import { TextField, TextFieldInput, TextFieldLabel } from "../text-field"
import { Button } from "../button"
import { Text } from "../text"
import { useAuthForm } from "./auth-context"
import EyeIcon from "lucide-solid/icons/eye"
import EyeOffIcon from "lucide-solid/icons/eye-off"

export type AuthPasswordFieldProps = {
  label?: string
  placeholder?: string
  showStrength?: boolean
  showToggle?: boolean
  class?: string
}

export const AuthPasswordField = (props: AuthPasswordFieldProps) => {
  const { formData, setFormData, showPassword, toggleShowPassword } = useAuthForm()

  const getPasswordStrength = () => {
    const password = formData().password
    if (!password) return { score: 0, label: "" }
    
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    
    const labels = ["", "Weak", "Fair", "Good", "Strong", "Excellent"]
    return { score, label: labels[score] || "" }
  }

  const strength = () => getPasswordStrength()

  return (
    <div class={props.class}>
      <TextField>
        <TextFieldLabel>{props.label ?? "Password"}</TextFieldLabel>
        <div class="relative">
          <TextFieldInput
            type={showPassword() ? "text" : "password"}
            placeholder={props.placeholder ?? "Enter your password"}
            value={formData().password}
            onInput={(e) => setFormData({ password: e.currentTarget.value })}
            class={props.showToggle ? "pr-10" : ""}
          />
          <Show when={props.showToggle}>
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={toggleShowPassword}
            >
              <Show when={showPassword()} fallback={<EyeIcon class="size-4" />}>
                <EyeOffIcon class="size-4" />
              </Show>
            </button>
          </Show>
        </div>
      </TextField>

      <Show when={props.showStrength && formData().password}>
        <div class="mt-2 space-y-1">
          <div class="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                class="h-1 flex-1 rounded-full transition-colors"
                classList={{
                  "bg-muted": strength().score < i,
                  "bg-destructive": strength().score >= i && strength().score < 2,
                  "bg-yellow-500": strength().score >= i && strength().score >= 2 && strength().score < 3,
                  "bg-success": strength().score >= i && strength().score >= 3
                }}
              />
            ))}
          </div>
          <Text class="text-xs text-muted-foreground">
            {strength().label}
          </Text>
        </div>
      </Show>
    </div>
  )
}

export type AuthConfirmPasswordFieldProps = {
  label?: string
  class?: string
}

export const AuthConfirmPasswordField = (props: AuthConfirmPasswordFieldProps) => {
  const { formData, setFormData, showPassword, toggleShowPassword } = useAuthForm()

  const passwordsMatch = () => {
    return formData().password === formData().confirmPassword
  }

  return (
    <TextField class={props.class}>
      <TextFieldLabel>{props.label ?? "Confirm Password"}</TextFieldLabel>
      <div class="relative">
        <TextFieldInput
          type={showPassword() ? "text" : "password"}
          placeholder="Confirm your password"
          value={formData().confirmPassword}
          onInput={(e) => setFormData({ confirmPassword: e.currentTarget.value })}
          class="pr-10"
        />
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={toggleShowPassword}
        >
          <Show when={showPassword()} fallback={<EyeIcon class="size-4" />}>
            <EyeOffIcon class="size-4" />
          </Show>
        </button>
      </div>
    </TextField>
  )
}
