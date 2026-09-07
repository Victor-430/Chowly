import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, MenuItem } from '@/types';

const PACKAGING_FEE = 200;

interface CartState {
  items: CartItem[];
  addItem: (menuItem: MenuItem, quantity?: number, specialInstructions?: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  updateInstructions: (menuItemId: string, instructions: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getPackagingFee: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (menuItem, quantity = 1, specialInstructions) => {
        set((state) => {
          const existing = state.items.find((i) => i.menuItem.id === menuItem.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.menuItem.id === menuItem.id
                  ? {
                      ...i,
                      quantity: i.quantity + quantity,
                      specialInstructions: specialInstructions !== undefined ? specialInstructions : i.specialInstructions,
                    }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { menuItem, quantity, specialInstructions }],
          };
        });
      },

      removeItem: (menuItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.menuItem.id !== menuItemId),
        }));
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.menuItem.id === menuItemId ? { ...i, quantity } : i
          ),
        }));
      },

      updateInstructions: (menuItemId, instructions) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.menuItem.id === menuItemId
              ? { ...i, specialInstructions: instructions }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0),

      getPackagingFee: () => (get().items.length > 0 ? PACKAGING_FEE : 0),

      getTotal: () => get().getSubtotal() + get().getPackagingFee(),
    }),
    {
      name: 'chowly-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

