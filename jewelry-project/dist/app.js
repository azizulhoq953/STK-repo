"use strict";
// import express from 'express';
// import dotenv from 'dotenv';
// import connectDB from './config/db.config';
// import authRoutes from './app/modules/auth/auth.routes';
// import productRoutes from './app/modules/product/product.routes';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv.config();
// connectDB();
// const app = express();
// app.use(express.json());
// // Mount auth routes
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes); // Prefix for product routes
// export default app;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_config_1 = __importDefault(require("./config/db.config")); // Make sure this is correctly set up
const auth_routes_1 = __importDefault(require("./app/modules/auth/auth.routes"));
const product_routes_1 = __importDefault(require("./app/modules/product/product.routes"));
dotenv_1.default.config();
(0, db_config_1.default)(); // Ensure your database connection works
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Mount routes
app.use('/api/auth', auth_routes_1.default); // Auth routes
app.use('/api/products', product_routes_1.default); // Product routes
// Default route for catching undefined routes
app.use((req, res) => {
    res.status(404).send({ message: 'Route not found' });
});
exports.default = app;
