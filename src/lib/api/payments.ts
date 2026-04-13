import { api } from './client'
import type {
  Payment,
  CreatePaymentRequest, CreatePaymentResponse,
} from '../types'

const PAYMENTS_BASE = '/payments'

export const paymentsApi = {
  create: async (data: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
    return api.post<CreatePaymentResponse>(`${PAYMENTS_BASE}/create`, data)
  },

  getByOrderId: async (orderId: string): Promise<Payment[]> => {
    return api.get<Payment[]>(`${PAYMENTS_BASE}/order/${orderId}`)
  },

  getStatus: async (paymentId: string): Promise<{ status: string; processedAt: string | null }> => {
    return api.get<{ status: string; processedAt: string | null }>(`${PAYMENTS_BASE}/${paymentId}/status`)
  },
}
