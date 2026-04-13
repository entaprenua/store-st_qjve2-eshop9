import { Show, type JSX } from "solid-js"
import { CheckoutProvider, useCheckout } from "./checkout-context"
import { useCart } from "~/components/ui/cart"

export type CheckoutFormProps = {
  onSuccess?: (order: Order) => void
  children?: JSX.Element
}

const CheckoutFormContent = (props: CheckoutFormProps) => {
  const checkout = useCheckout()
  const cart = useCart()

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    
    if (cart.isEmpty()) {
      checkout.setError("Your cart is empty")
      return
    }

    checkout.setIsLoading(true)
    checkout.setError(null)
    checkout.setStatus("processing")

    try {
      const res = await fetch("/api/v1/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          paymentMethod: checkout.formData().paymentMethod,
          paymentPhone: checkout.formData().paymentPhone,
          billingAddress: checkout.formData().billingAddress,
          shippingAddress: checkout.formData().shippingAddress,
          notes: checkout.formData().notes,
          guestEmail: checkout.formData().guestEmail,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        checkout.setError(data.message || "Checkout failed")
        checkout.setStatus("failed")
        return
      }

      checkout.setOrder(data.data)
      checkout.setStatus("success")
      cart.clear()
      props.onSuccess?.(data.data)
    } catch (err) {
      checkout.setError("An error occurred. Please try again.")
      checkout.setStatus("failed")
    } finally {
      checkout.setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {props.children}
    </form>
  )
}

export const CheckoutForm = (props: CheckoutFormProps) => {
  return (
    <CheckoutProvider>
      <CheckoutFormContent {...props} />
    </CheckoutProvider>
  )
}
