import { create } from 'zustand';
import { sampleOrders } from '@/data/mock-data';
import type { Order, OrderStatus } from '@/types';
import { generateOrderId } from '@/lib/utils';
import type { CartItem } from '@/types';

interface OrderState {
  orders: Order[];
  placeOrder: (params: {
    items: CartItem[];
    tableNumber: number;
    restaurantId: string;
  }) => Order;
  updateStatus: (orderId: string, status: OrderStatus) => void;
  assignChef: (orderId: string, chefId: string, chefName: string) => void;
  assignBartender: (orderId: string, bartenderId: string, bartenderName: string) => void;
  assignWaiter: (orderId: string, waiterId: string, waiterName: string) => void;
  getOrder: (orderId: string) => Order | undefined;
  getOrdersByStatus: (...statuses: OrderStatus[]) => Order[];
  getActiveOrders: () => Order[];
  getCustomerOrders: (tableNumber: number) => Order[];
  updateOrderItem: (orderId: string, menuItemId: string, quantity: number) => void;
  removeOrderItem: (orderId: string, menuItemId: string) => void;
  addRating: (orderId: string, rating: number, comment?: string) => void;
}

const PACKAGING_FEE = 200;

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [...sampleOrders],

  placeOrder: ({ items, tableNumber, restaurantId }) => {
    const subtotal = items.reduce(
      (sum, i) => sum + i.menuItem.price * i.quantity,
      0
    );
    const order: Order = {
      id: generateOrderId(),
      restaurantId,
      tableNumber,
      items: items.map((i) => ({
        menuItemId: i.menuItem.id,
        name: i.menuItem.name,
        price: i.menuItem.price,
        quantity: i.quantity,
        specialInstructions: i.specialInstructions,
      })),
      status: 'new',
      subtotal,
      packagingFee: PACKAGING_FEE,
      total: subtotal + PACKAGING_FEE,
      estimatedWait: Math.max(...items.map((i) => i.menuItem.prepTime)),
      staffAssignment: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ orders: [order, ...state.orders] }));
    return order;
  },

  updateStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o
      ),
    }));
  },

  assignChef: (orderId, chefId, chefName) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              staffAssignment: { ...o.staffAssignment, chefId, chefName },
              updatedAt: new Date().toISOString(),
            }
          : o
      ),
    }));
  },

  assignBartender: (orderId, bartenderId, bartenderName) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              staffAssignment: { ...o.staffAssignment, bartenderId, bartenderName },
              updatedAt: new Date().toISOString(),
            }
          : o
      ),
    }));
  },

  assignWaiter: (orderId, waiterId, waiterName) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              staffAssignment: { ...o.staffAssignment, waiterId, waiterName },
              updatedAt: new Date().toISOString(),
            }
          : o
      ),
    }));
  },

  getOrder: (orderId) => get().orders.find((o) => o.id === orderId),

  getOrdersByStatus: (...statuses) =>
    get().orders.filter((o) => statuses.includes(o.status)),

  getActiveOrders: () =>
    get().orders.filter(
      (o) => !['paid', 'cancelled'].includes(o.status)
    ),

  getCustomerOrders: (tableNumber) =>
    get().orders.filter((o) => o.tableNumber === tableNumber),

  updateOrderItem: (orderId, menuItemId, quantity) => {
    set((state) => ({
      orders: state.orders.map((o) => {
        if (o.id !== orderId) return o;
        const items = quantity <= 0
          ? o.items.filter((i) => i.menuItemId !== menuItemId)
          : o.items.map((i) =>
              i.menuItemId === menuItemId ? { ...i, quantity } : i
            );
        const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
        return {
          ...o,
          items,
          subtotal,
          total: subtotal + o.packagingFee,
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  },

  removeOrderItem: (orderId, menuItemId) => {
    get().updateOrderItem(orderId, menuItemId, 0);
  },

  addRating: (_orderId, _rating, _comment) => {
    // In a real app this would persist to the backend
    // For now, it's handled by the feedback page directly
  },
}));

