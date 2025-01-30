"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const router = (0, express_1.Router)();
// User routes
router.post("/place-order", auth_middleware_1.isAuthenticated, order_controller_1.OrderController.placeOrder);
router.get("/my-orders", auth_middleware_1.isAuthenticated, order_controller_1.OrderController.getOrderStatus);
// Admin routes
// router.get("/orders", isAuthenticated, isAdmin, OrderController.getAllOrders);
router.get("/orders", auth_middleware_1.isAuthenticated, auth_middleware_1.isAdmin, order_controller_1.OrderController.getAllOrders);
router.put("/orders/update-status", auth_middleware_1.isAuthenticated, auth_middleware_1.isAdmin, order_controller_1.OrderController.updateOrderStatus);
router.delete("/orders/:orderId", auth_middleware_1.isAuthenticated, auth_middleware_1.isAdmin, order_controller_1.OrderController.deleteOrder);
// router.get("/debug-orders", isAuthenticated, isAdmin, OrderController.debugOrders);
exports.default = router;
