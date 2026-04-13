import { splitProps, type JSX, createMemo, createContext, useContext, Show } from "solid-js"
import { useProduct } from "./product-context"
import { cn } from "~/lib/utils"

const ProductMetadataContext = createContext<{
  key: string
  value: () => string | undefined
}>()

export const useProductMetadata = () => {
  const ctx = useContext(ProductMetadataContext)
  if (!ctx) {
    throw new Error("useProductMetadata must be used within ProductMetadataEntry")
  }
  return ctx
}

const formatKey = (key: string): string => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

type ProductMetadataEntryProps = {
  name: string
  defaultValue?: string
  class?: string
  children?: JSX.Element
}

const ProductMetadataEntry = (props: ProductMetadataEntryProps) => {
  const [local] = splitProps(props, ["name", "defaultValue", "class", "children"])
  const product = useProduct()

  const value = createMemo(() => {
    const metadata = product?.data?.metadata as Record<string, string> | undefined
    return metadata?.[local.name]
  })

  const resolvedValue = createMemo(() => {
    return value() ?? local.defaultValue
  })

  const hasValue = createMemo(() => {
    const v = resolvedValue()
    return v !== undefined && v !== null && v !== ''
  })

  const contextValue = {
    key: local.name,
    value: resolvedValue,
  }

  return (
    <ProductMetadataContext.Provider value={contextValue}>
      <Show when={hasValue()}>
        <div class={local.class}>
          {local.children}
        </div>
      </Show>
    </ProductMetadataContext.Provider>
  )
}

type ProductMetadataEntryKeyProps = {
  class?: string
}

const ProductMetadataEntryKey = (props: ProductMetadataEntryKeyProps) => {
  const [local] = splitProps(props, ["class"])
  const ctx = useProductMetadata()

  const formattedKey = createMemo(() => formatKey(ctx.key))

  return (
    <span class={local.class}>
      {formattedKey()}
    </span>
  )
}

type ProductMetadataEntryValueProps = {
  class?: string
}

const ProductMetadataEntryValue = (props: ProductMetadataEntryValueProps) => {
  const [local] = splitProps(props, ["class"])
  const ctx = useProductMetadata()

  return (
    <span class={local.class}>
      {ctx.value()}
    </span>
  )
}

export {
  ProductMetadataEntry,
  ProductMetadataEntryKey,
  ProductMetadataEntryValue,
}

export type {
  ProductMetadataEntryProps,
  ProductMetadataEntryKeyProps,
  ProductMetadataEntryValueProps,
}
