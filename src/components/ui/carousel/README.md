# Carousel Component

A carousel with motion and swipe gestures built using Embla Carousel.

## Installation

```bash
pnpm add embla-carousel-solid embla-carousel-autoplay
```

## Usage

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "~/components/ui/carousel"
```

```tsx
<Carousel>
  <CarouselContent>
    <CarouselItem>Slide 1</CarouselItem>
    <CarouselItem>Slide 2</CarouselItem>
    <CarouselItem>Slide 3</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

### Basic Example

```tsx
<Carousel>
  <CarouselContent>
    <CarouselItem>
      <img src="https://picsum.photos/seed/1/800/400.jpg" alt="Slide 1" />
    </CarouselItem>
    <CarouselItem>
      <img src="https://picsum.photos/seed/2/800/400.jpg" alt="Slide 2" />
    </CarouselItem>
    <CarouselItem>
      <img src="https://picsum.photos/seed/2/800/400.jpg" alt="Slide 3" />
    </CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

### Sizes

Items take up 25%, of the carousel width on mobile, 33% on tablet,  50% on tablet,  25% of carousel width:

```tsx
<Carousel>
  <CarouselContent>
    <CarouselItem class="basis-1/3">...</CarouselItem>
    <CarouselItem class="basis-1/3">...</CarouselItem>
  </CarouselContent>
</Carousel>
```

Or use responsive grid:

```tsx
<Carousel>
  <CarouselContent class="grid grid-cols-2 md:grid-cols-3 gap-2">
    <CarouselItem class="md:basis-1/2 lg:basis-1/3">
      <img src="https://picsum.photos/seed/1/200/300.jpg" alt="Slide 1" />
    </CarouselItem>
    <CarouselItem class="md:basis-1/2 lg:basis-1/3">
      <img src="https://picsum.photos/seed/2/200/300.jpg" alt="Slide 2" />
    </CarouselItem>
    <CarouselItem class="md:basis-1/2 lg:basis-1/3">
      <img src="https://picsum.photos/seed/3/200/300.jpg" alt="Slide 3" />
    </CarouselItem>
  </CarouselContent>
</Carousel>
```

### Vertical

```tsx
<Carousel orientation="vertical" class="h-96 w-72">
  <CarouselContent class="h-full">
    <CarouselItem class="pt-4 basis-full">
      <div class="p-4">
        <img src="https://picsum.photos/seed/1/200/600.jpg" alt="Slide 1" />
      </div>
    </CarouselItem>
    <CarouselItem class="pt-4 basis-full">
      <div class="p-4">
        <img src="https://picsum.photos/seed/2/200/600.jpg" alt="Slide 2" />
      </div>
    </CarouselItem>
  </CarouselContent>
</Carousel>
```

### Autoplay

```tsx
<Carousel autoplay>
  <CarouselContent>
    <CarouselItem>...</CarouselItem>
  </CarouselContent>
  <CarouselDots />
</Carousel>
```

### API Access

```tsx
import { createSignal, createEffect } from "solid-js"
import type { CarouselApi } from "~/components/ui/carousel"

export function CarouselDemo() {
  const [api, setApi] = createSignal<ReturnType<CarouselApi>>()
  const [current, setCurrent] = createSignal(0)
  const [count, setCount] = createSignal(0)

  createEffect(() => {
    if (!api()) return

    setCount(api().scrollSnapList().length)
    setCurrent(api().selectedScrollSnap() + 1)

  })

  return (
    <Carousel setApi={setApi} showDots>
      <CarouselContent>
        <CarouselItem>...</CarouselItem>
        <CarouselItem>...</CarouselItem>
      </CarouselContent>
      <div class="py-4 text-center text-sm text-muted-foreground">
        Slide {current()} of {count()}
      </div>
      <CarouselDots />
    </Carousel>
  )
}
```

## Context

The `useCarousel` hook provides access to carousel context:

## Props

| Prop | Type | Default |
|-----------|-------|---------|
| `orientation` | `"horizontal"` \| `"vertical"` | `"horizontal"` |
| `showDots` | `boolean` | `true` |
| `autoplay` | `boolean \| CarouselAutoplayOptions` | `false` |
| `opts` | `CarouselOptionsType` | - |
| `plugins` | `ReturnType<CarouselPlugin>` | - |
| `setApi` | `(api: CarouselApi) => void` | - |

Carousel components exported:
- `Carousel` - Main carousel component
- `CarouselContent` - Content wrapper
- `CarouselItem` - Individual slide
- `CarouselNext` - Next button
- `CarouselPrevious` - Previous button
- `CarouselDots` - Dot navigation
- `useCarousel` - Hook to access context

## Notes

- Carousel uses Embla Carousel under the hood
- Autoplay plugin included automatically
- Keyboard navigation (ArrowLeft/ArrowRight)
- Accessible via ARIA attributes
- SSR compatible with