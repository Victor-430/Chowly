import type { ComplaintType } from '@prisma/client';
import { asyncHandler } from '../utils/async-handler.js';
import { ok } from '../utils/api-response.js';
import * as ratingService from '../services/rating.service.js';
import * as complaintService from '../services/complaint.service.js';

export const createRating = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId as string;
  const { customerId, rating, comment } = req.body;
  const result = await ratingService.createRating(orderId, customerId, rating, comment);
  ok(res, result, 'Rating submitted successfully', 201);
});

export const createComplaint = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId as string;
  const { customerId, type, description } = req.body;
  const result = await complaintService.createComplaint(
    orderId,
    customerId,
    type.toUpperCase() as ComplaintType,
    description,
  );
  ok(res, result, 'Complaint submitted successfully', 201);
});
