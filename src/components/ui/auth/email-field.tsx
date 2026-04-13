import { type JSX } from "solid-js"
import { TextField, TextFieldInput, TextFieldLabel } from "../text-field"
import { useAuthForm } from "./auth-context"

export type AuthEmailFieldProps = {
  class?: string
}

export const AuthEmailField = (props: AuthEmailFieldProps) => {
  const { formData, setFormData } = useAuthForm()

  return (
    <TextField class={props.class}>
      <TextFieldLabel>Email</TextFieldLabel>
      <TextFieldInput
        type="email"
        placeholder="you@example.com"
        value={formData().email}
        onInput={(e) => setFormData({ email: e.currentTarget.value })}
      />
    </TextField>
  )
}
