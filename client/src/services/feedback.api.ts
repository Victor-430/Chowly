import { api } from '@/lib/api';
import type { ComplaintType, Payment, Rating } from '@/types';

export const feedbackApi = {
  createPayment: (orderId: string, paymentType: 'CARD' | 'BANK_TRANSFER' | 'CASH' = 'CARD') =>
    api.post<Payment>(`/orders/${orderId}/payments`, { paymentType }),

  createRating: (
    orderId: string,
    payload: { customerId?: string; rating: number; comment?: string }
  ) => api.post<Rating>(`/orders/${orderId}/rating`, payload),

  createComplaint: (
    orderId: string,
    payload: { customerId?: string; type: ComplaintType; description: string }
  ) => api.post<{ id: string; orderId: string; type: string; description: string }>(
    `/orders/${orderId}/complaints`,
    payload
  ),
};

