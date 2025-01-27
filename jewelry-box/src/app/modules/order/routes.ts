import { Router } from 'express';
import { OrderController } from './order.controller';
import { isAuthenticated, isAdmin } from '../auth/auth.middleware';

const router = Router();

router.post('/create', isAuthenticated, OrderController.createOrder);
router.get('/:orderId/status', isAuthenticated, OrderController.getOrderStatus);
router.put('/:orderId/status', isAdmin, OrderController.updateOrderStatus);

export default router;
