import type { Component, ComponentProps, JSX } from "solid-js"
import { Show, splitProps } from "solid-js"
import { cn } from "~/lib/utils"
import { useCarousel } from "./CarouselContext"
import { IconButton } from "../icon-button"
import ChevronRight from "lucide-solid/icons/chevron-right"

type CarouselNextProps = Omit<ComponentProps<"button">, "children"> & {
  /** Custom icon */
  children?: JSX.Element
}

export const CarouselNext: Component<CarouselNextProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "onClick", "children"])
  const carousel = useCarousel()

  const handleClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (e) => {
    carousel.scrollNext()
    if (typeof local.onClick === "function") {
      local.onClick(e)
    }
  }

  return (
    <Show when={carousel.canScrollNext()}>
      <IconButton
        variant="outline"
        size="sm"
        class={cn(
          "absolute size-8 touch-manipulation rounded-full",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          carousel.orientation === "horizontal"
            ? "-right-12 top-1/2 -translate-y-1/2"
            : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
          local.class
        )}
        onClick={handleClick}
        aria-label="Next slide"
        {...others}
      >
        <Show when={local.children} fallback={<ChevronRight class="size-4" />}>
          {local.children}
        </Show>
      </IconButton>
    </Show>
  )
}
