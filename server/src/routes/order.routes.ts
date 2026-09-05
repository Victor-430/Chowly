import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import * as paymentController from '../controllers/payment.controller.js';
import * as feedbackController from '../controllers/feedback.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { validateCreateOrder, validateStatus } from '../validators/order.validator.js';
import { validateAssignment } from '../validators/assignment.validator.js';
import { validatePayment } from '../validators/payment.validator.js';
import { validateRating } from '../validators/rating.validator.js';
import { validateComplaint } from '../validators/complaint.validator.js';

const router = Router();

// Order CRUD & Queries
router.post('/', validate(validateCreateOrder), orderController.createOrder);
router.get('/', orderController.listOrders);
router.get('/:id', orderController.getOrder);

// Order Status & Assignments
router.patch('/:id/status', validate(validateStatus), orderController.updateOrderStatus);
router.patch('/:id/waiter', orderController.assignWaiter);
router.patch('/:id/assign', validate(validateAssignment), orderController.assignStaff);

// Payments
router.post('/:orderId/payments', validate(validatePayment), paymentController.createPayment);

// Feedback (Rating & Complaints)
router.post('/:orderId/rating', validate(validateRating), feedbackController.createRating);
router.post('/:orderId/complaints', validate(validateComplaint), feedbackController.createComplaint);

export default router;
