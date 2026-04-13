import { Show, type JSX, For } from "solid-js"
import { cn } from "~/lib/utils"
import { Skeleton } from "~/components/ui/skeleton"
import { Flex } from "~/components/ui/flex"

const RecommendationsSkeleton = (props: { class?: string; count?: number; children?: JSX.Element }) => {
  const count = () => props.count ?? 4
  
  return (
    <div class={cn("relative w-full", props.class)}>
      <Show when={props.children} fallback={
        <Flex class="gap-4" wrap>
          <For each={Array.from({ length: count() })}>
            {() => (
              <RecommendationsItemSkeleton />
            )}
          </For>
        </Flex>
      }>
        {props.children}
      </Show>
    </div>
  )
}

const RecommendationsItemSkeleton = (props: { class?: string; children?: JSX.Element }) => (
  <div class={cn("relative w-full overflow-hidden", props.class)}>
    <Show when={props.children} fallback={
      <>
        <Skeleton class="h-48 w-full mb-2" />
        <Skeleton class="h-4 w-3/4 mb-1" />
        <Skeleton class="h-4 w-1/2" />
      </>
    }>
      {props.children}
    </Show>
  </div>
)

export {
  RecommendationsSkeleton,
  RecommendationsItemSkeleton,
}
