"use strict";
// // product.routes.ts
// import express from 'express';
// import {  getProducts } from './product.controller';
// import { createProduct } from './product.controller';
// import { adminAuthMiddleware } from '../../middlewares/auth.middleware';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// // Apply adminAuthMiddleware to routes that require admin access
// router.post('/create', adminAuthMiddleware, createProduct); // Add product
// router.get('/', getProducts); // Get all products
// export default router;
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("./product.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post('/create', auth_middleware_1.adminAuthMiddleware, product_controller_1.createProduct); // Add product
router.get('/', product_controller_1.getProducts); // Get all products
exports.default = router;
