import { splitProps, mergeProps, type JSX, type ValidComponent } from "solid-js"
import { Dynamic } from "solid-js/web"
import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import { cn } from "~/lib/utils"

type TextVariant = 
  | "h1" 
  | "h2" 
  | "h3" 
  | "h4" 
  | "h5" 
  | "h6"
  | "subtitle1" 
  | "subtitle2" 
  | "body1" 
  | "body2"
  | "caption"
  | "overline"
  | "inherit"

type TextAlign = "left" | "center" | "right" | "justify" | "start" | "end"

type TextWeight = "thin" | "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold"

type TextTransform = "uppercase" | "lowercase" | "capitalize" | "normal-case"

type TextDecoration = "underline" | "overline" | "line-through" | "no-underline"

type TextColor = 
  | "primary" 
  | "secondary" 
  | "muted" 
  | "accent" 
  | "destructive"
  | "success"
  | "warning"
  | "error"
  | "foreground" 
  | "inherit"

const textVariants = cva("text-foreground", {
  variants: {
    variant: {
      h1: "text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl",
      h2: "text-3xl font-semibold tracking-tight md:text-4xl",
      h3: "text-2xl font-semibold tracking-tight md:text-3xl",
      h4: "text-xl font-semibold md:text-2xl",
      h5: "text-lg font-semibold md:text-xl",
      h6: "text-base font-semibold md:text-lg",
      subtitle1: "text-lg font-normal",
      subtitle2: "text-base font-medium",
      body1: "text-base font-normal leading-relaxed",
      body2: "text-sm font-normal leading-relaxed",
      caption: "text-xs font-normal text-muted-foreground",
      overline: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
      inherit: "",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
      start: "text-start",
      end: "text-end",
    },
    weight: {
      thin: "font-thin",
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
    transform: {
      uppercase: "uppercase",
      lowercase: "lowercase",
      capitalize: "capitalize",
      "normal-case": "normal-case",
    },
    decoration: {
      underline: "underline",
      overline: "overline",
      "line-through": "line-through",
      "no-underline": "no-underline",
    },
    color: {
      primary: "text-primary",
      secondary: "text-secondary-foreground",
      muted: "text-muted-foreground",
      accent: "text-accent-foreground",
      destructive: "text-destructive",
      success: "text-success-foreground",
      warning: "text-warning-foreground",
      error: "text-error-foreground",
      foreground: "text-foreground",
      inherit: "text-inherit",
    },
    truncate: {
      true: "truncate",
      2: "line-clamp-2",
      3: "line-clamp-3",
      4: "line-clamp-4",
      5: "line-clamp-5",
    },
    italic: {
      true: "italic",
    },
    noWrap: {
      true: "whitespace-nowrap",
    },
    gutterBottom: {
      true: "mb-4",
    },
  },
  defaultVariants: {
    variant: "body1",
  },
})

const defaultElements: Record<TextVariant, string> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  subtitle1: "p",
  subtitle2: "p",
  body1: "p",
  body2: "p",
  caption: "span",
  overline: "span",
  inherit: "span",
}

type TextProps = {
  variant?: TextVariant
  align?: TextAlign
  weight?: TextWeight
  transform?: TextTransform
  decoration?: TextDecoration
  color?: TextColor
  truncate?: true | 2 | 3 | 4 | 5
  italic?: boolean
  noWrap?: boolean
  gutterBottom?: boolean
  class?: string
  children?: JSX.Element
  as?: string | ValidComponent
}

function Text(props: TextProps) {
  const merged = mergeProps({ variant: "body1" as TextVariant }, props)
  const [local, others] = splitProps(merged, [
    "variant",
    "align",
    "weight",
    "transform",
    "decoration",
    "color",
    "truncate",
    "italic",
    "noWrap",
    "gutterBottom",
    "class",
    "children",
    "as",
  ])

  const component = () => local.as ?? defaultElements[local.variant ?? "body1"]

  return (
    <Dynamic
      component={component()}
      class={cn(
        textVariants({
          variant: local.variant,
          align: local.align,
          weight: local.weight,
          transform: local.transform,
          decoration: local.decoration,
          color: local.color,
          truncate: local.truncate,
          italic: local.italic,
          noWrap: local.noWrap,
          gutterBottom: local.gutterBottom,
        }),
        local.class
      )}
    >
      {local.children}
    </Dynamic>
  )
}

type HeadingProps = Omit<TextProps, "variant"> & {
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

function Heading(props: HeadingProps) {
  const [local, others] = splitProps(props, ["level"])
  const level = local.level ?? 2
  const variant = `h${level}` as TextVariant
  
  return <Text variant={variant} {...others} />
}

type ParagraphProps = Omit<TextProps, "variant"> & {
  size?: "sm" | "md" | "lg"
}

function Paragraph(props: ParagraphProps) {
  const merged = mergeProps({ size: "md" as const }, props)
  const [local, others] = splitProps(merged, ["size"])
  
  const variantMap: Record<"sm" | "md" | "lg", TextVariant> = { 
    sm: "body2", 
    md: "body1", 
    lg: "subtitle1" 
  }
  
  return <Text variant={variantMap[local.size]} {...others} />
}

type CaptionProps = Omit<TextProps, "variant">

function Caption(props: CaptionProps) {
  return <Text variant="caption" {...props} />
}

type OverlineProps = Omit<TextProps, "variant">

function Overline(props: OverlineProps) {
  return <Text variant="overline" {...props} />
}

export {
  Text,
  Heading,
  Paragraph,
  Caption,
  Overline,
  textVariants,
}

export type {
  TextVariant,
  TextAlign,
  TextWeight,
  TextTransform,
  TextDecoration,
  TextColor,
  TextProps,
  HeadingProps,
  ParagraphProps,
  CaptionProps,
  OverlineProps,
}
