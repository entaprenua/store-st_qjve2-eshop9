# Store Components Architecture

## Overview

Atomic, composable store components that read from the global `StoreProvider` context. All components are codeless - they automatically read store data without explicit data passing.

## Design Principles

1. **Codeless** - Components auto-read from context, no manual data passing
2. **Composable** - Section primitives that users combine freely
3. **Atomic** - Raw value components, user provides styling
4. **Context-aware** - Uses global StoreProvider from app level

## Data Flow

```
StoreProvider (global)
        ↓
useCurrentStore() → store data
        ↓
StoreProvider (local) wraps data
        ↓
Atomic components read via useStore()
```

## Components

### Atomic Section Primitives

All primitives read from `useStore()` which gets data from the global `StoreProvider`.

```typescript
<StoreName class?: string />
<StoreLogo class?: string; fallback?: string />
<StoreLogoLink href?: string; class?: string />
<StoreDescription class?: string />
<StoreDomain class?: string; includeProtocol?: boolean />
<StoreBadge variant?: "active" | "inactive" | "template" | "maintenance"; class?: string />
<StoreLink href?: string; class?: string; external?: boolean />
```

### StoreContext

```typescript
type StoreContextValue = {
  data: Accessor<Store | null>
  id: Accessor<string | null>
  name: Accessor<string | null>
  description: Accessor<string | null>
  logo: Accessor<string | null>
  favicon: Accessor<string | null>
  domain: Accessor<string | null>
  subdomain: Accessor<string | null>
}

export const useStore = (): StoreContextValue => { ... }
```

### StoreProvider

Optional local provider for overriding store data:

```typescript
type StoreProviderProps = {
  data?: Store | null
  children?: JSX.Element
}

// Reads from global StoreProvider if no data prop provided
```

## Usage Examples

### Header Logo

```tsx
<StoreLogoLink href="/" class="text-xl font-bold" />
```

### Footer

```tsx
<div class="footer">
  <StoreName class="font-bold" />
  <StoreDescription />
  <StoreDomain includeProtocol />
</div>
```

### Store Link

```tsx
<StoreLink external class="text-primary hover:underline" />
```

### Status Badge

```tsx
<StoreBadge />
```

## File Structure

```
src/components/ui/store/
├── index.ts                    # Barrel exports
├── store-context.tsx          # Context + useStore() hook
├── store-sections.tsx         # Atomic primitives
└── STRUCTURE.md              # This file
```

## Context Hierarchy

```
Global (app.tsx)
  └── StoreProvider (useCurrentStore from stores/store-context)
        ↓
Local (components can wrap with StoreProvider to override)
  └── useStore() reads from nearest context
```

## Implementation

| Component | Status |
|-----------|--------|
| StoreName | ✅ Done |
| StoreLogo | ✅ Done |
| StoreLogoLink | ✅ Done |
| StoreDescription | ✅ Done |
| StoreDomain | ✅ Done |
| StoreId | ✅ Done |
| StoreBadge | ✅ Done |
| StoreLink | ✅ Done |
