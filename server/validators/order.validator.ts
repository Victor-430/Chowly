import { requirePositiveInteger, requireString } from '../middleware/validation.middleware.js';
import { invalid } from '../utils/errors.js';

export const validateCreateOrder = (body: unknown) => {
  if (!body || typeof body !== 'object') throw invalid('Request body is required');
  const value = body as Record<string, unknown>;
  requireString(value.customerId, 'customerId', 100);
  requireString(value.restaurantId, 'restaurantId', 100);
  requireString(value.tableId, 'tableId', 100);
  if (!value.tableId && value.tableNumber === undefined) {
    throw invalid('Either tableId or tableNumber is required');
  }
  if (value.tableId !== undefined) {
    requireString(value.tableId, 'tableId', 100);
  }
  if (value.tableNumber !== undefined) {
    requirePositiveInteger(value.tableNumber, 'tableNumber', 1000);
  }
  if (!Array.isArray(value.items) || value.items.length === 0 || value.items.length > 30) throw invalid('items must contain between 1 and 30 items');
  for (const item of value.items) {
    if (!item || typeof item !== 'object') throw invalid('Each item must be an object');
    const line = item as Record<string, unknown>;
    requireString(line.menuItemId, 'menuItemId', 100);
    requirePositiveInteger(line.quantity, 'quantity', 50);
    if (line.specialInstructions !== undefined && (typeof line.specialInstructions !== 'string' || line.specialInstructions.length > 500)) throw invalid('specialInstructions must be at most 500 characters');
  }
};

export const validateStatus = (body: unknown) => {
  if (!body || typeof body !== 'object' || typeof (body as Record<string, unknown>).status !== 'string') throw invalid('status is required');
};
