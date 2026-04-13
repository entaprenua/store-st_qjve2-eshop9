import { Show, type JSX } from "solid-js"
import { useCheckout } from "./checkout-context"

export type CheckoutErrorMessageProps = {
  class?: string
  children?: JSX.Element
}

export const CheckoutErrorMessage = (props: CheckoutErrorMessageProps) => {
  const { error } = useCheckout()

  return (
    <Show when={error()}>
      <div class={props.class}>
        {props.children ?? error()}
      </div>
    </Show>
  )
}
