import { type JSX } from "solid-js"
import { useOrder } from "../order"

export type MpesaAmountDisplayProps = {
  currency?: string
  class?: string
  children?: JSX.Element
}

export const MpesaAmountDisplay = (props: MpesaAmountDisplayProps) => {
  const order = useOrder()
  const currency = props.currency ?? "KES"

  return (
    <div class={props.class}>
      {props.children ?? (
        <span>
          {currency} {order.subtotal().toLocaleString()}
        </span>
      )}
    </div>
  )
}
