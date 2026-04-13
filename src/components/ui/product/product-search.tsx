import type { JSX } from "solid-js"
import { Search } from "@kobalte/core/search"
import { SearchItemProvider } from "../search"
import { useProductSearch } from "./product-search-context"
import { Product } from "./product-root"
import type { Product as ProductType } from "~/lib/types"


export type ProductSearchProps = {
  placeholder?: string
  class?: string
  itemComponent?: JSX.Element
  children?: JSX.Element
}

export function ProductSearch(props: ProductSearchProps) {
  const context = useProductSearch()
  /*props.itemComponent may include SearchItem, Product etc */
  return (
    <Search<ProductType>
      options={context.results()}
      onInputChange={context.handleSearch}
      optionValue="id"
      optionLabel="name"
      itemComponent={(itemProps) => (
        <SearchItemProvider item={itemProps.item}>
          {props.itemComponent}
        </SearchItemProvider>
      )}
    >
      {props.children}
    </Search>
  )
}
