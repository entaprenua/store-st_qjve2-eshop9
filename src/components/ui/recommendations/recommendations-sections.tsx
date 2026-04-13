import { Show, splitProps, type JSX } from "solid-js"
import { Dynamic } from "solid-js/web"
import { useRecommendations } from "./recommendations-context"
import { cn } from "~/lib/utils"

export type RecommendationsTitleProps = {
  class?: string
  level?: "h1" | "h2" | "h3" | "h4"
  children?: JSX.Element
}

const RecommendationsTitle = (props: RecommendationsTitleProps) => {
  const recommendations = useRecommendations()
  const [local] = splitProps(props, ["class", "level", "children"])

  return (
    <Show when={recommendations.products().length > 0}>
      <Dynamic component={local.level ?? "h2"} class={cn("text-2xl font-semibold mb-4", local.class)}>
        {local.children}
      </Dynamic>
    </Show>
  )
}

export {
  RecommendationsTitle,
}
