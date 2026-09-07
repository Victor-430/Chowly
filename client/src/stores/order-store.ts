import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderStatus, CartItem, Complaint, ComplaintType } from '@/types';
import { orderApi, type CreateOrderPayload } from '@/services/order.api';
import { feedbackApi } from '@/services/feedback.api';

interface OrderState {
  orders: Order[];
  customerId: string;
  customerOrderIds: string[];
  isLoading: boolean;
  error: string | null;

  setCustomerId: (id: string) => void;
  placeOrder: (params: {
    items: CartItem[];
    tableNumber: number;
    tableId?: string;
    restaurantId: string;
    customerId?: string;
  }) => Promise<Order>;

  fetchOrder: (orderId: string) => Promise<Order | null>;
  fetchOrders: (params?: { restaurantId?: string; customerId?: string; tableNumber?: number }) => Promise<void>;
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

const DEFAULT_CUSTOMER_ID = 'cust-001';

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      customerId: DEFAULT_CUSTOMER_ID,
      customerOrderIds: [],
      isLoading: false,
      error: null,

      setCustomerId: (id: string) => set({ customerId: id }),

      placeOrder: async ({ items, tableNumber, tableId, restaurantId, customerId }) => {
        set({ isLoading: true, error: null });
        const resolvedCustomerId = customerId || get().customerId || DEFAULT_CUSTOMER_ID;

        try {
          const payload: CreateOrderPayload = {
            customerId: resolvedCustomerId,
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
            customerOrderIds: Array.from(new Set([liveOrder.id, ...state.customerOrderIds])),
            customerId: resolvedCustomerId,
            isLoading: false,
          }));
          return liveOrder;
        } catch (err: any) {
          const message = err.message || 'Failed to place order with database';
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
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
              const existingMap = new Map(state.orders.map((o) => [o.id, o]));

              const mergedServerOrders = res.orders.map((incoming) => {
                const existing = existingMap.get(incoming.id);
                if (!existing) return incoming;
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

              // Retain any orders that were placed on this device but are not in the current server slice
              const localDeviceOrders = state.orders.filter(
                (o) => !serverMap.has(o.id) && state.customerOrderIds.includes(o.id)
              );

              return {
                orders: [...mergedServerOrders, ...localDeviceOrders],
                isLoading: false,
              };
            });
          } else {
            set({ isLoading: false });
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

        // Local update fallback if offline
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
                      status: o.status, // preserve current order status
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

      getCustomerOrders: (tableNumber) => {
        const { orders, customerOrderIds, customerId } = get();
        return orders
          .filter((o) => {
            if (customerOrderIds.includes(o.id)) return true;
            if (o.customerId && o.customerId === customerId) return true;
            if (tableNumber !== undefined && o.tableNumber === tableNumber) return true;
            return false;
          })
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

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

        try {
          const saved = await feedbackApi.createRating(orderId, {
            customerId: customerId || get().customerId || DEFAULT_CUSTOMER_ID,
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

        try {
          const saved = await feedbackApi.createComplaint(orderId, {
            customerId: customerId || get().customerId || DEFAULT_CUSTOMER_ID,
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
    }),
    {
      name: 'chowly-orders',
      partialize: (state) => ({
        orders: state.orders,
        customerId: state.customerId,
        customerOrderIds: state.customerOrderIds,
      }),
    }
  )
);
