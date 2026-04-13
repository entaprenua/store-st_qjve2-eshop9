import {
  createContext,
  useContext,
  splitProps,
  Show,
  Switch,
  Match,
  ErrorBoundary,
  Suspense,
  type JSX,
} from "solid-js"
import {
  QueryClient as TanStackQueryClient,
  QueryClientProvider,
  useQuery,
  type QueryClient as QueryClientType,
} from "@tanstack/solid-query"
import { cn } from "~/lib/utils"
import { Box } from "../box"
import { Button } from "../button"

/**
 * TanStack Query v5 with SolidJS SSR Support
 * 
 * TanStack Query's query results are SolidJS resources that work directly
 * with Suspense. No custom wrapper needed - use useQuery + Suspense + ErrorBoundary.
 * 
 * @example
 * ```tsx
 * import { ErrorBoundary, Suspense } from 'solid-js'
 * import { useQuery } from '@tanstack/solid-query'
 * 
 * function MyComponent() {
 *   const query = useQuery(() => ({
 *     queryKey: ['users'],
 *     queryFn: fetchUsers,
 *   }))
 * 
 *   return (
 *     <ErrorBoundary fallback={<div>Error!</div>}>
 *       <Suspense fallback={<div>Loading...</div>}>
 *         <div>{query.data}</div>
 *       </Suspense>
 *     </ErrorBoundary>
 *   )
 * }
 * ```
 */

const defaultQueryClient = new TanStackQueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
})

type QueryState<TData, TError> = {
  data: TData | undefined
  error: TError | null
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  isFetching: boolean
  isRefetching: boolean
  isStale: boolean
  refetch: () => Promise<void>
}

const QueryContext = createContext<QueryState<unknown, unknown> | null>(null)

function useQueryState<TData = unknown, TError = Error>(): QueryState<TData, TError> | null {
  const ctx = useContext(QueryContext)
  return ctx as QueryState<TData, TError> | null
}

type QueryFetcher<TData> = () => Promise<TData>

/**
 * Props for QueryProvider component.
 * 
 * @property queryKey - Unique key for caching (changes trigger refetch)
 * @property queryFn - Async function that returns data
 * @property enabled - Whether to fetch (default: true)
 * @property staleTime - Time in ms before data is stale (default: 5 min)
 * @property gcTime - Time in ms to keep unused data in cache (default: 5 min)
 * @property retry - Number of retries on error (default: 1, or false to disable)
 * @property refetchOnWindowFocus - Refetch when window regains focus (default: true)
 * @property placeholderData - Keep showing old data while fetching new data (prevents UI jump)
 *   Use: placeholderData: (previousData) => previousData
 *   This shows stale data during refetch instead of loading spinner
 */
type QueryProviderProps<TData, TError = Error> = {
  queryKey: unknown[]
  queryFn?: QueryFetcher<TData>
  enabled?: boolean
  staleTime?: number
  gcTime?: number
  retry?: number | boolean
  refetchOnWindowFocus?: boolean
  placeholderData?: (previousData: TData | undefined) => TData | undefined
  children?: JSX.Element
} & JSX.HTMLAttributes<HTMLDivElement>

/**
 * Internal Query Provider component.
 * Wraps TanStack Query's useQuery and exposes state via context.
 * 
 * Key features:
 * - Automatically provides default staleTime (5 min) and retry (1)
 * - Supports placeholderData to prevent UI jumps during refetch
 * - Exposes query state via QueryContext for useQueryState() hook
 */
function QueryProvider<TData = unknown, TError = Error>(props: QueryProviderProps<TData, TError>) {
  const [local, others] = splitProps(props, [
    "queryKey",
    "queryFn",
    "enabled",
    "staleTime",
    "gcTime",
    "retry",
    "refetchOnWindowFocus",
    "placeholderData",
    "children",
    "class",
  ])

  const query = useQuery<TData, TError>(() => ({
    queryKey: local.queryKey,
    queryFn: local.queryFn,
    enabled: local.enabled ?? true,
    staleTime: local.staleTime ?? 1000 * 60 * 5,
    gcTime: local.gcTime,
    retry: local.retry ?? 1,
    refetchOnWindowFocus: local.refetchOnWindowFocus ?? true,
    refetchOnMount: true,
    placeholderData: local.placeholderData as any,
  }))

  const state: QueryState<TData, TError> = {
    get data() {
      return query.data
    },
    get error() {
      return query.error ?? null
    },
    get isLoading() {
      return query.isLoading
    },
    get isError() {
      return query.isError
    },
    get isSuccess() {
      return query.isSuccess
    },
    get isFetching() {
      return query.isFetching
    },
    get isRefetching() {
      return query.isRefetching
    },
    get isStale() {
      return query.isStale
    },
    refetch: async () => {
      await query.refetch()
    },
  }

  return (
    <QueryContext.Provider value={state as QueryState<unknown, unknown>}>
      <div class={local.class} {...others}>
        {local.children}
      </div>
    </QueryContext.Provider>
  )
}

type QueryProps<TData, TError = Error> = QueryProviderProps<TData, TError> & {
  client?: QueryClientType
}

const Query = <TData = unknown, TError = Error>(props: QueryProps<TData, TError>) => {
  const [local, others] = splitProps(props, ["client", "children"])
  const client = () => local.client ?? defaultQueryClient

  return (
    <QueryClientProvider client={client()}>
      <QueryProvider {...others}>{local.children}</QueryProvider>
    </QueryClientProvider>
  )
}

type QueryBoundaryProps = {
  loadingFallback?: JSX.Element
  errorFallback?: JSX.Element | ((error: Error, retry: () => void) => JSX.Element)
  children: JSX.Element | ((data: unknown) => JSX.Element)
}

const QueryBoundary = (props: QueryBoundaryProps) => {
  const query = useQueryState()

  const doRefetch = () => {
    if (query) {
      query.refetch()
    }
  }

  const DefaultErrorFallback = () => (
    <div class="flex flex-col items-center gap-3 p-4 text-center">
      <p class="text-sm text-destructive">Failed to load data</p>
      <Button variant="outline" size="sm" onClick={() => query?.refetch()}>
        Try again
      </Button>
    </div>
  )

  const renderError = () => {
    const error = query?.error as Error
    if (typeof props.errorFallback === "function") {
      return props.errorFallback(error, () => query?.refetch())
    }
    return props.errorFallback ?? <DefaultErrorFallback />
  }

  return (
    <ErrorBoundary fallback={renderError()}>
        <Show when={query} fallback={<div class="text-destructive">QueryBoundary must be used within a Query component</div>}>
          {(q) => (
            <Switch>
              <Match when={q().isLoading}>
                {props.loadingFallback ?? <QueryLoading />}
              </Match>
              <Match when={q().isError}>
                {renderError()}
              </Match>
              <Match when={q().isSuccess}>
                {typeof props.children === "function" 
                  ? props.children(q().data) 
                  : props.children}
              </Match>
            </Switch>
          )}
        </Show>
    </ErrorBoundary>
  )
}

type QueryLoadingProps = JSX.HTMLAttributes<HTMLDivElement>

const QueryLoading = (props: QueryLoadingProps) => {
  const [local, others] = splitProps(props, ["class", "children"])
  
  return (
    <div class={cn("flex items-center justify-center p-4", local.class)} {...others}>
      {local.children ?? (
        <div class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      )}
    </div>
  )
}

type QueryErrorProps = JSX.HTMLAttributes<HTMLDivElement> & {
  message?: string
}

const QueryError = (props: QueryErrorProps) => {
  const [local, others] = splitProps(props, ["class", "children", "message"])
  const query = useQueryState()

  if (!query) return null

  return (
    <Show when={query.isError}>
      <div class={cn("text-destructive", local.class)} {...others}>
        {local.children ?? local.message ?? (query.error as Error)?.message ?? "An error occurred"}
      </div>
    </Show>
  )
}

type QueryErrorMessageProps = JSX.HTMLAttributes<HTMLDivElement>

const QueryErrorMessage = (props: QueryErrorMessageProps) => {
  const [local, others] = splitProps(props, ["class", "children"])
  const query = useQueryState()

  return (
    <div class={local.class} {...others}>
      {local.children}
      {query?.error && (query.error as Error)?.message}
    </div>
  )
}

type QueryErrorCauseProps = JSX.HTMLAttributes<HTMLDivElement>

const QueryErrorCause = (props: QueryErrorCauseProps) => {
  const [local, others] = splitProps(props, ["class", "children"])
  const query = useQueryState()

  return (
    <div class={local.class} {...others}>
      {local.children}
      {query?.error && (query.error as Error & { cause?: string })?.cause}
    </div>
  )
}

type QueryTriggerProps = {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  children?: JSX.Element
  class?: string
  onClick?: (event: MouseEvent) => void
} & Omit<JSX.HTMLAttributes<HTMLButtonElement>, "onClick">

const QueryTrigger = (props: QueryTriggerProps) => {
  const [local, others] = splitProps(props, ["class", "onClick", "variant", "size", "children"])
  const query = useQueryState()

  return (
    <Button
      variant={local.variant ?? "default"}
      size={local.size ?? "default"}
      class={local.class}
      onClick={(e: MouseEvent) => {
        local.onClick?.(e)
        query?.refetch()
      }}
      {...others}
    >
      {local.children ?? "Load"}
    </Button>
  )
}

type QueryRetryTriggerProps = {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  children?: JSX.Element
  class?: string
  onClick?: (event: MouseEvent) => void
} & Omit<JSX.HTMLAttributes<HTMLButtonElement>, "onClick">

const QueryRetryTrigger = (props: QueryRetryTriggerProps) => {
  const [local, others] = splitProps(props, ["class", "onClick", "variant", "size", "children"])
  const query = useQueryState()

  return (
    <Button
      variant={local.variant ?? "outline"}
      size={local.size ?? "default"}
      class={local.class}
      onClick={(e: MouseEvent) => {
        local.onClick?.(e)
        query?.refetch()
      }}
      {...others}
    >
      {local.children ?? "Retry"}
    </Button>
  )
}

type QueryCancelTriggerProps = {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  children?: JSX.Element
  class?: string
  onClick?: (event: MouseEvent) => void
} & Omit<JSX.HTMLAttributes<HTMLButtonElement>, "onClick">

const QueryCancelTrigger = (props: QueryCancelTriggerProps) => {
  const [local, others] = splitProps(props, ["class", "onClick", "variant", "size", "children"])

  return (
    <Button
      variant={local.variant ?? "ghost"}
      size={local.size ?? "default"}
      class={local.class}
      onClick={(e: MouseEvent) => {
        local.onClick?.(e)
      }}
      {...others}
    >
      {local.children ?? "Cancel"}
    </Button>
  )
}

type QueryOverlayProps = JSX.HTMLAttributes<HTMLDivElement> & {
  opacity?: number
}

const QueryOverlay = (props: QueryOverlayProps) => {
  const [local, others] = splitProps(props, ["class", "opacity"])
  const query = useQueryState()

  return (
    <Show when={query?.isFetching}>
      <div
        class={cn(
          "absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm",
          local.class
        )}
        style={{ opacity: local.opacity ?? 0.5 }}
        {...others}
      >
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    </Show>
  )
}

export {
  Query,
  QueryBoundary,
  QueryLoading,
  QueryError,
  QueryErrorMessage,
  QueryErrorCause,
  QueryTrigger,
  QueryRetryTrigger,
  QueryCancelTrigger,
  QueryOverlay,
  useQueryState,
  defaultQueryClient,
  TanStackQueryClient as QueryClient,
}
