import { prisma } from '../lib/prisma.js';
import { conflict, invalid, notFound } from '../utils/errors.js';

export async function createRating(orderId: string, customerId?: string, rating?: number, comment?: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw notFound('Order');
  if (rating === undefined || rating < 1 || rating > 5) {
    throw invalid('rating must be between 1 and 5');
  }

  const effectiveCustomerId = order.customerId;
  const existing = await prisma.rating.findUnique({ where: { orderId } });
  if (existing) {
    const updated = await prisma.rating.update({
      where: { orderId },
      data: { rating, comment: comment?.trim() || null },
    });
    return {
      id: updated.id, orderId: updated.orderId, rating: updated.rating,
      comment: updated.comment, createdAt: updated.createdAt,
    };
  }

  const created = await prisma.rating.create({
    data: { orderId, customerId: effectiveCustomerId, rating, comment: comment?.trim() || null },
  });
  return {
    id: created.id, orderId: created.orderId, rating: created.rating,
    comment: created.comment, createdAt: created.createdAt,
  };
}
