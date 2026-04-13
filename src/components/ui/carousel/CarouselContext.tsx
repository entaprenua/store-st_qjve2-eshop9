import type {
  Accessor,
  Component,
  ComponentProps,
} from "solid-js"
import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  onCleanup,
  splitProps,
  useContext,
} from "solid-js"
import type { CreateEmblaCarouselType } from "embla-carousel-solid"
import createEmblaCarousel from "embla-carousel-solid"
import Autoplay from "embla-carousel-autoplay"

import { cn } from "~/lib/utils"

export type CarouselApi = CreateEmblaCarouselType[1]

type UseCarouselParameters = Parameters<typeof createEmblaCarousel>
type CarouselOptions = NonNullable<UseCarouselParameters[0]>
type CarouselPlugin = NonNullable<UseCarouselParameters[1]>

export type CarouselOptionsType = NonNullable<Parameters<CarouselOptions>>

export type CarouselAutoplayOptions = NonNullable<Parameters<typeof Autoplay>[0]>

export type CarouselProps = ComponentProps<"div"> & {
  opts?: CarouselOptionsType
  plugins?: ReturnType<CarouselPlugin>
  orientation?: "horizontal" | "vertical"
  // eslint-disable-next-line no-unused-vars
  setApi?: (api: CarouselApi) => void
  autoplay?: boolean | CarouselAutoplayOptions
  showDots?: boolean
}

type CarouselContextValue = {
  carouselRef: ReturnType<typeof createEmblaCarousel>[0]
  api: CarouselApi
  options: CarouselOptionsType | undefined
  orientation: "horizontal" | "vertical"
  scrollPrev: () => void
  scrollNext: () => void
  // eslint-disable-next-line no-unused-vars
  scrollTo: (index: number) => void
  canScrollPrev: Accessor<boolean>
  canScrollNext: Accessor<boolean>
  selectedIndex: Accessor<number>
  scrollSnaps: Accessor<number[]>
  scrollProgress: Accessor<number>
  slideCount: Accessor<number>
  autoplay: boolean | CarouselAutoplayOptions | undefined
  showDots: boolean
  plugins: ReturnType<CarouselPlugin>
}

const CarouselContext = createContext<Accessor<CarouselContextValue> | null>(null)

export function useCarousel(): CarouselContextValue {
  const context = useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context()
}

export const Carousel: Component<CarouselProps> = (rawProps) => {
  const props = mergeProps(
    {
      orientation: "horizontal" as const,
      autoplay: false,
      showDots: true,
    },
    rawProps
  )

  const [local, others] = splitProps(props, [
    "orientation",
    "opts",
    "setApi",
    "plugins",
    "class",
    "children",
    "autoplay",
    "showDots",
  ])

  const autoplayPlugin = createMemo(() => {
    if (!local.autoplay) return null
    const options = typeof local.autoplay === "boolean" ? {} : local.autoplay
    return Autoplay({
      delay: 4000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      ...options,
    })
  })

  const plugins = createMemo(() => {
    const base = local.plugins ?? []
    if (autoplayPlugin()) {
      return [...base, autoplayPlugin()!]
    }
    return base
  })

  const [carouselRef, api] = createEmblaCarousel(
    () => ({
      ...local.opts,
      axis: local.orientation === "horizontal" ? "x" : "y",
    }),
    () => plugins()
  )

  const [canScrollPrev, setCanScrollPrev] = createSignal(false)
  const [canScrollNext, setCanScrollNext] = createSignal(false)
  const [selectedIndex, setSelectedIndex] = createSignal(0)
  const [scrollSnaps, setScrollSnaps] = createSignal<number[]>([])
  const [scrollProgress, setScrollProgress] = createSignal(0)
  const [slideCount, setSlideCount] = createSignal(0)

  const handleSelect = () => {
    const emblaApi = api()
    if (!emblaApi) return
    
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setScrollProgress(emblaApi.scrollProgress())
  }

  const handleInit = () => {
    const emblaApi = api()
    if (!emblaApi) return
    
    setScrollSnaps(emblaApi.scrollSnapList())
    setSlideCount(emblaApi.slideNodes().length)
    handleSelect()
  }

  const scrollPrev = () => api()?.scrollPrev()
  const scrollNext = () => api()?.scrollNext()
  const scrollTo = (index: number) => api()?.scrollTo(index)

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      scrollPrev()
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      scrollNext()
    }
  }

  createEffect(() => {
    const emblaApi = api()
    if (!emblaApi) return

    if (local.setApi) {
      local.setApi(api)
    }

    handleInit()
    emblaApi.on("select", handleSelect)
    emblaApi.on("reInit", handleInit)
    emblaApi.on("scroll", handleSelect)

    onCleanup(() => {
      emblaApi.off("select", handleSelect)
      emblaApi.off("reInit", handleInit)
      emblaApi.off("scroll", handleSelect)
    })
  })

  const value = createMemo(
    () =>
      ({
        carouselRef,
        api,
        options: local.opts,
        orientation: local.orientation,
        scrollPrev,
        scrollNext,
        scrollTo,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        scrollSnaps,
        scrollProgress,
        slideCount,
        autoplay: local.autoplay,
        showDots: local.showDots,
        plugins: plugins(),
      }) satisfies CarouselContextValue
  )

  return (
    <CarouselContext.Provider value={value}>
      <div
        onKeyDown={handleKeyDown}
        class={cn("relative", local.class)}
        role="region"
        aria-roledescription="carousel"
        {...others}
      >
        {local.children}
      </div>
    </CarouselContext.Provider>
  )
}

export type { CarouselContextValue }
