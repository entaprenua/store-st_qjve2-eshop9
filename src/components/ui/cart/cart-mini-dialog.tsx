import type { JSX } from "solid-js"
import { Dialog } from "~/components/ui/dialog"
import { useCartMini } from "./cart-mini-context"

export type CartMiniDialogProps = {
  children?: JSX.Element
}

export const CartMiniDialog = (props: CartMiniDialogProps) => {
  const { open, setOpen } = useCartMini()

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      {props.children}
    </Dialog>
  )
}
