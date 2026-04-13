import type { JSX } from "solid-js"
import { Sheet } from "~/components/ui/sheet"
import { useCartMini } from "./cart-mini-context"

export type CartMiniSheetProps = {
  children?: JSX.Element
}

export const CartMiniSheet = (props: CartMiniSheetProps) => {
  const { open, setOpen } = useCartMini()

  return (
    <Sheet open={open()} onOpenChange={setOpen}>
      {props.children}
    </Sheet>
  )
}
