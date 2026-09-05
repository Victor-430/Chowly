import { requireString } from '../middleware/validation.middleware.js';
import { invalid } from '../utils/errors.js';

export const validateAssignment = (body: unknown) => {
  if (!body || typeof body !== 'object') throw invalid('Request body is required');
  const value = body as Record<string, unknown>;
  requireString(value.waiterId, 'waiterId', 100);
  requireString(value.staffId, 'staffId', 100);
  if (value.role !== 'CHEF' && value.role !== 'BARTENDER') throw invalid('role must be CHEF or BARTENDER');
};
