import { prisma } from '../lib/prisma.js';
import { notFound } from '../utils/errors.js';

export async function listStaff(restaurantId: string, role?: string) {
  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
  if (!restaurant) throw notFound('Restaurant');

  const where: any = { restaurantId };
  if (role) {
    where.role = role.toUpperCase();
  }

  const staff = await prisma.staff.findMany({
    where,
    orderBy: { fullName: 'asc' },
    select: { id: true, fullName: true, role: true, availability: true },
  });
  return staff.map((s) => ({
    id: s.id, name: s.fullName, role: s.role.toLowerCase(),
    availability: s.availability.toLowerCase(),
  }));
}
