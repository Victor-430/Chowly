import { api } from '@/lib/api';
import type { Order, OrderStatus } from '@/types';

export interface CreateOrderPayload {
  customerId: string;
  restaurantId: string;
  tableId?: string;
  tableNumber?: number;
  items: Array<{
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
  }>;
}

export interface ListOrdersParams {
  restaurantId?: string;
  customerId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedOrders {
  orders: Order[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const orderApi = {
  create: (payload: CreateOrderPayload) =>
    api.post<Order>('/orders', payload),

  getById: (id: string) =>
    api.get<Order>(`/orders/${id}`),

  list: (params?: ListOrdersParams) => {
    const query = new URLSearchParams();
    if (params?.restaurantId) query.set('restaurantId', params.restaurantId);
    if (params?.customerId) query.set('customerId', params.customerId);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return api.get<PaginatedOrders>(`/orders${queryString}`);
  },

  updateStatus: (id: string, status: OrderStatus) =>
    api.patch<Order>(`/orders/${id}/status`, { status }),

  assignWaiter: (id: string, waiterId: string) =>
    api.patch<Order>(`/orders/${id}/waiter`, { waiterId }),

  assignStaff: (id: string, staffId: string, role: 'CHEF' | 'BARTENDER') =>
    api.patch<Order>(`/orders/${id}/assign`, { staffId, role }),
};

