import { prisma } from '../lib/prisma.js';
import { conflict, invalid, notFound } from '../utils/errors.js';

export async function createRating(orderId: string, customerId: string, rating: number, comment?: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw notFound('Order');
  if (order.customerId !== customerId) throw invalid('You can only rate your own orders');
  if (!['SERVED', 'AWAITING_PAYMENT', 'PAID'].includes(order.status)) {
    throw conflict('Order must be served or paid before rating');
  }

  const existing = await prisma.rating.findUnique({ where: { orderId } });
  if (existing) throw conflict('This order has already been rated');

  const created = await prisma.rating.create({
    data: { orderId, customerId, rating, comment: comment?.trim() || null },
  });
  return {
    id: created.id, orderId: created.orderId, rating: created.rating,
    comment: created.comment, createdAt: created.createdAt,
  };
}
