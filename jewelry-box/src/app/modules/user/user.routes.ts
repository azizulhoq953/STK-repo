// user.routes.ts 
import { Router } from 'express';
import { UserController } from './user.controller';
import { isAuthenticated } from '../auth/auth.middleware';

const router = Router();

// Register user route
router.post('/register', UserController.register);

// Login user route
router.post('/login', UserController.login);

router.get("/count", isAuthenticated, UserController.getTotalUsers);
router.post("/cart", isAuthenticated, UserController.addToCart);
router.put("/cart", isAuthenticated, UserController.updateCart);
router.delete("/cart", isAuthenticated, UserController.deleteCartItem);
router.get("/cart", isAuthenticated, UserController.getCart);
export default router;
