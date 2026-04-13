import { createContext, useContext, createMemo, type Accessor, type JSX } from "solid-js"
import { useCurrentStoreId } from "~/lib/store-context"

export type StoreContextValue = {
  data: Accessor<import("~/lib/types").Store | null>
  id: Accessor<string | null>
  name: Accessor<string | null>
  description: Accessor<string | null>
  logo: Accessor<string | null>
  favicon: Accessor<string | null>
  domain: Accessor<string | null>
  subdomain: Accessor<string | null>
}

const StoreContext = createContext<StoreContextValue>()

export const useStore = (): StoreContextValue => {
  const ctx = useContext(StoreContext)
  if (!ctx) {
    throw new Error("useStore must be used within StoreProvider")
  }
  return ctx
}

type StoreProviderProps = {
  data?: import("~/lib/types").Store | null
  children?: JSX.Element
}

export const StoreProvider = (props: StoreProviderProps) => {
  const contextStoreId = useCurrentStoreId()
  const data = createMemo(() => props.data ?? null)

  const id = createMemo(() => contextStoreId() ?? data()?.id ?? null)
  const name = createMemo(() => data()?.name ?? null)
  const description = createMemo(() => data()?.description ?? null)
  const logo = createMemo(() => data()?.logo ?? null)
  const favicon = createMemo(() => data()?.favicon ?? null)
  const domain = createMemo(() => data()?.domain ?? null)
  const subdomain = createMemo(() => data()?.subdomain ?? null)

  const contextValue: StoreContextValue = {
    data,
    id,
    name,
    description,
    logo,
    favicon,
    domain,
    subdomain,
  }

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  )
}

export { StoreContext }
