import type { Component, JSX } from "solid-js"
import { splitProps, createMemo, mergeProps, useContext, createContext } from "solid-js"

type OverlayBehaviorProps = {
  children?: JSX.Element
  closeOnEscapeKeyDown?: boolean
  closeOnInteractOutside?: boolean
  closeOnFocusOutside?: boolean
  closeOnPointerDownOutside?: boolean
  showBackdrop?: boolean
}

const OVERLAY_BEHAVIOR_KEYS = [
  "closeOnEscapeKeyDown",
  "closeOnInteractOutside",
  "closeOnFocusOutside",
  "closeOnPointerDownOutside",
  "showBackdrop",
] as const

type OverlayHandlers = {
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onInteractOutside?: (event: Event) => void
  onFocusOutside?: (event: FocusEvent) => void
  onPointerDownOutside?: (event: PointerEvent) => void
}

const OVERLAY_HANDLER_KEYS = [
  "onEscapeKeyDown",
  "onInteractOutside",
  "onFocusOutside",
  "onPointerDownOutside",
] as const

type OverlayBehaviorContextValue = {
  closeOnEscapeKeyDown: boolean
  closeOnInteractOutside: boolean
  closeOnFocusOutside: boolean
  closeOnPointerDownOutside: boolean
  showBackdrop: boolean
}

const OverlayBehaviorContext = createContext<OverlayBehaviorContextValue | null>(null)

const useOverlayBehavior = () => useContext(OverlayBehaviorContext)

const createOverlayHandlers = (handlers?: OverlayHandlers) => {
  const context = useOverlayBehavior()

  return createMemo(() => ({
    onEscapeKeyDown: (event: KeyboardEvent) => {
      if (!context?.closeOnEscapeKeyDown) {
        event.preventDefault()
      }
      handlers?.onEscapeKeyDown?.(event)
    },
    onInteractOutside: (event: Event) => {
      if (!context?.closeOnInteractOutside) {
        event.preventDefault()
      }
      handlers?.onInteractOutside?.(event)
    },
    onFocusOutside: (event: FocusEvent) => {
      if (!context?.closeOnFocusOutside) {
        event.preventDefault()
      }
      handlers?.onFocusOutside?.(event)
    },
    onPointerDownOutside: (event: PointerEvent) => {
      if (!context?.closeOnPointerDownOutside) {
        event.preventDefault()
      }
      handlers?.onPointerDownOutside?.(event)
    },
  }))
}

const OverlayBehavior: Component<OverlayBehaviorProps> = (rawProps) => {
  const props = mergeProps(
    {
      showBackdrop: false,
      closeOnEscapeKeyDown: true,
      closeOnInteractOutside: true,
      closeOnFocusOutside: true,
      closeOnPointerDownOutside: true,
    } satisfies OverlayBehaviorProps,
    rawProps
  )

  const [local, rest] = splitProps(props, ["children", ...OVERLAY_BEHAVIOR_KEYS])

  const contextValue: OverlayBehaviorContextValue = {
    get closeOnEscapeKeyDown() { return local.closeOnEscapeKeyDown },
    get closeOnInteractOutside() { return local.closeOnInteractOutside },
    get closeOnFocusOutside() { return local.closeOnFocusOutside },
    get closeOnPointerDownOutside() { return local.closeOnPointerDownOutside },
    get showBackdrop() { return local.showBackdrop },
  }

  return (
    <OverlayBehaviorContext.Provider value={contextValue} {...rest}>
      {local.children}
    </OverlayBehaviorContext.Provider>
  )
}

export type { OverlayBehaviorProps, OverlayHandlers, OverlayBehaviorContextValue }
export { OVERLAY_BEHAVIOR_KEYS, OVERLAY_HANDLER_KEYS, createOverlayHandlers, OverlayBehavior, useOverlayBehavior }
