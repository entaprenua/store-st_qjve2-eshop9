import { splitProps, type JSX, createMemo, For, Show, useContext, createContext } from "solid-js"
import { Collection, CollectionView, CollectionItem, useCollectionItem } from "../collection"
import { categoriesApi } from "~/lib/api/categories"
import { useStoreId } from "~/lib/store-context"
import type { Category } from "~/lib/types"

const CategoryTreeDepthContext = createContext<{
  currentDepth: () => number
  maxDepth: () => number
}>()

export const useCategoryTreeDepth = () => {
  const ctx = useContext(CategoryTreeDepthContext)
  if (!ctx) return { currentDepth: () => 1, maxDepth: () => 10 }
  return ctx
}

type CategoryTreeProps = {
  maxDepth?: number
  queryKey?: unknown[]
  enabled?: boolean
  errorFallback?: JSX.Element
  loadingFallback?: JSX.Element
  children?: JSX.Element
}

const CategoryTree = (props: CategoryTreeProps) => {
  const [local] = splitProps(props, [
    "maxDepth",
    "queryKey",
    "enabled",
    "errorFallback",
    "loadingFallback",
    "children",
  ])

  const storeId = useStoreId()
  const maxDepth = createMemo(() => local.maxDepth ?? 10)

  const queryFn = async (): Promise<Category[] | null> => {
    if (!storeId()) return null
    const response = await categoriesApi.getTree(storeId())
    return response.content
  }

  return (
    <Collection
      queryFn={queryFn}
      queryKey={["categories", "tree", storeId()]}
      enabled={local.enabled ?? true}
      loadingFallback={local.loadingFallback ?? <DefaultCategoryTreeLoading />}
      errorFallback={local.errorFallback}
    >
      <CategoryTreeDepthContext.Provider value={{ currentDepth: () => 1, maxDepth: maxDepth }}>
        {local.children}
      </CategoryTreeDepthContext.Provider>
    </Collection>
  )
}

type CategoryTreeViewProps = {
  class?: string
  children?: JSX.Element
}

const CategoryTreeView = (props: CategoryTreeViewProps) => {
  return (
    <CollectionView class={props.class}>
      {props.children}
    </CollectionView>
  )
}

type CategoryTreeSubcategoriesProps = {
  class?: string
  children?: JSX.Element
}

const CategoryTreeSubcategories = (props: CategoryTreeSubcategoriesProps) => {
  const [local] = splitProps(props, ["class", "children"])

  const depthCtx = useCategoryTreeDepth()
  const currentItem = useCollectionItem()

  const nextDepth = () => depthCtx.currentDepth() + 1

  const subcategories = createMemo(() => {
    const item = currentItem?.item as Category | undefined
    return item?.subcategories ?? null
  })

  const hasSubcategories = () => {
    const subs = subcategories()
    return subs && subs.length > 0 && nextDepth() <= depthCtx.maxDepth()
  }

  return (
    <Show when={hasSubcategories()}>
      <For each={subcategories()}>
        {(subcategory, index) => (
          <CategoryTreeDepthContext.Provider value={{ currentDepth: nextDepth, maxDepth: depthCtx.maxDepth }}>
            <CollectionItem item={subcategory} index={index()} collection={subcategories()}>
              {local.children}
            </CollectionItem>
          </CategoryTreeDepthContext.Provider>
        )}
      </For>
    </Show>
  )
}

const DefaultCategoryTreeLoading = (props: { class?: string }) => (
  <div class={props.class ?? "flex flex-col gap-2 p-2"}>
    <div class="animate-pulse h-12 bg-muted rounded" />
    <div class="animate-pulse h-12 bg-muted rounded" />
  </div>
)

export { CategoryTree, CategoryTreeView, CategoryTreeSubcategories, DefaultCategoryTreeLoading }
export type { CategoryTreeProps, CategoryTreeViewProps, CategoryTreeSubcategoriesProps }
