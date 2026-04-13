import { Show, type JSX } from "solid-js"
import { cn } from "~/lib/utils"
import { Skeleton } from "../skeleton"

const HeroSkeleton = (props: { class?: string; children?: JSX.Element }) => (
  <div class={cn("relative w-full", props.class)} style={{ 'aspect-ratio': '16/9' }}>
    <Show when={props.children} fallback={<Skeleton class="absolute inset-0" />}>
      {props.children}
    </Show>
  </div>
)

const HeroItemSkeleton = (props: { class?: string; children?: JSX.Element }) => (
  <div class={cn("relative w-full overflow-hidden", props.class)} style={{ 'aspect-ratio': '16/9' }}>
    <Show when={props.children} fallback={
      <>
        <Skeleton class="absolute inset-0" />
        <div class="relative z-10 p-8 h-full flex flex-col items-center justify-center text-center">
          <Skeleton class="h-4 w-24 mb-2" />
          <Skeleton class="h-10 w-64 mb-4" />
          <Skeleton class="h-6 w-96 mb-6" />
          <div class="flex gap-3">
            <Skeleton class="h-10 w-32" />
            <Skeleton class="h-10 w-32" />
          </div>
        </div>
      </>
    }>
      {props.children}
    </Show>
  </div>
)

export {
  HeroSkeleton,
  HeroItemSkeleton,
}
