import { splitProps, type JSX, For, createMemo } from "solid-js"
import { useContext } from "solid-js"
import { Collection, CollectionView, CollectionEmpty, type CollectionViewProps } from "../collection"
import { useQueryState } from "../query"
import { productsApi, type ProductFilters } from "~/lib/api/products"
import { useStoreId } from "~/lib/store-context"
import type { Product, PagedResponse } from "~/lib/types"
import { ProductPaginationContext, ProductPaginationProvider } from "./product-pagination-context"

type ProductListProps = {
  storeId?: string
  categoryId?: string
  filters?: ProductFilters
  searchQuery?: string
  pageSize?: number
  queryKey?: unknown[]
  enabled?: boolean
  errorFallback?: JSX.Element
  loadingFallback?: JSX.Element
  children?: JSX.Element
}

const ProductListInner = (props: ProductListProps) => {
  const [local] = splitProps(props, [
    "storeId",
    "categoryId",
    "filters",
    "searchQuery",
    "pageSize",
    "queryKey",
    "enabled",
    "errorFallback",
    "loadingFallback",
    "children",
  ])

  const contextStoreId = useStoreId()
  const paginationCtx = useContext(ProductPaginationContext)
  const query = useQueryState()

  const resolvedStoreId = createMemo(() => local.storeId ?? contextStoreId())

  const queryFn = async (): Promise<Product[] | null> => {
    const storeId = resolvedStoreId()
    if (!storeId) return null

    const apiPage = paginationCtx ? paginationCtx.page() - 1 : 0
    const apiPageSize = paginationCtx ? paginationCtx.pageSize() : (local.pageSize ?? 20)

    let response: PagedResponse<Product> | null = null

    if (local.searchQuery) {
      response = await productsApi.search(storeId, local.searchQuery, apiPage, apiPageSize, local.filters)
    } else if (local.categoryId) {
      response = await productsApi.getByCategory(storeId, local.categoryId, apiPage, apiPageSize)
    } else {
      response = await productsApi.getAll(storeId, apiPage, apiPageSize, local.filters)
    }

    if (paginationCtx && response) {
      paginationCtx.syncTotals(response)
    }

    return response?.content ?? null
  }

  const key = local.searchQuery
    ? ["products", "search", resolvedStoreId(), local.searchQuery, local.filters]
    : local.categoryId
      ? ["products", "category", resolvedStoreId(), local.categoryId]
      : ["products", "list", resolvedStoreId(), local.filters]

  return (
    <Collection
      queryFn={queryFn}
      queryKey={local.queryKey ?? key}
      enabled={local.enabled ?? true}
      loadingFallback={local.loadingFallback ?? <DefaultProductListLoading />}
      errorFallback={local.errorFallback}
    >
      {local.children}
    </Collection>
  )
}

const ProductList = (props: ProductListProps) => {
  return (
    <ProductPaginationProvider initialPageSize={props.pageSize}>
      <ProductListInner {...props} />
    </ProductPaginationProvider>
  )
}

const DefaultProductListLoading = () => (
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <For each={[1, 2, 3, 4, 5, 6, 7, 8]}>
      {() => (
        <div class="animate-pulse space-y-3 p-4 border rounded-lg">
          <div class="h-48 bg-muted rounded-md" />
          <div class="h-4 bg-muted rounded w-3/4" />
          <div class="h-4 bg-muted rounded w-1/2" />
        </div>
      )}
    </For>
  </div>
)

type ProductListViewProps = {
  class?: string
  children?: JSX.Element
}

// Passed to ProductList(only shows when list is not null)
const ProductListView = (props: ProductListViewProps) => {
  return (
    <CollectionView class={props.class}>
      {props.children}
    </CollectionView>
  )
}

/* Passsed to ProductList, only shows when product is null */
const ProductListEmptyView = (props: { class?: string; children?: JSX.Element }) => {
  return (
    <CollectionEmpty class={props.class}>
      {props.children ?? <DefaultEmptyMessage />}
    </CollectionEmpty>
  )
}

const DefaultEmptyMessage = () => (
  <div class="flex flex-col items-center justify-center min-h-[30vh] gap-2">
    <span class="text-muted-foreground text-lg">No products found</span>
  </div>
)


export { ProductList, ProductListView, ProductListEmptyView }
export type { ProductListProps, ProductListViewProps }
