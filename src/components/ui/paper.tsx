import type { Component, ComponentProps } from "solid-js"
import { splitProps, mergeProps } from "solid-js"
import { cn } from "~/lib/utils"

type PaperProps = {
  elevation?: 0 | 1 | 2 | 3 | 4 | 5
  squareCorners?: boolean
} & ComponentProps<"div">

const ELEVATION_CLASSES = {
  0: "",
  1: "shadow-sm",
  2: "shadow",
  3: "shadow-md",
  4: "shadow-lg",
  5: "shadow-xl",
}

const Paper: Component<PaperProps> = (rawProps) => {
  const props = mergeProps({ elevation: 2, squareCorners: false }, rawProps)
  const [local, others] = splitProps(props, ["class", "elevation", "squareCorners"])

  return (
    <div
      class={cn(
        "bg-background",
        ELEVATION_CLASSES[local.elevation as keyof typeof ELEVATION_CLASSES],
        !local.squareCorners && "rounded-lg",
        local.class
      )}
      {...others}
    />
  )
}

export type { PaperProps }
export { Paper }
