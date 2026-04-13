# Query Component

Enterprise-grade data fetching component built on TanStack Query (`@tanstack/solid-query`).

## Features

- Automatic caching with configurable stale/gc times
- Retry logic with exponential backoff
- Suspense-ready with ErrorBoundary support
- TypeScript generics for type-safe data
- Context-based state sharing via `useQueryState()`
- Composable sub-components for loading/error states

## Installation

```bash
pnpm add @tanstack/solid-query
```

## Basic Usage

```tsx
import { Query, QueryBoundary, useQueryState } from "~/components/ui/query"

function MyComponent() {
  return (
    <Query
      queryKey={["users"]}
      queryFn={() => fetch("/api/users").then(r => r.json())}
    >
      <QueryBoundary>
        {(data) => (
          <ul>
            {data.map(user => <li key={user.id}>{user.name}</li>)}
          </ul>
        )}
      </QueryBoundary>
    </Query>
  )
}
```

## With Custom Loading/Error States

```tsx
<Query queryKey={["posts"]} queryFn={fetchPosts}>
  <QueryBoundary
    loadingFallback={<MySkeleton />}
    errorFallback={(error, retry) => (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={retry}>Retry</button>
      </div>
    )}
  >
    {(data) => <PostList posts={data} />}
  </QueryBoundary>
</Query>
```

## Using useQueryState Hook

```tsx
function MyComponent() {
  return (
    <Query queryKey={["data"]} queryFn={fetchData}>
      <ChildComponent />
    </Query>
  )
}

function ChildComponent() {
  const { data, isLoading, isError, refetch } = useQueryState()

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error!</div>

  return (
    <div>
      {data}
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  )
}
```

## Components

### `<Query>`

Main wrapper component. Creates query context.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `queryKey` | `unknown[]` | required | Unique key for caching |
| `queryFn` | `() => Promise<T>` | - | Async fetcher function |
| `enabled` | `boolean` | `true` | Enable/disable fetching |
| `staleTime` | `number` | `300000` (5min) | Time before data is stale |
| `gcTime` | `number` | `600000` (10min) | Time before garbage collection |
| `retry` | `number \| boolean` | `3` | Retry attempts |
| `client` | `QueryClient` | - | Custom query client |

### `<QueryBoundary>`

Combined Suspense + ErrorBoundary wrapper.

| Prop | Type | Description |
|------|------|-------------|
| `loadingFallback` | `JSX.Element` | Shown during loading |
| `errorFallback` | `JSX.Element \| (error, retry) => JSX` | Shown on error |
| `children` | `JSX.Element \| (data) => JSX` | Content on success |

### `<QueryLoading>`

Loading spinner component.

```tsx
<QueryLoading class="my-custom-class">
  Custom loading text...
</QueryLoading>
```

### `<QueryError>`

Error display component.

```tsx
<QueryError message="Failed to load" />
```

### `<QueryErrorMessage>`

Displays error message from query.

```tsx
<QueryErrorMessage />
```

### `<QueryTrigger>`

Button to trigger fetch/refetch.

```tsx
<QueryTrigger variant="outline" size="sm">
  Load Data
</QueryTrigger>
```

### `<QueryRetryTrigger>`

Button to retry failed query.

```tsx
<QueryRetryTrigger>Try Again</QueryRetryTrigger>
```

### `<QueryCancelTrigger>`

Button to cancel/reset query.

```tsx
<QueryCancelTrigger>Cancel</QueryCancelTrigger>
```

### `<QueryOverlay>`

Loading overlay for existing content.

```tsx
<div class="relative">
  <QueryOverlay opacity={0.7} />
  <MyContent />
</div>
```

## useQueryState() Return Value

```ts
{
  data: TData | undefined,      // Fetched data
  error: TError | null,         // Error object
  isLoading: boolean,           // Initial loading
  isError: boolean,             // Has error
  isSuccess: boolean,           // Successfully loaded
  isFetching: boolean,          // Fetching (including refetch)
  isRefetching: boolean,        // Refetching in background
  isStale: boolean,             // Data is stale
  refetch: () => Promise<void>, // Trigger refetch
}
```

## Global Query Client

```tsx
import { defaultQueryClient, QueryClient } from "~/components/ui/query"

// Customize defaults
defaultQueryClient.setDefaultOptions({
  queries: {
    staleTime: 1000 * 60 * 10, // 10 minutes
  },
})

// Or create your own
const myClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: Infinity },
  },
})

<Query queryKey={["data"]} queryFn={fetchData} client={myClient}>
  ...
</Query>
```

## Conditional Fetching

```tsx
const [userId, setUserId] = createSignal<string | null>(null)

<Query
  queryKey={() => ["user", userId()]}
  queryFn={() => fetchUser(userId()!)}
  enabled={userId() !== null}
>
  ...
</Query>
```

## Dependent Queries

```tsx
function MyComponent() {
  const user = useQueryState<User>() // From parent Query

  return (
    <Query
      queryKey={() => ["posts", user.data?.id]}
      queryFn={() => fetchUserPosts(user.data!.id)}
      enabled={!!user.data}
    >
      ...
    </Query>
  )
}
```

## TypeScript

```tsx
interface User {
  id: string
  name: string
}

<Query<User>
  queryKey={["user", "123"]}
  queryFn={() => fetchUser("123")}
>
  <QueryBoundary>
    {(data) => <div>{data.name}</div>} {/* data is typed as User */}
  </QueryBoundary>
</Query>

const { data } = useQueryState<User>() // data: User | undefined
```
