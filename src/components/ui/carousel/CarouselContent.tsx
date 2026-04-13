import type { Component, ComponentProps } from "solid-js"
import { splitProps } from "solid-js"
import { cn } from "~/lib/utils"
import { useCarousel } from "./CarouselContext"

type CarouselContentProps = ComponentProps<"div">

export const CarouselContent: Component<CarouselContentProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"])
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} class="overflow-hidden">
      <div
        class={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          local.class
        )}
        {...others}
      >
        {local.children}
      </div>
    </div>
  )
}
