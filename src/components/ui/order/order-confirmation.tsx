import { Show, type JSX } from "solid-js"
import { useCheckout } from "./checkout-context"

export type OrderConfirmationProps = {
  class?: string
  children?: JSX.Element
}

export const OrderConfirmation = (props: OrderConfirmationProps) => {
  const { status, order } = useCheckout()

  return (
    <Show when={status() === "success" && order()}>
      <div class={props.class}>
        {props.children ?? <DefaultOrderConfirmation />}
      </div>
    </Show>
  )
}

const DefaultOrderConfirmation = () => {
  const { order } = useCheckout()

  return (
    <div class="text-center space-y-4">
      <div class="text-4xl">✓</div>
      <h2 class="text-2xl font-bold">Order Confirmed!</h2>
      <p class="text-muted-foreground">
        Thank you for your order. Your order number is <strong>{order()?.orderNumber}</strong>
      </p>
      <p class="text-lg font-bold">
        Total: KES {order()?.total?.toLocaleString()}
      </p>
    </div>
  )
}

export const OrderNumber = (props: { class?: string }) => {
  const { order } = useCheckout()

  return (
    <div class={props.class}>
      Order #{order()?.orderNumber}
    </div>
  )
}

export const OrderTotal = (props: { class?: string }) => {
  const { order } = useCheckout()

  return (
    <div class={props.class}>
      Total: KES {order()?.total?.toLocaleString()}
    </div>
  )
}
