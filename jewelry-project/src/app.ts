import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.config'; // Make sure this is correctly set up
import authRoutes from './app/modules/auth/auth.routes';
import productRoutes from './app/modules/product/product.routes';

dotenv.config();
connectDB(); // Ensure your database connection works

const app = express();

app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/products', productRoutes); // Product routes

// Default route for catching undefined routes
app.use((req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

export default app;
