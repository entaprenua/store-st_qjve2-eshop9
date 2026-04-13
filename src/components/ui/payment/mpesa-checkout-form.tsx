import { type JSX } from "solid-js"
import { MpesaProvider, useMpesa } from "./mpesa-context"
import { useOrder } from "../order"

export type MpesaCheckoutFormProps = {
  orderId?: string
  onSuccess?: () => void
  children?: JSX.Element
}

const MpesaCheckoutFormContent = (props: MpesaCheckoutFormProps) => {
  const order = useOrder()
  const { formData, setFormData, setIsLoading, setError, setStatus, setTransactionId } = useMpesa()

  const handleSubmit = async (e: Event) => {
    e.preventDefault()

    const phone = formData().phone
    if (!phone || phone.length < 9) {
      setError("Please enter a valid phone number")
      return
    }

    const amount = order.subtotal()
    if (amount <= 0) {
      setError("No items in order")
      return
    }

    setIsLoading(true)
    setError(null)
    setStatus("waiting")

    try {
      const response = await fetch("/api/v1/payments/mpesa/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          phone: phone,
          amount: amount,
          orderId: props.orderId,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.message || "Failed to initiate payment")
        setStatus("failed")
        setIsLoading(false)
        return
      }

      const referenceId = data.data?.referenceId
      if (referenceId) {
        setTransactionId(referenceId)
        pollStatus(referenceId)
      } else {
        setStatus("failed")
        setError("No reference ID received")
        setIsLoading(false)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      setStatus("failed")
      setIsLoading(false)
    }
  }

  const pollStatus = async (referenceId: string) => {
    const maxAttempts = 60
    let attempts = 0

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setError("Payment timeout. Please check your phone.")
        setStatus("failed")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/v1/payments/mpesa/status/${referenceId}`, {
          credentials: "include",
        })

        const data = await response.json()

        if (data.status === "success") {
          setStatus("success")
          setIsLoading(false)
          order.clear()
          props.onSuccess?.()
          return
        } else if (data.status === "failed") {
          setError(data.message || "Payment failed")
          setStatus("failed")
          setIsLoading(false)
          return
        }

        attempts++
        setTimeout(poll, 2000)
      } catch {
        attempts++
        setTimeout(poll, 2000)
      }
    }

    poll()
  }

  return (
    <form onSubmit={handleSubmit}>
      {props.children}
    </form>
  )
}

export const MpesaCheckoutForm = (props: MpesaCheckoutFormProps) => {
  return (
    <MpesaProvider orderId={props.orderId} onSuccess={props.onSuccess}>
      <MpesaCheckoutFormContent {...props} />
    </MpesaProvider>
  )
}
