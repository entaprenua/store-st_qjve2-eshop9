# Product Components Architecture

## Overview

Zero-code ready product components for the visual builder. Components are designed to be fully composable - users can include/exclude sections by simply adding/removing child components.

## Design Principles

1. **Zero-Code Ready** - All components work without manual setup; just drop them in and configure via props
2. **Composable** - Sections are separate components that can be included/excluded via children
3. **Context-Based** - Components read from ProductContext, no manual data passing
4. **Action Wrappers** - All triggers prevent click propagation and include state data attributes
5. **Server-Aligned** - All server endpoints and filters are supported

## Directory Structure

```
components/ui/product/
├── STRUCTURE.md              # This file
├── index.ts                  # Barrel exports
├── product-context.tsx       # Context + useProduct() hook
├── product-root.tsx          # Main Product component
├── product-sections.tsx       # All product section components
├── product-list.tsx          # ProductList + ProductListView
├── product-media.tsx         # ProductMedia + ProductMediaItem
├── product-search.tsx        # ProductSearch + ProductSearchProvider
└── product-skeleton.tsx      # Loading skeleton components
```

## Data Sources

Product resolves data from multiple sources in priority order:

1. **Collection item** - From `useCollectionItem()` (within Collection/List)
2. **Explicit data** - `data` prop passed directly
3. **Route params** - `productSlug` from URL params

```typescript
// Resolution order
const resolvedData = () => {
  if (collectionItem?.item) return collectionItem.item  // 1. Collection item
  if (local.data) return local.data                   // 2. Explicit data
  return undefined
}
```

## Component Hierarchy

```
Product (provides ProductProvider context)
├── ProductImage
├── ProductName
├── ProductDescription
├── ProductSku
├── ProductPrice
├── ProductComparePrice
├── ProductStockBadge
├── ProductStockCount
└── ProductActionWrapper (wraps all triggers)
    ├── ProductAddToCartTrigger
    ├── ProductRemoveFromCartTrigger
    ├── ProductAddToWishlistTrigger
    ├── ProductRemoveFromWishlistTrigger
    ├── ProductToggleWishlistTrigger
    ├── ProductOrderTrigger
    └── ProductQuantityActions
        ├── ProductQuantityDecrementTrigger
        ├── ProductQuantityInput
        └── ProductQuantityIncrementTrigger

ProductList
├── Collection (data fetching)
└── CollectionView (layout)
    └── Product (per item)

ProductMedia
├── Collection (iterates product.media)
├── CollectionView
└── ProductMediaItem (renders image/video/audio)
```

## Usage Examples

### Product List

```tsx
<ProductList>
  <CollectionView layout="vertical-grid" columns={4} gap={4}>
    <Product class="border rounded-lg p-4">
      <ProductImage class="w-full aspect-square object-cover" />
      <ProductName class="font-semibold mt-2" />
      <ProductPrice class="text-lg font-bold" />
      
      <ProductAddToCartTrigger class="w-full mt-4" />
    </Product>
  </CollectionView>
</ProductList>
```

### Product with Actions

```tsx
<Product class="border rounded-lg p-6">
  <ProductImage class="w-full aspect-square" />
  
  <ProductName class="text-2xl font-bold mt-4" />
  <ProductDescription class="text-muted mt-2" />
  <ProductSku class="text-sm text-muted mt-1" />
  
  <div class="flex items-baseline gap-2 mt-4">
    <ProductPrice class="text-3xl font-bold" />
    <ProductComparePrice class="text-lg" />
  </div>
  
  <ProductStockBadge class="mt-4" />
  <ProductStockCount class="text-sm text-muted mt-1" />
  
  <ProductQuantityActions class="mt-4" />
  
  <ProductAddToCartTrigger class="w-full mt-4" />
  <ProductAddToWishlistTrigger class="w-full mt-2" />
</Product>
```

### CSS-Based Visibility with Data Attributes

Triggers include data attributes for CSS-based visibility control:

```tsx
<Product class="border rounded-lg">
  <ProductImage />
  <ProductName />
  <ProductPrice />
  
  {/* Show/hide based on cart state via CSS */}
  <ProductAddToCartTrigger 
    class="data-[in-cart]:hidden w-full mt-4" 
  />
  <ProductRemoveFromCartTrigger 
    class="hidden data-[in-cart]:block w-full mt-4" 
  />
  
  {/* Same pattern for wishlist */}
  <ProductAddToWishlistTrigger 
    class="data-[in-wishlist]:hidden w-full mt-2" 
  />
  <ProductRemoveFromWishlistTrigger 
    class="hidden data-[in-wishlist]:block w-full mt-2" 
  />
</Product>
```

### Custom Product Card

```tsx
<Product class="group">
  <div class="relative overflow-hidden rounded-lg">
    <ProductImage class="w-full aspect-square transition-transform group-hover:scale-105" />
    <ProductStockBadge class="absolute top-2 right-2" />
  </div>
  
  <div class="mt-3 space-y-1">
    <ProductSku class="text-xs text-muted" />
    <ProductName class="font-medium line-clamp-2" />
    <div class="flex items-baseline gap-2">
      <ProductPrice class="font-bold" />
      <ProductComparePrice />
    </div>
  </div>
  
  <ProductQuantityActions class="mt-3" />
  <ProductAddToCartTrigger class="w-full mt-3" />
</Product>
```

## ProductActionWrapper

All triggers are wrapped with `ProductActionWrapper` which:

1. Prevents click propagation (stops navigation to product page)
2. Includes state data attributes (`data-in-cart`, `data-in-wishlist`)

```tsx
<ProductActionWrapper>
  <Button data-in-cart="true">Remove</Button>
</ProductActionWrapper>
```

## ProductMedia

ProductMedia iterates over `product.data.media` array:

```tsx
<ProductMedia>
  <CollectionView layout="grid" columns={4} gap={2}>
    <ProductMediaItem />
  </CollectionView>
</ProductMedia>

// Or with custom item
<ProductMedia>
  <CollectionView>
    <ProductMediaItem class="rounded-lg" />
  </CollectionView>
</ProductMedia>

// Using Image component (more robust)
<Image class="size-full">
  <ImageImg alt="Product" />
  <ImageFallback>No image</ImageFallback>
</Image>
```

## Props Reference

### ProductRoot

```typescript
type ProductRootProps = {
  // Data source (auto-resolved from collection/route)
  data?: ProductContextData | Product
  
  // Query options
  includeMedia?: boolean     // Fetch media (default: false)
  includeMetadata?: boolean  // Fetch metadata (default: false)
  queryKey?: unknown[]
  
  // UI options
  errorFallback?: JSX.Element
  loadingFallback?: JSX.Element
  href?: string             // For wrapping in link
  class?: string
  children?: JSX.Element
}
```

### ProductList

```typescript
type ProductListProps = {
  storeId?: string
  filters?: ProductFilters
  pageSize?: number
  queryKey?: unknown[]
  enabled?: boolean
  errorFallback?: JSX.Element
  loadingFallback?: JSX.Element
  class?: string
  children?: JSX.Element
}
```

### ProductMedia

```typescript
type ProductMediaProps = {
  class?: string
  children?: JSX.Element
}

type ProductMediaItemProps = {
  src?: string
  type?: ProductMediaItemType
  alt?: string
  class?: string
  autoplay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
  poster?: string
}
```

## Context API

### ProductContextValue

```typescript
type ProductContextValue = {
  data: Product
  isInCart: () => boolean
  isInWishlist: () => boolean
  getStockStatus: () => "in_stock" | "low_stock" | "out_of_stock"
  getAvailableQuantity: () => number
}
```

## Inventory Status Logic

```typescript
function getStockStatus(product: Product): "in_stock" | "low_stock" | "out_of_stock" {
  if (!product.trackInventory) return "in_stock"
  
  const available = product.stockQuantity - product.reservedQuantity
  
  if (available <= 0) {
    return product.allowBackorder ? "in_stock" : "out_of_stock"
  }
  
  if (available <= product.lowStockThreshold) {
    return "low_stock"
  }
  
  return "in_stock"
}
```

## Image Component Alternative

Users can also use the robust `Image` component for more features:

```tsx
<Image class="size-full">
  <ImageImg alt="Product" />
  <ImageFallback>No image</ImageFallback>
</Image>
```

The `Image` component automatically infers:
- Product image from product context
- Category image from category context

## Future Enhancements

### QueryTrigger Integration

`ProductActionWrapper` is a placeholder for future enhancements. In the future, triggers will integrate with QueryTrigger for mutation handling via API calls.

```tsx
// Future usage
<ProductActionWrapper mutationFn={() => addToCart()}>
  <ProductAddToCartTrigger />
</ProductActionWrapper>
```
