import type { Component, ComponentProps, JSX, ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
 
import * as SheetPrimitive from "@kobalte/core/dialog"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { cva, type VariantProps } from "class-variance-authority"
 
import { cn } from "~/lib/utils"
 
const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetCloseButton = SheetPrimitive.CloseButton
 
const SheetHeader: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"])
  return (
    <div class={cn("flex flex-col space-y-2 text-center sm:text-left", local.class)} {...others} />
  )
}
 
const SheetFooter: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"])
  return (
    <div
      class={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", local.class)}
      {...others}
    />
  )
}
 
type DialogTitleProps<T extends ValidComponent = "h2"> = SheetPrimitive.DialogTitleProps<T> & {
  class?: string | undefined
}
 
const SheetTitle = <T extends ValidComponent = "h2">(
  props: PolymorphicProps<T, DialogTitleProps<T>>
) => {
  const [local, others] = splitProps(props as DialogTitleProps, ["class"])
  return (
    <SheetPrimitive.Title
      class={cn("text-lg font-semibold text-foreground", local.class)}
      {...others}
    />
  )
}
 
type DialogDescriptionProps<T extends ValidComponent = "p"> =
  SheetPrimitive.DialogDescriptionProps<T> & { class?: string | undefined }
 
const SheetDescription = <T extends ValidComponent = "p">(
  props: PolymorphicProps<T, DialogDescriptionProps<T>>
) => {
  const [local, others] = splitProps(props as DialogDescriptionProps, ["class"])
  return (
    <SheetPrimitive.Description
      class={cn("text-sm text-muted-foreground", local.class)}
      {...others}
    />
  )
}
 
export { 
  SheetCloseButton, SheetFooter, SheetDescription, SheetHeader,
  SheetTitle, SheetTrigger
}
export * from "./SheetContent"
export * from "./Sheet"




















