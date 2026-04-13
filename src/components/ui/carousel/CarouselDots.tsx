import type { Component, ComponentProps } from "solid-js"
import { For, Show, splitProps } from "solid-js"
import { cn } from "~/lib/utils"
import { useCarousel } from "./CarouselContext"

type CarouselDotsProps = ComponentProps<"div"> & {
  /** Custom class for dot buttons */
  dotClass?: string
  /** Show dot labels (slide numbers) */
  showLabels?: boolean
}

export const CarouselDots: Component<CarouselDotsProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "dotClass", "showLabels"])
  const carousel = useCarousel()

  return (
    <Show when={carousel.showDots && carousel.slideCount() > 1}>
      <div
        class={cn(
          "flex items-center justify-center gap-2",
          local.class
        )}
        role="tablist"
        aria-label="Carousel navigation"
        {...others}
      >
        <For each={carousel.scrollSnaps()}>
          {(_, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={index() === carousel.selectedIndex()}
              aria-label={`Go to slide ${index() + 1}`}
              class={cn(
                "size-2.5 rounded-full transition-all",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                index() === carousel.selectedIndex()
                  ? "bg-primary scale-100"
                  : "bg-muted-foreground/25 scale-75 hover:bg-muted-foreground/50",
                local.dotClass
              )}
              onClick={() => carousel.scrollTo(index())}
            >
              <Show when={local.showLabels}>
                <span class="sr-only">{index() + 1}</span>
              </Show>
            </button>
          )}
        </For>
      </div>
    </Show>
  )
}
