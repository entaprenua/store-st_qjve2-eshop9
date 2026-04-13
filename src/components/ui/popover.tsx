import type { Component, ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import * as PopoverPrimitive from "@kobalte/core/popover"
import { cn } from "~/lib/utils"
import {
  type OverlayBehaviorProps, OVERLAY_BEHAVIOR_KEYS, OverlayBehavior, useOverlayBehavior,
  type OverlayHandlers, OVERLAY_HANDLER_KEYS, createOverlayHandlers,
} from "./overlay-behavior"

type PopoverTriggerProps = PopoverPrimitive.PopoverTriggerProps
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverCloseButton = PopoverPrimitive.CloseButton
const PopoverTitle = PopoverPrimitive.Title
const PopoverArrow = PopoverPrimitive.Arrow
const PopoverDescription = PopoverPrimitive.Description

const usePopover = useOverlayBehavior

type PopoverProps = PopoverPrimitive.PopoverRootProps & OverlayBehaviorProps

const Popover: Component<PopoverProps> = (props) => {
  const [local, rest] = splitProps(props, OVERLAY_BEHAVIOR_KEYS)
  return (
    <OverlayBehavior {...local}>
      <PopoverPrimitive.Root gutter={4} {...rest} />
    </OverlayBehavior>
  )
}

type PopoverContentProps<T extends ValidComponent = "div"> =
  PopoverPrimitive.PopoverContentProps<T> & OverlayHandlers & { class?: string | undefined }

const PopoverContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, PopoverContentProps<T>>
) => {
  const [local, others] = splitProps(props as PopoverContentProps, [
    "class", ...OVERLAY_HANDLER_KEYS,
  ])
  const handlers = createOverlayHandlers()

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        class={cn(
          "z-50 w-72 origin-[var(--kb-popover-content-transform-origin)] rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95",
          local.class
        )}
        {...handlers}
        {...others}
      />
    </PopoverPrimitive.Portal>
  )
}

export type { PopoverContentProps, PopoverProps, PopoverTriggerProps }
export {
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverTitle,
  PopoverTrigger,
  PopoverContent,
  PopoverDescription,
  usePopover,
}
