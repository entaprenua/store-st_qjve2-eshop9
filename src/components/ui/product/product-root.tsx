import { Show, splitProps, createEffect, useContext, type JSX, createMemo } from "solid-js"
import { A, useParams } from "@solidjs/router"
import { ProductProvider, useProduct, type ProductContextData } from "./product-context"
import { Query, QueryBoundary, useQueryState } from "../query"
import { productsApi } from "~/lib/api/products"
import { useCollectionItem } from "../collection"
import { SearchItemContext } from "../search"
import { useStoreId } from "~/lib/store-context"
import type { Product } from "~/lib/types"

type ProductRootProps = {
  storeId?: string
  productSlug?: string
  data?: ProductContextData | Product
  includeMedia?: boolean
  includeMetadata?: boolean
  queryKey?: unknown[]
  errorFallback?: JSX.Element
  loadingFallback?: JSX.Element
  href?: string
  class?: string
  children?: JSX.Element
}

const ProductRoot = (props: ProductRootProps) => {
  const [local, others] = splitProps(props, [
    "storeId",
    "productSlug",
    "data",
    "includeMedia",
    "includeMetadata",
    "queryKey",
    "errorFallback",
    "loadingFallback",
    "href",
    "class",
    "children",
  ])

  const collectionItem = useCollectionItem()
  const searchItemCtx = useContext(SearchItemContext)
  const params = useParams<{ productSlug?: string; slug?: string }>()
  const contextStoreId = useStoreId()

  const routeProductSlug = createMemo(() => params.productSlug ?? params.slug)
  const resolvedStoreId = createMemo(() => local.storeId ?? contextStoreId())

  const hasExplicitData = () => !!local.data
  const hasCollectionItem = () => !!collectionItem?.item
  const hasSearchItem = () => !!(searchItemCtx?.item as { rawValue?: unknown })?.rawValue
  const hasExplicitFetch = () => !!resolvedStoreId() && (!!local.productSlug || !!routeProductSlug())

  const shouldCreateProvider = () =>
    hasCollectionItem() || hasSearchItem() || hasExplicitData() || hasExplicitFetch()

  const resolvedData = createMemo(() => {
    if (local.data) return local.data
    if (collectionItem?.item) return collectionItem.item as ProductContextData
    const searchItemRawValue = (searchItemCtx?.item as { rawValue?: unknown })?.rawValue
    if (searchItemRawValue) return searchItemRawValue as ProductContextData
    return undefined
  })

  const resolvedHref = createMemo(() => {
    if (!local.href) return undefined
    return local.href
  })

  return (
    <Show
      when={shouldCreateProvider()}
      fallback={
        <ProductWrapper href={resolvedHref()} class={local.class}>
          {local.children}
        </ProductWrapper>
      }
    >
      <Show
        when={hasExplicitData()}
        fallback={
          <Show
            when={hasCollectionItem() || hasSearchItem() && !hasExplicitData()}
            fallback={
              <ProductRootWithFetch
                storeId={resolvedStoreId() ?? undefined}
                productSlug={local.productSlug ?? routeProductSlug()}
                includeMedia={local.includeMedia}
                includeMetadata={local.includeMetadata}
                queryKey={local.queryKey}
                errorFallback={local.errorFallback}
                loadingFallback={local.loadingFallback}
                href={local.href}
                class={local.class}
              >
                {local.children}
              </ProductRootWithFetch>
            }
          >
            <ProductProvider data={resolvedData()!}>
              <ProductWrapper href={resolvedHref()} class={local.class}>
                {local.children}
              </ProductWrapper>
            </ProductProvider>
          </Show>
        }
      >
        <ProductProvider data={local.data!}>
          <ProductWrapper href={resolvedHref()} class={local.class}>
            {local.children}
          </ProductWrapper>
        </ProductProvider>
      </Show>
    </Show>
  )
}

const ProductWrapper = (
  props: { href?: string; class?: string; children?: JSX.Element }
) => {
  const product = useProduct()

  const resolvedHref = () => {
    const productSlug = product?.data?.slug
    if (!productSlug) return undefined

    if (props.href) {
      let base = props.href
      if (base.endsWith("/")) {
        base = base.slice(0, -1)
      }
      if (!base.startsWith("/")) {
        base = `/${base}`
      }
      return `${base}/${productSlug}`
    }

    return `/${productSlug}`
  }

  return (
    <Show
      when={resolvedHref()}
      fallback={
        <div class={props.class}>
          {props.children}
        </div>
      }
    >
      <A href={resolvedHref()!} class={props.class}>
        {props.children}
      </A>
    </Show>
  )
}

const ProductRootWithFetch = (props: Omit<ProductRootProps, "data">) => {
  const [local, others] = splitProps(props, [
    "storeId",
    "productSlug",
    "includeMedia",
    "includeMetadata",
    "queryKey",
    "errorFallback",
    "loadingFallback",
    "href",
    "class",
    "children",
  ])

  const queryFn = async (): Promise<Product | null> => {
    if (local.storeId && local.productSlug) {
      return productsApi.getBySlug(
        local.storeId,
        local.productSlug,
        local.includeMedia ?? false,
        local.includeMetadata ?? false
      )
    }
    return null
  }

  return (
    <Show
      when={local.storeId && local.productSlug}
      fallback={
        <div class="text-destructive text-sm">
          Product requires either data or storeId + productSlug
        </div>
      }
    >
      <Query
        queryFn={queryFn}
        queryKey={
          local.queryKey ?? [
            "product",
            local.storeId,
            local.productSlug,
            local.includeMedia,
            local.includeMetadata,
          ]
        }
      >
        <QueryBoundary
          loadingFallback={
            local.loadingFallback ?? <DefaultProductLoading />
          }
          errorFallback={local.errorFallback}
        >
          <ProductRootContent
            href={local.href}
            class={local.class}
          >
            {local.children}
          </ProductRootContent>
        </QueryBoundary>
      </Query>
    </Show>
  )
}

const ProductRootContent = (props: { href?: string; class?: string; children?: JSX.Element }) => {
  const [local, others] = splitProps(props, ["href", "class", "children"])

  const query = useQueryState()

  const productData = (): Product | null => {
    return (query?.data as Product) ?? null
  }

  return (
    <Show
      when={productData()}
      fallback={
        <div class="text-destructive text-sm">Failed to load product</div>
      }
    >
      <ProductProvider data={productData() as ProductContextData}>
        <ProductWrapper href={local.href} class={local.class}>
          {local.children}
        </ProductWrapper>
      </ProductProvider>
    </Show>
  )
}

const DefaultProductLoading = () => (
  <div class="animate-pulse space-y-3 p-4">
    <div class="h-48 bg-muted rounded-md" />
    <div class="h-4 bg-muted rounded w-3/4" />
    <div class="h-4 bg-muted rounded w-1/2" />
    <div class="h-8 bg-muted rounded w-1/3 mt-4" />
  </div>
)

export { ProductRoot, ProductRoot as Product }
export type { ProductRootProps }
