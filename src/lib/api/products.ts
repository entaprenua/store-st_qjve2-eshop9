import { api } from './client';
import type { Product, PagedResponse } from '../types';

const PRODUCTS_BASE = (storeId: string) => `/stores/${storeId}/products`;

export interface ProductFilters {
  search?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: "name" | "price" | "createdAt"
  sortOrder?: "asc" | "desc"
}

const buildFilterParams = (filters?: ProductFilters): URLSearchParams => {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.categoryId) params.append("categoryId", filters.categoryId);
  if (filters?.minPrice) params.append("minPrice", String(filters.minPrice));
  if (filters?.maxPrice) params.append("maxPrice", String(filters.maxPrice));
  if (filters?.sortBy) params.append("sortBy", filters.sortBy);
  if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
  return params;
};

export const productsApi = {
  getAll: async (
    storeId: string, 
    page = 0, 
    size = 20, 
    filters?: ProductFilters
  ): Promise<PagedResponse<Product>> => {
    const filterParams = buildFilterParams(filters);
    filterParams.set("page", String(page));
    filterParams.set("size", String(size));
    return api.get<PagedResponse<Product>>(`${PRODUCTS_BASE(storeId)}?${filterParams}`);
  },

  getById: async (storeId: string, id: string, includeMedia = false, includeMetadata = false): Promise<Product> => {
    const params = new URLSearchParams();
    if (includeMedia) params.append('includeMedia', 'true');
    if (includeMetadata) params.append('includeMetadata', 'true');
    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get<Product>(`${PRODUCTS_BASE(storeId)}/${id}${query}`);
  },

  getBySlug: async (storeId: string, slug: string, includeMedia = false, includeMetadata = false): Promise<Product> => {
    const params = new URLSearchParams();
    if (includeMedia) params.append('includeMedia', 'true');
    if (includeMetadata) params.append('includeMetadata', 'true');
    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get<Product>(`${PRODUCTS_BASE(storeId)}/by-slug/${encodeURIComponent(slug)}${query}`);
  },

  getByCategory: async (storeId: string, categoryId: string, page = 0, size = 20): Promise<PagedResponse<Product>> => {
    return api.get<PagedResponse<Product>>(`${PRODUCTS_BASE(storeId)}/category/${categoryId}?page=${page}&size=${size}`);
  },

  search: async (
    storeId: string, 
    query: string, 
    page = 0, 
    size = 20,
    filters?: ProductFilters
  ): Promise<PagedResponse<Product>> => {
    const filterParams = buildFilterParams(filters);
    filterParams.set("page", String(page));
    filterParams.set("size", String(size));
    filterParams.set("search", query);
    return api.get<PagedResponse<Product>>(`${PRODUCTS_BASE(storeId)}?${filterParams}`);
  },
};
