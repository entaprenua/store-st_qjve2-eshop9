import { Show, type JSX } from "solid-js"
import { Flex } from "../flex"
import { Grid } from "../grid"
import { Skeleton } from "../skeleton"

const ProductSkeleton = (props: { class?: string; children?: JSX.Element }) => {
  return (
    <div class={props.class}>
      <Show when={props.children} fallback={
        <div class="animate-pulse space-y-3">
          <Skeleton class="h-48 w-full rounded-md" />
          <Skeleton class="h-4 w-3/4 rounded" />
          <Skeleton class="h-4 w-1/2 rounded" />
          <Skeleton class="h-8 w-1/3 rounded mt-4" />
        </div>
      }>
        {props.children}
      </Show>
    </div>
  )
}

const ProductCardSkeleton = (props: { class?: string; children?: JSX.Element }) => {
  return (
    <div class={props.class}>
      <Show when={props.children} fallback={
        <div class="animate-pulse space-y-3 p-4 border rounded-lg">
          <Skeleton class="h-48 w-full rounded-md" />
          <Skeleton class="h-4 w-3/4 rounded" />
          <Skeleton class="h-3 w-1/2 rounded" />
          <Flex class="justify-between items-center mt-4">
            <Skeleton class="h-6 w-20 rounded" />
            <Skeleton class="h-8 w-24 rounded" />
          </Flex>
        </div>
      }>
        {props.children}
      </Show>
    </div>
  )
}

const ProductListSkeleton = (props: {
  count?: number
  columns?: number
  class?: string
  children?: JSX.Element
}) => {
  const columns = () => props.columns ?? 4
  const count = () => props.count ?? 8

  return (
    <Show when={props.children} fallback={
      <Grid cols={columns() as any} class={props.class}>
        {Array.from({ length: count() }).map(() => (
          <ProductCardSkeleton />
        ))}
      </Grid>
    }>
      {props.children}
    </Show>
  )
}

const ProductDetailSkeleton = (props: { class?: string; children?: JSX.Element }) => {
  return (
    <Show when={props.children} fallback={
      <Flex flexDirection="col" class={props.class}>
        <div class="animate-pulse space-y-4">
          <Skeleton class="h-96 w-full rounded-md" />
          <Skeleton class="h-8 w-3/4 rounded" />
          <Skeleton class="h-4 w-full rounded" />
          <Skeleton class="h-4 w-2/3 rounded" />
          <Flex class="gap-4 mt-4">
            <Skeleton class="h-10 w-32 rounded" />
            <Skeleton class="h-10 w-32 rounded" />
          </Flex>
        </div>
      </Flex>
    }>
      {props.children}
    </Show>
  )
}

export { ProductSkeleton, ProductCardSkeleton, ProductListSkeleton, ProductDetailSkeleton }
