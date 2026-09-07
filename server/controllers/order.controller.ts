import type { OrderStatus } from '@prisma/client';
import { asyncHandler } from '../utils/async-handler.js';
import { ok } from '../utils/api-response.js';
import * as orderService from '../services/order.service.js';

export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.body);
  ok(res, order, 'Order created successfully', 201);
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrder(req.params.id as string);
  ok(res, order, 'Order retrieved successfully');
});

export const listOrders = asyncHandler(async (req, res) => {
  const restaurantId = req.query.restaurantId as string | undefined;
  const customerId = req.query.customerId as string | undefined;
  const tableNumber = req.query.tableNumber ? parseInt(req.query.tableNumber as string, 10) : undefined;
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

  const result = await orderService.listOrders(restaurantId, customerId, tableNumber, page, limit);
  ok(res, result, 'Orders retrieved successfully');
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const id = req.params.id as string;
  const { status } = req.body;
  const order = await orderService.updateOrderStatus(id, status.toUpperCase() as OrderStatus);
  ok(res, order, 'Order status updated successfully');
});

export const assignWaiter = asyncHandler(async (req, res) => {
  const id = req.params.id as string;
  const { waiterId } = req.body;
  const order = await orderService.assignWaiter(id, waiterId);
  ok(res, order, 'Waiter assigned successfully');
});

export const assignStaff = asyncHandler(async (req, res) => {
  const id = req.params.id as string;
  const { staffId, role } = req.body;
  const order = await orderService.assignStaff(id, staffId, role.toUpperCase() as 'CHEF' | 'BARTENDER');
  ok(res, order, 'Staff assigned successfully');
});
