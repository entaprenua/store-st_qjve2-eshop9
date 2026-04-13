import type { JSX } from "solid-js"
import { Show } from "solid-js"
import { Pagination, PaginationItem, PaginationEllipsis, PaginationItemProvider } from "./../pagination"
import { useProductPagination } from "./product-pagination-context"

export type ProductPaginationProps = {
  class?: string
  itemComponent?: JSX.Element
  ellipsisComponent?: JSX.Element
  children?: JSX.Element
}

export function ProductPagination(props: ProductPaginationProps) {
  const context = useProductPagination()

  return (
    <Pagination
      page={context.page()}
      onPageChange={context.setPage}
      count={context.totalPages()}
      itemComponent={(itemProps: { page: number }) => (
        <PaginationItemProvider page={itemProps.page}>
          <Show when={props.itemComponent}
            fallback={<PaginationItem />}
          >
            {props.itemComponent}
          </Show>
        </PaginationItemProvider>
      )}
      ellipsisComponent={() => (
        <Show when={props.ellipsisComponent} fallback={<PaginationEllipsis> ... </PaginationEllipsis>}>
          {props.ellipsisComponent}
        </Show>
      )}
    >
      {props.children}
    </Pagination >
  )
}

export type ProductPaginationInfoProps = {
  class?: string
}

export function ProductPaginationInfo(props: ProductPaginationInfoProps) {
  const context = useProductPagination()

  const from = () => ((context.page() - 1) * context.pageSize()) + 1
  const to = () => Math.min(context.page() * context.pageSize(), context.totalElements())

  return (
    <span class={props.class}>
      Showing {from()} to {to()} of {context.totalElements()} products
    </span>
  )
}
