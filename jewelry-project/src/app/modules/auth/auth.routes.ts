// import express from 'express';
// import { registerAdmin, adminLogin } from './auth.controller';

// const router = express.Router();

// // Admin Registration
// router.post('/register', registerAdmin);

// // Admin Login
// router.post('/login', adminLogin);

// export default router;

import express from 'express';
import { registerUser, registerAdmin, loginUser } from '../auth/auth.controller';
import { adminAuthMiddleware } from '../../middlewares/auth.middleware';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/admin/register', adminAuthMiddleware, registerAdmin);
router.post('/login', loginUser);

export default router;