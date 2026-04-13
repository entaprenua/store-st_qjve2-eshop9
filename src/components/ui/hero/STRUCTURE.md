# Hero Components Architecture

## Overview

Codeless, composable hero/banner components for the visual builder. Components automatically detect their context and render accordingly without manual data passing.

## Design Principles

1. **Codeless** - Components auto-read from context, no manual data passing
2. **Composable** - Section primitives that users combine freely
3. **Context-Aware** - Components automatically detect their context (carousel, collection, etc.)
4. **Atomic** - Raw value components, user provides styling
5. **Layout Flexible** - Layout is controlled by user via Grid, Flex, Carousel, etc.

## Directory Structure

```
components/ui/hero/
├── STRUCTURE.md              # This file
├── index.ts                  # Barrel exports
├── hero-context.tsx          # Context + useHero hook
├── hero-root.tsx             # HeroRoot, HeroItems, HeroItemsView, HeroItem components
├── hero-sections.tsx         # All hero section components + useHeroItem hook
└── hero-skeleton.tsx         # Loading skeleton components
```

## Core Pattern

```tsx
<HeroRoot>
  <Carousel>
    <CarouselContent>
      <HeroItems>
        <HeroItemsView>
          <CarouselItem>
            <HeroItem>
              <HeroBackground />
              <HeroContent>
                <HeroSubtitle />
                <HeroTitle />
                <HeroDescription />
                <HeroCtaPrimary />
                <HeroCtaSecondary />
              </HeroContent>
            </HeroItem>
          </CarouselItem>
        </HeroItemsView>
      </HeroItems>
    </CarouselContent>
    <CarouselNext />
    <CarouselPrevious />
  </Carousel>
</HeroRoot>
```

## Components

### HeroRoot

Fetches hero data and provides context.

```typescript
type HeroRootProps = {
  storeId?: string
  heroId?: string
  data?: Hero
  queryKey?: unknown[]
  enabled?: boolean
  errorFallback?: JSX.Element
  loadingFallback?: JSX.Element
  class?: string
  children?: JSX.Element
}
```

### HeroItems

Collection wrapper - provides item context from hero.items.

```typescript
type HeroItemsProps = {
  class?: string
  children?: JSX.Element
}
```

### HeroItemsView

CollectionView wrapper - renders items.

```typescript
type HeroItemsViewProps = {
  class?: string
  children?: JSX.Element
}
```

### HeroItem

Single hero item display with background, content positioning.

```typescript
type HeroItemProps = {
  aspectRatio?: string
  maxHeight?: number
  class?: string
  children?: JSX.Element
}
```

## Section Components

### HeroBackground

Background with image/color/gradient and overlay.

### HeroContent

Content container with positioning.

```typescript
type HeroContentProps = {
  class?: string
  contentPosition?: string
  children?: JSX.Element
}
```

### HeroTitle

Title text with color from item.

### HeroSubtitle

Subtitle text with color from item.

### HeroDescription

Description text with color from item.

### HeroCtaPrimary

Primary CTA button with styling.

### HeroCtaSecondary

Secondary CTA button with styling.

## Context API

### HeroContextValue

```typescript
type HeroContextValue = {
  hero: Accessor<Hero | null>
  items: Accessor<HeroItem[]>
  activeItem: Accessor<HeroItem | null>
  currentIndex: Accessor<number>
  next: () => void
  prev: () => void
  goTo: (index: number) => void
}
```

### useHeroItem Hook

Provides automatic item detection for hero sections. Checks contexts in priority order:

1. **CollectionItem context** - From HeroItemsView
2. **Carousel context** - Uses carousel.selectedIndex()
3. **Active item** - Default fallback

## Usage Examples

### With Carousel

```tsx
<HeroRoot>
  <Carousel>
    <CarouselContent>
      <HeroItems>
        <HeroItemsView>
          <CarouselItem>
            <HeroItem>
              <HeroBackground />
              <HeroContent>
                <HeroSubtitle />
                <HeroTitle />
                <HeroDescription />
                <Flex class="gap-3">
                  <HeroCtaPrimary />
                  <HeroCtaSecondary />
                </Flex>
              </HeroContent>
            </HeroItem>
          </CarouselItem>
        </HeroItemsView>
      </HeroItems>
    </CarouselContent>
    <CarouselNext />
    <CarouselPrevious />
  </Carousel>
</HeroRoot>
```

### With Grid

```tsx
<HeroRoot>
  <HeroItems>
    <Grid cols={2} gap={4}>
      <HeroItemsView>
        <HeroItem>
          <HeroBackground />
          <HeroContent>
            <HeroTitle />
            <HeroDescription />
            <HeroCtaPrimary />
          </HeroContent>
        </HeroItem>
      </HeroItemsView>
    </Grid>
  </HeroItems>
</HeroRoot>
```

### Single Hero Item

```tsx
<HeroRoot>
  <HeroItem>
    <HeroBackground />
    <HeroContent contentPosition="center">
      <HeroSubtitle />
      <HeroTitle />
      <HeroDescription />
      <HeroCtaPrimary />
    </HeroContent>
  </HeroItem>
</HeroRoot>
```

### Custom Styling

```tsx
<HeroRoot>
  <HeroItem class="rounded-xl overflow-hidden shadow-lg">
    <HeroBackground />
    <HeroContent class="p-12">
      <HeroTitle class="text-4xl md:text-6xl font-black" />
      <HeroDescription class="text-lg max-w-2xl" />
      <HeroCtaPrimary class="mt-6" />
    </HeroContent>
  </HeroItem>
</HeroRoot>
```

## API Alignment

| Endpoint | Usage |
|----------|-------|
| `GET /stores/:id/hero` | HeroRoot fetches hero |

## Server Response

```typescript
interface Hero {
  id: string
  storeId: string
  name: string
  displayType: string
  autoplay: boolean
  autoplayInterval: number
  showIndicators: boolean
  showNavigation: boolean
  aspectRatio: string
  maxHeight: number | null
  gap: number
  isActive: boolean
  items: HeroItem[]
}

interface HeroItem {
  id: string
  heroId: string
  sortOrder: number
  backgroundType: "image" | "video" | "color" | "gradient"
  backgroundImageUrl: string | null
  backgroundImageAlt: string | null
  backgroundVideoUrl: string | null
  backgroundColor: string | null
  backgroundGradient: string | null
  overlayColor: string | null
  overlayOpacity: number
  title: string | null
  titleColor: string
  subtitle: string | null
  subtitleColor: string
  description: string | null
  descriptionColor: string
  contentPosition: string
  textAlignment: string
  ctaText: string | null
  ctaUrl: string | null
  ctaStyle: string
  ctaTarget: string
  ctaSecondaryText: string | null
  ctaSecondaryUrl: string | null
  ctaSecondaryStyle: string
  ctaSecondaryTarget: string
}
```


