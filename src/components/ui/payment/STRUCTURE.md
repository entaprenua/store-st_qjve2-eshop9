# M-Pesa Payment Components Architecture

## Overview

Codeless M-Pesa mobile money payment components for the visual builder. Components are designed to be fully composable - users compose UI by nesting components without manual data passing.

## Design Principles

1. **Codeless** - Components auto-read from `OrderContext`
2. **Composable** - Section primitives that users combine freely
3. **Context-Based** - Uses `MpesaContext` for payment state
4. **Status-Based** - Components react to payment status changes

## Directory Structure

```
src/components/ui/payment/
├── STRUCTURE.md              # This file
├── index.ts                  # Barrel exports
├── mpesa-context.tsx         # MpesaProvider + useMpesa hook
├── mpesa-phone-field.tsx     # MpesaPhoneField component
├── mpesa-amount-display.tsx # MpesaAmountDisplay component
├── mpesa-status-message.tsx  # MpesaStatusMessage + variants
├── mpesa-checkout-form.tsx   # MpesaCheckoutForm component
└── mpesa-loading.tsx        # MpesaLoading component
```

## M-Pesa Flow

```
1. OrderContext has items (from Checkout or Buy Now)
2. User enters phone number
3. Click "Pay with M-Pesa"
4. Form submits to /api/v1/payments/mpesa/initiate
   - Amount comes from OrderContext.subtotal()
5. Backend calls Safaricom STK Push API
6. Customer receives USSD prompt on phone
7. Enter PIN on phone
8. Safaricom calls callback with result
9. Frontend polls for status via /api/v1/payments/mpesa/status/:referenceId
10. On success: OrderContext cleared
```

## MpesaContext

```typescript
type MpesaStatus = "idle" | "waiting" | "processing" | "success" | "failed"

type MpesaFormData = {
  phone: string
}

type MpesaContextValue = {
  formData: Accessor<MpesaFormData>
  setFormData: (data: Partial<MpesaFormData>) => void
  resetFormData: () => void
  isLoading: Accessor<boolean>
  setIsLoading: (loading: boolean) => void
  error: Accessor<string | null>
  setError: (error: string | null) => void
  status: Accessor<MpesaStatus>
  setStatus: (status: MpesaStatus) => void
  transactionId: Accessor<string | null>
  setTransactionId: (id: string | null) => void
}
```

## Usage Pattern

### Basic M-Pesa Checkout

```tsx
<MpesaCheckoutForm>
  <MpesaAmountDisplay class="text-2xl font-bold mb-4" />
  <MpesaPhoneField />
  <Button type="submit">Pay with M-Pesa</Button>
  <MpesaLoading />
  <MpesaStatusMessage class="p-4">
    <MpesaStatusWaiting>Enter PIN on your phone</MpesaStatusWaiting>
    <MpesaStatusProcessing>Processing payment...</MpesaStatusProcessing>
    <MpesaStatusSuccess>Payment successful!</MpesaStatusSuccess>
    <MpesaStatusFailed>Payment failed</MpesaStatusFailed>
  </MpesaStatusMessage>
</MpesaCheckoutForm>
```

### Compact Layout

```tsx
<MpesaCheckoutForm>
  <MpesaAmountDisplay />
  <MpesaPhoneField />
  <MpesaLoading />
</MpesaCheckoutForm>
```

### With Custom Content

```tsx
<MpesaCheckoutForm>
  <MpesaAmountDisplay class="text-xl">
    Total: KES {order.subtotal().toLocaleString()}
  </MpesaAmountDisplay>
  
  <MpesaPhoneField label="M-Pesa Number" />
  
  <Button type="submit" class="w-full bg-green-600">
    Pay KES {order.subtotal()} with M-Pesa
  </Button>
  
  <MpesaStatusMessage>
    <MpesaStatusSuccess>Payment received!</MpesaStatusSuccess>
  </MpesaStatusMessage>
</MpesaCheckoutForm>
```

## Component Props

### MpesaCheckoutForm

```typescript
type MpesaCheckoutFormProps = {
  orderId?: string        // Optional: order reference
  onSuccess?: () => void  // Optional: success callback
  children?: JSX.Element
}
// Amount automatically reads from OrderContext.subtotal()
```

### MpesaPhoneField

```typescript
type MpesaPhoneFieldProps = {
  label?: string          // Default: "Phone Number"
  placeholder?: string     // Default: "0700123456"
  class?: string
}
```

### MpesaAmountDisplay

```typescript
type MpesaAmountDisplayProps = {
  currency?: string       // Default: "KES"
  class?: string
  children?: JSX.Element  // Override default display
}
// Amount automatically reads from OrderContext.subtotal()
```

### MpesaStatusMessage

```typescript
type MpesaStatusMessageProps = {
  class?: string
  children?: JSX.Element
}
```

### MpesaLoading

```typescript
type MpesaLoadingProps = {
  class?: string
  children?: JSX.Element
}
```

### Status Components

```typescript
type MpesaStatusWaitingProps = { class?: string; children?: JSX.Element }
type MpesaStatusProcessingProps = { class?: string; children?: JSX.Element }
type MpesaStatusSuccessProps = { class?: string; children?: JSX.Element }
type MpesaStatusFailedProps = { class?: string; children?: JSX.Element }
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| POST `/api/v1/payments/mpesa/initiate` | MpesaCheckoutForm | Initiate STK Push |
| GET `/api/v1/payments/mpesa/status/:referenceId` | Polling | Check payment status |

## Status Flow

```
idle ──submit──> waiting ──confirmation──> processing ──result──> success/failed
                                    │
                                    └── timeout ──> failed
```

| Status | Description |
|--------|-------------|
| `idle` | Initial state, form ready |
| `waiting` | STK Push sent, awaiting PIN entry |
| `processing` | PIN confirmed, processing payment |
| `success` | Payment completed, OrderContext cleared |
| `failed` | Payment failed or timed out |

## Server-Side Integration

The backend M-Pesa service handles:
1. Token generation (every 50 minutes)
2. STK Push request
3. Callback processing
4. Status updates

See `backend/docs/PAYMENT_MODULE.md` for full backend documentation.
