import { splitProps, Match, Switch, type JSX, For, createMemo } from "solid-js"
import { cn } from "~/lib/utils"
import { Collection, CollectionView, CollectionEmpty, useCollectionItem } from "../collection"
import { useProduct } from "./product-context"

type ProductMediaItemType = "image" | "video" | "audio" | "document" | "file"

type MediaVariants = {
  thumbnail?: { url: string; width: number; height: number }
  small?: { url: string; width: number; height: number }
  medium?: { url: string; width: number; height: number }
  large?: { url: string; width: number; height: number }
}

type MediaItemProps = {
  id: string
  url: string
  type?: ProductMediaItemType
  mimeType?: string
  sizeBytes?: number
  width?: number
  height?: number
  alt?: string
  variants?: MediaVariants
  isPrimary?: boolean
  displayOrder?: number
  insertedAt?: string
  updatedAt?: string
}



const detectMediaType = (src?: string): ProductMediaItemType => {
  if (!src) return "image"
  const ext = src.split(".").pop()?.toLowerCase()?.split("?")[0]
  const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico", "avif"]
  const videoExts = ["mp4", "webm", "ogg", "mov", "avi", "mkv", "m4v"]
  const audioExts = ["mp3", "wav", "ogg", "aac", "flac", "m4a", "wma"]

  if (ext && imageExts.includes(ext)) return "image"
  if (ext && videoExts.includes(ext)) return "video"
  if (ext && audioExts.includes(ext)) return "audio"
  return "image"
}

type ProductMediaItemProps = {
  src?: string
  type?: ProductMediaItemType
  alt?: string
  class?: string
  autoplay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
  poster?: string
}

const ProductMediaItem = (props: ProductMediaItemProps) => {
  const [local, others] = splitProps(props, [
    "src", "type", "alt", "class", "autoplay", "controls", "loop", "muted", "poster"
  ])

  const collectionItem = useCollectionItem()
  const mediaItem = () => collectionItem?.item as ProductMediaItemProps | undefined

  const src = () => local.src ?? mediaItem()?.url
  const alt = () => local.alt ?? mediaItem()?.alt
  const type = () => local.type ?? mediaItem()?.type ?? detectMediaType(src())

  return (
    <Switch fallback={
      <img src={src()} alt={alt() ?? ""} class="size-full object-cover" />
    }>
      <Match when={type() === "video"}>
        <video
          src={src()}
          class={local.class}
          autoplay={local.autoplay}
          controls={local.controls}
          loop={local.loop}
          muted={local.muted}
          poster={local.poster}
          {...others}
        />
      </Match>
      <Match when={type() === "audio"}>
        <audio
          src={src()}
          class={local.class}
          autoplay={local.autoplay}
          controls={local.controls}
          loop={local.loop}
          muted={local.muted}
          {...others}
        />
      </Match>
    </Switch>
  )
}

type ProductMediaProps = {
  class?: string
  children?: JSX.Element
}

const ProductMedia = (props: ProductMediaProps) => {
  const product = useProduct()
  const [local] = splitProps(props, ["children"])

  const mediaItems = createMemo(() => {
    const items = product?.data?.media as ProductMediaItemProps[] | undefined
  })

  return (
    <Collection
      data={mediaItems() ?? []}
    >
      {local.children}
    </Collection>
  )
}
type ProductMediaViewProps = {
  class?: string
  children?: JSX.Element
}

// Passed to ProductList(only shows when list is not null)
const ProductMediaView = (props: ProductMediaViewProps) => {
  return (
    <CollectionView class={props.class}>
      {props.children}
    </CollectionView>
  )
}

/* Passsed to ProductList, only shows when product is null */
const ProductMediaEmptyView = (props: { class?: string; children?: JSX.Element }) => {
  return (
    <CollectionEmpty class={props.class}>
      {props.children}
    </CollectionEmpty>
  )
}




export { ProductMedia, ProductMediaView, ProductMediaEmptyView, ProductMediaItem, detectMediaType }
export type { ProductMediaItemType, MediaItemProps, ProductMediaItemProps }
