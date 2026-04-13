import { Show, splitProps, type JSX, createMemo } from "solid-js"
import { HeroProvider, useHero } from "./hero-context"
import { useHeroItem } from "./hero-sections"
import { Query, QueryBoundary } from "../query"
import { Collection, CollectionView } from "../collection"
import { Button } from "../button"
import { Flex } from "../flex"
import { Skeleton } from "../skeleton"
import { cn } from "~/lib/utils"
import { heroApi } from "~/lib/api/heroes"
import { useStoreId } from "~/lib/store-context"
import type { Hero, HeroItem as HeroItemType } from "~/lib/types"

export type HeroRootProps = {
  heroId?: string
  storeId?: string | (() => string | null | undefined)
  data?: Hero
  queryKey?: unknown[]
  enabled?: boolean
  errorFallback?: JSX.Element
  loadingFallback?: JSX.Element
  class?: string
  children?: JSX.Element
}

const HeroRoot = (props: HeroRootProps) => {
  const [local, others] = splitProps(props, [
    "heroId", "storeId", "data", "queryKey", "enabled", "errorFallback", "loadingFallback", "class", "children"
  ])

  const contextStoreId = useStoreId()

  const resolvedStoreId = createMemo(() => {
    if (local.storeId) {
      return typeof local.storeId === "function" ? local.storeId() : local.storeId
    }
    return contextStoreId()
  })

  const hasStoreId = createMemo(() => !!resolvedStoreId())

  const queryFn = async () => {
    const sid = resolvedStoreId()
    if (!sid) return null
    return await heroApi.getByStoreId(sid)
  }

  const queryKey = createMemo(() => {
    const sid = resolvedStoreId()
    return local.queryKey ?? ["hero", local.heroId, sid]
  })
  return (
    <Show when={local.data} fallback={
      <Show when={hasStoreId()} fallback={<HeroSkeleton />}>
        <Query
          queryFn={queryFn}
          queryKey={queryKey()}
          enabled={local.enabled ?? true}
        >
          <QueryBoundary
            loadingFallback={local.loadingFallback ?? <HeroSkeleton />}
            errorFallback={local.errorFallback}
          >{items => (
            <HeroRootContent
              data={items as Hero | undefined}
              class={local.class}
            >{local.children}
            </HeroRootContent>
          )}
          </QueryBoundary>
        </Query>
      </Show>
    }>
      <Show when={local.data!.items && local.data!.items.length > 0} fallback={null}>
        <HeroProvider initialHero={local.data!}>
          <div class={local.class} {...others as any}>{local.children}</div>
        </HeroProvider>
      </Show>
    </Show>
  )
}

const HeroRootContent = (props: { data?: Hero; class?: string; children?: JSX.Element }) => {
  return (
    <Show when={props.data?.items && props.data.items.length > 0} fallback={null}>
      <HeroProvider initialHero={props.data}>
        <div class={props.class}>{props.children}</div>
      </HeroProvider>
    </Show>
  )
}

export type HeroItemsProps = {
  class?: string
  children?: JSX.Element
}

const HeroItems = (props: HeroItemsProps) => {
  const hero = useHero()
  const items = createMemo(() => hero?.items() ?? [])
  const [local] = splitProps(props, ["class", "children"])

  return (
    <Collection data={items()}>
      {local.children}
    </Collection>
  )
}

export type HeroItemsViewProps = {
  class?: string
  children?: JSX.Element
}

const HeroItemsView = (props: HeroItemsViewProps) => {
  const [local] = splitProps(props, ["class", "children"])

  return (
    <CollectionView class={local.class}>
      {local.children}
    </CollectionView>
  )
}

export type HeroItemProps = {
  item?: HeroItemType
  aspectRatio?: string
  maxHeight?: number
  class?: string
  children?: JSX.Element
}

const HeroItem = (props: HeroItemProps) => {
  const hero = useHero()
  const [local, others] = splitProps(props, ["item", "aspectRatio", "maxHeight", "class", "children"])

  const heroItem = useHeroItem()

  const item = createMemo(() => local.item ?? heroItem() ?? null)

  const bgStyle = createMemo(() => {
    const i = item()
    if (!i) return {}

    if (i.backgroundType === 'gradient' && i.backgroundGradient) {
      return { background: i.backgroundGradient }
    }
    if (i.backgroundType === 'color' && i.backgroundColor) {
      return { 'background-color': i.backgroundColor }
    }
    if (i.backgroundType === 'image' && i.backgroundImageUrl) {
      return {
        'background-image': `url(${i.backgroundImageUrl})`,
        'background-size': 'cover',
        'background-position': 'center',
      }
    }
    return {}
  })

  const positionClass = createMemo(() => {
    const i = item()
    const pos = i?.contentPosition ?? 'center'
    const map: Record<string, string> = {
      'top-left': 'items-start justify-start text-left',
      'top-center': 'items-start justify-center text-center',
      'top-right': 'items-start justify-end text-right',
      'center-left': 'items-center justify-start text-left',
      'center': 'items-center justify-center text-center',
      'center-right': 'items-center justify-end text-right',
      'bottom-left': 'items-end justify-start text-left',
      'bottom-center': 'items-end justify-center text-center',
      'bottom-right': 'items-end justify-end text-right',
    }
    return map[pos] ?? 'items-center justify-center text-center'
  })

  return (
    <Show when={item()}>
      <div
        class={cn("relative w-full overflow-hidden", local.class)}
        style={{
          'aspect-ratio': local.aspectRatio ?? '16/9',
          'max-height': local.maxHeight ? `${local.maxHeight}px` : undefined,
          ...bgStyle(),
        }}
        {...others}
      >
        <Show when={item()!.backgroundType === 'image' && item()!.overlayColor}>
          <div
            class="absolute inset-0"
            style={{
              'background-color': item()!.overlayColor!,
              opacity: Number(item()!.overlayOpacity ?? 0.3)
            }}
          />
        </Show>

        <Flex flexDirection="col" class={cn("relative z-10 p-8 h-full", positionClass())}>
          {local.children ?? (
            <>
              <Show when={item()!.subtitle}>
                <p class="text-sm uppercase tracking-wider mb-2" style={{ color: item()!.subtitleColor ?? 'white' }}>
                  {item()!.subtitle}
                </p>
              </Show>
              <Show when={item()!.title}>
                <p class="text-3xl md:text-5xl font-bold mb-4" style={{ color: item()!.titleColor ?? 'white' }}>
                  {item()!.title}
                </p>
              </Show>
              <Show when={item()!.description}>
                <p class="text-lg max-w-xl mb-6" style={{ color: item()!.descriptionColor ?? 'white' }}>
                  {item()!.description}
                </p>
              </Show>
              <Flex class={cn("gap-3", item()!.textAlignment === 'center' && 'justify-center', item()!.textAlignment === 'right' && 'justify-end')}>
                <Show when={item()!.ctaText && item()!.ctaUrl}>
                  <Button as="a" href={item()!.ctaUrl!} variant={item()!.ctaStyle as any} target={item()!.ctaTarget}>
                    {item()!.ctaText}
                  </Button>
                </Show>
                <Show when={item()!.ctaSecondaryText && item()!.ctaSecondaryUrl}>
                  <Button as="a" href={item()!.ctaSecondaryUrl!} variant={item()!.ctaSecondaryStyle as any} target={item()!.ctaSecondaryTarget}>
                    {item()!.ctaSecondaryText}
                  </Button>
                </Show>
              </Flex>
            </>
          )}
        </Flex>
      </div>
    </Show>
  )
}

const HeroSkeleton = (props: { class?: string }) => (
  <div class={cn("relative w-full", props.class)} style={{ 'aspect-ratio': '16/9' }}>
    <Skeleton class="absolute inset-0" />
  </div>
)

export {
  HeroRoot,
  HeroProvider,
  HeroItems,
  HeroItemsView,
  HeroItem,
  HeroSkeleton,
  useHero,
}
