import { create } from 'zustand';
import { sampleOrders } from '@/data/mock-data';
import type { Order, OrderStatus, CartItem, Complaint, ComplaintType } from '@/types';
import { generateOrderId } from '@/lib/utils';
import { orderApi, type CreateOrderPayload } from '@/services/order.api';
import { feedbackApi } from '@/services/feedback.api';

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
  addRating: (orderId: string, rating: number, comment?: string, customerId?: string) => Promise<void>;
  addComplaint: (orderId: string, type: ComplaintType, description: string, customerId?: string) => Promise<void>;
}

const PACKAGING_FEE = 200;
const DEFAULT_CUSTOMER_ID = 'cust-001';

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [...sampleOrders],
  isLoading: false,
  error: null,

  placeOrder: async ({ items, tableNumber, tableId, restaurantId, customerId = DEFAULT_CUSTOMER_ID }) => {
    set({ isLoading: true, error: null });

    // Always attempt backend API creation first
    try {
      const payload: CreateOrderPayload = {
        customerId,
        restaurantId,
        tableId: tableId || undefined,
        tableNumber,
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
      const incoming = await orderApi.getById(orderId);
      if (incoming) {
        set((state) => {
          const existing = state.orders.find((o) => o.id === incoming.id);
          const merged: Order = existing
            ? {
                ...incoming,
                rating: incoming.rating || existing.rating,
                complaints: (incoming.complaints && incoming.complaints.length > 0)
                  ? incoming.complaints
                  : existing.complaints,
                staffAssignment: {
                  waiterId: incoming.staffAssignment?.waiterId || existing.staffAssignment?.waiterId,
                  waiterName: incoming.staffAssignment?.waiterName || existing.staffAssignment?.waiterName,
                  chefId: incoming.staffAssignment?.chefId || existing.staffAssignment?.chefId,
                  chefName: incoming.staffAssignment?.chefName || existing.staffAssignment?.chefName,
                  bartenderId: incoming.staffAssignment?.bartenderId || existing.staffAssignment?.bartenderId,
                  bartenderName: incoming.staffAssignment?.bartenderName || existing.staffAssignment?.bartenderName,
                },
              }
            : incoming;

          return {
            orders: existing
              ? state.orders.map((o) => (o.id === incoming.id ? merged : o))
              : [merged, ...state.orders],
          };
        });
        return incoming;
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
        set((state) => {
          const serverMap = new Map(res.orders.map((o) => [o.id, o]));
          const mergedOrders = state.orders.map((existing) => {
            const incoming = serverMap.get(existing.id);
            if (!incoming) return existing;
            serverMap.delete(existing.id);
            return {
              ...incoming,
              rating: incoming.rating || existing.rating,
              complaints: (incoming.complaints && incoming.complaints.length > 0)
                ? incoming.complaints
                : existing.complaints,
              staffAssignment: {
                waiterId: incoming.staffAssignment?.waiterId || existing.staffAssignment?.waiterId,
                waiterName: incoming.staffAssignment?.waiterName || existing.staffAssignment?.waiterName,
                chefId: incoming.staffAssignment?.chefId || existing.staffAssignment?.chefId,
                chefName: incoming.staffAssignment?.chefName || existing.staffAssignment?.chefName,
                bartenderId: incoming.staffAssignment?.bartenderId || existing.staffAssignment?.bartenderId,
                bartenderName: incoming.staffAssignment?.bartenderName || existing.staffAssignment?.bartenderName,
              },
            };
          });
          const newOrders = Array.from(serverMap.values());
          return { orders: [...mergedOrders, ...newOrders], isLoading: false };
        });
      }
    } catch (err: any) {
      console.warn('Could not fetch orders list live:', err);
      set({ isLoading: false });
    }
  },

  updateStatus: async (orderId, status) => {
    try {
      const updated = await orderApi.updateStatus(orderId, status);
      if (updated) {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...updated,
                  status: updated.status || status,
                  staffAssignment: {
                    waiterId: updated.staffAssignment?.waiterId || o.staffAssignment?.waiterId,
                    waiterName: updated.staffAssignment?.waiterName || o.staffAssignment?.waiterName,
                    chefId: updated.staffAssignment?.chefId || o.staffAssignment?.chefId,
                    chefName: updated.staffAssignment?.chefName || o.staffAssignment?.chefName,
                    bartenderId: updated.staffAssignment?.bartenderId || o.staffAssignment?.bartenderId,
                    bartenderName: updated.staffAssignment?.bartenderName || o.staffAssignment?.bartenderName,
                  },
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        }));
        return;
      }
    } catch (err) {
      console.warn(`Failed to update status on server for order ${orderId}, applying local update:`, err);
    }

    // Fallback local update (offline / mock data)
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o
      ),
    }));
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
      if (updated) {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...updated,
                  status: o.status, // preserve the current order status
                  staffAssignment: {
                    ...updated.staffAssignment,
                    waiterId: updated.staffAssignment?.waiterId || waiterId,
                    waiterName: updated.staffAssignment?.waiterName || waiterName,
                  },
                }
              : o
          ),
        }));
      }
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
    get().orders.filter((o) => tableNumber === undefined || o.tableNumber === tableNumber),

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

  addRating: async (orderId, rating, comment, customerId = DEFAULT_CUSTOMER_ID) => {
    // Optimistically update order rating locally
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              rating: { orderId, rating, comment: comment?.trim() },
              updatedAt: new Date().toISOString(),
            }
          : o
      ),
    }));

    // Persist to backend API
    try {
      const saved = await feedbackApi.createRating(orderId, {
        customerId,
        rating,
        comment: comment?.trim() || undefined,
      });
      if (saved) {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  rating: {
                    id: saved.id,
                    orderId: saved.orderId,
                    rating: saved.rating,
                    comment: saved.comment,
                    createdAt: saved.createdAt,
                  },
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        }));
      }
    } catch (err: any) {
      console.warn(`Failed to submit rating to backend for order ${orderId}:`, err);
    }
  },

  addComplaint: async (orderId, type, description, customerId = DEFAULT_CUSTOMER_ID) => {
    const tempComplaint: Complaint = {
      orderId,
      type,
      description: description.trim(),
      createdAt: new Date().toISOString(),
    };

    // Optimistically update order complaints locally
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              complaints: [...(o.complaints || []), tempComplaint],
              updatedAt: new Date().toISOString(),
            }
          : o
      ),
    }));

    // Persist to backend API
    try {
      const saved = await feedbackApi.createComplaint(orderId, {
        customerId,
        type,
        description: description.trim(),
      });
      if (saved) {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  complaints: [
                    ...(o.complaints || []).filter((c) => c !== tempComplaint),
                    {
                      id: saved.id,
                      orderId: saved.orderId,
                      type: saved.type,
                      description: saved.description,
                      createdAt: new Date().toISOString(),
                    },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        }));
      }
    } catch (err: any) {
      console.warn(`Failed to submit complaint to backend for order ${orderId}:`, err);
    }
  },
}));
