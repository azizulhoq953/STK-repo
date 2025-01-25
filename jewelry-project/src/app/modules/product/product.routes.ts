
// // product.routes.ts
// import express from 'express';
// import {  getProducts } from './product.controller';
// import { createProduct } from './product.controller';
// import { adminAuthMiddleware } from '../../middlewares/auth.middleware';

// const router = express.Router();

// // Apply adminAuthMiddleware to routes that require admin access
// router.post('/create', adminAuthMiddleware, createProduct); // Add product
// router.get('/', getProducts); // Get all products

// export default router;


import express from 'express';
import { createProduct, getProducts } from './product.controller';
import { adminAuthMiddleware } from '../../middlewares/auth.middleware';

const router = express.Router();

router.post('/create', adminAuthMiddleware, createProduct); // Add product
router.get('/', getProducts); // Get all products

export default router;
