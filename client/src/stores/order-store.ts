import { create } from 'zustand';
import { sampleOrders } from '@/data/mock-data';
import type { Order, OrderStatus, CartItem } from '@/types';
import { generateOrderId } from '@/lib/utils';
import { orderApi } from '@/services/order.api';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;

  placeOrder: (params: {
    items: CartItem[];
    tableNumber: number;
    tableId?: string;
    restaurantId: string;
    customerId?: string;
  }) => Promise<Order>;

  fetchOrder: (orderId: string) => Promise<Order | null>;
  fetchOrders: (params?: { restaurantId?: string; customerId?: string }) => Promise<void>;
  updateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  assignChef: (orderId: string, chefId: string, chefName: string) => Promise<void>;
  assignBartender: (orderId: string, bartenderId: string, bartenderName: string) => Promise<void>;
  assignWaiter: (orderId: string, waiterId: string, waiterName: string) => Promise<void>;
  getOrder: (orderId: string) => Order | undefined;
  getOrdersByStatus: (...statuses: OrderStatus[]) => Order[];
  getActiveOrders: () => Order[];
  getCustomerOrders: (tableNumber?: number) => Order[];
  updateOrderItem: (orderId: string, menuItemId: string, quantity: number) => void;
  removeOrderItem: (orderId: string, menuItemId: string) => void;
  addRating: (orderId: string, rating: number, comment?: string) => void;
}

const PACKAGING_FEE = 200;
const DEFAULT_CUSTOMER_ID = 'cust-001';

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [...sampleOrders],
  isLoading: false,
  error: null,

  placeOrder: async ({ items, tableNumber, tableId, restaurantId, customerId = DEFAULT_CUSTOMER_ID }) => {
    set({ isLoading: true, error: null });

    // Try backend API creation first
    try {
      if (tableId) {
        const payload = {
          customerId,
          restaurantId,
          tableId,
          items: items.map((i) => ({
            menuItemId: i.menuItem.id,
            quantity: i.quantity,
            specialInstructions: i.specialInstructions,
          })),
        };

        const liveOrder = await orderApi.create(payload);
        set((state) => ({
          orders: [liveOrder, ...state.orders.filter((o) => o.id !== liveOrder.id)],
          isLoading: false,
        }));
        return liveOrder;
      }
    } catch (err: any) {
      console.warn('API order placement failed or offline, falling back to local order:', err);
    }

    // Fallback local order creation
    const subtotal = items.reduce(
      (sum, i) => sum + i.menuItem.price * i.quantity,
      0
    );
    const fallbackOrder: Order = {
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

    set((state) => ({
      orders: [fallbackOrder, ...state.orders],
      isLoading: false,
    }));
    return fallbackOrder;
  },

  fetchOrder: async (orderId: string) => {
    try {
      const order = await orderApi.getById(orderId);
      if (order) {
        set((state) => ({
          orders: state.orders.some((o) => o.id === order.id)
            ? state.orders.map((o) => (o.id === order.id ? order : o))
            : [order, ...state.orders],
        }));
        return order;
      }
    } catch (err) {
      console.warn(`Could not fetch order ${orderId} live:`, err);
    }
    return get().orders.find((o) => o.id === orderId) || null;
  },

  fetchOrders: async (params) => {
    set({ isLoading: true });
    try {
      const res = await orderApi.list(params);
      if (res && Array.isArray(res.orders)) {
        set({ orders: res.orders, isLoading: false });
      }
    } catch (err: any) {
      console.warn('Could not fetch orders list live:', err);
      set({ isLoading: false });
    }
  },

  updateStatus: async (orderId, status) => {
    // Optimistic update
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o
      ),
    }));

    try {
      const updated = await orderApi.updateStatus(orderId, status);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === orderId ? updated : o)),
      }));
    } catch (err) {
      console.error(`Failed to update status on server for order ${orderId}:`, err);
    }
  },

  assignChef: async (orderId, chefId, chefName) => {
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

    try {
      const updated = await orderApi.assignStaff(orderId, chefId, 'CHEF');
      set((state) => ({
        orders: state.orders.map((o) => (o.id === orderId ? updated : o)),
      }));
    } catch (err) {
      console.warn(`Failed to sync chef assignment on server for order ${orderId}:`, err);
    }
  },

  assignBartender: async (orderId, bartenderId, bartenderName) => {
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

    try {
      const updated = await orderApi.assignStaff(orderId, bartenderId, 'BARTENDER');
      set((state) => ({
        orders: state.orders.map((o) => (o.id === orderId ? updated : o)),
      }));
    } catch (err) {
      console.warn(`Failed to sync bartender assignment on server for order ${orderId}:`, err);
    }
  },

  assignWaiter: async (orderId, waiterId, waiterName) => {
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

    try {
      const updated = await orderApi.assignWaiter(orderId, waiterId);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === orderId ? updated : o)),
      }));
    } catch (err) {
      console.warn(`Failed to sync waiter assignment on server for order ${orderId}:`, err);
    }
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

