import type { Product } from "~/lib/types"

export type RecommendationType = 
  | "personalized" 
  | "popular" 
  | "newest" 
  | "related" 
  | "bought_together"

export type RecommendationSource = "personalized" | "popular" | "related" | "bought_together" | "newest"

export type RecommendationResponse = {
  products: Product[]
  source: RecommendationSource
  fallback: RecommendationSource | null
}

const API_BASE = '/api/v1'

export const recommendationsApi = {
  get: async (
    storeId: string, 
    type: RecommendationType = "personalized", 
    limit: number = 10,
    sessionId?: string
  ): Promise<RecommendationResponse> => {
    const params = new URLSearchParams({
      type,
      limit: String(limit)
    })
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (sessionId) {
      headers["X-Session-Id"] = sessionId
    }
    
    const response = await fetch(`${API_BASE}/stores/${storeId}/recommendations?${params}`, {
      method: 'GET',
      headers,
      credentials: 'include',
    })
    
    if (!response.ok) {
      throw new Error(`Failed to get recommendations: ${response.status}`)
    }
    
    const json = await response.json()
    
    // Unwrap from { success, data } structure
    if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
      return (json as { success: boolean; data: RecommendationResponse }).data
    }
    
    return json as RecommendationResponse
  },
  
  trackView: async (
    storeId: string,
    productId: string,
    sessionId?: string
  ): Promise<{ tracked: boolean }> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (sessionId) headers["X-Session-Id"] = sessionId
    
    const response = await fetch(`${API_BASE}/stores/${storeId}/products/${productId}/view`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({}),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to track view: ${response.status}`)
    }
    
    const json = await response.json()
    
    if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
      return (json as { success: boolean; data: { tracked: boolean } }).data
    }
    
    return { tracked: true }
  },
  
  addFavorite: async (
    storeId: string,
    productId: string,
    userId: string
  ): Promise<{ added: boolean }> => {
    const response = await fetch(`${API_BASE}/stores/${storeId}/products/${productId}/favorite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      credentials: 'include',
      body: JSON.stringify({}),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to add favorite: ${response.status}`)
    }
    
    const json = await response.json()
    
    if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
      return (json as { success: boolean; data: { added: boolean } }).data
    }
    
    return { added: true }
  },
  
  removeFavorite: async (
    storeId: string,
    productId: string,
    userId: string
  ): Promise<{ removed: boolean }> => {
    const response = await fetch(`${API_BASE}/stores/${storeId}/products/${productId}/favorite`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      credentials: 'include',
    })
    
    if (!response.ok) {
      throw new Error(`Failed to remove favorite: ${response.status}`)
    }
    
    const json = await response.json()
    
    if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
      return (json as { success: boolean; data: { removed: boolean } }).data
    }
    
    return { removed: true }
  },
}
