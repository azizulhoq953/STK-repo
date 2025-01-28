import express from "express";
import { PaymentController } from "../app/modules/payment/payment.controller";
import { isAuthenticated } from "../app/modules/auth/auth.middleware";

const router = express.Router();

/**
 * Admin Routes
 */

// View all payments
router.get("/admin/payments", isAuthenticated, PaymentController.viewPayments);

// You can add more admin-related routes here (e.g., manage users, orders, etc.)

export default router;
