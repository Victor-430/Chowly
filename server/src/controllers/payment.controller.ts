import type { PaymentType } from '@prisma/client';
import { asyncHandler } from '../utils/async-handler.js';
import { ok } from '../utils/api-response.js';
import * as paymentService from '../services/payment.service.js';

export const createPayment = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId as string;
  const { paymentType } = req.body;
  const payment = await paymentService.createPayment(
    orderId,
    paymentType.toUpperCase() as PaymentType,
  );
  ok(res, payment, 'Payment processed successfully', 201);
});
