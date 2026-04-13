import { Show, type JSX } from "solid-js"
import { useStore } from "./store-context"
import { Image, ImageImg, ImageFallback } from "../image"
import { Link } from "../link"
import { cn } from "~/lib/utils"

type StoreNameProps = {
  class?: string
  children?: JSX.Element
}

export function StoreName(props: StoreNameProps): JSX.Element {
  const store = useStore()
  
  return (
    <span class={cn(props.class)}>
      {props.children ?? store.name() ?? "Store"}
    </span>
  )
}

type StoreLogoProps = {
  class?: string
  fallback?: string
}

export function StoreLogo(props: StoreLogoProps): JSX.Element {
  const store = useStore()
  
  return (
    <Show
      when={store.logo()}
      fallback={
        <Show when={props.fallback}>
          <span class={cn("text-lg font-bold", props.class)}>{props.fallback}</span>
        </Show>
      }
    >
      <Image class={cn("relative", props.class)}>
        <ImageImg src={store.logo()!} alt={store.name() ?? "Store logo"} />
        <ImageFallback>
          <span class="text-lg font-bold">{store.name()?.charAt(0) ?? "S"}</span>
        </ImageFallback>
      </Image>
    </Show>
  )
}

type StoreLogoLinkProps = {
  href?: string
  class?: string
}

export function StoreLogoLink(props: StoreLogoLinkProps): JSX.Element {
  const store = useStore()
  
  return (
    <Link 
      href={props.href ?? "/"} 
      class={cn("inline-flex items-center", props.class)}
    >
      <StoreLogo />
    </Link>
  )
}

type StoreDescriptionProps = {
  class?: string
}

export function StoreDescription(props: StoreDescriptionProps): JSX.Element {
  const store = useStore()
  
  return (
    <span class={cn("text-muted-foreground", props.class)}>
      {store.description()}
    </span>
  )
}

type StoreDomainProps = {
  class?: string
  includeProtocol?: boolean
}

export function StoreDomain(props: StoreDomainProps): JSX.Element {
  const store = useStore()
  
  const domain = () => {
    const d = store.domain() ?? store.subdomain()
    if (!d) return null
    if (props.includeProtocol) return `https://${d}`
    return d
  }
  
  return (
    <span class={cn("text-muted-foreground text-sm", props.class)}>
      {domain()}
    </span>
  )
}

type StoreBadgeProps = {
  variant?: "active" | "inactive" | "template" | "maintenance"
  class?: string
}

export function StoreBadge(props: StoreBadgeProps): JSX.Element {
  const store = useStore()
  const data = store.data()
  
  const variant = () => {
    if (props.variant) return props.variant
    if (data?.isInMaintenanceMode) return "maintenance"
    if (data?.isActive) return "active"
    if (data?.isTemplate) return "template"
    return "inactive"
  }
  
  const variantStyles = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    template: "bg-blue-100 text-blue-800",
    maintenance: "bg-yellow-100 text-yellow-800",
  }
  
  const variantLabels = {
    active: "Active",
    inactive: "Inactive",
    template: "Template",
    maintenance: "Maintenance",
  }
  
  return (
    <span class={cn(
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
      variantStyles[variant()],
      props.class
    )}>
      {variantLabels[variant()]}
    </span>
  )
}

type StoreLinkProps = {
  href?: string
  class?: string
  children?: JSX.Element
  external?: boolean
}

export function StoreLink(props: StoreLinkProps): JSX.Element {
  const store = useStore()
  
  const href = () => props.href ?? `https://${store.domain() ?? store.subdomain()}`
  
  return (
    <Show
      when={props.external}
      fallback={
        <Link href={href()} class={props.class}>
          {props.children ?? store.name()}
        </Link>
      }
    >
      <a 
        href={href()} 
        class={props.class}
        target="_blank" 
        rel="noopener noreferrer"
      >
        {props.children ?? store.name()}
      </a>
    </Show>
  )
}
