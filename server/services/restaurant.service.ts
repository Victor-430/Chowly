import { prisma } from '../lib/prisma';
import { notFound } from '../utils/errors.js';

const restaurantSelect = {
  id: true, name: true, phone: true, image: true, description: true,
  openingTime: true, closingTime: true, status: true, averagePrepTime: true,
  createdAt: true, updatedAt: true,
} as const;

const toPresentation = (r: any, tableCount?: number) => ({
  id: r.id, name: r.name, phone: r.phone, image: r.image,
  description: r.description, openingTime: r.openingTime, closingTime: r.closingTime,
  status: r.status.toLowerCase(), avgPrepTime: r.averagePrepTime,
  rating: 4.8, // placeholder — will compute from ratings later
  ...(tableCount !== undefined ? { tableCount } : {}),
  createdAt: r.createdAt, updatedAt: r.updatedAt,
});

export async function listRestaurants() {
  const restaurants = await prisma.restaurant.findMany({
    select: { ...restaurantSelect, _count: { select: { tables: true } } },
    orderBy: { name: 'asc' },
  });
  return restaurants.map((r) => toPresentation(r, r._count.tables));
}

export async function getRestaurant(id: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    select: { ...restaurantSelect, _count: { select: { tables: true } } },
  });
  if (!restaurant) throw notFound('Restaurant');
  return toPresentation(restaurant, restaurant._count.tables);
}

export async function getRestaurantTables(restaurantId: string) {
  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
  if (!restaurant) throw notFound('Restaurant');
  const tables = await prisma.restaurantTable.findMany({
    where: { restaurantId },
    orderBy: { tableNumber: 'asc' },
    select: { id: true, tableNumber: true, capacity: true, status: true },
  });
  return tables.map((t) => ({
    id: t.id, number: t.tableNumber, capacity: t.capacity,
    status: t.status.toLowerCase(), restaurantId,
  }));
}
