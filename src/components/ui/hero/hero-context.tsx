import { createContext, useContext, type JSX, createMemo, type Accessor } from "solid-js"
import { createStore, produce } from "solid-js/store"
import { CollectionItemContextInstance, type CollectionItemContext } from "../collection"
import type { Hero, HeroItem } from "~/lib/types"

export type HeroContextValue = {
  hero: Accessor<Hero | null>
  items: Accessor<HeroItem[]>
  activeItem: Accessor<HeroItem | null>
  currentIndex: Accessor<number>
  setHero: (hero: Hero | null) => void
  setItems: (items: HeroItem[]) => void
  addItem: (item: HeroItem) => void
  removeItem: (id: string) => void
  setCurrentIndex: (index: number) => void
  next: () => void
  prev: () => void
  goTo: (index: number) => void
  clear: () => void
}

const HeroContext = createContext<HeroContextValue | undefined>()

export const useHero = (): HeroContextValue => {
  const ctx = useContext(HeroContext)
  if (!ctx) {
    throw new Error("useHero must be used within HeroProvider")
  }
  return ctx
}

type HeroProviderProps = {
  initialHero?: Hero | null
  children?: JSX.Element
}

export const HeroProvider = (props: HeroProviderProps) => {
  const [state, setState] = createStore<{
    hero: Hero | null
    items: HeroItem[]
    currentIndex: number
  }>({
    hero: props.initialHero ?? null,
    items: props.initialHero?.items ?? [],
    currentIndex: 0,
  })

  const hero = createMemo(() => state.hero)
  const items = createMemo(() => state.items)
  const currentIndex = createMemo(() => state.currentIndex)
  const activeItem = createMemo(() => state.items[state.currentIndex] ?? null)

  const value: HeroContextValue = {
    hero,
    items,
    activeItem,
    currentIndex,
    setHero: (hero) => setState("hero", hero),
    setItems: (items) => setState("items", items),
    addItem: (item) => setState(produce(s => { s.items.push(item) })),
    removeItem: (id) => setState(produce(s => { s.items = s.items.filter(i => i.id !== id) })),
    setCurrentIndex: (index) => setState("currentIndex", Math.max(0, Math.min(index, state.items.length - 1))),
    next: () => setState("currentIndex", s => s >= state.items.length - 1 ? 0 : s + 1),
    prev: () => setState("currentIndex", s => s <= 0 ? state.items.length - 1 : s - 1),
    goTo: (index) => setState("currentIndex", Math.max(0, Math.min(index, state.items.length - 1))),
    clear: () => setState({ hero: null, items: [], currentIndex: 0 }),
  }

  return <HeroContext.Provider value={value}>{props.children}</HeroContext.Provider>
}

export { HeroContext }
export type { HeroProviderProps }
