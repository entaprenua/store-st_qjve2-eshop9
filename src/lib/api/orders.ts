import { api } from './client';
import type { Order } from '../types';

const STORES_BASE = '/stores';

export const ordersApi = {
  getById: async (storeId: string, orderId: string): Promise<Order> => {
    return api.get<Order>(`${STORES_BASE}/${storeId}/orders/${orderId}`);
  },

  lookup: async (storeId: string, orderNumber: string, email: string): Promise<Order | null> => {
    return api.get<Order>(`${STORES_BASE}/${storeId}/orders/lookup?orderNumber=${orderNumber}&email=${encodeURIComponent(email)}`);
  },
};
