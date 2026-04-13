import { splitProps, type JSX, createMemo, createContext, useContext, type Accessor } from "solid-js"
import { Collection, CollectionView, useCollectionItem } from "../collection"
import { useParentCategoryId } from "./category-context"
import { categoriesApi } from "~/lib/api/categories"
import { useStoreId } from "~/lib/store-context"
import type { Category } from "~/lib/types"

const CategoryDepthContext = createContext<{
  currentDepth: Accessor<number>
  maxDepth: Accessor<number>
}>()

export const useCategoryDepth = () => {
  const ctx = useContext(CategoryDepthContext)
  if (!ctx) return { currentDepth: () => 1, maxDepth: () => 3 }
  return ctx
}

type CategoryListProps = {
  storeId?: string
  maxDepth?: number
  queryKey?: unknown[]
  enabled?: boolean
  errorFallback?: JSX.Element
  loadingFallback?: JSX.Element
  children?: JSX.Element
}

const CategoryList = (props: CategoryListProps) => {
  const [local] = splitProps(props, [
    "storeId",
    "maxDepth",
    "queryKey",
    "enabled",
    "errorFallback",
    "loadingFallback",
    "children",
  ])

  const contextStoreId = useStoreId()
  const resolvedStoreId = createMemo(() => local.storeId ?? contextStoreId())
  const maxDepth = createMemo(() => local.maxDepth ?? 3)

  const depthCtx = {
    currentDepth: () => 1,
    maxDepth,
  }

  const queryFn = async (): Promise<Category[] | null> => {
    const storeId = resolvedStoreId()
    if (!storeId) return null
    return (await categoriesApi.getRoot(storeId)).content
  }

  return (
    <CategoryDepthContext.Provider value={depthCtx}>
      <Collection
        queryFn={queryFn}
        queryKey={["categories", "list", resolvedStoreId()]}
        enabled={local.enabled ?? true}
        loadingFallback={local.loadingFallback ?? <DefaultCategoryListLoading />}
        errorFallback={local.errorFallback}
      >
        {local.children}
      </Collection>
    </CategoryDepthContext.Provider>
  )
}

type CategoryListViewProps = {
  class?: string
  children?: JSX.Element
}

const CategoryListView = (props: CategoryListViewProps) => {
  return (
    <CollectionView class={props.class}>
      {props.children}
    </CollectionView>
  )
}

type SubcategoryListProps = {
  storeId?: string
  page?: number
  pageSize?: number
  queryKey?: unknown[]
  enabled?: boolean
  errorFallback?: JSX.Element
  loadingFallback?: JSX.Element
  class?: string
  children?: JSX.Element
}

const SubcategoryList = (props: SubcategoryListProps) => {
  const [local] = splitProps(props, [
    "storeId",
    "page",
    "pageSize",
    "queryKey",
    "enabled",
    "errorFallback",
    "loadingFallback",
    "class",
    "children",
  ])

  const depthCtx = useCategoryDepth()
  const parentCategoryId = useParentCategoryId()

  if (!parentCategoryId) return null

  const nextDepth = () => depthCtx.currentDepth() + 1
  if (nextDepth() > depthCtx.maxDepth()) return null

  const contextStoreId = useStoreId()
  const resolvedStoreId = createMemo(() => local.storeId ?? contextStoreId())

  const childDepthCtx = {
    currentDepth: nextDepth,
    maxDepth: depthCtx.maxDepth,
  }

  const queryFn = async (): Promise<Category[] | null> => {
    const storeId = resolvedStoreId()
    if (!storeId || !parentCategoryId) return []
    const response = await categoriesApi.getByParent(storeId, parentCategoryId, local.page ?? 0, local.pageSize ?? 20)
    return response.content
  }

  return (
    <CategoryDepthContext.Provider value={childDepthCtx}>
      <Collection queryFn={queryFn} queryKey={["categories", "children", resolvedStoreId(), parentCategoryId]}>
        {local.children}
      </Collection>
    </CategoryDepthContext.Provider>
  )
}

const DefaultCategoryListLoading = (props: { class?: string }) => (
  <div class={props.class ?? "flex flex-col gap-2 p-2"}>
    <div class="animate-pulse h-12 bg-muted rounded" />
    <div class="animate-pulse h-12 bg-muted rounded" />
  </div>
)

export { CategoryList, CategoryListView, SubcategoryList, DefaultCategoryListLoading }
export type { CategoryListProps, CategoryListViewProps, SubcategoryListProps }
