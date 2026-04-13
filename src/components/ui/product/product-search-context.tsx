import { createContext, useContext, createSignal, type Accessor, type JSX } from "solid-js"
import { productsApi } from "~/lib/api/products"
import { useStoreId } from "~/lib/store-context"
import type { Product } from "~/lib/types"

export type ProductSearchContextValue = {
  query: Accessor<string>
  results: Accessor<Product[]>
  isLoading: Accessor<boolean>
  selectedProduct: Accessor<Product | null>
  handleSearch: (query: string) => void
  selectProduct: (product: Product) => void
  clearSelection: () => void
}

const ProductSearchContext = createContext<ProductSearchContextValue>()

export const useProductSearch = (): ProductSearchContextValue => {
  const ctx = useContext(ProductSearchContext)
  if (!ctx) {
    throw new Error("useProductSearch must be used within ProductSearchProvider")
  }
  return ctx
}

type ProductSearchProviderProps = {
  storeId?: string
  debounceMs?: number
  maxResults?: number
  children?: JSX.Element
}

export function ProductSearchProvider(props: ProductSearchProviderProps) {
  const contextStoreId = useStoreId()
  const resolvedStoreId = () => props.storeId ?? contextStoreId()

  const [query, setQuery] = createSignal("")
  const [results, setResults] = createSignal<Product[]>([])
  const [isLoading, setIsLoading] = createSignal(false)
  const [selectedProduct, setSelectedProduct] = createSignal<Product | null>(null)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  const debounceMs = () => props.debounceMs ?? 300
  const maxResults = () => props.maxResults ?? 10

  const searchProducts = async (searchQuery: string) => {
    const storeId = resolvedStoreId()
    if (!storeId || searchQuery.length < 2) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await productsApi.search(storeId, searchQuery, 0, maxResults())
      setResults(response.content)
    } catch (error) {
      console.error("Product search failed:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)

    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    if (!searchQuery || searchQuery.length < 2) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    debounceTimer = setTimeout(() => {
      searchProducts(searchQuery)
    }, debounceMs())
  }

  const selectProduct = (product: Product) => {
    setSelectedProduct(product)
  }

  const clearSelection = () => {
    setSelectedProduct(null)
  }

  const value: ProductSearchContextValue = {
    query,
    results,
    isLoading,
    selectedProduct,
    handleSearch,
    selectProduct,
    clearSelection,
  }

  return (
    <ProductSearchContext.Provider value={value}>
      {props.children}
    </ProductSearchContext.Provider>
  )
}

export { ProductSearchContext }
