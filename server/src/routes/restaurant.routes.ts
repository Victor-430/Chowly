import { Router } from 'express';
import * as restaurantController from '../controllers/restaurant.controller.js';
import * as menuController from '../controllers/menu.controller.js';
import * as staffController from '../controllers/staff.controller.js';

const router = Router();

router.get('/', restaurantController.listRestaurants);
router.get('/:id', restaurantController.getRestaurant);
router.get('/:id/tables', restaurantController.getRestaurantTables);
router.get('/:restaurantId/menu', menuController.listMenuItems);
router.get('/:restaurantId/staff', staffController.listStaff);

export default router;
