import type { 
  User, Store, Product, ProductDto, Category, Cart, CartItem,
  Order, OrderItem, Wishlist, Media, Payment, ApiResponse, PagedResponse
} from '../types';

export function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'email' in data &&
    'role' in data
  );
}

export function isStore(data: unknown): data is Store {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'userId' in data &&
    'name' in data
  );
}

export function isProduct(data: unknown): data is Product {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'storeId' in data &&
    'name' in data
  );
}

export function isProductDto(data: unknown): data is ProductDto {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'storeId' in data &&
    'name' in data &&
    'stockQuantity' in data
  );
}

export function isCategory(data: unknown): data is Category {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'storeId' in data &&
    'name' in data
  );
}

export function isCart(data: unknown): data is Cart {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'storeId' in data &&
    'status' in data
  );
}

export function isCartItem(data: unknown): data is CartItem {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'cartId' in data &&
    'productId' in data &&
    'quantity' in data
  );
}

export function isOrder(data: unknown): data is Order {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'storeId' in data &&
    'status' in data &&
    'total' in data
  );
}

export function isOrderItem(data: unknown): data is OrderItem {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'orderId' in data &&
    'productId' in data &&
    'quantity' in data
  );
}

export function isWishlist(data: unknown): data is Wishlist {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'storeId' in data &&
    'userId' in data
  );
}

export function isMedia(data: unknown): data is Media {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'url' in data &&
    'type' in data
  );
}

export function isPayment(data: unknown): data is Payment {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'orderId' in data &&
    'amount' in data &&
    'status' in data
  );
}

export function isApiResponse<T>(data: unknown, dataGuard?: (d: unknown) => d is T): data is ApiResponse<T> {
  if (
    typeof data !== 'object' ||
    data === null ||
    !('success' in data) ||
    !('message' in data)
  ) {
    return false;
  }
  
  if (dataGuard && 'data' in data && data.data !== null) {
    return dataGuard(data.data);
  }
  
  return true;
}

export function isPagedResponse<T>(data: unknown, itemGuard?: (d: unknown) => d is T): data is PagedResponse<T> {
  if (
    typeof data !== 'object' ||
    data === null ||
    !('content' in data) ||
    !('page' in data) ||
    !('size' in data) ||
    !('totalElements' in data) ||
    !Array.isArray((data as PagedResponse<T>).content)
  ) {
    return false;
  }
  
  if (itemGuard) {
    const content = (data as PagedResponse<T>).content;
    return content.every(itemGuard);
  }
  
  return true;
}

export function isArray<T>(data: unknown, itemGuard: (d: unknown) => d is T): data is T[] {
  return Array.isArray(data) && data.every(itemGuard);
}
