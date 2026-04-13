import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "~/components/ui/sheet"
import { useCartMini } from "./cart-mini-context"
import { CartItems, CartSummary, CartCheckoutTrigger } from "./cart-sections"
import { Button } from "~/components/ui/button"

export const CartSheet = () => {
  const { open, setOpen } = useCartMini()

  return (
    <Sheet open={open()} onOpenChange={setOpen}>
      <SheetTrigger as="div">
        <Button variant="ghost">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <CartItems />
        <CartSummary />
        <CartCheckoutTrigger />
      </SheetContent>
    </Sheet>
  )
}
