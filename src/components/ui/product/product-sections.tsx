import { Show, splitProps, type JSX, createMemo } from "solid-js"
import { A } from "@solidjs/router"
import { useProduct, type ProductStockStatus } from "./product-context"
import { useCart } from "../cart/cart-context"
import { useWishlist } from "../wishlist/wishlist-context"
import { useOrder } from "../order/order-context"
import { Button } from "../button"
import { Flex } from "../flex"
import { NumberField, NumberFieldInput } from "../number-field"
import { Collection, CollectionView, type CollectionLayoutMode, type CollectionColumnCount, type CollectionGapSize } from "../collection"
import { cn } from "~/lib/utils"
import { ImageImg, ImageFallback, Image } from "../image"


type ProductFieldProps = {
  class?: string
  label?: string
}

type ProductActionProps = {
  class?: string
  href?: string
  onClick?: (e: MouseEvent) => void
  children?: JSX.Element
}

const ProductActionWrapper = (props: { children?: JSX.Element; class?: string }) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      class={props.class}
    >
      {props.children}
    </div>
  )
}

const ProductName = (props: ProductFieldProps) => {
  const product = useProduct()
  return (
    <Show when={product?.data.name}>
      <div class={props.class}>
        {props.label ?? product!.data.name}
      </div>
    </Show>
  )
}

const ProductDescription = (props: ProductFieldProps) => {
  const product = useProduct()
  return (
    <Show when={product?.data.description}>
      <div class={props.class}>
        {props.label ?? product!.data.description}
      </div>
    </Show>
  )
}

const ProductSku = (props: ProductFieldProps) => {
  const product = useProduct()
  return (
    <Show when={product?.data.sku}>
      <div class={cn("text-muted-foreground text-sm", props.class)}>
        {props.label ?? `SKU: ${product!.data.sku}`}
      </div>
    </Show>
  )
}

const ProductPrice = (props: ProductFieldProps) => {
  const product = useProduct()
  const formattedPrice = createMemo(() => {
    const price = product?.data.price
    if (!price) return null
    const numPrice = typeof price === "string" ? parseFloat(price) : price
    if (isNaN(numPrice)) return null
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numPrice)
  })

  return (
    <Show when={formattedPrice()}>
      <div class={props.class}>{props.label ?? formattedPrice()}</div>
    </Show>
  )
}

const ProductComparePrice = (props: ProductFieldProps) => {
  const product = useProduct()
  const formattedPrice = createMemo(() => {
    const price = product?.data.compareToPrice
    if (!price) return null
    const numPrice = typeof price === "string" ? parseFloat(price) : price
    if (isNaN(numPrice)) return null
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numPrice)
  })

  return (
    <Show when={formattedPrice()}>
      <div class={cn("text-muted-foreground line-through", props.class)}>
        {props.label ?? formattedPrice()}
      </div>
    </Show>
  )
}

const ProductQuantity = (props: ProductFieldProps) => {
  const product = useProduct()
  return (
    <div class={props.class}>
      {props.label ?? String(product?.data.quantity ?? 1)}
    </div>
  )
}

const ProductStockBadge = (props: ProductFieldProps) => {
  const product = useProduct()

  const stockStatus = createMemo(() => product?.getStockStatus() ?? "in_stock")

  const statusConfig: Record<
    ProductStockStatus,
    { label: string; class: string }
  > = {
    in_stock: { label: "In Stock", class: "bg-green-100 text-green-800" },
    low_stock: { label: "Low Stock", class: "bg-yellow-100 text-yellow-800" },
    out_of_stock: { label: "Out of Stock", class: "bg-red-100 text-red-800" },
  }

  return (
    <Show when={stockStatus()}>
      {(() => {
        const config = statusConfig[stockStatus()]
        return (
          <span
            class={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              config.class,
              props.class
            )}
          >
            {props.label ?? config.label}
          </span>
        )
      })()}
    </Show>
  )
}

const ProductStockCount = (props: ProductFieldProps) => {
  const product = useProduct()

  const availableQty = createMemo(() => product?.getAvailableQuantity() ?? -1)

  return (
    <Show when={availableQty() >= 0}>
      <span class={props.class}>
        {props.label ?? `${availableQty()} in stock`}
      </span>
    </Show>
  )
}

const ProductImage = (props: ProductFieldProps & { alt?: string }) => {
  /**
   * Simple product image component.
   * Users can also use the robust Image component which supports:
   * - Lazy loading
   * - Error fallback
   * - Aspect ratio
   * 
   * Usage:
   * ```tsx
   * <ProductImage />
   * <ProductImage alt="Custom alt text" />
   * 
   * // Or use the robust Image component:
   * <Image class="size-full">
   *   <ImageImg alt="Product" />
   *   <ImageFallback>No image</ImageFallback>
   * </Image>
   * ```
   */
  const [local] = splitProps(props, ["class", "alt"])
  const product = useProduct()

  const altText = createMemo(() => {
    return (
      local.alt ??
      product?.data.name ??
      "Product image"
    )
  })

  return (
    <Image class={cn("relative", local.class)}>
      <ImageImg alt={altText()} />
      <ImageFallback>No image</ImageFallback>
    </Image>
  )
}

const ProductAddToCartTrigger = (props: ProductActionProps) => {
  const product = useProduct()

  let cart: ReturnType<typeof useCart> | undefined
  try {
    cart = useCart()
  } catch {
    return (
      <ProductActionWrapper>
        <Button variant="ghost" class={cn("p-1", props.class)} disabled>
          Add to Cart
        </Button>
      </ProductActionWrapper>
    )
  }

  const isInCart = createMemo(() => {
    if (!product?.data?.id || !cart) return false
    return !!cart.findByProductId(product.data.id)
  })

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    props.onClick?.(e)
    if (cart && product?.data) {
      cart.addProduct(product.data as any, product.data.quantity ?? 1)
    }
  }

  return (
    <ProductActionWrapper>
      <Button
        variant="ghost"
        data-in-cart={isInCart() ? "true" : "false"}
        class={cn("p-1", props.class)}
        onClick={handleClick}
      >
        {props.children ?? "Add to Cart"}
      </Button>
    </ProductActionWrapper>
  )
}

const ProductRemoveFromCartTrigger = (props: ProductActionProps) => {
  const product = useProduct()

  let cart: ReturnType<typeof useCart> | undefined
  try {
    cart = useCart()
  } catch {
    return null
  }

  const item = createMemo(() => {
    if (!product?.data?.id || !cart) return undefined
    return cart.findByProductId(product.data.id)
  })

  const isInCart = createMemo(() => !!item())

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    props.onClick?.(e)
    if (item() && cart) {
      cart.remove(item()!.id)
    }
  }

  return (
    <ProductActionWrapper>
      <Button
        variant="ghost"
        data-in-cart={isInCart() ? "true" : "false"}
        class={cn("p-1", props.class)}
        onClick={handleClick}
      >
        {props.children ?? "Remove"}
      </Button>
    </ProductActionWrapper>
  )
}

const ProductAddToWishlistTrigger = (props: ProductActionProps) => {
  const product = useProduct()

  let wishlist: ReturnType<typeof useWishlist> | undefined
  try {
    wishlist = useWishlist()
  } catch {
    return (
      <ProductActionWrapper>
        <Button variant="ghost" class={cn("p-1", props.class)} disabled>
          Add to Wishlist
        </Button>
      </ProductActionWrapper>
    )
  }

  const isInWishlist = createMemo(() => {
    if (!product?.data?.id || !wishlist) return false
    return !!wishlist.findByProductId(product.data.id)
  })

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    props.onClick?.(e)
    if (wishlist && product?.data) {
      wishlist.addProduct(product.data as any)
    }
  }

  return (
    <ProductActionWrapper>
      <Button
        variant="ghost"
        data-in-wishlist={isInWishlist() ? "true" : "false"}
        class={cn("p-1", props.class)}
        onClick={handleClick}
      >
        {props.children ?? "Add to Wishlist"}
      </Button>
    </ProductActionWrapper>
  )
}

const ProductRemoveFromWishlistTrigger = (props: ProductActionProps) => {
  const product = useProduct()

  let wishlist: ReturnType<typeof useWishlist> | undefined
  try {
    wishlist = useWishlist()
  } catch {
    return null
  }

  const item = createMemo(() => {
    if (!product?.data?.id || !wishlist) return undefined
    return wishlist.findByProductId(product.data.id)
  })

  const isInWishlist = createMemo(() => !!item())

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    props.onClick?.(e)
    if (item() && wishlist) {
      wishlist.remove(item()!.id)
    }
  }

  return (
    <ProductActionWrapper>
      <Button
        variant="ghost"
        data-in-wishlist={isInWishlist() ? "true" : "false"}
        class={cn("p-1", props.class)}
        onClick={handleClick}
      >
        {props.children ?? "Remove from Wishlist"}
      </Button>
    </ProductActionWrapper>
  )
}

const ProductToggleWishlistTrigger = (props: ProductActionProps) => {
  const product = useProduct()

  let wishlist: ReturnType<typeof useWishlist> | undefined
  try {
    wishlist = useWishlist()
  } catch {
    return (
      <ProductActionWrapper>
        <Button variant="ghost" class={cn("p-1", props.class)} disabled>
          Wishlist
        </Button>
      </ProductActionWrapper>
    )
  }

  const item = createMemo(() => {
    if (!product?.data?.id || !wishlist) return undefined
    return wishlist.findByProductId(product.data.id)
  })

  const isInWishlist = createMemo(() => !!item())

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    props.onClick?.(e)
    if (item()) {
      wishlist!.remove(item()!.id)
    } else {
      wishlist!.addProduct(product!.data as any)
    }
  }

  return (
    <ProductActionWrapper>
      <Button
        variant="ghost"
        data-in-wishlist={isInWishlist() ? "true" : "false"}
        class={cn("p-1", props.class)}
        onClick={handleClick}
      >
        {props.children ?? (item() ? "Remove from Wishlist" : "Add to Wishlist")}
      </Button>
    </ProductActionWrapper>
  )
}

const ProductOrderTrigger = (props: ProductActionProps) => {
  const product = useProduct()
  const order = useOrder()

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    props.onClick?.(e)
    if (!product?.data?.id) return

    const price = typeof product.data.price === "string"
      ? parseFloat(product.data.price)
      : (product.data.price ?? 0)
    const quantity = product.data.quantity ?? 1

    order.clear()
    order.addItem({
      productId: product.data.id,
      name: product.data.name ?? "Product",
      price,
      quantity,
      image: product.data.image as string | undefined,
    })

    if (props.href) {
      window.location.href = props.href
    }
  }

  return (
    <ProductActionWrapper>
      <Button
        variant="ghost"
        class={cn("p-1", props.class)}
        onClick={handleClick}
      >
        {props.children ?? "Order Now"}
      </Button>
    </ProductActionWrapper>
  )
}

const ProductQuantityDecrementTrigger = (props: ProductActionProps) => {
  const product = useProduct()

  let cart: ReturnType<typeof useCart> | undefined
  try {
    cart = useCart()
  } catch {
    return null
  }

  const item = createMemo(() => {
    if (!product?.data?.id || !cart) return undefined
    return cart.findByProductId(product.data.id)
  })

  const handleDecrement = (e: MouseEvent) => {
    e.stopPropagation()
    props.onClick?.(e)
    if (!item() || !cart) return
    const currentQty = item()?.quantity ?? 1
    if (currentQty <= 1) {
      cart.remove(item()!.id)
    } else {
      cart.setQuantity(item()!.id, currentQty - 1)
    }
  }

  return (
    <ProductActionWrapper>
      <Button
        variant="ghost"
        data-in-cart={item() ? "true" : "false"}
        class={cn("p-1 w-8", props.class)}
        onClick={handleDecrement}
      >
        {props.children ?? "−"}
      </Button>
    </ProductActionWrapper>
  )
}

const ProductQuantityIncrementTrigger = (props: ProductActionProps) => {
  const product = useProduct()

  let cart: ReturnType<typeof useCart> | undefined
  try {
    cart = useCart()
  } catch {
    return null
  }

  const item = createMemo(() => {
    if (!product?.data?.id || !cart) return undefined
    return cart.findByProductId(product.data.id)
  })

  const handleIncrement = (e: MouseEvent) => {
    e.stopPropagation()
    props.onClick?.(e)
    if (!item() || !cart) return
    const currentQty = item()?.quantity ?? 1
    cart.setQuantity(item()!.id, currentQty + 1)
  }

  return (
    <ProductActionWrapper>
      <Button
        variant="ghost"
        data-in-cart={item() ? "true" : "false"}
        class={cn("p-1 w-8", props.class)}
        onClick={handleIncrement}
      >
        {props.children ?? "+"}
      </Button>
    </ProductActionWrapper>
  )
}

const ProductQuantityInput = (props: ProductActionProps) => {
  const product = useProduct()

  let cart: ReturnType<typeof useCart> | undefined
  try {
    cart = useCart()
  } catch {
    return null
  }

  const item = createMemo(() => {
    if (!product?.data?.id || !cart) return undefined
    return cart.findByProductId(product.data.id)
  })

  const handleChange = (value: number) => {
    const qty = isNaN(value) || value < 1 ? 1 : value
    if (item() && cart) {
      cart.setQuantity(item()!.id, qty)
    }
  }

  return (
    <ProductActionWrapper>
      <NumberField
        onRawValueChange={handleChange}
        onClick={(e) => e.stopPropagation()}
        value={item()?.quantity ?? 1}
        class={props.class}
      >
        <NumberFieldInput class="w-16 h-8 text-center" />
      </NumberField>
    </ProductActionWrapper>
  )
}

const ProductQuantityActions = (props: ProductFieldProps) => {
  return (
    <Flex
      flexDirection="row"
      class={cn(
        "ring ring-1 ring-primary rounded-lg h-8 items-center",
        props.class
      )}
    >
      <ProductQuantityDecrementTrigger />
      <ProductQuantityInput class="flex-1" />
      <ProductQuantityIncrementTrigger />
    </Flex>
  )
}

type ProductBackLinkProps = {
  href: string
  class?: string
  children?: JSX.Element
}

const ProductBackLink = (props: ProductBackLinkProps) => {
  return (
    <A href={props.href} class={props.class}>
      {props.children ?? "← Back"}
    </A>
  )
}

export {
  ProductName,
  ProductDescription,
  ProductSku,
  ProductPrice,
  ProductComparePrice,
  ProductQuantity,
  ProductStockBadge,
  ProductStockCount,
  ProductImage,
  ProductAddToCartTrigger,
  ProductRemoveFromCartTrigger,
  ProductAddToWishlistTrigger,
  ProductRemoveFromWishlistTrigger,
  ProductToggleWishlistTrigger,
  ProductOrderTrigger,
  ProductQuantityDecrementTrigger,
  ProductQuantityIncrementTrigger,
  ProductQuantityInput,
  ProductQuantityActions,
  ProductBackLink,
  ProductActionWrapper,
}

export type {
  ProductFieldProps,
  ProductActionProps,
}
