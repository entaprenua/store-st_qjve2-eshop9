// User & Auth
export type UserRole = 'USER' | 'ADMIN' | 'STORE_OWNER' | 'STORE_MANAGER' | 'MODERATOR'
export type AccountStatus = 'ACTIVE' | 'LOCKED' | 'SUSPENDED' | 'PENDING_VERIFICATION'
export type IdentityProvider = 'LOCAL' | 'GOOGLE' | 'FACEBOOK' | 'GITHUB' | 'APPLE'

export interface User {
  id: string
  email: string
  username: string | null
  provider: IdentityProvider
  providerId: string | null
  avatarUrl: string | null
  emailVerified: boolean
  role?: UserRole
  version: number
}

// Store
export interface Store {
  id: string;
  userId: string;
  parentId: string | null;
  name: string;
  description: string | null;
  domain: string | null;
  subdomain: string | null;
  isActive: boolean;
  isTemplate: boolean;
  isInMaintenanceMode?: boolean;
  version: number;
  insertedAt: string;
  updatedAt: string;
  domainName?: string | null;
  price?: string | null;
  visibility?: string | null;
  docUrl?: string | null;
  publicId?: string | null;
}

// Product
export interface Product {
  id: string;
  storeId: string;
  name: string;
  slug: string | null;
  description: string | null;
  price: string | null;
  compareToPrice: string | null;
  image: string | null;
  visibility: string | null;
  metadata: Record<string, string> | null;
  media: Record<string, string> | null;
  sku: string | null;
  stockQuantity: number;
  reservedQuantity: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  lowStockThreshold: number;
  outOfStockThreshold: number;
  isDeleted: boolean;
  version: number;
  insertedAt: string;
  updatedAt: string;
}

// Category
export interface Category {
  id: string;
  storeId: string;
  name: string;
  slug: string | null;
  image: string | null;
  level: number | null;
  visibility: string | null;
  parentId: string | null;
  path: string | null;
  isDeleted: boolean;
  subcategories: Category[] | null;
  isMappedToParent?: boolean;
  insertedAt: string;
  updatedAt: string;
}

// Address
export interface Address {
  firstName: string
  lastName: string
  company?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state?: string
  postalCode: string
  country: string
  phone?: string
}

// Cart
export interface Cart {
  id?: string;
  storeId: string;
  customerId?: string | null;
  currency: string;
  subtotal: string;
  total: string;
  notes?: string | null;
  isLocked?: boolean;
  version?: number;
  insertedAt?: string;
  updatedAt?: string;
  lastModifiedBy?: string | null;
  items?: CartItem[];
  guestSessionId?: string;
  guestEmail?: string;
  expiresAt?: string;
}

export interface CartItem {
  id?: string;
  cartId?: string;
  productId: string;
  price: string;
  quantity: number;
  subtotal: string;
  version?: number;
  insertedAt?: string;
  updatedAt?: string;
}

// Order
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'on_hold' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'returned' | 'payment_failed'

export interface Order {
  id: string;
  storeId: string;
  customerId: string | null;
  guestEmail?: string | null;
  orderNumber: string;
  status: OrderStatus;
  currency: string;
  subtotal: string;
  tax: string;
  shippingCost: string;
  discount: string;
  total: string;
  billingAddress: Address | null;
  shippingAddress: Address | null;
  notes: string | null;
  trackingNumber: string | null;
  paid: boolean;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  refundedAt: string | null;
  version: number;
  insertedAt: string;
  updatedAt: string;
  lastModifiedBy: string | null;
  isDeleted?: boolean;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  price: string | number;
  quantity: number;
  subtotal: string | number;
  insertedAt: string;
  updatedAt: string;
  version: number;
}

// Wishlist
export interface Wishlist {
  id: string;
  storeId: string;
  customerId: string;
  version: number;
  insertedAt: string;
  updatedAt: string;
  items?: WishlistItem[];
}

export interface WishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  insertedAt: string;
  updatedAt: string;
  version: number;
}

// Media
export interface MediaVariants {
  thumbnail: string | null;
  medium: string | null;
  large: string | null;
}

export interface Media {
  id: string;
  url: string;
  type: string;
  mimeType: string | null;
  sizeBytes: number | null;
  width: number | null;
  height: number | null;
  alt: string | null;
  variants: MediaVariants | null;
  isPrimary: boolean;
  displayOrder: number;
  fileId: string | null;
  insertedAt: string;
  updatedAt: string;
}

// Payment (Generic - supports Stripe, M-Pesa, Airtel)
export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'

export interface Payment {
  id: string
  orderId: string
  storeId: string
  userId: string | null
  guestEmail: string | null
  
  referenceId: string | null
  transactionId: string | null
  customerId: string | null
  paymentPhone: string | null
  merchantRequestId: string | null
  
  amount: number
  currency: string
  status: PaymentStatus
  applicationFee: number
  fee: number
  netAmount: number | null
  amountRefunded: number
  refundReason: string | null
  refundedAt: string | null
  failureCode: string | null
  failureMessage: string | null
  paymentMethodType: string | null
  cardBrand: string | null
  cardLast4: string | null
  description: string | null
  metadata: Record<string, any> | null
  receiptEmail: string | null
  receiptNumber: string | null
  receiptUrl: string | null
  processedAt: string | null
  cancelledAt: string | null
  version: number
  insertedAt: string
  updatedAt: string
}

export type RefundReason =
  | 'DUPLICATE'
  | 'FRAUDULENT'
  | 'REQUESTED_BY_CUSTOMER'
  | 'EXPIRED_UNCAPTURED_CHARGE'

export type RefundStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED'

export interface Refund {
  id: string
  paymentId: string
  orderId: string
  storeId: string
  userId: string
  refundId: string | null
  amount: number
  currency: string
  reason: RefundReason | null
  status: RefundStatus
  failureReason: string | null
  description: string | null
  metadata: Record<string, any> | null
  processedAt: string | null
  version: number
  insertedAt: string
  updatedAt: string
}

// Hero
export interface Hero {
  id: string
  storeId: string
  name: string
  displayType: string
  autoplay: boolean
  autoplayInterval: number
  showIndicators: boolean
  showNavigation: boolean
  aspectRatio: string
  maxHeight: number | null
  gap: number
  isActive: boolean
  visibility?: string | null
  startsAt: string | null
  endsAt: string | null
  metadata: Record<string, string> | null
  items: HeroItem[] | null
  version: number
  insertedAt: string
  updatedAt: string
}

export interface HeroItem {
  id: string
  heroId: string
  sortOrder: number

  backgroundType: string
  backgroundImageUrl: string | null
  backgroundImageAlt: string | null
  backgroundVideoUrl: string | null
  backgroundColor: string | null
  backgroundGradient: string | null
  overlayColor: string | null
  overlayOpacity: number | string

  title: string | null
  titleColor: string | null
  subtitle: string | null
  subtitleColor: string | null
  description: string | null
  descriptionColor: string | null

  contentPosition: string
  textAlignment: string

  ctaText: string | null
  ctaUrl: string | null
  ctaStyle: string
  ctaTarget: string

  ctaSecondaryText: string | null
  ctaSecondaryUrl: string | null
  ctaSecondaryStyle: string
  ctaSecondaryTarget: string

  mobileBackgroundImageUrl: string | null
  mobileContentPosition: string | null
  hideOnMobile: boolean
  hideOnDesktop: boolean

  startsAt: string | null
  endsAt: string | null

  isActive: boolean
  metadata: Record<string, string> | null
  version: number
  insertedAt: string
  updatedAt: string
}

// Payment Settings (Generic)
export interface PaymentSettings {
  id: string
  storeId: string
  provider: string
  enabled: boolean
  environment: string
  apiKey: string | null
  apiSecret: string | null
  merchantId: string | null
  tillNumber: string | null
  paybillNumber: string | null
  passkey: string | null
  acceptCards: boolean
  acceptMpesa: boolean
  acceptAirtel: boolean
  webhookSecret: string | null
  metadata: Record<string, any> | null
  version: number
  insertedAt: string
  updatedAt: string
}

export interface CreatePaymentRequest {
  orderId: string
  userId?: string
  storeId: string
  amount: number
  currency?: string
  paymentMethod?: string
  paymentPhone?: string
  guestEmail?: string
  description?: string
  receiptEmail?: string
  metadata?: Record<string, string>
}

export interface CreatePaymentResponse {
  success: boolean
  paymentId: string | null
  orderId: string | null
  clientSecret?: string | null
  referenceId?: string | null
  status: string
  message?: string
}

// Paged Response
export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  empty: boolean
}

// API Response
export interface ApiSuccess<T> {
  success: boolean
  message: string
  data: T
  error?: unknown
  timestamp: number
  path?: string
}
