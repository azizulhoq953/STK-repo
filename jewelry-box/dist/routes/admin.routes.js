"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("../app/modules/payment/payment.controller");
const auth_middleware_1 = require("../app/modules/auth/auth.middleware");
const router = express_1.default.Router();
/**
 * Admin Routes
 */
// View all payments
router.get("/admin/payments", auth_middleware_1.isAuthenticated, payment_controller_1.PaymentController.viewPayments);
// You can add more admin-related routes here (e.g., manage users, orders, etc.)
exports.default = router;
