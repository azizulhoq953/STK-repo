"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const router = (0, express_1.Router)();
// User routes
router.post("/create", auth_middleware_1.isAuthenticated, order_controller_1.OrderController.createOrder);
router.get("/my-orders", auth_middleware_1.isAuthenticated, order_controller_1.OrderController.viewUserOrders);
// Admin routes
router.patch("/:id", auth_middleware_1.isAuthenticated, auth_middleware_1.isAdmin, order_controller_1.OrderController.updateOrderStatus);
router.delete("/:id", auth_middleware_1.isAuthenticated, auth_middleware_1.isAdmin, order_controller_1.OrderController.deleteOrder);
router.get("/all", auth_middleware_1.isAuthenticated, auth_middleware_1.isAdmin, order_controller_1.OrderController.viewAllOrders);
exports.default = router;
