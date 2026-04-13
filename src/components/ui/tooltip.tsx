import type { Component, ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import * as TooltipPrimitive from "@kobalte/core/tooltip"
import { cn } from "~/lib/utils"
import {
  type OverlayBehaviorProps, OVERLAY_BEHAVIOR_KEYS, OverlayBehavior, useOverlayBehavior,
} from "./overlay-behavior"

const TooltipTrigger = TooltipPrimitive.Trigger
const TooltipArrow = TooltipPrimitive.Arrow

const useTooltip = useOverlayBehavior

type TooltipProps = TooltipPrimitive.TooltipRootProps & OverlayBehaviorProps

const Tooltip: Component<TooltipProps> = (props) => {
  const [local, rest] = splitProps(props, OVERLAY_BEHAVIOR_KEYS)
  return (
    <OverlayBehavior {...local}>
      <TooltipPrimitive.Root gutter={4} {...rest} />
    </OverlayBehavior>
  )
}

type TooltipContentProps<T extends ValidComponent = "div"> =
  TooltipPrimitive.TooltipContentProps<T> & { class?: string | undefined }

const TooltipContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, TooltipContentProps<T>>
) => {
  const [local, others] = splitProps(props as TooltipContentProps, ["class"])

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        class={cn(
          "z-50 origin-[var(--kb-popover-content-transform-origin)] rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
          local.class
        )}
        {...others}
      />
    </TooltipPrimitive.Portal>
  )
}

export type { TooltipContentProps, TooltipProps }
export { TooltipContent, Tooltip, TooltipTrigger, TooltipArrow, useTooltip }
