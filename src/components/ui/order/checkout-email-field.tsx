import { type JSX } from "solid-js"
import { TextField, TextFieldInput, TextFieldLabel } from "../text-field"
import { useCheckout } from "./checkout-context"

export type CheckoutEmailFieldProps = {
  label?: string
  placeholder?: string
  class?: string
}

export const CheckoutEmailField = (props: CheckoutEmailFieldProps) => {
  const { formData, setFormData } = useCheckout()

  return (
    <TextField class={props.class}>
      <TextFieldLabel>{props.label ?? "Email"}</TextFieldLabel>
      <TextFieldInput
        type="email"
        placeholder={props.placeholder ?? "you@example.com"}
        value={formData().guestEmail}
        onInput={(e) => setFormData({ guestEmail: e.currentTarget.value })}
      />
    </TextField>
  )
}
