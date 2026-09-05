import type { PaymentType } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { conflict, notFound } from '../utils/errors.js';

const toNumber = (value: { toString(): string } | number) => Number(value.toString());

export async function createPayment(orderId: string, paymentType: PaymentType) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId } });
    if (!order) throw notFound('Order');
    if (order.status !== 'AWAITING_PAYMENT' && order.status !== 'SERVED') throw conflict('Order must be served or awaiting payment');

    const now = new Date();
    const payment = await tx.payment.create({
      data: {
        orderId,
        amount: order.totalAmount,
        paymentType,
        status: 'SUCCESS',
        paidAt: now,
        isPretend: true,
      },
    });

    await tx.order.update({
      where: { id: orderId },
      data: { status: 'PAID', paymentStatus: 'SUCCESS' },
    });

    await tx.orderTracking.update({
      where: { orderId },
      data: { status: 'PAID' },
    });

    return {
      id: payment.id, orderId: payment.orderId,
      amount: toNumber(payment.amount), status: payment.status.toLowerCase(),
      paymentType: payment.paymentType.toLowerCase(),
      paidAt: payment.paidAt, createdAt: payment.createdAt,
    };
  });
}
