import type { Component, ComponentProps, } from "solid-js"
import { 
  splitProps, 
} from "solid-js";
import { useCarousel } from "./CarouselContext";
import { cn } from "~/lib/utils"

export const CarouselItem: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"])
  const { orientation } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      class={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        local.class
      )}
      {...others}
    >
      {local.children}
    </div>
  )
}
