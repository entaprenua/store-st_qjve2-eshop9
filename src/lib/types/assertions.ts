import { isUser, isStore, isProduct, isCategory, isCart, isOrder, isWishlist, isMedia, isPayment, isApiResponse, isPagedResponse } from './guards';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class TypeGuardError extends Error {
  constructor(message: string, public readonly data: unknown) {
    super(message);
    this.name = 'TypeGuardError';
  }
}

export function assertUser(data: unknown): asserts data is import('./entities').User {
  if (!isUser(data)) {
    throw new TypeGuardError('Invalid user data', data);
  }
}

export function assertStore(data: unknown): asserts data is import('./entities').Store {
  if (!isStore(data)) {
    throw new TypeGuardError('Invalid store data', data);
  }
}

export function assertProduct(data: unknown): asserts data is import('./entities').Product {
  if (!isProduct(data)) {
    throw new TypeGuardError('Invalid product data', data);
  }
}

export function assertCategory(data: unknown): asserts data is import('./entities').Category {
  if (!isCategory(data)) {
    throw new TypeGuardError('Invalid category data', data);
  }
}

export function assertCart(data: unknown): asserts data is import('./entities').Cart {
  if (!isCart(data)) {
    throw new TypeGuardError('Invalid cart data', data);
  }
}

export function assertOrder(data: unknown): asserts data is import('./entities').Order {
  if (!isOrder(data)) {
    throw new TypeGuardError('Invalid order data', data);
  }
}

export function assertWishlist(data: unknown): asserts data is import('./entities').Wishlist {
  if (!isWishlist(data)) {
    throw new TypeGuardError('Invalid wishlist data', data);
  }
}

export function assertMedia(data: unknown): asserts data is import('./entities').Media {
  if (!isMedia(data)) {
    throw new TypeGuardError('Invalid media data', data);
  }
}

export function assertPayment(data: unknown): asserts data is import('./entities').Payment {
  if (!isPayment(data)) {
    throw new TypeGuardError('Invalid payment data', data);
  }
}

export function assertApiResponse<T>(
  data: unknown,
  dataGuard?: (d: unknown) => d is T
): asserts data is import('./api').ApiResponse<T> {
  if (!isApiResponse(data, dataGuard)) {
    throw new TypeGuardError('Invalid API response', data);
  }
}

export function assertPagedResponse<T>(
  data: unknown,
  itemGuard?: (d: unknown) => d is T
): asserts data is import('./api').PagedResponse<T> {
  if (!isPagedResponse(data, itemGuard)) {
    throw new TypeGuardError('Invalid paginated response', data);
  }
}

export function assertDefined<T>(value: T | null | undefined, message?: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new ValidationError(message || 'Value is null or undefined');
  }
}

export function assertString(value: unknown, message?: string): asserts value is string {
  if (typeof value !== 'string') {
    throw new ValidationError(message || 'Value is not a string');
  }
}

export function assertNumber(value: unknown, message?: string): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new ValidationError(message || 'Value is not a valid number');
  }
}

export function assertPositiveNumber(value: unknown, message?: string): asserts value is number {
  assertNumber(value, message);
  if (value <= 0) {
    throw new ValidationError(message || 'Value must be positive');
  }
}

export function assertNonEmptyString(value: unknown, message?: string): asserts value is string {
  assertString(value, message);
  if (value.trim() === '') {
    throw new ValidationError(message || 'Value cannot be empty');
  }
}

export function assertArray(value: unknown, message?: string): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throw new ValidationError(message || 'Value is not an array');
  }
}

export function assertUuid(value: string, message?: string): void {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (!uuidRegex.test(value)) {
    throw new ValidationError(message || 'Invalid UUID format');
  }
}
