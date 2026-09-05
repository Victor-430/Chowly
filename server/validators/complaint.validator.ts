import { requireString } from '../middleware/validation.middleware.js';
import { invalid } from '../utils/errors.js';

const VALID_COMPLAINT_TYPES = [
  'FOOD_TOOK_TOO_LONG',
  'INCORRECT_ORDER',
  'POOR_SERVICE',
  'OTHER',
];

export const validateComplaint = (body: unknown) => {
  if (!body || typeof body !== 'object') throw invalid('Request body is required');
  const value = body as Record<string, unknown>;
  requireString(value.customerId, 'customerId', 100);
  requireString(value.description, 'description', 2000);

  const rawType = requireString(value.type, 'type', 50).toUpperCase();
  if (!VALID_COMPLAINT_TYPES.includes(rawType)) {
    throw invalid(`type must be one of: ${VALID_COMPLAINT_TYPES.join(', ')}`);
  }
};

