import { asyncHandler } from '../utils/async-handler.js';
import { ok } from '../utils/api-response.js';
import * as restaurantService from '../services/restaurant.service.js';

export const listRestaurants = asyncHandler(async (_req, res) => {
  const restaurants = await restaurantService.listRestaurants();
  ok(res, restaurants, 'Restaurants retrieved successfully');
});

export const getRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await restaurantService.getRestaurant(req.params.id as string);
  ok(res, restaurant, 'Restaurant retrieved successfully');
});

export const getRestaurantTables = asyncHandler(async (req, res) => {
  const tables = await restaurantService.getRestaurantTables(req.params.id as string);
  ok(res, tables, 'Tables retrieved successfully');
});
