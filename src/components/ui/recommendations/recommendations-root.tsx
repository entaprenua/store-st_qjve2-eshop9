import { Show, splitProps, type JSX, createMemo } from "solid-js"
import { RecommendationsProvider, useRecommendations } from "./recommendations-context"
import { Query, QueryBoundary } from "~/components/ui/query"
import { Collection, CollectionView } from "~/components/ui/collection"
import { Flex } from "~/components/ui/flex"
import { Skeleton } from "~/components/ui/skeleton"
import { cn } from "~/lib/utils"
import { recommendationsApi, type RecommendationType, type RecommendationResponse } from "~/lib/api/recommendations"
import { useStoreId } from "~/lib/store-context"
import type { Product } from "~/lib/types"

export type RecommendationsRootProps = {
  type?: RecommendationType
  limit?: number
  data?: RecommendationResponse
  queryKey?: unknown[]
  enabled?: boolean
  errorFallback?: JSX.Element
  loadingFallback?: JSX.Element
  class?: string
  children?: JSX.Element
}

const RecommendationsRoot = (props: RecommendationsRootProps) => {
  const [local, others] = splitProps(props, [
    "type", "limit", "data", "queryKey", "enabled", "errorFallback", "loadingFallback", "class", "children"
  ])

  const contextStoreId = useStoreId()

  const resolvedStoreId = createMemo(() => {
    return contextStoreId()
  })

  const hasStoreId = createMemo(() => !!resolvedStoreId())

  const queryFn = async () => {
    const sid = resolvedStoreId()
    if (!sid) return null
    return recommendationsApi.get(sid, local.type ?? "personalized", local.limit ?? 10)
  }

  const queryKey = createMemo(() => {
    const sid = resolvedStoreId()
    return local.queryKey ?? ["recommendations", local.type ?? "personalized", sid]
  })

  return (
    <Show when={local.data} fallback={
        <Show when={hasStoreId()} fallback={<RecommendationsSkeleton />}>
          <Query 
            queryFn={queryFn} 
            queryKey={queryKey()}
            enabled={local.enabled ?? true}
          >
            <QueryBoundary 
              loadingFallback={local.loadingFallback ?? <RecommendationsSkeleton />} 
              errorFallback={local.errorFallback}
            >{items => (
               <RecommendationsRootContent 
                  data={items as RecommendationResponse | undefined} 
                  class={local.class}
                >{local.children}
               </RecommendationsRootContent>
              )}
            </QueryBoundary>
           </Query>
        </Show>
      }>
      <Show when={local.data!.products.length > 0} fallback={null}>
        <RecommendationsProvider initialData={local.data!}>
          <div class={local.class} {...others as any}>{local.children}</div>
        </RecommendationsProvider>
      </Show>
    </Show>
  )
}

const RecommendationsRootContent = (props: { data?: RecommendationResponse; class?: string; children?: JSX.Element }) => {
  return (
    <Show when={props.data?.products && props.data.products.length > 0} fallback={null}>
      <RecommendationsProvider initialData={props.data}>
        <div class={props.class}>{props.children}</div>
      </RecommendationsProvider>
    </Show>
  )
}

export type RecommendationsItemsProps = {
  class?: string
  children?: JSX.Element
}

const RecommendationsItems = (props: RecommendationsItemsProps) => {
  const recommendations = useRecommendations()
  const items = createMemo(() => recommendations.products())
  const [local] = splitProps(props, ["class", "children"])
  
  return (
    <Collection data={items()}>
      {local.children}
    </Collection>
  )
}

export type RecommendationsItemsViewProps = {
  class?: string
  children?: JSX.Element | ((item: Product, index: number) => JSX.Element)
}

const RecommendationsItemsView = (props: RecommendationsItemsViewProps) => {
  const [local] = splitProps(props, ["class", "children"])
  
  return (
    <CollectionView class={local.class}>
      {local.children}
    </CollectionView>
  )
}

const RecommendationsSkeleton = (props: { class?: string }) => (
  <div class={cn("relative w-full", props.class)}>
    <Flex class="gap-4" wrap>
      {[1, 2, 3, 4].map(() => (
        <div class="flex-none w-64">
          <Skeleton class="h-48 w-full mb-2" />
          <Skeleton class="h-4 w-3/4 mb-1" />
          <Skeleton class="h-4 w-1/2" />
        </div>
      ))}
    </Flex>
  </div>
)

export {
  RecommendationsRoot,
  RecommendationsProvider,
  RecommendationsItems,
  RecommendationsItemsView,
  RecommendationsSkeleton,
  useRecommendations,
}
