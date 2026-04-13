export type ModalProps = {
 /* Eg on clicking backdrop */ 
 closeOnFocusOutside?:  boolean //eg overlay click
 /* eg clicking a button, opening another dialog, popover */ 
 closeOnInteractOutside?: boolean
 closeOnPointerDownOutside?: boolean
 closeOnEscapeKeyDown?: boolean
 showBackdrop?: boolean
}

export type ModalContentProps = {
    onEscapeKeyDown?: (event) => void
    onInteractOutside?: (event) => void
    onFocusOutside?: (event) => void
    onPointerDownOutside?: (event) => void
}
 
