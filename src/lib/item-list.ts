import { createMemo, createEffect, createSignal, on, type Accessor } from "solid-js"
import { createStore, produce } from "solid-js/store"
import { createUniqueId } from "./utils"
import type { CartItem, WishlistItem, OrderItem } from "~/lib/types"

export type ItemListEntry = {
  id: string
  productId: string
  quantity: number
  price: string | number
  name: string
  image?: string
  selected: boolean
  subtotal: string | number
  cartId?: string
  wishlistId?: string
  orderId?: string
}

export type ItemListSnapshot = {
  id?: string
  storeId?: string
  customerId?: string
  currency?: string
  items?: ItemListEntry[]
  subtotal?: string | number
  total?: string | number
  notes?: string | null
}

export type ItemListActions = {
  add: (item: Omit<ItemListEntry, 'id' | 'subtotal'>) => void
  remove: (id: string) => void
  update: (id: string, updates: Partial<Omit<ItemListEntry, 'id'>>) => void
  setQuantity: (id: string, quantity: number) => void
  toggleSelected: (id: string) => void
  selectAll: () => void
  deselectAll: () => void
  clear: () => void
  find: (id: string) => ItemListEntry | undefined
  findByProductId: (productId: string) => ItemListEntry | undefined
  hasProduct: (productId: string) => boolean
}

export type ItemListState = {
  id: Accessor<string | undefined>
  storeId: Accessor<string | undefined>
  customerId: Accessor<string | undefined>
  currency: Accessor<string | undefined>
  items: Accessor<ItemListEntry[]>
  selectedItems: Accessor<ItemListEntry[]>
  count: Accessor<number>
  selectedCount: Accessor<number>
  subtotal: Accessor<number>
  isEmpty: Accessor<boolean>
  setSnapshot: (value: ItemListSnapshot) => void
} & ItemListActions

export type CreateItemListOptions = {
  defaultQuantity?: number
  defaultSelected?: boolean
}

export function createItemList(
  initialSnapshot?: ItemListSnapshot,
  options: CreateItemListOptions = {}
): ItemListState {
  const defaultQuantity = options.defaultQuantity ?? 1
  const defaultSelected = options.defaultSelected ?? true

  const [snapshot, setSnapshot] = createSignal<ItemListSnapshot | undefined>(initialSnapshot)
  const [store, setStore] = createStore<Record<string, ItemListEntry>>({})

  const calcSubtotal = (price: string | number, qty: number): number => 
    Math.round(Number(price) * qty * 100) / 100

  createEffect(
    on(snapshot, (val) => {
      if (!val?.items) return
      const items = val.items
      setStore(
        produce((s: Record<string, ItemListEntry>) => {
          Object.keys(s).forEach((k) => delete s[k])
          items.forEach((item) => {
            if (item.id) s[item.id] = item
          })
        })
      )
    })
  )

  const items = createMemo(() => Object.values(store))
  const selectedItems = createMemo(() => items().filter((i) => i.selected))
  const count = createMemo(() => items().length)
  const selectedCount = createMemo(() => selectedItems().length)
  const subtotal = createMemo(() => 
    selectedItems().reduce((sum, item) => sum + Number(item.subtotal), 0)
  )
  const isEmpty = createMemo(() => count() === 0)

  const find = (id: string): ItemListEntry | undefined => store[id]
  const findByProductId = (productId: string): ItemListEntry | undefined => 
    items().find((i) => i.productId === productId)
  const hasProduct = (productId: string): boolean => !!findByProductId(productId)

  const add = (item: Omit<ItemListEntry, 'id' | 'subtotal'>): void => {
    const existing = findByProductId(item.productId)
    if (existing) {
      setQuantity(existing.id, existing.quantity + item.quantity)
      return
    }
    const id = createUniqueId()
    setStore(id, { ...item, id, subtotal: calcSubtotal(item.price, item.quantity) })
  }

  const remove = (id: string): void => {
    setStore(produce((s) => { delete s[id] }))
  }

  const update = (id: string, updates: Partial<Omit<ItemListEntry, 'id'>>): void => {
    if (!store[id]) return
    setStore(produce((s) => {
      Object.assign(s[id], updates)
      if ('price' in updates || 'quantity' in updates) {
        s[id].subtotal = calcSubtotal(s[id].price, s[id].quantity)
      }
    }))
  }

  const setQuantity = (id: string, quantity: number): void => {
    if (quantity <= 0) {
      remove(id)
      return
    }
    update(id, { quantity })
  }

  const toggleSelected = (id: string): void => {
    if (!store[id]) return
    setStore(id, 'selected', (v) => !v)
  }

  const selectAll = (): void => {
    setStore(produce((s) => {
      Object.keys(s).forEach((k) => { s[k].selected = true })
    }))
  }

  const deselectAll = (): void => {
    setStore(produce((s) => {
      Object.keys(s).forEach((k) => { s[k].selected = false })
    }))
  }

  const clear = (): void => {
    setStore(produce((s) => {
      Object.keys(s).forEach((k) => delete s[k])
    }))
  }

  return {
    get id() { return createMemo(() => snapshot()?.id) },
    get storeId() { return createMemo(() => snapshot()?.storeId) },
    get customerId() { return createMemo(() => snapshot()?.customerId) },
    get currency() { return createMemo(() => snapshot()?.currency) },
    items,
    selectedItems,
    count,
    selectedCount,
    subtotal,
    isEmpty,
    setSnapshot: (v) => setSnapshot(() => v),
    add,
    remove,
    update,
    setQuantity,
    toggleSelected,
    selectAll,
    deselectAll,
    clear,
    find,
    findByProductId,
    hasProduct,
  }
}

export type ProductInput = {
  id?: string
  name?: string
  price?: number | null
  image?: string | null | { url?: string }
  quantity?: number
}

export function productToEntry(
  product: ProductInput,
  options: { quantity?: number; selected?: boolean } = {}
): Omit<ItemListEntry, 'id' | 'subtotal'> | null {
  if (!product.id) return null
  
  const image = typeof product.image === 'string' 
    ? product.image 
    : product.image?.url ?? undefined

  return {
    productId: product.id,
    name: product.name ?? '',
    price: product.price ?? 0,
    image,
    quantity: options.quantity ?? product.quantity ?? 1,
    selected: options.selected ?? true,
  }
}

export function toCartItems(items: ItemListEntry[], cartId: string): CartItem[] {
  return items.map((item) => ({
    id: item.id,
    cartId,
    productId: item.productId,
    price: item.price,
    quantity: item.quantity,
    subtotal: item.subtotal,
    insertedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
  }))
}

export function toWishlistItems(items: ItemListEntry[], wishlistId: string): WishlistItem[] {
  return items.map((item) => ({
    id: item.id,
    wishlistId,
    productId: item.productId,
    insertedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
  }))
}

export function toOrderItems(items: ItemListEntry[], orderId: string): OrderItem[] {
  return items.map((item) => ({
    id: item.id,
    orderId,
    productId: item.productId,
    productName: item.name,
    price: item.price,
    quantity: item.quantity,
    subtotal: item.subtotal,
    insertedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
  }))
}
