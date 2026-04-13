import { createContext, useContext, createSignal, type Accessor, type JSX } from "solid-js"
import type { PagedResponse } from "~/lib/types"

export type ProductPaginationContextValue = {
  page: Accessor<number>
  pageSize: Accessor<number>
  totalElements: Accessor<number>
  totalPages: Accessor<number>
  setPage: (page: number) => void
  syncTotals: (response: PagedResponse<unknown>) => void
  resetPagination: () => void
}

const ProductPaginationContext = createContext<ProductPaginationContextValue>()

export const useProductPagination = (): ProductPaginationContextValue => {
  const ctx = useContext(ProductPaginationContext)
  if (!ctx) {
    throw new Error("useProductPagination must be used within ProductPaginationProvider")
  }
  return ctx
}

type ProductPaginationProviderProps = {
  initialPage?: number
  initialPageSize?: number
  children?: JSX.Element
}

export function ProductPaginationProvider(props: ProductPaginationProviderProps) {
  const [page, setPageSignal] = createSignal(props.initialPage ?? 1)
  const [pageSize, setPageSize] = createSignal(props.initialPageSize ?? 20)
  const [totalElements, setTotalElements] = createSignal(0)
  const [totalPages, setTotalPages] = createSignal(1)

  const setPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages()) {
      setPageSignal(newPage)
    }
  }

  const syncTotals = (response: PagedResponse<unknown>) => {
    setTotalElements(response.totalElements ?? 0)
    setTotalPages(response.totalPages ?? 1)
  }

  const resetPagination = () => {
    setPageSignal(1)
    setTotalElements(0)
    setTotalPages(1)
  }

  const value: ProductPaginationContextValue = {
    page,
    pageSize,
    totalElements,
    totalPages,
    setPage,
    syncTotals,
    resetPagination,
  }

  return (
    <ProductPaginationContext.Provider value={value}>
      {props.children}
    </ProductPaginationContext.Provider>
  )
}

export { ProductPaginationContext }
