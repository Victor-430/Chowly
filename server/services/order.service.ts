import { OrderStatus, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { conflict, invalid, notFound } from "../utils/errors.js";

type CreateOrderInput = {
  customerId: string;
  restaurantId: string;
  tableId?: string;
  tableNumber?: number;
  items: Array<{
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
  }>;
};

const orderInclude = {
  table: true,
  waiter: true,
  items: { include: { menuItem: true } },
  assignments: { include: { staff: true } },
  tracking: true,
  payments: true,
  rating: true,
  complaints: true,
} as const;

const transitions: Record<OrderStatus, OrderStatus[]> = {
  NEW: ["ASSIGNED", "CANCELLED"],
  ASSIGNED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY"],
  READY: ["SERVED"],
  SERVED: ["AWAITING_PAYMENT", "PAID"],
  AWAITING_PAYMENT: ["PAID"],
  PAID: [],
  CANCELLED: [],
};

const toNumber = (value: { toString(): string } | number) =>
  Number(value.toString());

export const presentOrder = (order: any) => ({
  id: order.id,
  customerId: order.customerId,
  restaurantId: order.restaurantId,
  tableId: order.tableId,
  tableNumber: order.table?.tableNumber,
  status: order.status.toLowerCase(),
  subtotal: toNumber(order.subtotal),
  packagingFee: toNumber(order.packagingMaterialCost),
  total: toNumber(order.totalAmount),
  estimatedWait: order.estimatedWaitingTime,
  paymentStatus: order.paymentStatus.toLowerCase(),
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  items: order.items.map((item: any) => ({
    menuItemId: item.menuItemId,
    name: item.menuItem?.name || item.name,
    price: toNumber(item.unitPrice),
    quantity: item.quantity,
    specialInstructions: item.specialInstructions,
  })),
  staffAssignment: {
    waiterId: order.waiter?.id,
    waiterName: order.waiter?.fullName,
    chefId: order.assignments?.find((a: any) => a.role === "CHEF")?.staff?.id,
    chefName: order.assignments?.find((a: any) => a.role === "CHEF")?.staff?.fullName,
    bartenderId: order.assignments?.find((a: any) => a.role === "BARTENDER")?.staff?.id,
    bartenderName: order.assignments?.find((a: any) => a.role === "BARTENDER")?.staff?.fullName,
  },
  tracking: order.tracking,
  payments: order.payments,
  rating: order.rating ? {
    id: order.rating.id,
    orderId: order.rating.orderId,
    rating: order.rating.rating,
    comment: order.rating.comment,
    createdAt: order.rating.createdAt,
  } : undefined,
  complaints: order.complaints ? order.complaints.map((c: any) => ({
    id: c.id,
    orderId: c.orderId,
    type: c.type.toLowerCase(),
    description: c.description,
    createdAt: c.createdAt,
  })) : [],
});

export async function createOrder(input: CreateOrderInput) {
  const ids = input.items.map((item) => item.menuItemId);
  if (new Set(ids).size !== ids.length)
    throw invalid("Each menu item may appear only once");
  return prisma.$transaction(
    async (tx) => {
      const restaurant = await tx.restaurant.findUnique({ where: { id: input.restaurantId } });
      if (!restaurant) throw notFound("Restaurant");
      if (restaurant.status !== "OPEN") throw conflict("Restaurant is closed");

      let customer = await tx.customer.findUnique({ where: { id: input.customerId } });
      if (!customer) {
        customer = await tx.customer.create({
          data: {
            id: input.customerId,
            displayName: "Dine-in Customer",
          },
        });
      }

      let table: any = null;
      if (input.tableId) {
        table = await tx.restaurantTable.findUnique({ where: { id: input.tableId } });
      }
      if (!table && input.tableNumber !== undefined) {
        table = await tx.restaurantTable.findFirst({
          where: {
            restaurantId: input.restaurantId,
            tableNumber: input.tableNumber,
          },
        });
      }
      if (!table && input.tableNumber !== undefined) {
        table = await tx.restaurantTable.create({
          data: {
            restaurantId: input.restaurantId,
            tableNumber: input.tableNumber,
            capacity: 4,
            status: "OCCUPIED",
          },
        });
      }
      if (!table || table.restaurantId !== input.restaurantId) {
        throw invalid("Table does not belong to this restaurant");
      }

      const menuItems = await tx.menuItem.findMany({
        where: {
          id: { in: ids },
          restaurantId: input.restaurantId,
          availabilityStatus: true,
        },
      });
      if (menuItems.length !== ids.length)
        throw invalid(
          "One or more menu items are missing, unavailable, or belong to another restaurant",
        );
      const byId = new Map(menuItems.map((item) => [item.id, item]));
      const lines = input.items.map((line) => {
        const item = byId.get(line.menuItemId)!;
        const subtotal = item.price.mul(line.quantity);
        return {
          ...line,
          price: item.price,
          subtotal,
          prepTime: item.preparationTime,
        };
      });
      const subtotal = lines.reduce(
        (sum, line) => sum.add(line.subtotal),
        new Prisma.Decimal(0),
      );
      const packaging = new Prisma.Decimal(0);
      const order = await tx.order.create({
        data: {
          customerId: customer.id,
          restaurantId: input.restaurantId,
          tableId: table.id,
          subtotal,
          packagingMaterialCost: packaging,
          totalAmount: subtotal.add(packaging),
          estimatedWaitingTime: Math.max(...lines.map((line) => line.prepTime)),
          items: {
            create: lines.map((line) => ({
              menuItemId: line.menuItemId,
              quantity: line.quantity,
              unitPrice: line.price,
              subtotal: line.subtotal,
              specialInstructions: line.specialInstructions?.trim() || null,
            })),
          },
          tracking: { create: { status: "NEW" } },
        },
        include: orderInclude,
      });
      await tx.restaurantTable.update({
        where: { id: table.id },
        data: { status: "OCCUPIED" },
      });
      return presentOrder(order);
    },
    { timeout: 15000, maxWait: 10000 },
  );
}

export async function getOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: orderInclude,
  });
  if (!order) throw notFound("Order");
  return presentOrder(order);
}

export async function listOrders(
  restaurantId?: string,
  customerId?: string,
  tableNumber?: number,
  page = 1,
  limit = 50,
) {
  const where: any = {
    ...(restaurantId ? { restaurantId } : {}),
    ...(customerId ? { customerId } : {}),
  };
  if (tableNumber !== undefined && !isNaN(tableNumber)) {
    where.table = { tableNumber };
  }
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: orderInclude,
      orderBy: { orderedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);
  return {
    orders: orders.map(presentOrder),
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function updateOrderStatus(
  orderId: string,
  nextStatus: OrderStatus,
) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: orderInclude,
  });
  if (!order) throw notFound("Order");
  if (order.status === nextStatus) {
    return presentOrder(order);
  }
  if (!transitions[order.status].includes(nextStatus))
    throw conflict(`Cannot transition from ${order.status} to ${nextStatus}`);
  if (nextStatus === "ASSIGNED" && !order.waiterId)
    throw conflict("Assign a waiter before assigning the order");
  const now = new Date();
  const updated = await prisma.$transaction(async (tx) => {
    await tx.orderTracking.update({
      where: { orderId },
      data: {
        status: nextStatus,
        ...(nextStatus === "PREPARING" ? { startedAt: now } : {}),
        ...(nextStatus === "READY" ? { readyAt: now } : {}),
        ...(nextStatus === "SERVED" ? { servedAt: now } : {}),
      },
    });
    return tx.order.update({
      where: { id: orderId },
      data: { status: nextStatus },
      include: orderInclude,
    });
  });
  return presentOrder(updated);
}

export async function assignWaiter(orderId: string, waiterId: string) {
  const [order, waiter] = await Promise.all([
    prisma.order.findUnique({ where: { id: orderId } }),
    prisma.staff.findUnique({ where: { id: waiterId } }),
  ]);
  if (!order) throw notFound("Order");
  if (
    !waiter ||
    waiter.role !== "WAITER" ||
    waiter.restaurantId !== order.restaurantId
  )
    throw invalid("Waiter must belong to the order restaurant");
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { waiterId },
    include: orderInclude,
  });
  return presentOrder(updated);
}

export async function assignStaff(
  orderId: string,
  staffId: string,
  role: "CHEF" | "BARTENDER",
) {
  const [order, staff] = await Promise.all([
    prisma.order.findUnique({ where: { id: orderId } }),
    prisma.staff.findUnique({ where: { id: staffId } }),
  ]);
  if (!order) throw notFound("Order");
  if (
    !staff ||
    staff.role !== role ||
    staff.restaurantId !== order.restaurantId
  ) {
    throw invalid(`Staff member must be a ${role} at the order's restaurant`);
  }
  // Upsert: one chef and one bartender per order (@@unique([orderId, role]))
  await prisma.orderAssignment.upsert({
    where: { orderId_role: { orderId, role } },
    create: { orderId, staffId, role },
    update: { staffId },
  });
  const updated = await prisma.order.findUnique({
    where: { id: orderId },
    include: orderInclude,
  });
  return presentOrder(updated!);
}
