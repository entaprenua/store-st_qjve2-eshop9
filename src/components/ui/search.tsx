import { Show, splitProps, children, createContext, useContext, type ParentComponent, type JSX } from "solid-js"
import type { ValidComponent } from "solid-js"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import { cn } from "~/lib/utils"
import * as SearchPrimitive from "@kobalte/core/search"

export const SearchLabel = SearchPrimitive.Label
export const SearchDescription = SearchPrimitive.Description
export const SearchControl = SearchPrimitive.Control
export const SearchIndicator = SearchPrimitive.Indicator
export const SearchIcon = SearchPrimitive.Icon
export const SearchPortal = SearchPrimitive.Portal
export const Search = SearchPrimitive.Root
export const SearchArrow = SearchPrimitive.Arrow
export const SearchListbox = SearchPrimitive.Listbox
export const SearchSection = SearchPrimitive.Section
export const SearchItemLabel = SearchPrimitive.ItemLabel
export const SearchItemDescription = SearchPrimitive.ItemDescription
export const SearchNoResult = SearchPrimitive.NoResult

const filterOptions = (options: string[], query: string): string[] => {
  try {
    let starters = options?.filter((option: string) => {
      return option?.toLowerCase().startsWith(query?.toLowerCase())
    })
    let includers = options?.filter((option: string) => {
      return option?.toLowerCase().includes(query?.toLowerCase())
    })
    const set = new Set([...starters, ...includers])
    return [...set.values()]
  } catch (error) {
    console.error("Filter failed with error: ", error)
    return []
  }
}

type SearchItemContextValue = {
  item: unknown
}

const SearchItemContext = createContext<SearchItemContextValue | undefined>(undefined)
const useSearchItem = () => {
  const ctx = useContext(SearchItemContext)
  if (!ctx) throw new Error("useSearchItem must be used within SearchItemProvider")
  return ctx
}

interface SearchItemProviderProps {
  item: unknown
  children?: JSX.Element
}

const SearchItemProvider: ParentComponent<SearchItemProviderProps> = (props) => {
  return (
    <SearchItemContext.Provider value={{ item: props.item }}>
      {props.children}
    </SearchItemContext.Provider>
  )
}

type SearchItemProps<T extends ValidComponent = "div"> =
  Omit<SearchPrimitive.SearchItemProps<T>, "item" | "children"> & {
    class?: string | undefined
    item?: unknown
    children?: JSX.Element | ((item: unknown) => JSX.Element)
  }

const SearchItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SearchItemProps<T>>
) => {
  const [local, others] = splitProps(props as SearchItemProps<T>, ["class", "item", "children"])
  const ctx = useContext(SearchItemContext)
  const item = local.item ?? ctx?.item

  const renderContent = children(() => {
    const currentItem = typeof item === "function" ? item() : item
    const child = local.children
    if (typeof child === "function") {
      return (child as (item: unknown) => JSX.Element)(currentItem)
    }
    return child
  })

  return (
    // @ts-expect-error - Kobalte expects CollectionNode but we support context-based item
    <SearchPrimitive.Item<T>
      class={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        local.class
      )}
      item={item}
      {...others}
    >
      {renderContent()}
    </SearchPrimitive.Item>
  )
}

type SearchContentProps<T extends ValidComponent = "div"> =
  SearchPrimitive.SearchContentProps<T> & { class?: string | undefined }

const SearchContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SearchContentProps<T>>
) => {
  const [local, others] = splitProps(props as SearchContentProps, ["class"])
  return (
    <SearchPortal>
      <SearchPrimitive.Content
        class={cn(
          "z-50 w-72 origin-[var(--kb-popover-content-transform-origin)] rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95",
          local.class
        )}
        {...others}
      />
    </SearchPortal>
  )
}

type SearchInputProps<T extends ValidComponent = "input"> =
  SearchPrimitive.SearchInputProps<T> & {
    class?: string | undefined
  }

const SearchInput = <T extends ValidComponent = "input">(
  props: PolymorphicProps<T, SearchInputProps<T>>
) => {
  const [local, others] = splitProps(props as SearchInputProps, ["class"])
  return (
    <SearchPrimitive.Input
      class={cn(
        "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        local.class
      )}
      {...others}
    />
  )
}

export {
  filterOptions,
  useSearchItem,
  SearchInput,
  SearchItemProvider,
  SearchContent,
  SearchItem,
  SearchItemContext,
}
