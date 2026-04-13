import type { JSX } from "solid-js"
import { Drawer } from "~/components/ui/drawer"
import { useCartMini } from "./cart-mini-context"

export type CartMiniDrawerProps = {
  children?: JSX.Element
}

export const CartMiniDrawer = (props: CartMiniDrawerProps) => {
  const { open, setOpen } = useCartMini()

  return (
    <Drawer open={open()} onOpenChange={setOpen}>
      {props.children}
    </Drawer>
  )
}
