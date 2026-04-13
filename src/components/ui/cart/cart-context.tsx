import { createContext, useContext, type JSX, type Accessor, createMemo, createSignal, Show, createEffect } from "solid-js"
import { fetchCart, addToCart, updateCartItem, removeFromCart, clearCart, getCurrentCartParams } from "~/lib/hooks/useCart"
import { useStoreId } from "~/lib/store-context"
import { useAuth } from "~/lib/guards/auth"
import type { CartItem } from "~/lib/api/carts"

export type CartItemContextData = {
  id: string
  productId: string
  quantity: number
  price: number
  name: string
  image?: string
  selected: boolean
  subtotal: number
}

type CartContextValue = {
  items: Accessor<CartItemContextData[]>
  selectedItems: Accessor<CartItemContextData[]>
  count: Accessor<number>
  subtotal: Accessor<number>
  selectedSubtotal: Accessor<number>
  isEmpty: Accessor<boolean>
  isLoading: Accessor<boolean>
  isPending: Accessor<boolean>
  error: Accessor<Error | null>
  addItem: (item: Omit<CartItemContextData, "id" | "subtotal">) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  toggleSelected: (productId: string) => void
  clear: () => void
  clearSelected: () => void
  refetch: () => void
  hasProduct: (productId: string) => boolean
  findByProductId: (productId: string) => CartItemContextData | undefined
}

const CartContext = createContext<CartContextValue>()

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider")
  }
  return ctx
}

const cartItemToContext = (item: CartItem): CartItemContextData => {
  const price = typeof item.price === "string" ? parseFloat(item.price) : (item.price ?? 0)
  const sub = typeof item.subtotal === "string" ? parseFloat(item.subtotal) : (item.subtotal ?? 0)
  return {
    id: item.id ?? "",
    productId: item.productId,
    quantity: item.quantity,
    price: price,
    name: "",
    image: undefined,
    selected: true,
    subtotal: sub,
  }
}

type CartProviderProps = {
  storeId?: string | (() => string | null | undefined)
  children?: JSX.Element
  loadingFallback?: JSX.Element
  errorFallback?: (error: Error) => JSX.Element
}

export const CartProvider = (props: CartProviderProps) => {
  const auth = useAuth()
  
  const storeId = () => {
    if (props.storeId) {
      return typeof props.storeId === "function" ? props.storeId() : props.storeId
    }
    return useStoreId()()
  }

  const [cartData, setCartData] = createSignal<CartItem[]>([])
  const [isLoading, setIsLoading] = createSignal(true)
  const [isPending, setIsPending] = createSignal(false)
  const [error, setError] = createSignal<Error | null>(null)

  const loadCart = async () => {
    const sid = storeId()
    if (!sid) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const userId = auth.user()?.id
      const guestId = userId ? undefined : getCurrentCartParams().guestId
      
      const cart = await fetchCart({
        storeId: sid,
        userId,
        guestId,
      })
      
      if (cart?.items) {
        setCartData(cart.items)
      } else {
        setCartData([])
      }
    } catch (e) {
      setError(e as Error)
      setCartData([])
    } finally {
      setIsLoading(false)
    }
  }

  createEffect(() => {
    const sid = storeId()
    if (sid) {
      loadCart()
    }
  })

  const items = createMemo((): CartItemContextData[] => 
    cartData().map(cartItemToContext)
  )

  const count = createMemo(() => items().length)

  const subtotal = createMemo(() => {
    return items().reduce((sum: number, item: CartItemContextData) => sum + (item.price * item.quantity), 0)
  })

  const selectedItems = createMemo(() => items().filter((item) => item.selected))

  const selectedSubtotal = createMemo(() => {
    return selectedItems().reduce((sum: number, item: CartItemContextData) => sum + (item.price * item.quantity), 0)
  })

  const isEmpty = createMemo(() => items().length === 0)

  const addItem = async (item: Omit<CartItemContextData, "id" | "subtotal">) => {
    const sid = storeId()
    if (!sid) return
    
    const userId = auth.user()?.id
    const guestId = userId ? undefined : getCurrentCartParams().guestId
    
    setIsPending(true)
    try {
      await addToCart({
        storeId: sid,
        userId,
        guestId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })
      await loadCart()
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsPending(false)
    }
  }

  const removeItem = async (productId: string) => {
    const sid = storeId()
    if (!sid) return
    
    const userId = auth.user()?.id
    const guestId = userId ? undefined : getCurrentCartParams().guestId
    
    setIsPending(true)
    try {
      await removeFromCart({
        storeId: sid,
        userId,
        guestId,
        productId,
      })
      await loadCart()
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsPending(false)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    const sid = storeId()
    if (!sid) return
    
    const userId = auth.user()?.id
    const guestId = userId ? undefined : getCurrentCartParams().guestId
    
    setIsPending(true)
    try {
      await updateCartItem({
        storeId: sid,
        userId,
        guestId,
        productId,
        quantity,
      })
      await loadCart()
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsPending(false)
    }
  }

  const toggleSelected = (productId: string) => {
    setCartData((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, selected: !item.selected }
          : item
      )
    )
  }

  const clear = async () => {
    const sid = storeId()
    if (!sid) return
    
    const userId = auth.user()?.id
    const guestId = userId ? undefined : getCurrentCartParams().guestId
    
    setIsPending(true)
    try {
      await clearCart({
        storeId: sid,
        userId,
        guestId,
      })
      setCartData([])
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsPending(false)
    }
  }

  const clearSelected = () => {
    setCartData((prev) =>
      prev.map((item) => ({ ...item, selected: false }))
    )
  }

  const refetch = () => loadCart()

  const hasProduct = (productId: string) => {
    return items().some(item => item.productId === productId)
  }

  const findByProductId = (productId: string) => {
    return items().find(item => item.productId === productId)
  }

  const value: CartContextValue = {
    items,
    selectedItems,
    count,
    subtotal,
    selectedSubtotal,
    isEmpty,
    isLoading,
    isPending,
    error,
    addItem,
    removeItem,
    updateQuantity,
    toggleSelected,
    clear,
    clearSelected,
    refetch,
    hasProduct,
    findByProductId,
  }

  return (
    <CartContext.Provider value={value}>
      <Show
        when={!isLoading()}
        fallback={props.loadingFallback ?? <DefaultCartLoading />}
      >
        {props.children}
      </Show>
    </CartContext.Provider>
  )
}

const DefaultCartLoading = () => (
  <div class="animate-pulse space-y-4 p-4">
    <div class="h-20 bg-muted rounded" />
    <div class="h-20 bg-muted rounded" />
    <div class="h-20 bg-muted rounded" />
  </div>
)

export { CartContext }
export type { CartContextValue, CartProviderProps }
