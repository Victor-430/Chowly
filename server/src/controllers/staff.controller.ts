import { asyncHandler } from '../utils/async-handler.js';
import { ok } from '../utils/api-response.js';
import * as staffService from '../services/staff.service.js';

export const listStaff = asyncHandler(async (req, res) => {
  const restaurantId = req.params.restaurantId as string;
  const role = req.query.role as string | undefined;
  const staff = await staffService.listStaff(restaurantId, role);
  ok(res, staff, 'Staff retrieved successfully');
});
