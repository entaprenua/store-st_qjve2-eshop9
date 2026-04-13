# ErrorBoundary Components

Codeless error handling components that catch errors and provide context-aware child components.

## Components

| Component | Description |
|-----------|-------------|
| `ErrorBoundary` | Wrapper component that catches errors and provides context |
| `ErrorBoundaryResetButton` | Button that triggers error boundary reset |
| `ErrorBoundaryMessage` | Displays the error message |
| `ErrorBoundaryCause` | Displays the error cause (if available) |

## How It Works

1. `ErrorBoundary` wraps content and catches any errors
2. When an error occurs, it provides `ErrorBoundaryContext` with `{ error, reset }`
3. Child components read from context to display error information

## Usage

### Basic Usage

```tsx
<ErrorBoundary fallback={<div>
  <ErrorBoundaryResetButton>Reset</ErrorBoundaryResetButton>
  An error occurred: <ErrorBoundaryMessage />
  Cause: <ErrorBoundaryCause />
</div>}>
  {props.children}
</ErrorBoundary>
```

### Styled Error Display

```tsx
<ErrorBoundary fallback={<div class="p-4 border border-red-300 rounded-lg bg-red-50">
  <ErrorBoundaryResetButton class="px-4 py-2 bg-red-500 text-white rounded">
    Try Again
  </ErrorBoundaryResetButton>
  <p class="mt-2 text-red-600">
    Error: <ErrorBoundaryMessage class="font-mono" />
  </p>
  <p class="mt-1 text-sm text-gray-600">
    Cause: <ErrorBoundaryCause />
  </p>
</div>}>
  {props.children}
</ErrorBoundary>
```

### All Props Passthrough

All child components accept HTML attributes for styling:

```tsx
<ErrorBoundaryResetButton 
  class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
>
  <span class="flex items-center gap-2">
    <RefreshIcon />
    Retry
  </span>
</ErrorBoundaryResetButton>

<ErrorBoundaryMessage class="font-mono text-sm text-red-700" />

<ErrorBoundaryCause class="text-gray-500 text-xs" />
```

## Component API

### ErrorBoundary

```tsx
type ErrorBoundaryProps = {
  fallback: JSX.Element;  // Content to show when error occurs
  children: JSX.Element;   // Content to wrap
};
```

### ErrorBoundaryResetButton

```tsx
type ErrorBoundaryResetButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: JSX.Element;
};
```

### ErrorBoundaryMessage

```tsx
type ErrorBoundaryMessageProps = JSX.HTMLAttributes<HTMLSpanElement>;
```

### ErrorBoundaryCause

```tsx
type ErrorBoundaryCauseProps = JSX.HTMLAttributes<HTMLSpanElement>;
```

## Notes

- `ErrorBoundaryMessage` only renders when `error.message` exists
- `ErrorBoundaryCause` only renders when `error.cause` exists
- All components use `<Show>` to conditionally render based on context values
- Props are passthrough to underlying HTML elements for full styling control
