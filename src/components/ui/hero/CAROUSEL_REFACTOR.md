# Hero & Recommendations Component Refactor Plan

## Overview

Refactor Hero and Recommendations components to be truly codeless and consistent using context-based item iteration.

## Design Principles

1. **Codeless**: No render props, no explicit data passing
2. **Consistency**: Hero and Recommendations follow identical patterns
3. **Context-based**: ItemContext provides data to children

---

## Problem Statement

### Current Issue

Currently, carousel items don't properly receive their individual item data. For example:

```tsx
// HeroCarouselContent iterates but...
<For each={heroItems()}>
  {(item) => (
    <CarouselItem>
      {props.children}  // ALL items show same content (from selectedIndex)
    </CarouselItem>
  )}
</For>
```

All carousel items render the same content because `HeroCarouselItem` reads from `carousel.selectedIndex()` instead of its corresponding item from iteration.

### Solution

Each carousel item should receive its corresponding item via context:

```tsx
// HeroCarouselContent provides context
<For each={heroItems()}>
  {(item) => (
    <HeroItemContext.Provider value={item}>
      <CarouselItem>
        {props.children}
      </CarouselItem>
    </HeroItemContext.Provider>
  )}
</For>

// HeroCarouselItem reads from context
const HeroCarouselItem = () => {
  const item = useHeroItemContext()  // Gets its specific item
  return <div>{item().title}</div>
}
```

---

## Unified Pattern

```
ComponentCarousel
├── ComponentCarouselContent (iterates items, provides ItemContext)
│   ├── ItemContext.Provider (per-item data)
│   └── CarouselItem (CSS basis controls visibility)
│       └── ComponentCarouselItem
│           └── <Component data={item}>
│               └── children (sections/aliases)
└── Navigation controls
```

---

## Hero Component Refactor

### Files to Change

| File | Changes |
|------|---------|
| `hero-context.tsx` | Add `HeroItemContext`, `useHeroItemContext()` |
| `hero-sections.tsx` | Update `useHeroItem()` to use `useHeroItemContext()` |
| `hero-carousel.tsx` | `HeroCarouselContent` iterates + provides context, `HeroCarouselItem` reads from context |
| `hero-root.tsx` | Update `HeroItems` to provide context |
| `hero/index.ts` | Export `HeroItemContext`, `useHeroItemContext` |

### Step 1: Add HeroItemContext

**File:** `hero-context.tsx`

```tsx
const HeroItemContext = createContext<Accessor<HeroItem | null>>()

export const useHeroItemContext = (): Accessor<HeroItem | null> => {
  const ctx = useContext(HeroItemContext)
  if (!ctx) {
    throw new Error("useHeroItemContext must be used within HeroItemContext.Provider")
  }
  return ctx
}
```

### Step 2: Update hero-sections.tsx

**File:** `hero-sections.tsx`

```tsx
const useHeroItem = () => {
  const hero = useHero()
  
  let carousel: ReturnType<typeof useCarousel> | undefined
  try {
    carousel = useCarousel()
  } catch {
    // Not inside carousel context
  }
  
  const collectionItem = useCollectionItem()
  const heroItemContext = useHeroItemContext()  // NEW: Check context first
  
  return createMemo(() => {
    // Priority: HeroItemContext > CollectionItem > carousel > activeItem
    if (heroItemContext()) {
      return heroItemContext()
    }
    if (collectionItem?.item) {
      return collectionItem.item as HeroItem
    }
    if (carousel) {
      return hero?.items()[carousel.selectedIndex()] ?? hero?.activeItem() ?? null
    }
    return hero?.activeItem() ?? null
  })
}
```

### Step 3: Update hero-carousel.tsx

**File:** `hero-carousel.tsx`

#### HeroCarouselContent

```tsx
const HeroCarouselContent = (props: HeroCarouselContentProps) => {
  const hero = useHero()
  
  return (
    <CarouselContent class={props.class}>
      <For each={hero.items()}>
        {(item) => (
          <HeroItemContext.Provider value={item}>
            <CarouselItem class={props.itemClass ?? "basis-full"}>
              {props.children}
            </CarouselItem>
          </HeroItemContext.Provider>
        )}
      </For>
    </CarouselContent>
  )
}
```

#### HeroCarouselItem

```tsx
const HeroCarouselItem = (props: HeroCarouselItemProps) => {
  const item = useHeroItemContext()  // Read from context
  
  // ... rest uses item() instead of props.item
}
```

### Step 4: Update hero-root.tsx

**File:** `hero-root.tsx`

Update `HeroItems` to provide context:

```tsx
const HeroItems = (props: HeroItemsViewProps) => {
  const hero = useHero()
  const items = createMemo(() => hero?.items() ?? [])
  
  return (
    <Collection data={items()} layout={local.layout} columns={local.columns} gap={local.gap}>
      <CollectionView class={local.class}>
        {/* Provide context for each item */}
        <For each={items()}>
          {(item) => (
            <HeroItemContext.Provider value={item}>
              <HeroItem>
                {local.children}
              </HeroItem>
            </HeroItemContext.Provider>
          )}
        </For>
      </CollectionView>
    </Collection>
  )
}
```

Note: `HeroItem` will read from `HeroItemContext` when inside `HeroItems`, and from carousel context when inside `HeroCarouselContent`.

---

## Recommendations Component Refactor

### Files to Change

| File | Changes |
|------|---------|
| `recommendations-context.tsx` | Add `RecommendationsItemContext`, `useRecommendationsItem()` |
| `recommendations-carousel.tsx` | `RecommendationsCarouselContent` iterates + provides context, `RecommendationsCarouselItem` reads from context |
| `recommendations-root.tsx` | Add `RecommendationsItem`, update `RecommendationsGrid` |
| `recommendations-sections.tsx` | Export `RecommendationItem*` aliases |
| `recommendations/index.ts` | Export new components/types |

### Step 1: Add RecommendationsItemContext

**File:** `recommendations-context.tsx`

```tsx
const RecommendationsItemContext = createContext<Accessor<Product | null>>()

export const useRecommendationsItem = (): Accessor<Product | null> => {
  const ctx = useContext(RecommendationsItemContext)
  if (!ctx) {
    throw new Error("useRecommendationsItem must be used within RecommendationsItemContext.Provider")
  }
  return ctx
}
```

### Step 2: Update recommendations-carousel.tsx

**File:** `recommendations-carousel.tsx`

#### RecommendationsCarouselContent

```tsx
const RecommendationsCarouselContent = (props: RecommendationsCarouselContentProps) => {
  const recommendations = useRecommendations()
  
  return (
    <CarouselContent class={cn("-ml-4", props.class)}>
      <For each={recommendations.products()}>
        {(product) => (
          <RecommendationsItemContext.Provider value={product}>
            <CarouselItem class={cn("pl-4", props.itemClass ?? "basis-full")}>
              {props.children}
            </CarouselItem>
          </RecommendationsItemContext.Provider>
        )}
      </For>
    </CarouselContent>
  )
}
```

#### RecommendationsCarouselItem

```tsx
const RecommendationsCarouselItem = (props: RecommendationsCarouselItemProps) => {
  const item = useRecommendationsItem()
  
  return (
    <Show when={item()}>
      <Product data={item()!}>
        <Show when={props.children} fallback={<DefaultRecommendationsItem />}>
          {props.children}
        </Show>
      </Product>
    </Show>
  )
}
```

### Step 3: Update recommendations-root.tsx

**File:** `recommendations-root.tsx`

Add `RecommendationsItem` and update `RecommendationsGrid`:

```tsx
const RecommendationsItem = (props: RecommendationsItemProps) => {
  const collectionItem = useCollectionItem()
  const recommendations = useRecommendations()
  
  const item = createMemo(() => 
    collectionItem?.item ?? recommendations.products()[0] ?? null
  )
  
  return (
    <Show when={item()}>
      <RecommendationsItemContext.Provider value={item()}>
        <Product data={item()!}>
          {props.children}
        </Product>
      </RecommendationsItemContext.Provider>
    </Show>
  )
}

// RecommendationsGrid uses RecommendationsItem
const RecommendationsGrid = (props: RecommendationsGridProps) => {
  return (
    <Collection layout="vertical-grid" columns={props.columns} gap={props.gap}>
      <RecommendationsItem>
        {props.children}
      </RecommendationsItem>
    </Collection>
  )
}
```

### Step 4: Export Aliases

**File:** `recommendations-sections.tsx` or `index.ts`

```tsx
export const RecommendationItem = Product
export const RecommendationItemMedia = ProductMedia
export const RecommendationItemName = ProductName
export const RecommendationItemPrice = ProductPrice
export const RecommendationItemComparePrice = ProductComparePrice
export const RecommendationItemSku = ProductSku
export const RecommendationItemStockBadge = ProductStockBadge
export const RecommendationItemAddToCartTrigger = ProductAddToCartTrigger
// ... etc
```

---

## Usage Examples (After Refactor)

### Hero Carousel

```tsx
// Standard hero carousel (1 item visible at a time)
<HeroRoot>
  <HeroCarousel>
    <HeroCarouselContent itemClass="basis-full">
      <HeroCarouselItem>
        <HeroBackground />
        <HeroContent>
          <HeroTitle />
          <HeroCtaPrimary />
        </HeroContent>
      </HeroCarouselItem>
    </HeroCarouselContent>
  </HeroCarousel>
</HeroRoot>

// Grid layout
<HeroRoot>
  <HeroItems layout="vertical-grid" columns={2}>
    <HeroItem>
      <HeroBackground />
      <HeroContent>
        <HeroTitle />
      </HeroContent>
    </HeroItem>
  </HeroItems>
</HeroRoot>
```

### Recommendations Carousel

```tsx
// Show 1 item at a time (swipe)
<RecommendationsRoot type="popular">
  <RecommendationsCarousel>
    <RecommendationsCarouselContent itemClass="basis-full">
      <RecommendationsCarouselItem>
        <RecommendationItemMedia />
        <RecommendationItemName />
        <RecommendationItemPrice />
      </RecommendationsCarouselItem>
    </RecommendationsCarouselContent>
  </RecommendationsCarousel>
</RecommendationsRoot>

// Show 4 items at a time
<RecommendationsRoot type="popular">
  <RecommendationsCarousel>
    <RecommendationsCarouselContent itemClass="basis-1/4">
      <RecommendationsCarouselItem>
        <RecommendationItemMedia />
        <RecommendationItemName />
      </RecommendationsCarouselItem>
    </RecommendationsCarouselContent>
  </RecommendationsCarousel>
</RecommendationsRoot>

// Responsive: 1 on mobile, 4 on desktop
<RecommendationsCarouselContent itemClass="basis-full lg:basis-1/4">
```

### Recommendations Grid

```tsx
<RecommendationsRoot type="newest">
  <RecommendationsTitle>New Arrivals</RecommendationsTitle>
  <RecommendationsGrid columns={4}>
    <RecommendationsItem>
      <RecommendationItemMedia />
      <RecommendationItemName />
      <RecommendationItemPrice />
    </RecommendationsItem>
  </RecommendationsGrid>
</RecommendationsRoot>
```

---

## CSS Basis for Visibility Control

| Class | Items Visible |
|-------|-------------|
| `basis-full` | 1 |
| `basis-1/2` | 2 |
| `basis-1/3` | 3 |
| `basis-1/4` | 4 |
| `basis-1/5` | 5 |
| `basis-1/6` | 6 |

### Responsive Examples

```tsx
// 1 on mobile, 2 on tablet, 4 on desktop
itemClass="basis-full md:basis-1/2 lg:basis-1/4"

// 2 on mobile, 3 on tablet, 6 on desktop
itemClass="basis-1/2 md:basis-1/3 lg:basis-1/6"
```

---

## Implementation Order

1. **Hero Components** (test first)
   - [ ] `hero-context.tsx` - Add HeroItemContext
   - [ ] `hero-sections.tsx` - Update useHeroItem()
   - [ ] `hero-carousel.tsx` - Update HeroCarouselContent, HeroCarouselItem
   - [ ] `hero-root.tsx` - Update HeroItems
   - [ ] `hero/index.ts` - Export new context
   - [ ] Test with hero demo

2. **Recommendations Components** (after hero works)
   - [ ] `recommendations-context.tsx` - Add RecommendationsItemContext
   - [ ] `recommendations-carousel.tsx` - Update content and item
   - [ ] `recommendations-root.tsx` - Add RecommendationsItem, fix Grid
   - [ ] `recommendations-sections.tsx` - Export aliases
   - [ ] `recommendations/index.ts` - Export everything
   - [ ] Create demo
