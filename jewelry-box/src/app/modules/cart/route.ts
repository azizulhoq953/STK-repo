import { Router } from 'express';
import { CartController } from './cart.controller';
import { isAuthenticated } from '../auth/auth.middleware';

const router = Router();

router.post('/add', isAuthenticated, CartController.addItem);
router.get('/', isAuthenticated, CartController.getCart);

export default router;
