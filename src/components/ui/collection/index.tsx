/*
 * Collection Components
 * 
 * A data-fetching and layout system for rendering lists/grids of items.
 * 
 * Usage:
 *   - Remote fetch: Collection queryFn={fetchFn} layout="grid" columns={4} > CollectionView > children
 *   - Local data: Collection data={array} layout="grid" columns={4} > CollectionView > children
 *   - Static children: Collection > CollectionView > Component (uses useCollectionItem)
 *   - Fallbacks: Collection loadingFallback={...} errorFallback={...}
 * 
 * Flow:
 *   1. Collection wraps TanStack Query (queryFn) OR accepts local data
 *   2. Layout props (layout, columns, gap) passed to Collection
 *   3. CollectionView gets data/layout from Collection context
 *   4. Children: function (item, index) => JSX OR static JSX (wrapped in CollectionItem)
 *   5. CollectionItem provides context: { item, index, collection, value }
 *   6. useCollectionItem() accesses current item in child components
 */

import { Query, QueryBoundary, useQueryState } from "./../query"
import {
  splitProps, Switch, children, createContext, useContext, For, Match, Show, createMemo,
  type JSX, type Accessor,
} from "solid-js"
import { cn } from "~/lib/utils"


// Collection Context
// ============================================================================

type CollectionContextValue = {
  data: Accessor<any[]>
}

const CollectionContext = createContext<CollectionContextValue>()

const useCollectionContext = (): CollectionContextValue => {
  const ctx = useContext(CollectionContext)
  if (!ctx) {
    throw new Error("CollectionView must be used within Collection")
  }
  return ctx
}

// ============================================================================
// CollectionItem (provides item context)
// ============================================================================

type CollectionItemContextValue = {
  item: any
  collection: any
  index: number
  value: any
}

const CollectionItemContext = createContext<CollectionItemContextValue | undefined>()

/**
 * Hook to access the query state from Collection
 * Alias for useQueryState - for accessing query data within Collection
 */
const useCollection = useQueryState

/**
 * Hook to access current item in Collection iteration
 */
const useCollectionItem = (): CollectionItemContextValue | undefined => useContext(CollectionItemContext)

/**
 * Hook to access Collection data (full array)
 */
const useCollectionData = (): Accessor<any[]> => {
  const ctx = useContext(CollectionContext)
  if (!ctx) {
    throw new Error("useCollectionData must be used within Collection")
  }
  return ctx.data
}

type CollectionItemProps = {
  item: any
  index: number
  collection: any
  children?: JSX.Element
}

const CollectionItem = (props: CollectionItemProps) => {
  const value: CollectionItemContextValue = {
    get index() { return props.index },
    get item() { return props.item },
    get collection() { return props.collection },
    get value() { return props.item },
  }

  return (
    <CollectionItemContext.Provider value={value}>
      {props.children}
    </CollectionItemContext.Provider>
  )
}

// ============================================================================
// Collection (data fetching + layout config)
// ============================================================================

type CollectionProps = {
  children?: JSX.Element
  errorFallback?: JSX.Element
  loadingFallback?: JSX.Element
  /** Function to fetch data remotely */
  queryFn?: () => Promise<any>
  /** Direct data array (alternative to queryFn) */
  data?: any[]
  queryKey?: unknown[]
  enabled?: boolean
}

const Collection = (props: CollectionProps) => {
  const [local] = splitProps(props, [
    "children",
    "errorFallback",
    "loadingFallback",
    "queryFn",
    "data",
    "queryKey",
    "enabled",
  ])

  // Data accessor - from query or direct
  const resolvedData = (): any[] => local.data ?? []

  // If queryFn is provided, use remote fetch mode
  if (local.queryFn) {
    return (
      <Query
        queryFn={local.queryFn}
        queryKey={local.queryKey ?? ["collection"]}
        enabled={local.enabled ?? true}
      >
        <QueryBoundary
          loadingFallback={local.loadingFallback}
          errorFallback={local.errorFallback}
        >
          <CollectionInner
            data={() => {
              const query = useQueryState()
              return (query?.data as any[]) ?? []
            }}
          >
            {local.children}
          </CollectionInner>
        </QueryBoundary>
      </Query>
    )
  }

  // Direct data mode
  return (
    <CollectionInner
      data={resolvedData}
    >
      {local.children}
    </CollectionInner>
  )
}

// Inner component that provides context
const CollectionInner = (props: {
  data: Accessor<any[]>
  children?: JSX.Element
}) => {
  const contextValue: CollectionContextValue = {
    data: props.data,
  }

  return (
    <CollectionContext.Provider value={contextValue}>
      {props.children}
    </CollectionContext.Provider>
  )
}

// ============================================================================
// CollectionEmpty
// ============================================================================

type CollectionEmptyProps = {
  class?: string
  children?: JSX.Element
}

const CollectionEmpty = (props: CollectionEmptyProps) => {
  const [local, others] = splitProps(props, ["class", "children"])
  const { data } = useCollectionContext()

  return (
    <Show when={data().length === 0}>
      <div
        class={cn(
          "flex flex-col justify-center items-center min-h-[30vh] h-full",
          local.class
        )}
        {...others}
      >
        {local.children}
      </div>
    </Show>
  )
}

// ============================================================================
// CollectionView (renders with layout)
// ============================================================================

/**
 * Renders collection data with layout options
 * Gets data and layout from Collection context
 * 
 * Props:
 *   - class: CSS class for wrapper
 *   - children: JSX.Element OR function (item, index) => JSX
 */
type CollectionViewProps = {
  class?: string
  children?: JSX.Element | ((item: any, index: number) => JSX.Element)
}

const CollectionView = (props: CollectionViewProps) => {
  const [local] = splitProps(props, ["class", "children"])
  const { data } = useCollectionContext()

  const resolvedChildren = children(() => local.children as any)
  /**
   * Renders children:
   * - If children is a function: call it for each item
   * - If children is static JSX: wrap in CollectionItem for context
   */
  return (
    <Show when={data().length > 0}>
      <Show when={typeof resolvedChildren() !== "function"}
        fallback={
          <For each={data()}>
            {(item: any, index: () => number) =>
              (resolvedChildren() as any)(item, index())
            }
          </For>
        }
      >
        <For each={data()}>
          {(item: any, index: () => number) => (
            <CollectionItem item={item} index={index()} collection={data()}>
              {local.children as JSX.Element}
            </CollectionItem>
          )}
        </For>
      </Show>
    </Show>
  )
}

export {
  Collection,
  CollectionItem,
  CollectionView,
  CollectionEmpty,
  useCollection,
  useCollectionItem,
  useCollectionData,
  useCollectionContext,
  CollectionContext,
  CollectionItemContext,
}

export type {
  CollectionViewProps,
  CollectionItemProps,
}
