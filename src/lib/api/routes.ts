export const apiRoutes = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    refresh: '/auth/refresh',
    verifyEmail: '/auth/verify-email',
    resendVerification: '/auth/resend-verification',
    passwordResetRequest: '/auth/password-reset/request',
    passwordResetConfirm: '/auth/password-reset/confirm',
  },
  products: {
    base: (storeId: string) => `/stores/${storeId}/products`,
    byId: (storeId: string, id: string) => `/stores/${storeId}/products/${id}`,
    bySlug: (storeId: string, slug: string) => `/stores/${storeId}/products/by-slug/${slug}`,
    byCategory: (storeId: string, categoryId: string) => `/stores/${storeId}/products/category/${categoryId}`,
    search: (storeId: string) => `/stores/${storeId}/products/search`,
  },
  categories: {
    base: (storeId: string) => `/stores/${storeId}/categories`,
    byId: (storeId: string, id: string) => `/stores/${storeId}/categories/${id}`,
    bySlug: (storeId: string, slug: string) => `/stores/${storeId}/categories/by-slug/${slug}`,
    root: (storeId: string) => `/stores/${storeId}/categories/root`,
    tree: (storeId: string) => `/stores/${storeId}/categories/tree`,
  },
  carts: {
    base: (storeId: string) => `/stores/${storeId}/carts`,
    byId: (storeId: string, id: string) => `/stores/${storeId}/carts/${id}`,
  },
  orders: {
    base: (storeId: string) => `/stores/${storeId}/orders`,
    byId: (storeId: string, id: string) => `/stores/${storeId}/orders/${id}`,
    lookup: (storeId: string) => `/stores/${storeId}/orders/lookup`,
  },
  wishlists: {
    base: (storeId: string) => `/stores/${storeId}/wishlists`,
    byId: (storeId: string, id: string) => `/stores/${storeId}/wishlists/${id}`,
  },
  heroes: {
    byStoreId: (storeId: string) => `/stores/${storeId}/heroes`,
    activeByStoreId: (storeId: string) => `/stores/${storeId}/heroes/active`,
    byId: (storeId: string, id: string) => `/stores/${storeId}/heroes/${id}`,
  },
  payments: {
    create: '/payments/create',
    byId: (id: string) => `/payments/${id}`,
    byOrderId: (orderId: string) => `/payments/order/${orderId}`,
    status: (id: string) => `/payments/${id}/status`,
  },
  recommendations: {
    base: (storeId: string) => `/stores/${storeId}/recommendations`,
    trackView: (storeId: string, productId: string) => `/stores/${storeId}/products/${productId}/view`,
  },
};
