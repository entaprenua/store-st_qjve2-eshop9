# Mini-Cart Components Architecture

## Overview

This document outlines the mini-cart (semi-cart) component system. The mini-cart provides a quick-view popup that appears when users add/remove items from their cart, offering immediate feedback and enabling rapid cart management without leaving the current page.

## Design Principles

1. **Centralized State** - All state and auto-open logic lives in `CartMini`
2. **Thin Variant Wrappers** - Variants (`CartMiniDrawer`, etc.) inject context into primitives
3. **Nested Context** - Trigger must be inside variant to get Drawer/Dialog context
4. **Composable** - Sections are separate components that can be included/excluded via children
5. **Zero-Code Ready** - Default usage requires no configuration
6. **Builder-Ready** - Each variant is a draggable component in the visual editor

## Architecture

```
CartMini (provides CartMiniContext)
└── CartMiniDrawer (provides DrawerContext + injects open/onOpenChange from CartMiniContext)
    ├── Drawer.Trigger    ← Inside variant to get DrawerContext
    └── Drawer.Content    ← Also inside DrawerContext
        └── Cart Items / Cart Summary / etc.
```

## Variants

| Component | Base | Use Case |
|-----------|------|----------|
| `CartMiniDrawer` | `Drawer` | Slide-out from bottom - full cart experience |
| `CartMiniSheet` | `Sheet` | Sheet overlay - flexible positioning |
| `CartMiniDialog` | `Dialog` | Centered modal - attention-grabbing |
| `CartMiniPopover` | `Popover` | Compact dropdown - anchored to trigger |
| `CartMiniToast` | `Toast` | Lightweight notification - auto-dismiss |

## Directory Structure

```
components/ui/cart/
├── cart-context.tsx              # Existing cart context
├── cart-sections.tsx             # Existing cart sections
├── cart-mini-context.tsx          # CartMini wrapper + context + auto-open
├── cart-mini-drawer.tsx          # CartMiniDrawer variant
├── cart-mini-sheet.tsx           # CartMiniSheet variant
├── cart-mini-dialog.tsx          # CartMiniDialog variant
├── cart-mini-popover.tsx         # CartMiniPopover variant
├── cart-mini-toast.tsx           # CartMiniToast variant
├── MINI-STRUCTURE.md             # This file
└── index.ts                      # Export all
```

## Data Flow

### Manual Trigger (User clicks cart icon)
```
User clicks Cart Icon (inside variant)
        ↓
Drawer.Trigger onClick (uses DrawerContext)
        ↓
CartMiniContext.open(true) ← via onOpenChange injected by CartMiniDrawer
        ↓
Drawer.Content renders
```

### Auto-Open (Cart actions trigger mini-cart)
```
User adds/removes item from cart
        ↓
CartContext.isPending() = true
        ↓
createEffect in CartMini detects change
        ↓
CartMiniContext.open(true) ← Automatically triggered
```

## Auto-Open Behavior

Built-in and requires no configuration. Centralized in `CartMini`:

```tsx
export const CartMini = (props: { children?: JSX.Element }) => {
  const [open, setOpen] = createSignal(false)
  const cart = useCart()
  
  // Auto-open when cart is being updated (add/remove/update)
  createEffect(() => {
    if (cart.isPending()) {
      setOpen(true)
    }
  })
  
  // Auto-close when cart becomes empty (optional)
  createEffect(() => {
    if (cart.isEmpty() && open()) {
      setTimeout(() => setOpen(false), 2000)
    }
  })
  
  return (
    <CartMiniContext.Provider value={{ open, setOpen }}>
      {props.children}
    </CartMiniContext.Provider>
  )
}
```

### Behavior Summary

| Event | Action |
|-------|--------|
| `addToCart()` called | Auto-open mini-cart |
| `removeFromCart()` called | Auto-open mini-cart |
| `updateCartItem()` called | Auto-open mini-cart |
| Cart becomes empty | Auto-close after delay |
| User clicks trigger | Manual open |
| User clicks backdrop/Escape | Close |

## Usage Examples

### CartMiniDrawer

```tsx
import { Drawer } from "~/components/ui/drawer"
import { CartMini } from "~/components/ui/cart"
import { CartItems, CartSummary, CartCheckoutTrigger } from "~/components/ui/cart"

<CartMini>
  <CartMiniDrawer>
    <Drawer.Trigger>Cart Icon</Drawer.Trigger>
    <Drawer.Content>
      <Drawer.Header>
        <Drawer.Title>Your Cart</Drawer.Title>
      </Drawer.Header>
      <CartItems />
      <CartSummary />
      <CartCheckoutTrigger />
    </Drawer.Content>
  </CartMiniDrawer>
</CartMini>
```

### CartMiniSheet

```tsx
import { Sheet } from "~/components/ui/sheet"
import { CartMini } from "~/components/ui/cart"

<CartMini>
  <CartMiniSheet>
    <Sheet.Trigger>Cart Icon</Sheet.Trigger>
    <Sheet.Content>
      <Sheet.Header>
        <Sheet.Title>Your Cart</Sheet.Title>
      </Sheet.Header>
      <CartItems />
      <CartSummary />
    </Sheet.Content>
  </CartMiniSheet>
</CartMini>
```

### CartMiniDialog

```tsx
import { Dialog } from "~/components/ui/dialog"
import { CartMini } from "~/components/ui/cart"

<CartMini>
  <CartMiniDialog>
    <Dialog.Trigger>Cart Icon</Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Quick View</Dialog.Title>
      </Dialog.Header>
      <CartItems />
      <Dialog.Footer>
        <CartCheckoutTrigger />
      </Dialog.Footer>
    </Dialog.Content>
  </CartMiniDialog>
</CartMini>
```

### CartMiniPopover

```tsx
import { Popover } from "~/components/ui/popover"
import { CartMini } from "~/components/ui/cart"

<CartMini>
  <CartMiniPopover>
    <Popover.Trigger>Cart Icon</Popover.Trigger>
    <Popover.Content>
      <CartItems />
    </Popover.Content>
  </CartMiniPopover>
</CartMini>
```

### CartMiniToast

```tsx
import { Toast } from "~/components/ui/toast"
import { CartMini } from "~/components/ui/cart"

<CartMini>
  <CartMiniToast>
    <button>Cart Icon</button>
    <Toast>
      <CartItems />
    </Toast>
  </CartMiniToast>
</CartMini>
```

## Imports Reference

| What User Needs | Import Location |
|-----------------|-----------------|
| `CartMini` | `~/components/ui/cart` |
| `CartMiniDrawer` | `~/components/ui/cart` |
| `CartMiniSheet` | `~/components/ui/cart` |
| `CartMiniDialog` | `~/components/ui/cart` |
| `CartMiniPopover` | `~/components/ui/cart` |
| `CartMiniToast` | `~/components/ui/cart` |
| `CartItems` | `~/components/ui/cart` |
| `CartSummary` | `~/components/ui/cart` |
| `CartCheckoutTrigger` | `~/components/ui/cart` |
| `CartEmpty` | `~/components/ui/cart` |
| `Drawer` primitives | `~/components/ui/drawer` |
| `Sheet` primitives | `~/components/ui/sheet` |
| `Dialog` primitives | `~/components/ui/dialog` |
| `Popover` primitives | `~/components/ui/popover` |
| `Toast` primitives | `~/components/ui/toast` |

## Context API

### CartMiniContextValue

```typescript
type CartMiniContextValue = {
  // State
  open: Accessor<boolean>
  
  // Actions
  setOpen: (open: boolean) => void
}
```

## Implementation

### cart-mini-context.tsx

```tsx
import { createContext, useContext, createSignal, createEffect, type Accessor, type JSX } from "solid-js"
import { useCart } from "./cart-context"

const CartMiniContext = createContext<{
  open: Accessor<boolean>
  setOpen: (open: boolean) => void
}>()

export const CartMini = (props: { children?: JSX.Element }) => {
  const [open, setOpen] = createSignal(false)
  const cart = useCart()
  
  // Auto-open when cart is being updated
  createEffect(() => {
    if (cart.isPending()) {
      setOpen(true)
    }
  })
  
  // Auto-close when cart becomes empty
  createEffect(() => {
    if (cart.isEmpty() && open()) {
      setTimeout(() => setOpen(false), 2000)
    }
  })
  
  return (
    <CartMiniContext.Provider value={{ open, setOpen }}>
      {props.children}
    </CartMiniContext.Provider>
  )
}

export const useCartMini = () => {
  const ctx = useContext(CartMiniContext)
  if (!ctx) {
    throw new Error("useCartMini must be used within CartMini")
  }
  return ctx
}
```

### cart-mini-drawer.tsx

```tsx
import { Drawer } from "~/components/ui/drawer"
import { useCartMini } from "./cart-mini-context"

export const CartMiniDrawer = (props: { children?: JSX.Element }) => {
  const { open, setOpen } = useCartMini()
  
  return (
    <Drawer open={open()} onOpenChange={setOpen}>
      {props.children}
    </Drawer>
  )
}
```

### cart-mini-sheet.tsx

```tsx
import { Sheet } from "~/components/ui/sheet"
import { useCartMini } from "./cart-mini-context"

export const CartMiniSheet = (props: { children?: JSX.Element }) => {
  const { open, setOpen } = useCartMini()
  
  return (
    <Sheet open={open()} onOpenChange={setOpen}>
      {props.children}
    </Sheet>
  )
}
```

### cart-mini-dialog.tsx

```tsx
import { Dialog } from "~/components/ui/dialog"
import { useCartMini } from "./cart-mini-context"

export const CartMiniDialog = (props: { children?: JSX.Element }) => {
  const { open, setOpen } = useCartMini()
  
  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      {props.children}
    </Dialog>
  )
}
```

### cart-mini-popover.tsx

```tsx
import { Popover } from "~/components/ui/popover"
import { useCartMini } from "./cart-mini-context"

export const CartMiniPopover = (props: { children?: JSX.Element }) => {
  const { open, setOpen } = useCartMini()
  
  return (
    <Popover open={open()} onOpenChange={setOpen}>
      {props.children}
    </Popover>
  )
}
```

### cart-mini-toast.tsx

```tsx
import { Show } from "solid-js"
import { Toast } from "~/components/ui/toast"
import { useCartMini } from "./cart-mini-context"

export const CartMiniToast = (props: { children?: JSX.Element }) => {
  const { open } = useCartMini()
  
  return (
    <>
      <Show when={open()}>
        <Toast>
          {props.children}
        </Toast>
      </Show>
    </>
  )
}
```

## Builder/Visual Editor Integration

Store owners select variant by:
1. Dragging `CartMini` wrapper onto the page
2. Dragging desired variant (`CartMiniDrawer`, etc.) inside
3. Adding primitives (`Drawer.Trigger`, `Drawer.Content`, etc.) and cart sections inside variant

```
Component Palette:
├── Cart Mini
│   ├── CartMini (wrapper)
│   ├── CartMiniDrawer
│   ├── CartMiniSheet
│   ├── CartMiniDialog
│   ├── CartMiniPopover
│   └── CartMiniToast
├── Cart Sections
│   ├── CartItems
│   ├── CartSummary
│   ├── CartCheckoutTrigger
│   └── CartEmpty
└── Primitives (from ui/drawer, ui/dialog, etc.)
    ├── Drawer.Trigger, Drawer.Content, etc.
    ├── Dialog.Trigger, Dialog.Content, etc.
    ├── Sheet.Trigger, Sheet.Content, etc.
    └── Popover.Trigger, Popover.Content, etc.
```

## TODO

- [ ] Create `cart-mini-context.tsx` (CartMini wrapper + context + auto-open logic)
- [ ] Create `cart-mini-drawer.tsx`
- [ ] Create `cart-mini-sheet.tsx`
- [ ] Create `cart-mini-dialog.tsx`
- [ ] Create `cart-mini-popover.tsx`
- [ ] Create `cart-mini-toast.tsx`
- [ ] Update `cart/index.ts` exports
- [ ] Create demo page (`src/routes/demos/store/cart-mini.tsx`)
- [ ] Write tests
- [ ] Add to builder component palette

## Future Enhancements

1. **Cart Count Badge** - Already exists in `CartIcon`, integrate into trigger
2. **Recently Viewed** - Show recently viewed items in mini-cart
3. **Cross-Sell** - Suggest related products
4. **Wishlist Merge** - Offer to move out-of-stock items to wishlist
5. **Guest Checkout** - Streamlined guest checkout flow
