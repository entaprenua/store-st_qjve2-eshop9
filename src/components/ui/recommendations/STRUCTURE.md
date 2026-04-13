# Recommendations Components Architecture

## Overview

Codeless, composable product recommendations components. Components automatically detect their context and render accordingly without manual data passing.

## Design Principles

1. **Codeless** - Components auto-read from context, no manual data passing
2. **Composable** - Section primitives that users combine freely
3. **Context-Aware** - Components automatically detect their context (carousel, collection, etc.)
4. **Atomic** - Raw value components, user provides styling
5. **Layout Flexible** - Layout is controlled by user via Grid, Flex, Carousel, etc.

## Directory Structure

```
components/ui/recommendations/
├── STRUCTURE.md                       # This file
├── index.ts                           # Barrel exports
├── recommendations-context.tsx        # Context + useRecommendations hook
├── recommendations-root.tsx             # RecommendationsRoot, RecommendationsItems, RecommendationsItemsView
├── recommendations-sections.tsx        # UI sections (title)
└── recommendations-skeleton.tsx       # Loading states
```

## Core Pattern

```tsx
<RecommendationsRoot type="newest" limit={12}>
  <RecommendationsTitle class="text-2xl font-bold mb-4" />
  <Carousel>
    <CarouselContent>
      <RecommendationsItems>
        <RecommendationsItemsView>
          <CarouselItem>
            <Product>
              <ProductImage class="rounded-lg aspect-square object-cover" />
              <ProductName />
              <ProductPrice />
            </Product>
          </CarouselItem>
        </RecommendationsItemsView>
      </RecommendationsItems>
    </CarouselContent>
    <CarouselNext />
    <CarouselPrevious />
  </Carousel>
</RecommendationsRoot>
```

## Components

### RecommendationsRoot

Fetches recommendations data and provides context.

```typescript
type RecommendationsRootProps = {
  type?: RecommendationType  // "personalized" | "popular" | "related" | "bought_together" | "newest"
  limit?: number
  data?: RecommendationResponse
  queryKey?: unknown[]
  enabled?: boolean
  errorFallback?: JSX.Element
  loadingFallback?: JSX.Element
  class?: string
  children?: JSX.Element
}
```

### RecommendationsTitle

Section title with heading level.

```typescript
type RecommendationsTitleProps = {
  class?: string
  level?: "h1" | "h2" | "h3" | "h4"
  children?: JSX.Element
}
```

### RecommendationsItems

Collection wrapper - provides item context from recommendation products.

```typescript
type RecommendationsItemsProps = {
  class?: string
  children?: JSX.Element
}
```

### RecommendationsItemsView

CollectionView wrapper - renders items.

```typescript
type RecommendationsItemsViewProps = {
  class?: string
  children?: JSX.Element
}
```

## Context API

### useRecommendations Hook

```typescript
const useRecommendations = () => RecommendationContextValue
```

### RecommendationContextValue

```typescript
type RecommendationContextValue = {
  recommendations: Accessor<{
    products: Product[]
    source: RecommendationSource | null
    fallback: RecommendationSource | null
  } | null>
  products: Accessor<Product[]>
  source: Accessor<RecommendationSource | null>
  currentIndex: Accessor<number>
  next: () => void
  prev: () => void
  goTo: (index: number) => void
}
```

## Usage Examples

### With Carousel

```tsx
<RecommendationsRoot type="newest" limit={12}>
  <RecommendationsTitle class="text-2xl font-bold mb-4" />
  <Carousel>
    <CarouselContent>
      <RecommendationsItems>
        <RecommendationsItemsView>
          <CarouselItem>
            <Product>
              <ProductImage class="rounded-lg aspect-square object-cover" />
              <ProductName />
              <ProductPrice />
            </Product>
          </CarouselItem>
        </RecommendationsItemsView>
      </RecommendationsItems>
    </CarouselContent>
    <CarouselNext />
    <CarouselPrevious />
  </Carousel>
</RecommendationsRoot>
```

### With Grid

```tsx
<RecommendationsRoot type="popular" limit={8}>
  <RecommendationsTitle class="text-2xl font-bold mb-4" />
  <RecommendationsItems>
    <Grid cols={4} gap={4}>
      <RecommendationsItemsView>
        <Product>
          <ProductImage class="rounded-lg aspect-square object-cover" />
          <ProductName />
          <ProductPrice />
        </Product>
      </RecommendationsItemsView>
    </Grid>
  </RecommendationsItems>
</RecommendationsRoot>
```

### With Flex

```tsx
<RecommendationsRoot type="related" limit={6}>
  <RecommendationsTitle class="text-xl font-semibold mb-3" />
  <RecommendationsItems>
    <Flex gap={4} wrap>
      <RecommendationsItemsView>
        <Product>
          <ProductImage class="w-32 h-32 rounded-lg object-cover" />
          <ProductName />
          <ProductPrice />
        </Product>
      </RecommendationsItemsView>
    </Flex>
  </RecommendationsItems>
</RecommendationsRoot>
```

## Recommendation Types

| Type | Description |
|------|-------------|
| `personalized` | Based on user's view/purchase history |
| `popular` | Most ordered products in last 30 days |
| `related` | Products from same categories |
| `bought_together` | Frequently ordered together |
| `newest` | Most recently added products |

## API Alignment

| Endpoint | Usage |
|----------|-------|
| `GET /stores/:id/recommendations?type=&limit=` | RecommendationsRoot fetches |

## Server Response

```typescript
interface RecommendationResponse {
  products: Product[]
  source: RecommendationSource | null
  fallback: RecommendationSource | null
}

type RecommendationSource = "personalized" | "popular" | "related" | "bought_together" | "newest"
```


