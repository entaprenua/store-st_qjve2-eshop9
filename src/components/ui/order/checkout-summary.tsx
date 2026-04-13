import { type JSX } from "solid-js"
import { useCart } from "~/components/ui/cart"

export type CheckoutSubtotalProps = {
  class?: string
}

export const CheckoutSubtotal = (props: CheckoutSubtotalProps) => {
  const cart = useCart()

  return (
    <span class={props.class}>
      {cart.subtotal().toLocaleString()}
    </span>
  )
}

export type CheckoutTaxProps = {
  class?: string
}

export const CheckoutTax = (props: CheckoutTaxProps) => {
  return (
    <span class={props.class}>
      0
    </span>
  )
}

export type CheckoutShippingProps = {
  class?: string
}

export const CheckoutShipping = (props: CheckoutShippingProps) => {
  return (
    <span class={props.class}>
      -
    </span>
  )
}

export type CheckoutTotalProps = {
  class?: string
}

export const CheckoutTotal = (props: CheckoutTotalProps) => {
  const cart = useCart()

  return (
    <span class={props.class}>
      {cart.subtotal().toLocaleString()}
    </span>
  )
}
