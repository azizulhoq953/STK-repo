import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./config/db.config";
import productRoutes from "./app/modules/product/product.routes";
import router from "./routes";
import dotenv from "dotenv";
import userRoutes from "./app/modules/user/user.routes";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use("/api", router);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
connectDB();

export default app;
