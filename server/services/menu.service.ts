import { prisma } from '../lib/prisma.js';
import { notFound } from '../utils/errors.js';

const toNumber = (value: { toString(): string } | number) => Number(value.toString());

const presentMenuItem = (item: any) => ({
  id: item.id, name: item.name, description: item.description,
  price: toNumber(item.price), image: item.image,
  category: item.category.name.toLowerCase(),
  prepTime: item.preparationTime,
  isPopular: item.availabilityStatus, // all available items shown
});

export async function listMenuItems(restaurantId: string, category?: string) {
  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
  if (!restaurant) throw notFound('Restaurant');

  const where: any = { restaurantId, availabilityStatus: true };
  if (category && category !== 'all') {
    where.category = { name: { equals: category, mode: 'insensitive' } };
  }

  const items = await prisma.menuItem.findMany({
    where,
    include: { category: true },
    orderBy: { name: 'asc' },
  });
  return items.map(presentMenuItem);
}

export async function getMenuItem(id: string) {
  const item = await prisma.menuItem.findUnique({ where: { id }, include: { category: true } });
  if (!item) throw notFound('Menu item');
  return presentMenuItem(item);
}
