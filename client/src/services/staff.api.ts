import { api } from '@/lib/api';
import type { StaffMember, StaffRole } from '@/types';

export const staffApi = {
  list: (restaurantId: string, role?: StaffRole) => {
    const query = role ? `?role=${encodeURIComponent(role)}` : '';
    return api.get<StaffMember[]>(`/restaurants/${restaurantId}/staff${query}`);
  },
};

