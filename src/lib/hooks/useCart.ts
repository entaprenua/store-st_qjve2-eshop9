import { cartsApi, type Cart, type CartItem } from "~/lib/api/carts"
import { getOrCreateGuestId, clearGuestId } from "./useCartGuestId"

export type ProductInput = {
  id: string
  name?: string
  price?: string | number | null
  image?: string
  quantity?: number
}

export interface CartFetchOptions {
  storeId: string
  userId?: string
  guestId?: string
}

export async function fetchCart(options: CartFetchOptions): Promise<Cart | null> {
  const { storeId, guestId } = options
  if (!storeId) return null
  try {
    const sessionId = guestId ?? getOrCreateGuestId()
    return await cartsApi.get(storeId, { sessionId })
  } catch {
    return null
  }
}

export async function addToCart(options: CartFetchOptions & {
  productId: string
  quantity?: number
  price: number
}): Promise<Cart> {
  const { storeId, guestId } = options
  const sessionId = guestId ?? getOrCreateGuestId()
  
  let cart: Cart
  try {
    cart = await cartsApi.get(storeId, { sessionId })
  } catch {
    cart = {
      storeId,
      currency: "USD",
      subtotal: "0.00",
      total: "0.00",
      items: [],
    }
  }

  const existingItemIndex = cart.items?.findIndex(
    item => item.productId === options.productId
  ) ?? -1

  if (existingItemIndex >= 0 && cart.items) {
    const existingItem = cart.items[existingItemIndex]
    const newQuantity = existingItem.quantity + (options.quantity ?? 1)
    const newSubtotal = options.price * newQuantity
    cart.items[existingItemIndex] = {
      ...existingItem,
      quantity: newQuantity,
      subtotal: newSubtotal.toFixed(2),
    }
  } else {
    const newItem: CartItem = {
      productId: options.productId,
      price: options.price.toFixed(2),
      quantity: options.quantity ?? 1,
      subtotal: (options.price * (options.quantity ?? 1)).toFixed(2),
    }
    cart.items = [...(cart.items ?? []), newItem]
  }

  recalculateCartTotals(cart)
  return cartsApi.save(storeId, cart)
}

export async function updateCartItem(options: CartFetchOptions & {
  productId: string
  quantity: number
}): Promise<Cart> {
  const { storeId, guestId } = options
  const sessionId = guestId ?? getOrCreateGuestId()
  
  const cart = await cartsApi.get(storeId, { sessionId })
  
  if (cart.items) {
    const itemIndex = cart.items.findIndex(item => item.productId === options.productId)
    if (itemIndex >= 0) {
      if (options.quantity <= 0) {
        cart.items = cart.items.filter((_, i) => i !== itemIndex)
      } else {
        const item = cart.items[itemIndex]
        cart.items[itemIndex] = {
          ...item,
          quantity: options.quantity,
          subtotal: (parseFloat(item.price) * options.quantity).toFixed(2),
        }
      }
    }
  }

  recalculateCartTotals(cart)
  return cartsApi.save(storeId, cart)
}

export async function removeFromCart(options: CartFetchOptions & {
  productId: string
}): Promise<Cart> {
  const { storeId, guestId } = options
  const sessionId = guestId ?? getOrCreateGuestId()
  
  const cart = await cartsApi.get(storeId, { sessionId })
  
  if (cart.items) {
    cart.items = cart.items.filter(item => item.productId !== options.productId)
  }

  recalculateCartTotals(cart)
  return cartsApi.save(storeId, cart)
}

export async function clearCart(options: CartFetchOptions): Promise<Cart> {
  const { storeId, guestId } = options
  const sessionId = guestId ?? getOrCreateGuestId()
  
  const cart = await cartsApi.get(storeId, { sessionId })
  cart.items = []

  recalculateCartTotals(cart)
  return cartsApi.save(storeId, cart)
}

export async function mergeGuestCart(options: CartFetchOptions): Promise<Cart> {
  const { storeId } = options
  const cart = await cartsApi.get(storeId, { sessionId: getOrCreateGuestId() })
  clearGuestId()
  return cart
}

export function getCurrentCartParams(): { guestId: string } {
  return { guestId: getOrCreateGuestId() }
}

function recalculateCartTotals(cart: Cart): void {
  const subtotal = cart.items?.reduce(
    (sum, item) => sum + parseFloat(item.subtotal.toString()),
    0
  ) ?? 0
  cart.subtotal = subtotal.toFixed(2)
  cart.total = subtotal.toFixed(2)
}
