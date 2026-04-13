import { Show, splitProps, type JSX } from "solid-js"
import { cn } from "~/lib/utils"
import { Skeleton } from "~/components/ui/skeleton"

export type WishlistSkeletonProps = {
  class?: string
  children?: JSX.Element
}

export const WishlistSkeleton = (props: WishlistSkeletonProps) => {
  const [local] = splitProps(props, ["class", "children"])
  
  return (
    <Show when={local.children} fallback={
      <div class={cn("grid grid-cols-2 md:grid-cols-4 gap-4", local.class)}>
        <WishlistItemSkeleton />
        <WishlistItemSkeleton />
        <WishlistItemSkeleton />
        <WishlistItemSkeleton />
      </div>
    }>
      {local.children}
    </Show>
  )
}

export type WishlistItemSkeletonProps = {
  class?: string
  children?: JSX.Element
}

export const WishlistItemSkeleton = (props: WishlistItemSkeletonProps) => {
  const [local] = splitProps(props, ["class", "children"])
  
  return (
    <Show when={local.children} fallback={
      <div class={cn("space-y-3", local.class)}>
        <Skeleton class="aspect-square rounded-lg" />
        <Skeleton class="h-4 w-3/4" />
        <Skeleton class="h-4 w-1/2" />
      </div>
    }>
      {local.children}
    </Show>
  )
}
