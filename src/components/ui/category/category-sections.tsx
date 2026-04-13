import { Show, splitProps, type JSX } from "solid-js"
import { useCategory } from "./category-context"
import { useCollectionItem } from "../collection"
import { cn } from "~/lib/utils"
import type { Category } from "~/lib/types"

const useCategoryData = (): (() => Category | undefined) => {
  const collectionItem = useCollectionItem()
  if (collectionItem) return () => collectionItem.item as Category

  const categoryCtx = useCategory()
  return categoryCtx.data as (() => Category | null) as () => Category | undefined
}

type CategoryNameProps = {
  class?: string
}

const CategoryName = (props: CategoryNameProps) => {
  const category = useCategoryData()
  return (
    <span class={props.class}>
      {category()?.name}
    </span>
  )
}

type CategoryImageProps = {
  class?: string
  alt?: string
}

const CategoryImage = (props: CategoryImageProps) => {
  const [local] = splitProps(props, ["class", "alt"])
  const category = useCategoryData()
  const image = () => category()?.image
  const alt = () => local.alt ?? category()?.name ?? "Category image"

  return (
    <Show when={image()}>
      <img
        src={image()!}
        alt={alt()}
        class={cn("size-full object-cover", local.class)}
      />
    </Show>
  )
}

type CategorySlugProps = {
  class?: string
}

const CategorySlug = (props: CategorySlugProps) => {
  const category = useCategoryData()
  return (
    <span class={props.class}>
      {category()?.slug}
    </span>
  )
}

type CategoryLevelProps = {
  class?: string
}

const CategoryLevel = (props: CategoryLevelProps) => {
  const category = useCategoryData()
  return (
    <span class={props.class}>
      {category()?.level}
    </span>
  )
}

type CategoryDepthProps = {
  class?: string
}

const CategoryDepth = (props: CategoryDepthProps) => {
  const category = useCategoryData()
  const depth = () => {
    const p = category()?.path
    if (!p) return category()?.level ?? 1
    return p.split('.').length
  }
  return (
    <span class={props.class}>
      {depth()}
    </span>
  )
}

type CategoryPathProps = {
  class?: string
}

const CategoryPath = (props: CategoryPathProps) => {
  const category = useCategoryData()
  return (
    <span class={props.class}>
      {category()?.path}
    </span>
  )
}

type CategoryParentIdProps = {
  class?: string
}

const CategoryParentId = (props: CategoryParentIdProps) => {
  const category = useCategoryData()
  return (
    <span class={props.class}>
      {category()?.parentId}
    </span>
  )
}

type CategoryIdProps = {
  class?: string
}

const CategoryId = (props: CategoryIdProps) => {
  const category = useCategoryData()
  return (
    <span class={props.class}>
      {category()?.id}
    </span>
  )
}

export type {
  CategoryNameProps,
  CategoryImageProps,
  CategorySlugProps,
  CategoryLevelProps,
  CategoryDepthProps,
  CategoryPathProps,
  CategoryParentIdProps,
  CategoryIdProps,
}

export {
  CategoryName,
  CategoryImage,
  CategorySlug,
  CategoryLevel,
  CategoryDepth,
  CategoryPath,
  CategoryParentId,
  CategoryId,
}
