"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const body_parser_1 = __importDefault(require("body-parser"));
const router = (0, express_1.Router)();
// Process payment
router.post("/pay", auth_middleware_1.isAuthenticated, payment_controller_1.PaymentController.processPayment);
router.get("/admin/payments", auth_middleware_1.isAuthenticated, payment_controller_1.PaymentController.viewPayments);
// Stripe Webhook (use raw body for Stripe signature verification)
router.post("/webhook", body_parser_1.default.raw({ type: "application/json" }), payment_controller_1.PaymentController.handleWebhook);
exports.default = router;
