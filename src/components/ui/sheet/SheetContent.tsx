/* Was Copied from: solid-ui/SheetContent */

import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js"
import { splitProps, Show } from "solid-js"
import * as SheetPrimitive from "@kobalte/core/dialog"
import { PolymorphicProps } from "@kobalte/core/polymorphic"
import { cva } from "class-variance-authority"
import type { VariantProps } from "class-variance-authority"
import CrossIcon from "lucide-solid/icons/x"
import { cn } from "~/lib/utils"
import { useSheet } from "./Sheet"
import { useDialog } from "../dialog"
import { type OverlayHandlers, createOverlayHandlers } from "../overlay-behavior"

 /* setting inset-0 disables ouside clicks, so we removed it 
  *  we changed position tor relative 
  */
const portalVariants = cva("relative z-auto flex", {
  variants: {
    position: {
      top: "items-start",
      bottom: "items-end",
      left: "justify-start",
      right: "justify-end"
    }
  },
  defaultVariants: { position: "right" }
})
 
type PortalProps = SheetPrimitive.DialogPortalProps & VariantProps<typeof portalVariants>

{/* Issue: Type error when type is set */}
const SheetPortal: Component<PortalProps> = (props) => {
  const [local, others] = splitProps(props, ["position","children"])
  return (
    <SheetPrimitive.Portal {...others}>
      <div class={portalVariants({ position: local.position })}>
           {local.children}
      </div>
    </SheetPrimitive.Portal>
  )
}
 
type DialogOverlayProps<T extends ValidComponent = "div"> = SheetPrimitive.DialogOverlayProps<T> & {
  class?: string | undefined
}
 
const SheetOverlay = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DialogOverlayProps<T>>
) => {
  const [local, others] = splitProps(props as DialogOverlayProps, ["class"])
  return (
    <SheetPrimitive.Overlay
      class={cn(
        "fixed z-50 inset-0 bg-black/80 data-[expanded=]:animate-in data-[closed=]:animate-out data-[closed=]:fade-out-0 data-[expanded=]:fade-in-0",
        local.class
      )}
      {...others}
    />
  )
}
 
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[closed=]:duration-300 data-[expanded=]:duration-500 data-[expanded=]:animate-in data-[closed=]:animate-out",
  {
    variants: {
      position: {
        top: "inset-x-0 top-0 border-b data-[closed=]:slide-out-to-top data-[expanded=]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[closed=]:slide-out-to-bottom data-[expanded=]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[closed=]:slide-out-to-left data-[expanded=]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[closed=]:slide-out-to-right data-[expanded=]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      position: "right"
    }
  }
)
type DialogContentProps<T extends ValidComponent = "div"> = SheetPrimitive.DialogContentProps<T> &
  VariantProps<typeof sheetVariants> & OverlayHandlers &
    { class?: string | undefined; children?: JSX.Element }
 
const SheetContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DialogContentProps<T>>
) => {
  const [local, others] = splitProps(props as DialogContentProps, [
     "position",
     "class", 
     "children",
  ])
  const sheet = useSheet()
  const dialog = useDialog()
  const handlers = createOverlayHandlers()
  
  return (
    <> 
    <SheetPortal position={local.position}> 
      <Show when={dialog?.showBackdrop && sheet?.variant == "temporary"}> 
        <SheetOverlay />
      </Show>
     <SheetPrimitive.Content
        class={cn(
          sheetVariants({ position: local.position?? sheet?.position }),
          local.class,
          "max-h-screen overflow-y-auto"
        )}
        {...handlers}
        {...others}
      >
        {local.children}
        <Show when={!(sheet?.variant === "permanent")}> 
          <SheetPrimitive.CloseButton class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <CrossIcon class="size-5" />
          </SheetPrimitive.CloseButton>
       </Show> 
      </SheetPrimitive.Content>
    </SheetPortal> 
   </> 
  )
}

export type { DialogContentProps as SheetContentProps }
export { SheetContent}
