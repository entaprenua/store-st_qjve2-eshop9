import { DialogProps, Dialog, useDialog } from "../dialog"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import {
  Context, useContext, createContext,
  splitProps, mergeProps,
} from "solid-js"

const SheetContext = createContext<any>(null)
const useSheet = () => useContext(SheetContext)

type VariantProps = "permanent" | "persistent" | "temporary"
type PositionProps = "bottom" | "left" | "right" | "top"

type SheetProps = {
   hideBackdrop?: boolean
   /* pass  to position prop of SheetContent */ 
   position?: PositionProps //Not used yet 
   variant?: VariantProps 
   onClose?: DialogProps["onOpenChange"]
   children?: DialogProps["children"]
} & DialogProps 

const Sheet = (props: SheetProps) => { 
   
   props = mergeProps({
     variant: "temporary" as VariantProps, 
     closeOnEscapeKeyDown: props.variant === "temporary"? true: false,
     closeOnInteractOutside: props.variant === "temporary"? true: false,
     closeOnFocusOutside: props.variant === "temporary"? true: false,
  }, props)   

    const [local, others] = splitProps(props , [
     "modal", 
     "variant",
     "onClose",
     "open", 
     "position", 
  ]) 

  const value = {
    get position(){ return local.position}, 
    get variant(){
      return local.variant
    },
  }
 
  return (
      <Dialog
          onOpenChange={local.onClose}
	  /* If modal not set explicitly do the conditional */ 
	  modal={local.modal?? local.variant == "temporary"? true : false} 
	  /* If permanent, no close call can change it to false */ 
	  open={local.variant == "permanent"? true : local.open} 
          {...others} 
      >
        <SheetContext.Provider value={value}>  
          {props.children} 
        </SheetContext.Provider> 
    </Dialog>
  )
}

export type { SheetProps }
export { Sheet, useSheet }


