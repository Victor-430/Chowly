import { create } from 'zustand';
import { restaurant as defaultRestaurant } from '@/data/mock-data';
import type { Restaurant } from '@/types';

interface RestaurantState {
  restaurant: Restaurant;
  tableNumber: number;
  setRestaurant: (restaurant: Restaurant) => void;
  setTable: (tableNumber: number) => void;
}

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurant: defaultRestaurant,
  tableNumber: 4, // default table for demo

  setRestaurant: (restaurant) => set({ restaurant }),
  setTable: (tableNumber) => set({ tableNumber }),
}));
