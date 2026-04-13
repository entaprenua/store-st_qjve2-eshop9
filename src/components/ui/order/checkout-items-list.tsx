import { type JSX } from "solid-js"

export type CheckoutItemsListProps = {
  class?: string
  children?: JSX.Element
}

export const CheckoutItemsList = (props: CheckoutItemsListProps) => {
  return (
    <div class={props.class}>
      {props.children}
    </div>
  )
}
