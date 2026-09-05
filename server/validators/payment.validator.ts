import { requireString } from '../middleware/validation.middleware.js';
import { invalid } from '../utils/errors.js';

const VALID_PAYMENT_TYPES = ['CARD', 'BANK_TRANSFER', 'CASH'];

export const validatePayment = (body: unknown) => {
  if (!body || typeof body !== 'object') throw invalid('Request body is required');
  const value = body as Record<string, unknown>;
  const paymentType = requireString(value.paymentType, 'paymentType', 50).toUpperCase();
  if (!VALID_PAYMENT_TYPES.includes(paymentType)) {
    throw invalid(`paymentType must be one of: ${VALID_PAYMENT_TYPES.join(', ')}`);
  }
};

