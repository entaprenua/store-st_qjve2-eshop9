import { type JSX } from "solid-js"
import { TextField, TextFieldInput, TextFieldLabel } from "../text-field"
import { useAuthForm } from "./auth-context"

export type AuthUsernameFieldProps = {
  label?: string
  placeholder?: string
  class?: string
}

export const AuthUsernameField = (props: AuthUsernameFieldProps) => {
  const { formData, setFormData } = useAuthForm()

  return (
    <TextField class={props.class}>
      <TextFieldLabel>{props.label ?? "Username (optional)"}</TextFieldLabel>
      <TextFieldInput
        type="text"
        placeholder={props.placeholder ?? "yourname"}
        value={formData().username}
        onInput={(e) => setFormData({ username: e.currentTarget.value })}
      />
    </TextField>
  )
}
