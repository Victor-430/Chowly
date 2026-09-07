import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { restaurant as defaultRestaurant } from '@/data/mock-data';
import type { Restaurant, Table } from '@/types';
import { restaurantApi } from '@/services/restaurant.api';

interface RestaurantState {
  restaurant: Restaurant;
  tables: Table[];
  tableNumber: number;
  tableId: string | null;
  isLoading: boolean;
  error: string | null;

  fetchRestaurant: (id?: string) => Promise<void>;
  fetchTables: (restaurantId?: string) => Promise<void>;
  setRestaurant: (restaurant: Restaurant) => void;
  setTable: (tableNumber: number, tableId?: string) => void;
}

const DEFAULT_RESTAURANT_ID = 'the-grill-house';

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set, get) => ({
      restaurant: defaultRestaurant,
      tables: [],
      tableNumber: 4, // default table for demo
      tableId: null,
      isLoading: false,
      error: null,

      fetchRestaurant: async (id = DEFAULT_RESTAURANT_ID) => {
        set({ isLoading: true, error: null });
        try {
          const data = await restaurantApi.getById(id);
          set({ restaurant: data, isLoading: false });
          // Also fetch tables for this restaurant
          get().fetchTables(data.id);
        } catch (err: any) {
          set({ error: err.message || 'Failed to load restaurant', isLoading: false });
        }
      },

      fetchTables: async (restaurantId = get().restaurant.id) => {
        try {
          const tables = await restaurantApi.getTables(restaurantId);
          set({ tables });
          // If tableId wasn't set, find matching table for tableNumber
          const currentTable = tables.find((t) => t.number === get().tableNumber);
          if (currentTable) {
            set({ tableId: currentTable.id });
          }
        } catch (err) {
          console.error('Failed to load tables from backend', err);
        }
      },

      setRestaurant: (restaurant) => set({ restaurant }),

      setTable: (tableNumber, tableId) => {
        const matchedId = tableId || get().tables.find((t) => t.number === tableNumber)?.id || null;
        set({ tableNumber, tableId: matchedId });
      },
    }),
    {
      name: 'chowly-restaurant',
      partialize: (state) => ({
        restaurant: state.restaurant,
        tableNumber: state.tableNumber,
        tableId: state.tableId,
      }),
    }
  )
);
