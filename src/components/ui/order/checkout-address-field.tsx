import { type JSX } from "solid-js"
import { TextField, TextFieldInput, TextFieldLabel } from "../text-field"
import { useCheckout, type AddressData } from "./checkout-context"

export type CheckoutAddressFieldProps = {
  type?: "billing" | "shipping"
  class?: string
  children?: JSX.Element
}

export const CheckoutAddressField = (props: CheckoutAddressFieldProps) => {
  const { formData, setFormData } = useCheckout()
  const type = props.type ?? "billing"
  const address = type === "billing" ? formData().billingAddress : formData().shippingAddress

  const updateField = (field: keyof AddressData, value: string) => {
    const newAddress = { ...address, [field]: value }
    if (type === "billing") {
      setFormData({ billingAddress: newAddress })
    } else {
      setFormData({ shippingAddress: newAddress })
    }
  }

  return (
    <div class={`space-y-4 ${props.class ?? ""}`}>
      {props.children ?? (
        <>
          <TextField>
            <TextFieldLabel>Full Name</TextFieldLabel>
            <TextFieldInput
              type="text"
              placeholder="John Doe"
              value={address.name}
              onInput={(e) => updateField("name", e.currentTarget.value)}
            />
          </TextField>

          <TextField>
            <TextFieldLabel>Phone</TextFieldLabel>
            <TextFieldInput
              type="tel"
              placeholder="0700123456"
              value={address.phone}
              onInput={(e) => updateField("phone", e.currentTarget.value)}
            />
          </TextField>

          <TextField>
            <TextFieldLabel>Address Line 1</TextFieldLabel>
            <TextFieldInput
              type="text"
              placeholder="Street address"
              value={address.line1}
              onInput={(e) => updateField("line1", e.currentTarget.value)}
            />
          </TextField>

          <TextField>
            <TextFieldLabel>Address Line 2</TextFieldLabel>
            <TextFieldInput
              type="text"
              placeholder="Apartment, suite, etc."
              value={address.line2}
              onInput={(e) => updateField("line2", e.currentTarget.value)}
            />
          </TextField>

          <div class="grid grid-cols-2 gap-4">
            <TextField>
              <TextFieldLabel>City</TextFieldLabel>
              <TextFieldInput
                type="text"
                placeholder="Nairobi"
                value={address.city}
                onInput={(e) => updateField("city", e.currentTarget.value)}
              />
            </TextField>

            <TextField>
              <TextFieldLabel>County/State</TextFieldLabel>
              <TextFieldInput
                type="text"
                placeholder="Nairobi"
                value={address.state}
                onInput={(e) => updateField("state", e.currentTarget.value)}
              />
            </TextField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <TextField>
              <TextFieldLabel>Postal Code</TextFieldLabel>
              <TextFieldInput
                type="text"
                placeholder="00100"
                value={address.postalCode}
                onInput={(e) => updateField("postalCode", e.currentTarget.value)}
              />
            </TextField>

            <TextField>
              <TextFieldLabel>Country</TextFieldLabel>
              <TextFieldInput
                type="text"
                placeholder="KE"
                value={address.country}
                onInput={(e) => updateField("country", e.currentTarget.value)}
              />
            </TextField>
          </div>
        </>
      )}
    </div>
  )
}
