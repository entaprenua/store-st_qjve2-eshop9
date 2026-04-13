import type { JSX } from "solid-js"
import { Popover } from "~/components/ui/popover"
import { useCartMini } from "./cart-mini-context"

export type CartMiniPopoverProps = {
  children?: JSX.Element
}

export const CartMiniPopover = (props: CartMiniPopoverProps) => {
  const { open, setOpen } = useCartMini()

  return (
    <Popover open={open()} onOpenChange={setOpen}>
      {props.children}
    </Popover>
  )
}
