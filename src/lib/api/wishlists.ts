import type { Wishlist, WishlistItem } from '../types';

export type WishlistResponse = {
  id: string;
  storeId: string;
  customerId: string;
  items?: WishlistItem[];
  insertedAt?: string;
  updatedAt?: string;
  version?: number;
}

const WISHLISTS_BASE = '/api/v1/stores';

export const wishlistsApi = {
  get: async (storeId: string): Promise<WishlistResponse> => {
    const response = await fetch(`${WISHLISTS_BASE}/${storeId}/wishlists`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return { id: '', storeId, customerId: '' };
      }
      throw new Error(`Failed to get wishlist: ${response.status}`);
    }
    
    const json = await response.json();
    
    if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
      return (json as { success: boolean; data: WishlistResponse }).data;
    }
    
    return json as WishlistResponse;
  },

  save: async (storeId: string, wishlist: Partial<WishlistResponse>): Promise<WishlistResponse> => {
    const response = await fetch(`${WISHLISTS_BASE}/${storeId}/wishlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(wishlist),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save wishlist: ${response.status}`);
    }
    
    const json = await response.json();
    
    if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
      return (json as { success: boolean; data: WishlistResponse }).data;
    }
    
    return json as WishlistResponse;
  },

  delete: async (storeId: string, wishlistId: string): Promise<{ deleted: boolean }> => {
    const response = await fetch(`${WISHLISTS_BASE}/${storeId}/wishlists/${wishlistId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete wishlist: ${response.status}`);
    }
    
    return { deleted: true };
  },
};
