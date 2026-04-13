import { type JSX } from "solid-js"
import { TextField, TextFieldInput, TextFieldLabel } from "../text-field"
import { useMpesa } from "./mpesa-context"

export type MpesaPhoneFieldProps = {
  label?: string
  placeholder?: string
  class?: string
}

export const MpesaPhoneField = (props: MpesaPhoneFieldProps) => {
  const { formData, setFormData } = useMpesa()

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    let value = target.value.replace(/\D/g, "")
    
    if (value.startsWith("254")) {
      value = value
    } else if (value.startsWith("0")) {
      value = "254" + value.substring(1)
    } else if (value.startsWith("7")) {
      value = "254" + value
    }
    
    setFormData({ phone: value })
  }

  return (
    <TextField class={props.class}>
      <TextFieldLabel>{props.label ?? "Phone Number"}</TextFieldLabel>
      <TextFieldInput
        type="tel"
        placeholder={props.placeholder ?? "0700123456"}
        value={formData().phone}
        onInput={handleInput}
      />
    </TextField>
  )
}
