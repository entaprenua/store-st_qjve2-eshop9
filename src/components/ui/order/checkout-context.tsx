import { createContext, useContext, type Accessor, type JSX, createSignal } from "solid-js"

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"

export type Order = {
  id: string
  orderNumber: string
  status: OrderStatus
  subtotal: number
  tax: number
  shippingCost: number
  discount: number
  total: number
  currency: string
  paid: boolean
  paidAt?: string
  items: OrderItem[]
}

export type OrderItem = {
  id: string
  productId: string
  productName: string
  price: number
  quantity: number
  subtotal: number
}

export type AddressData = {
  name: string
  phone: string
  line1: string
  line2: string
  city: string
  state: string
  postalCode: string
  country: string
}

export type CheckoutFormData = {
  guestEmail: string
  billingAddress: AddressData
  shippingAddress: AddressData
  notes: string
  paymentMethod: "card" | "mpesa"
  paymentPhone: string
}

export type CheckoutStatus = "idle" | "processing" | "success" | "failed"

type CheckoutContextValue = {
  formData: Accessor<CheckoutFormData>
  setFormData: (data: Partial<CheckoutFormData>) => void
  resetFormData: () => void
  isLoading: Accessor<boolean>
  setIsLoading: (loading: boolean) => void
  error: Accessor<string | null>
  setError: (error: string | null) => void
  status: Accessor<CheckoutStatus>
  setStatus: (status: CheckoutStatus) => void
  order: Accessor<Order | null>
  setOrder: (order: Order | null) => void
}

const defaultAddress: AddressData = {
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "KE",
}

const defaultFormData: CheckoutFormData = {
  guestEmail: "",
  billingAddress: { ...defaultAddress },
  shippingAddress: { ...defaultAddress },
  notes: "",
  paymentMethod: "mpesa",
  paymentPhone: "",
}

const CheckoutContext = createContext<CheckoutContextValue>()

export const useCheckout = (): CheckoutContextValue => {
  const ctx = useContext(CheckoutContext)
  if (!ctx) {
    throw new Error("useCheckout must be used within CheckoutProvider")
  }
  return ctx
}

type CheckoutProviderProps = {
  onSuccess?: (order: Order) => void
  children?: JSX.Element
}

export const CheckoutProvider = (props: CheckoutProviderProps) => {
  const [formData, setFormDataState] = createSignal<CheckoutFormData>({ ...defaultFormData })
  const [isLoading, setIsLoading] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)
  const [status, setStatus] = createSignal<CheckoutStatus>("idle")
  const [order, setOrder] = createSignal<Order | null>(null)

  const setFormData = (data: Partial<CheckoutFormData>) => {
    setFormDataState((prev) => {
      const newData = { ...prev, ...data }
      
      if (data.billingAddress) {
        newData.billingAddress = { ...prev.billingAddress, ...data.billingAddress }
      }
      if (data.shippingAddress) {
        newData.shippingAddress = { ...prev.shippingAddress, ...data.shippingAddress }
      }
      
      return newData
    })
  }

  const resetFormData = () => {
    setFormDataState({ ...defaultFormData })
    setError(null)
    setStatus("idle")
    setOrder(null)
  }

  const value: CheckoutContextValue = {
    formData,
    setFormData,
    resetFormData,
    isLoading,
    setIsLoading,
    error,
    setError,
    status,
    setStatus,
    order,
    setOrder,
  }

  return (
    <CheckoutContext.Provider value={value}>
      {props.children}
    </CheckoutContext.Provider>
  )
}
