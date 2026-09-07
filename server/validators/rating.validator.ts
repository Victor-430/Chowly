import { requireString } from '../middleware/validation.middleware.js';
import { invalid } from '../utils/errors.js';

export const validateRating = (body: unknown) => {
  if (!body || typeof body !== 'object') throw invalid('Request body is required');
  const value = body as Record<string, unknown>;
  requireString(value.customerId, 'customerId', 100);
  if (value.customerId !== undefined) {
    requireString(value.customerId, 'customerId', 100);
  }

  const rating = value.rating;
  if (!Number.isInteger(rating) || (rating as number) < 1 || (rating as number) > 5) {
    throw invalid('rating must be an integer between 1 and 5');
  }

  if (value.comment !== undefined && (typeof value.comment !== 'string' || (value.comment as string).length > 1000)) {
    throw invalid('comment must be a string with at most 1000 characters');
  }
};

