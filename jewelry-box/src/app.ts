import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./config/db.config";
import productRoutes from "./app/modules/product/product.routes";
import router from "./routes";
import dotenv from "dotenv";
import userRoutes from "./app/modules/user/user.routes";
import orderRoutes from "./app/modules/order/order.routes";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use("/api", router);
app.use("/api/users", userRoutes);
app.use("/api/auth/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
connectDB();
app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
    next();
  });
  
export default app;
