import { JSX, Show, splitProps, mergeProps } from "solid-js"
import { A } from "@solidjs/router"
import type { Component, ComponentProps } from "solid-js"
import { cn } from "~/lib/utils"
import { Button } from "../button"
import { Flex } from "../flex"
import { Box } from "../box"
import { Text } from "../text"
import type { ButtonProps } from "../button"

type NavbarProps = ComponentProps<"header"> & {
  position?: "sticky" | "absolute" | "relative" | "fixed"
  variant?: "default" | "outline" | "ghost"
}

export function Navbar(rawProps: NavbarProps) {
  const props = mergeProps({ variant: "default" } as const, rawProps)
  const [local, others] = splitProps(props, [
    "position",
    "variant",
    "class",
    "children"
  ])

  const positionClasses = () => {
    switch (local.position) {
      case "sticky": return "sticky"
      case "absolute": return "absolute"
      case "fixed": return "fixed"
      default: return "relative"
    }
  }

  const variantClasses = () => {
    switch (local.variant) {
      case "outline": return "border-b bg-background"
      case "ghost": return "bg-transparent"
      default: return "border-b bg-background"
    }
  }

  return (
    <header
      class={cn(
        "top-0 z-50 w-full",
        positionClasses(),
        variantClasses(),
        local.class
      )}
      {...others}
    >
      <div class="container mx-auto px-4">
        <Flex class="h-16 items-center justify-between">
          {local.children}
        </Flex>
      </div>
    </header>
  )
}

type NavbarBrandProps = ComponentProps<"div">
export function NavbarBrand(props: NavbarBrandProps) {
  const [local, others] = splitProps(props, ["class", "children"])
  return (
    <Flex class="items-center gap-2" {...others}>
      {local.children}
    </Flex>
  )
}

type NavbarContentProps = ComponentProps<"div">
export function NavbarContent(props: NavbarContentProps) {
  const [local, others] = splitProps(props, ["class", "children"])
  return (
    <Flex class="hidden md:flex items-center gap-6" {...others}>
      {local.children}
    </Flex>
  )
}

type NavbarEndProps = ComponentProps<"div">
export function NavbarEnd(props: NavbarEndProps) {
  const [local, others] = splitProps(props, ["class", "children"])
  return (
    <Flex class="items-center gap-2" {...others}>
      {local.children}
    </Flex>
  )
}

type NavbarToggleProps = ButtonProps
export function NavbarToggle(props: NavbarToggleProps) {
  const [local, others] = splitProps(props, ["class", "children"])
  return (
    <Button variant="ghost" size="icon" class="md:hidden" {...others}>
      {local.children}
    </Button>
  )
}

type NavbarLinkProps = ComponentProps<"a"> & {
  active?: boolean
}
export function NavbarLink(props: NavbarLinkProps) {
  const [local, others] = splitProps(props, ["class", "active", "children", "href"])

  return (
    <A
      class={cn(
        "text-sm font-medium transition-colors hover:text-foreground",
        local.active ? "text-foreground" : "text-muted-foreground",
        local.class
      )}
      href={local.href || "#"}
      {...others}
    >
      {local.children}
    </A>
  )
}
