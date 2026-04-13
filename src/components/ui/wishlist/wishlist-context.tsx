import { createContext, useContext, type ParentComponent, createEffect, on } from "solid-js"
import { createSignal } from "solid-js"
import { createItemList, productToEntry, toWishlistItems, type ProductInput } from "~/lib/item-list"
import type { ItemListEntry, ItemListSnapshot } from "~/lib/item-list"
import type { Wishlist, WishlistItem } from "~/lib/types"
import { wishlistsApi, type WishlistResponse } from "~/lib/api/wishlists"

type WishlistStore = ReturnType<typeof createItemList> & {
  sync: (wishlist: WishlistResponse) => void
  addProduct: (product: ProductInput) => void
  toWishlistItems: () => WishlistItem[]
  save: () => Promise<void>
  isLoading: () => boolean
  error: () => string | null
}

const WishlistContext = createContext<WishlistStore>()

export const useWishlist = (): WishlistStore => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider")
  return ctx
}

export const WishlistProvider: ParentComponent<{ 
  storeId: string
  initialWishlist?: WishlistResponse 
}> = (props) => {
  const list = createItemList(undefined, { defaultQuantity: 1, defaultSelected: true })
  const [wishlistData, setWishlistData] = createSignal<WishlistResponse | undefined>(props.initialWishlist)
  const [isLoading, setIsLoading] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)

  const sync = (wishlist: WishlistResponse): void => {
    setWishlistData(wishlist)
    const snapshot: ItemListSnapshot = {
      id: wishlist.id,
      storeId: wishlist.storeId,
      customerId: wishlist.customerId,
      items: wishlist.items?.map((item): ItemListEntry => ({
        id: item.id,
        productId: item.productId,
        quantity: 1,
        price: 0,
        name: "",
        selected: true,
        subtotal: 0,
        wishlistId: item.wishlistId,
      })),
    }
    list.setSnapshot(snapshot)
  }

  const addProduct = (product: ProductInput): void => {
    if (!product.id || list.hasProduct(product.id)) return
    const entry = productToEntry(product, { quantity: 1, selected: true })
    if (entry) list.add(entry)
  }

  const toWishlistItemsFn = (): WishlistItem[] => {
    const wishlistId = wishlistData()?.id ?? ""
    return toWishlistItems(list.items(), wishlistId)
  }

  const save = async (): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const wishlist: Partial<WishlistResponse> = {
        id: wishlistData()?.id,
        storeId: props.storeId,
        customerId: wishlistData()?.customerId,
        items: toWishlistItemsFn(),
      }
      const saved = await wishlistsApi.save(props.storeId, wishlist)
      sync(saved)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save wishlist")
    } finally {
      setIsLoading(false)
    }
  }

  createEffect(
    on(
      () => list.items(),
      () => {
        if (wishlistData()?.id) {
          save()
        }
      },
      { defer: true }
    )
  )

  const store: WishlistStore = {
    ...list,
    sync,
    addProduct,
    toWishlistItems: toWishlistItemsFn,
    save,
    isLoading,
    error,
  }

  return <WishlistContext.Provider value={store}>{props.children}</WishlistContext.Provider>
}
