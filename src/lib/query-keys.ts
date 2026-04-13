export const cartKeys = {
  all: ['cart'] as const,
  store: (storeId: string) => ['cart', 'store', storeId] as const,
  active: (storeId: string) => ['cart', 'store', storeId, 'active'] as const,
  detail: (cartId: string) => ['cart', 'detail', cartId] as const,
}

export const productKeys = {
  all: ['products'] as const,
  list: (storeId: string, filters?: Record<string, unknown>) =>
    ['products', 'list', storeId, filters] as const,
  detail: (storeId: string, productId: string) =>
    ['products', 'detail', storeId, productId] as const,
}

export const categoryKeys = {
  all: ['categories'] as const,
  list: (storeId: string) => ['categories', 'list', storeId] as const,
  detail: (categoryId: string) => ['categories', 'detail', categoryId] as const,
}

export const heroKeys = {
  all: ['heroes'] as const,
  list: (storeId: string) => ['heroes', 'list', storeId] as const,
  detail: (heroId: string) => ['heroes', 'detail', heroId] as const,
  active: (storeId: string) => ['heroes', 'active', storeId] as const,
}
