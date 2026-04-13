# Order Components Architecture

## Overview

Order components handle the checkout flow for the visual builder. Components are designed to be fully composable - users compose UI by nesting components without manual data passing.

## Design Principles

1. **Codeless** - Components auto-read from context
2. **Composable** - Section primitives that users combine freely
3. **Context-Based** - Uses `OrderContext` for order items, `CartContext` for cart
4. **Global Provider** - `OrderProvider` wraps the app for order persistence

## Directory Structure

```
src/components/ui/order/
├── STRUCTURE.md              # This file
├── index.ts                  # Barrel exports
├── order-context.tsx         # OrderProvider + useOrder hook
└── checkout-context.tsx     # Checkout context + form components
```

## Order Flow

```
1. User clicks "Checkout" in cart → selected items added to OrderContext
2. User clicks "Buy Now" on product → single product added to OrderContext
3. User navigates to checkout page
4. CheckoutForm reads from OrderContext + CartContext
5. Payment processed (M-Pesa, Card)
6. On success:
   - OrderContext cleared
   - Selected cart items removed from cart
```

## OrderContext

Global context with localStorage persistence for order items.

```typescript
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
  addItem: (item: ProductData) => void      // Clears + adds single
  addItems: (items: ProductData[]) => void   // Clears + adds multiple
}
```

## Cart Integration

### CartContext (existing)

```typescript
type CartContextValue = {
  items: Accessor<CartItem[]>
  selectedItems: Accessor<CartItem[]>      // Items where selected = true
  selectedSubtotal: Accessor<number>
  toggleSelected: (productId: string) => void
  clearSelected: () => void
  // ... other methods
}
```

### CartCheckoutTrigger

Adds selected items to OrderContext when clicked.

```tsx
<CartCheckoutTrigger href="/checkout">
  Proceed to Checkout
</CartCheckoutTrigger>

// On click:
// 1. order.clear()
// 2. order.addItems(cart.selectedItems())
// 3. Navigate to href
```

### ProductOrderTrigger

Adds single product to OrderContext when clicked.

```tsx
<ProductOrderTrigger href="/checkout">
  Buy Now
</ProductOrderTrigger>

// On click:
// 1. order.clear()
// 2. order.addItem(product)
// 3. Navigate to href
```

## Checkout Components

These read from `OrderContext` for display and `CartContext` for cart operations.

### CheckoutSummary

```tsx
<CheckoutSummary>
  <CheckoutSubtotal />      // Reads from OrderContext
  <CheckoutTax />
  <CheckoutShipping />      // Reads from store settings (future)
  <CheckoutTotal />
</CheckoutSummary>
```

### CheckoutItemsList

```tsx
<CheckoutItemsList>
  <CheckoutListView>
    <Product />            // Uses OrderContext items
  </CheckoutListView>
</CheckoutItemsList>
```

### CheckoutForm

```tsx
<CheckoutForm>
  <CheckoutSummary />
  <CheckoutItemsList />
  <CheckoutEmailField />
  <CheckoutBillingAddress />
  
  <MpesaCheckoutForm>
    <MpesaPhoneField />
    <MpesaAmountDisplay />
    <Button type="submit">Pay KES {order.subtotal()}</Button>
  </MpesaCheckoutForm>
  
  <OrderConfirmation>
    <OrderNumber />
    <OrderTotal />
  </OrderConfirmation>
</CheckoutForm>
```

## Usage Example

```tsx
// App root - wrap with OrderProvider
<OrderProvider>
  <Router>
    <Route path="/" component={Home} />
    <Route path="/checkout" component={CheckoutPage} />
  </Router>
</OrderProvider>

// Checkout page
const CheckoutPage = () => (
  <CheckoutForm>
    <CheckoutSummary class="border rounded-lg p-4">
      <CheckoutSubtotal />
      <CheckoutShipping />
      <CheckoutTotal />
    </CheckoutSummary>
    
    <CheckoutItemsList>
      <CheckoutListView>
        <Product />
      </CheckoutListView>
    </CheckoutItemsList>
    
    <CheckoutEmailField />
    <CheckoutBillingAddress />
    
    <MpesaCheckoutForm>
      <MpesaPhoneField />
      <MpesaAmountDisplay />
      <MpesaLoading />
      <MpesaStatusMessage>
        <MpesaStatusSuccess>Payment successful!</MpesaStatusSuccess>
        <MpesaStatusFailed>Payment failed</MpesaStatusFailed>
      </MpesaStatusMessage>
    </MpesaCheckoutForm>
  </CheckoutForm>
)
```

## Component Props

### CartCheckoutTrigger

```typescript
type CartCheckoutTriggerProps = {
  href?: string
  class?: string
  children?: JSX.Element
}
```

### ProductOrderTrigger

```typescript
type ProductOrderTriggerProps = {
  href?: string
  class?: string
  children?: JSX.Element
}
```

### CheckoutSummary

```typescript
type CheckoutSummaryProps = {
  class?: string
  children?: JSX.Element
}
```

### CheckoutSubtotal / CheckoutTax / CheckoutShipping / CheckoutTotal

```typescript
type Props = { class?: string }
```

### CheckoutEmailField

```typescript
type CheckoutEmailFieldProps = {
  label?: string
  placeholder?: string
  class?: string
}
```

### CheckoutAddressField

```typescript
type CheckoutAddressFieldProps = {
  type?: "billing" | "shipping"
  class?: string
}
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| POST `/api/v1/checkout` | CheckoutForm | Create order and process payment |
| GET `/api/v1/stores/:id/orders/:orderId` | OrderStatus | Get order status |

## Backend Integration

The checkout flow:
1. `CheckoutServiceImpl.checkoutWithPayment()` receives `CheckoutRequest`
2. Creates order from cart items
3. Processes payment (M-Pesa or Card)
4. Clears selected cart items
5. Returns order details

See `backend/docs/CHECKOUT.md` for full backend documentation.
