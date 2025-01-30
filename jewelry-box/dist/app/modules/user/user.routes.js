"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// user.routes.ts 
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const router = (0, express_1.Router)();
// Register user route
router.post('/register', user_controller_1.UserController.register);
// Login user route
router.post('/login', user_controller_1.UserController.login);
router.post('/forgot-password', user_controller_1.UserController.forgotPassword);
router.post('/reset-password', user_controller_1.UserController.resetPassword);
router.get("/count", auth_middleware_1.isAuthenticated, user_controller_1.UserController.getTotalUsers);
router.post("/cart", auth_middleware_1.isAuthenticated, user_controller_1.UserController.addToCart);
router.put("/cart", auth_middleware_1.isAuthenticated, user_controller_1.UserController.updateCart);
router.delete("/cart", auth_middleware_1.isAuthenticated, user_controller_1.UserController.deleteCartItem);
router.get("/cart", auth_middleware_1.isAuthenticated, user_controller_1.UserController.getCart);
exports.default = router;
