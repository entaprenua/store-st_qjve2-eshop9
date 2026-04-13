import { Show, splitProps, type JSX, createMemo } from "solid-js"
import { A } from "@solidjs/router"
import { CategoryProvider, ParentCategoryContext, type CategoryProps } from "./category-context"
import { useCollectionItem } from "../collection"

type CategoryRootProps = {
  storeId?: string
  categorySlug?: string
  data?: CategoryProps | null
  class?: string
  children?: JSX.Element
}

const Category = (props: CategoryRootProps) => {
  const [local, others] = splitProps(props, ["storeId", "categorySlug", "data", "class", "children"])

  const collectionItem = useCollectionItem()

  const resolvedData = createMemo(() => {
    if (local.data !== undefined) return local.data
    if (collectionItem) return collectionItem.item as CategoryProps
    return null
  })

  const shouldCreateProvider = () =>
    local.data !== undefined || !!collectionItem

  return (
    <Show
      when={shouldCreateProvider()}
    >
      <CategoryProvider data={resolvedData()}>
        <ParentCategoryContext.Provider value={resolvedData()?.id}>
          <CategoryWrapper class={local.class}>
            {local.children}
          </CategoryWrapper>
        </ParentCategoryContext.Provider>
      </CategoryProvider>
    </Show>
  )
}

type CategoryWrapperProps = {
  href?: string
  class?: string
  children?: JSX.Element
}

const CategoryWrapper = (props: CategoryWrapperProps) => {
  const collectionItem = useCollectionItem()

  const resolvedHref = createMemo(() => {
    if (props.href) return props.href
    const slug = collectionItem?.item?.slug as string | undefined
    if (!slug) return undefined
    return `/${slug}`
  })

  return (
    <Show
      when={resolvedHref()}
      fallback={<div class={props.class}>{props.children}</div>}
    >
      <A href={resolvedHref()!} class={props.class}>
        {props.children}
      </A>
    </Show>
  )
}

export { Category, Category as CategoryRoot, CategoryWrapper }
export type { CategoryRootProps }
