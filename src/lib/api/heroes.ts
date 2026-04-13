import { api } from './client'
import type { Hero } from '../types'

export const heroApi = {
  getByStoreId: async (storeId: string): Promise<Hero | null> => {
    try {
      return await api.get<Hero>(`/stores/${storeId}/hero`)
    } catch (error: any) {
      if (error?.status === 404) {
        return null
      }
      throw error
    }
  },
}
