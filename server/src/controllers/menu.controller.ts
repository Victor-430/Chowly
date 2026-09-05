import { asyncHandler } from '../utils/async-handler.js';
import { ok } from '../utils/api-response.js';
import * as menuService from '../services/menu.service.js';

export const listMenuItems = asyncHandler(async (req, res) => {
  const restaurantId = req.params.restaurantId as string;
  const category = req.query.category as string | undefined;
  const items = await menuService.listMenuItems(restaurantId, category);
  ok(res, items, 'Menu items retrieved successfully');
});

export const getMenuItem = asyncHandler(async (req, res) => {
  const item = await menuService.getMenuItem(req.params.id as string);
  ok(res, item, 'Menu item retrieved successfully');
});
