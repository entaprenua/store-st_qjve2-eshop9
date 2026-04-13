import { createContext, useContext, type Accessor, createSignal } from "solid-js"
import { createStorage } from "@solid-primitives/storage"
import { createUniqueId } from "~/lib/utils"

type OrderItem = {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
  subtotal: number
}

type OrderContextValue = {
  items: Accessor<OrderItem[]>
  subtotal: Accessor<number>
  isEmpty: Accessor<boolean>
  clear: () => void
  addItem: (item: { productId: string; name?: string; price?: number | null; quantity?: number; image?: string | null }) => void
  addItems: (items: { productId: string; name?: string; price?: number | null; quantity?: number; image?: string | null }[]) => void
}

const OrderContext = createContext<OrderContextValue>()

export const useOrder = (): OrderContextValue => {
  const ctx = useContext(OrderContext)
  if (!ctx) {
    throw new Error("useOrder must be used within OrderProvider")
  }
  return ctx
}

export const OrderProvider = (props: { children: any }) => {
  const [rawItems, setRawItems] = createStorage<OrderItem[]>("order_items", [])

  const items = (): OrderItem[] => rawItems

  const subtotal = () =>
    rawItems.reduce((sum, item) => sum + item.subtotal, 0)

  const isEmpty = () => rawItems.length === 0

  const clear = () => {
    setRawItems([])
  }

  const addItem = (item: { productId: string; name?: string; price?: number | null; quantity?: number; image?: string | null }) => {
    const price = typeof item.price === "number" ? item.price : (item.price ? parseFloat(String(item.price)) : 0)
    const quantity = item.quantity ?? 1
    const newItem: OrderItem = {
      id: createUniqueId(),
      productId: item.productId,
      name: item.name ?? "Product",
      price,
      quantity,
      image: typeof item.image === "string" ? item.image : undefined,
      subtotal: price * quantity,
    }
    setRawItems([newItem])
  }

  const addItems = (newItems: { productId: string; name?: string; price?: number | null; quantity?: number; image?: string | null }[]) => {
    const mapped: OrderItem[] = newItems.map((item) => {
      const price = typeof item.price === "number" ? item.price : (item.price ? parseFloat(String(item.price)) : 0)
      const quantity = item.quantity ?? 1
      return {
        id: createUniqueId(),
        productId: item.productId,
        name: item.name ?? "Product",
        price,
        quantity,
        image: typeof item.image === "string" ? item.image : undefined,
        subtotal: price * quantity,
      }
    })
    setRawItems(mapped)
  }

  const value: OrderContextValue = {
    items,
    subtotal,
    isEmpty,
    clear,
    addItem,
    addItems,
  }

  return (
    <OrderContext.Provider value={value}>
      {props.children}
    </OrderContext.Provider>
  )
}
