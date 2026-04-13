import { createContext, useContext, createSignal, createEffect, type Accessor, type JSX } from "solid-js"
import { useCart } from "./cart-context"

type CartMiniContextValue = {
  open: Accessor<boolean>
  setOpen: (open: boolean) => void
}

const CartMiniContext = createContext<CartMiniContextValue>()

export const useCartMini = () => {
  const ctx = useContext(CartMiniContext)
  if (!ctx) {
    throw new Error("useCartMini must be used within CartMini")
  }
  return ctx
}

export type CartMiniProps = {
  children?: JSX.Element
}

export const CartMini = (props: CartMiniProps) => {
  const [open, setOpen] = createSignal(false)
  const cart = useCart()

  createEffect(() => {
    if (cart.isPending()) {
      setOpen(true)
    }
  })

  createEffect(() => {
    if (cart.isEmpty() && open()) {
      setTimeout(() => setOpen(false), 2000)
    }
  })

  return (
    <CartMiniContext.Provider value={{ open, setOpen }}>
      {props.children}
    </CartMiniContext.Provider>
  )
}
