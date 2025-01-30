import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./config/db.config";
import productRoutes from "./app/modules/product/product.routes";
import router from "./routes";
import dotenv from "dotenv";
import userRoutes from "./app/modules/user/user.routes";
import orderRoutes from "./app/modules/order/order.routes";
import paymentRoutes from "./app/modules/payment/routes";
import adminRoutes from "./routes/admin.routes";
import { PaymentController } from "./app/modules/payment/payment.controller";
import adminProfileRouter from "./app/modules/admin/adminProfile.routes";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use("/api", router);
app.use("/api", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api", adminRoutes);
app.use("/api", adminProfileRouter);
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), PaymentController.handleWebhook);
app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next();
});

connectDB();
app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
    next();
  });
  
export default app;
