import { api } from './client';
import type { Cart, CartItem } from '../types';

const CARTS_BASE = (storeId: string) => `/stores/${storeId}/carts`;

export const cartsApi = {
  /**
   * Get cart by store ID
   * For authenticated users: returns their cart
   * For guests: pass sessionId in options
   */
  get: async (storeId: string, options?: { sessionId?: string }): Promise<Cart> => {
    const params = options?.sessionId ? `?sessionId=${options.sessionId}` : '';
    return api.get<Cart>(`${CARTS_BASE(storeId)}${params}`);
  },

  /**
   * Save (create or update) cart
   * Sends entire cart object with items
   */
  save: async (storeId: string, cart: Cart): Promise<Cart> => {
    return api.post<Cart>(CARTS_BASE(storeId), cart);
  },

  /**
   * Delete cart by ID
   */
  delete: async (storeId: string, cartId: string): Promise<void> => {
    return api.delete<void>(`${CARTS_BASE(storeId)}/${cartId}`);
  },
};

export interface AddToCartInput {
  productId: string;
  quantity: number;
  price: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}

export type { Cart, CartItem };
