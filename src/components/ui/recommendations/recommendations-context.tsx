import { createContext, useContext, type JSX, createMemo, type Accessor } from "solid-js"
import { createStore, produce } from "solid-js/store"
import type { Product } from "~/lib/types"
import type { RecommendationSource } from "~/lib/api/recommendations"

export type RecommendationContextValue = {
  recommendations: Accessor<{
    products: Product[]
    source: RecommendationSource | null
    fallback: RecommendationSource | null
  } | null>
  products: Accessor<Product[]>
  source: Accessor<RecommendationSource | null>
  fallback: Accessor<RecommendationSource | null>
  currentIndex: Accessor<number>
  setProducts: (products: Product[]) => void
  setSource: (source: RecommendationSource | null) => void
  setFallback: (fallback: RecommendationSource | null) => void
  setCurrentIndex: (index: number) => void
  next: () => void
  prev: () => void
  goTo: (index: number) => void
  clear: () => void
}

const RecommendationsContext = createContext<RecommendationContextValue | undefined>()

export const useRecommendations = (): RecommendationContextValue => {
  const ctx = useContext(RecommendationsContext)
  if (!ctx) {
    throw new Error("useRecommendations must be used within RecommendationsProvider")
  }
  return ctx
}

type RecommendationsProviderProps = {
  initialData?: {
    products: Product[]
    source: RecommendationSource | null
    fallback: RecommendationSource | null
  } | null
  children?: JSX.Element
}

export const RecommendationsProvider = (props: RecommendationsProviderProps) => {
  const [state, setState] = createStore<{
    data: {
      products: Product[]
      source: RecommendationSource | null
      fallback: RecommendationSource | null
    } | null
    currentIndex: number
  }>({
    data: props.initialData ?? null,
    currentIndex: 0,
  })

  const recommendations = createMemo(() => state.data)
  const products = createMemo(() => state.data?.products ?? [])
  const source = createMemo(() => state.data?.source ?? null)
  const fallback = createMemo(() => state.data?.fallback ?? null)
  const currentIndex = createMemo(() => state.currentIndex)

  const value: RecommendationContextValue = {
    recommendations,
    products,
    source,
    fallback,
    currentIndex,
    setProducts: (products) => setState("data", "products", products),
    setSource: (source) => setState("data", "source", source),
    setFallback: (fallback) => setState("data", "fallback", fallback),
    setCurrentIndex: (index) => setState("currentIndex", Math.max(0, Math.min(index, (state.data?.products.length ?? 1) - 1))),
    next: () => setState("currentIndex", s => s >= (state.data?.products.length ?? 1) - 1 ? 0 : s + 1),
    prev: () => setState("currentIndex", s => s <= 0 ? (state.data?.products.length ?? 1) - 1 : s - 1),
    goTo: (index) => setState("currentIndex", Math.max(0, Math.min(index, (state.data?.products.length ?? 1) - 1))),
    clear: () => setState({ data: null, currentIndex: 0 }),
  }

  return <RecommendationsContext.Provider value={value}>{props.children}</RecommendationsContext.Provider>
}

export { RecommendationsContext }
export type { RecommendationsProviderProps }
