import { createContext, useContext, type Accessor, type JSX, createSignal } from "solid-js"
import { useOrder } from "../order"

export type MpesaStatus = "idle" | "waiting" | "processing" | "success" | "failed"

export type MpesaFormData = {
  phone: string
}

type MpesaContextValue = {
  formData: Accessor<MpesaFormData>
  setFormData: (data: Partial<MpesaFormData>) => void
  resetFormData: () => void
  isLoading: Accessor<boolean>
  setIsLoading: (loading: boolean) => void
  error: Accessor<string | null>
  setError: (error: string | null) => void
  status: Accessor<MpesaStatus>
  setStatus: (status: MpesaStatus) => void
  transactionId: Accessor<string | null>
  setTransactionId: (id: string | null) => void
}

const defaultFormData: MpesaFormData = {
  phone: "",
}

const MpesaContext = createContext<MpesaContextValue>()

export const useMpesa = (): MpesaContextValue => {
  const ctx = useContext(MpesaContext)
  if (!ctx) {
    throw new Error("useMpesa must be used within MpesaProvider")
  }
  return ctx
}

type MpesaProviderProps = {
  orderId?: string
  onSuccess?: () => void
  children?: JSX.Element
}

export const MpesaProvider = (props: MpesaProviderProps) => {
  const order = useOrder()

  const [formData, setFormDataState] = createSignal<MpesaFormData>({ ...defaultFormData })
  const [isLoading, setIsLoading] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)
  const [status, setStatus] = createSignal<MpesaStatus>("idle")
  const [transactionId, setTransactionId] = createSignal<string | null>(null)

  const setFormData = (data: Partial<MpesaFormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }))
  }

  const resetFormData = () => {
    setFormDataState({ ...defaultFormData })
    setError(null)
    setStatus("idle")
    setTransactionId(null)
  }

  const value: MpesaContextValue = {
    formData,
    setFormData,
    resetFormData,
    isLoading,
    setIsLoading,
    error,
    setError,
    status,
    setStatus,
    transactionId,
    setTransactionId,
  }

  return (
    <MpesaContext.Provider value={value}>
      {props.children}
    </MpesaContext.Provider>
  )
}
