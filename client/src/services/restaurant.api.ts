import { api } from '@/lib/api';
import type { Restaurant, Table } from '@/types';

export const restaurantApi = {
  list: () => api.get<Restaurant[]>('/restaurants'),

  getById: (id: string) => api.get<Restaurant>(`/restaurants/${id}`),

  getTables: (restaurantId: string) =>
    api.get<Table[]>(`/restaurants/${restaurantId}/tables`),
};

