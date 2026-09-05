import { api } from '@/lib/api';
import type { MenuItem } from '@/types';

export const menuApi = {
  list: (restaurantId: string, category?: string) => {
    const query = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
    return api.get<MenuItem[]>(`/restaurants/${restaurantId}/menu${query}`);
  },

  getById: (id: string) => api.get<MenuItem>(`/menu/${id}`),
};

