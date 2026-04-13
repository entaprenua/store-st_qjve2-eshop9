import { Show, splitProps, type JSX, createMemo } from "solid-js"
import { useCarousel } from "../carousel"
import { useCollectionItem } from "../collection"
import { useHero } from "./hero-context"
import { Button } from "../button"
import { Flex } from "../flex"
import { cn } from "~/lib/utils"
import type { HeroItem } from "~/lib/types"

const useHeroItem = () => {
  const hero = useHero()
  
  let carousel: ReturnType<typeof useCarousel> | undefined
  try {
    carousel = useCarousel()
  } catch {
    // Not inside carousel context
  }
  
  const collectionItem = useCollectionItem()
  
  return createMemo(() => {
    if (collectionItem?.item) {
      return collectionItem.item as HeroItem
    }
    if (carousel) {
      return hero?.items()[carousel.selectedIndex()] ?? hero?.activeItem() ?? null
    }
    return hero?.activeItem() ?? null
  })
}

export type HeroBackgroundProps = {
  class?: string
  children?: JSX.Element
}

const HeroBackground = (props: HeroBackgroundProps) => {
  const item = useHeroItem()
  const [local] = splitProps(props, ["class", "children"])

  const bgStyle = createMemo(() => {
    const i = item()
    if (!i) return {}

    if (i.backgroundType === 'gradient' && i.backgroundGradient) {
      return { background: i.backgroundGradient }
    }
    if (i.backgroundType === 'color' && i.backgroundColor) {
      return { 'background-color': i.backgroundColor }
    }
    if (i.backgroundType === 'image' && i.backgroundImageUrl) {
      return {
        'background-image': `url(${i.backgroundImageUrl})`,
        'background-size': 'cover',
        'background-position': 'center',
      }
    }
    return {}
  })

  return (
    <div class={cn("absolute inset-0", local.class)} style={bgStyle()}>
      <Show when={item()!.backgroundType === 'image' && item()!.overlayColor}>
        <div
          class="absolute inset-0"
          style={{
            'background-color': item()!.overlayColor!,
            opacity: Number(item()!.overlayOpacity ?? 0.3)
          }}
        />
      </Show>
      {local.children}
    </div>
  )
}

export type HeroContentProps = {
  class?: string
  contentPosition?: string
  children?: JSX.Element
}

const HeroContent = (props: HeroContentProps) => {
  const item = useHeroItem()
  const [local] = splitProps(props, ["class", "contentPosition", "children"])

  const positionClass = createMemo(() => {
    const i = item()
    const pos = local.contentPosition ?? i?.contentPosition ?? 'center'
    const map: Record<string, string> = {
      'top-left': 'items-start justify-start text-left',
      'top-center': 'items-start justify-center text-center',
      'top-right': 'items-start justify-end text-right',
      'center-left': 'items-center justify-start text-left',
      'center': 'items-center justify-center text-center',
      'center-right': 'items-center justify-end text-right',
      'bottom-left': 'items-end justify-start text-left',
      'bottom-center': 'items-end justify-center text-center',
      'bottom-right': 'items-end justify-end text-right',
    }
    return map[pos] ?? 'items-center justify-center text-center'
  })

  return (
    <Flex flexDirection="col" class={cn("relative z-10 p-8 h-full", positionClass(), local.class)}>
      {local.children}
    </Flex>
  )
}

export type HeroTitleProps = {
  class?: string
}

const HeroTitle = (props: HeroTitleProps) => {
  const item = useHeroItem()

  return (
    <Show when={item()?.title}>
      <p
        class={cn("text-3xl md:text-5xl font-bold mb-4", props.class)}
        style={{ color: item()?.titleColor ?? 'white' }}
      >
        {item()?.title}
      </p>
    </Show>
  )
}

export type HeroSubtitleProps = {
  class?: string
}

const HeroSubtitle = (props: HeroSubtitleProps) => {
  const item = useHeroItem()

  return (
    <Show when={item()?.subtitle}>
      <p
        class={cn("text-sm uppercase tracking-wider mb-2", props.class)}
        style={{ color: item()?.subtitleColor ?? 'white' }}
      >
        {item()?.subtitle}
      </p>
    </Show>
  )
}

export type HeroDescriptionProps = {
  class?: string
}

const HeroDescription = (props: HeroDescriptionProps) => {
  const item = useHeroItem()

  return (
    <Show when={item()?.description}>
      <p
        class={cn("text-lg max-w-xl mb-6", props.class)}
        style={{ color: item()?.descriptionColor ?? 'white' }}
      >
        {item()?.description}
      </p>
    </Show>
  )
}

export type HeroCtaProps = {
  class?: string
  children?: JSX.Element
}

const HeroCtaPrimary = (props: HeroCtaProps) => {
  const item = useHeroItem()
  const [local] = splitProps(props, ["class", "children"])

  return (
    <Show when={item()?.ctaText && item()?.ctaUrl}>
      <Button
        as="a"
        href={item()!.ctaUrl!}
        variant={item()!.ctaStyle as any}
        target={item()!.ctaTarget}
        class={local.class}
      >
        {local.children ?? item()!.ctaText}
      </Button>
    </Show>
  )
}

const HeroCtaSecondary = (props: HeroCtaProps) => {
  const item = useHeroItem()
  const [local] = splitProps(props, ["class", "children"])

  return (
    <Show when={item()?.ctaSecondaryText && item()?.ctaSecondaryUrl}>
      <Button
        as="a"
        href={item()!.ctaSecondaryUrl!}
        variant={item()!.ctaSecondaryStyle as any}
        target={item()!.ctaSecondaryTarget}
        class={local.class}
      >
        {local.children ?? item()!.ctaSecondaryText}
      </Button>
    </Show>
  )
}

export {
  useHeroItem,
  HeroBackground,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  HeroDescription,
  HeroCtaPrimary,
  HeroCtaSecondary,
}
