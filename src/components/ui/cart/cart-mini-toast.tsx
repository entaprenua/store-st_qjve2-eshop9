import { Show, createEffect } from "solid-js"
import { Toaster } from "~/components/ui/toast"
import { useCartMini } from "./cart-mini-context"
import { useCart } from "./cart-context"
import { showToast } from "~/components/ui/toast"

export type CartMiniToastProps = {
  children?: any
}

export const CartMiniToast = (props: CartMiniToastProps) => {
  return (
    <Toaster />
  )
}

export const showCartToast = (message: string, variant?: "default" | "success" | "destructive") => {
  showToast({
    title: "Cart Updated",
    description: message,
    variant,
    duration: 3000,
  })
}
