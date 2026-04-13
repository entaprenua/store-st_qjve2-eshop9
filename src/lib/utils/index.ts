import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useColorMode } from "@kobalte/core"
import { createBreakpoints } from "@solid-primitives/media"
import { splitProps, mergeProps } from "solid-js"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


const formatCurrency = (amount: string | number, currency = "USD"): string => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(num)
}

const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  })
}

const formatDateTime = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num)
}

const formatPercent = (num: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(num)
}

export {
  cn,
  splitProps,
  mergeProps,
  useColorMode,
  createBreakpoints,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPercent,
}

