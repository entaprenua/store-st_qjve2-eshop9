import { createContext, useContext, type Accessor } from "solid-js"

const StoreContext = createContext<Accessor<string | null>>()

export const useStoreId = (): Accessor<string | null> => {
  const ctx = useContext(StoreContext)
  if (!ctx) {
    throw new Error("useStoreId must be used within StoreProvider")
  }
  return ctx
}

export const StoreProvider = (props: { id?: string | null; children: any }) => {
  const storeId = (): string | null => props.id ?? null

  return (
    <StoreContext.Provider value={storeId}>
      {props.children}
    </StoreContext.Provider>
  )
}

export { StoreContext }
