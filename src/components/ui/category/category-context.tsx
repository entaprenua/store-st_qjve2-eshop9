import { createContext, useContext, type Accessor, type JSX, createMemo } from "solid-js"

export type CategoryProps = {
  id?: string
  storeId?: string
  name?: string
  slug?: string | null
  image?: string | null
  level?: number | null
  visibility?: string
  parentId?: string | null
  path?: string | null
  isDeleted?: boolean
  version?: number
  insertedAt?: string
  updatedAt?: string
}

export type CategoryContextValue = {
  data: Accessor<CategoryProps | null>
  id: Accessor<string | null>
  name: Accessor<string | null>
  slug: Accessor<string | null>
  image: Accessor<string | null>
  level: Accessor<number | null>
  parentId: Accessor<string | null>
  path: Accessor<string | null>
  depth: Accessor<number | null>
  isRoot: Accessor<boolean>
}

const CategoryContext = createContext<CategoryContextValue>()

const ParentCategoryContext = createContext<string | undefined>()

export const useCategory = (): CategoryContextValue => {
  const ctx = useContext(CategoryContext)
  if (!ctx) {
    throw new Error("useCategory must be used within CategoryContext")
  }
  return ctx
}

export const useParentCategoryId = (): string | undefined => {
  return useContext(ParentCategoryContext)
}

type CategoryProviderProps = {
  data?: CategoryProps | null
  children?: JSX.Element
}

export const CategoryProvider = (props: CategoryProviderProps) => {
  const data = createMemo(() => props.data ?? null)

  const id = createMemo(() => data()?.id ?? null)
  const name = createMemo(() => data()?.name ?? null)
  const slug = createMemo(() => data()?.slug ?? null)
  const image = createMemo(() => data()?.image ?? null)
  const level = createMemo(() => data()?.level ?? null)
  const parentId = createMemo(() => data()?.parentId ?? null)
  const path = createMemo(() => data()?.path ?? null)

  const depth = createMemo(() => {
    const p = path()
    if (!p) return null
    const parts = p.split('.')
    return parts.length
  })

  const isRoot = createMemo(() => {
    return parentId() === null || parentId() === undefined
  })

  const contextValue: CategoryContextValue = {
    data,
    id,
    name,
    slug,
    image,
    level,
    parentId,
    path,
    depth,
    isRoot,
  }

  return (
    <CategoryContext.Provider value={contextValue}>
      {props.children}
    </CategoryContext.Provider>
  )
}

export { CategoryContext, ParentCategoryContext }
export type { CategoryProviderProps }
