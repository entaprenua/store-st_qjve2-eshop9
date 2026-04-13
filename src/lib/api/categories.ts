import { api } from './client';
import type { Category, PagedResponse } from '../types';

const CATEGORIES_BASE = (storeId: string) => `/stores/${storeId}/categories`;

export interface CategoryFilters {
  search?: string
  parentId?: string
}

const buildFilterParams = (filters?: CategoryFilters): URLSearchParams => {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.parentId) params.append("parentId", filters.parentId);
  return params;
};

export const categoriesApi = {
  getAll: async (
    storeId: string,
    page = 0,
    size = 20,
    filters?: CategoryFilters
  ): Promise<PagedResponse<Category>> => {
    const filterParams = buildFilterParams(filters);
    filterParams.set("page", String(page));
    filterParams.set("size", String(size));
    return api.get<PagedResponse<Category>>(`${CATEGORIES_BASE(storeId)}?${filterParams}`);
  },

  getById: async (storeId: string, id: string): Promise<Category> => {
    return api.get<Category>(`${CATEGORIES_BASE(storeId)}/${id}`);
  },

  getBySlug: async (storeId: string, slug: string): Promise<Category> => {
    return api.get<Category>(`${CATEGORIES_BASE(storeId)}/by-slug/${encodeURIComponent(slug)}`);
  },

  getRoot: async (storeId: string): Promise<PagedResponse<Category>> => {
    return api.get<PagedResponse<Category>>(`${CATEGORIES_BASE(storeId)}?root=true`);
  },

  getTree: async (storeId: string): Promise<PagedResponse<Category>> => {
    return api.get<PagedResponse<Category>>(`${CATEGORIES_BASE(storeId)}?tree=true`);
  },

  getByParent: async (
    storeId: string,
    parentId: string,
    page = 0,
    size = 20
  ): Promise<PagedResponse<Category>> => {
    return api.get<PagedResponse<Category>>(
      `${CATEGORIES_BASE(storeId)}?childrenOf=${encodeURIComponent(parentId)}&page=${page}&size=${size}`
    );
  },
};
