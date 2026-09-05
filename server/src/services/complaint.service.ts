import type { ComplaintType } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { invalid, notFound } from '../utils/errors.js';

export async function createComplaint(
  orderId: string, customerId: string, type: ComplaintType, description: string,
) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw notFound('Order');
  if (order.customerId !== customerId) throw invalid('You can only file complaints for your own orders');

  const created = await prisma.complaint.create({
    data: { orderId, customerId, type, description: description.trim() },
  });
  return {
    id: created.id, orderId: created.orderId,
    type: created.type.toLowerCase(), description: created.description,
    createdAt: created.createdAt,
  };
}
