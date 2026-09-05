import { create } from 'zustand';
import type { Role } from '@/types';

const ROLE_STORAGE_KEY = 'chowly-role';

interface RoleState {
  role: Role;
  switchRole: (role: Role) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  role: (localStorage.getItem(ROLE_STORAGE_KEY) as Role) || 'customer',

  switchRole: (role: Role) => {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
    set({ role });
  },
}));

