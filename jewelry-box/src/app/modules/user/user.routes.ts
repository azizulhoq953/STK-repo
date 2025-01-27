import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();

// Register user route
router.post('/register', UserController.register);

// Login user route
router.post('/login', UserController.login);

export default router;
