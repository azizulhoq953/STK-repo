"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const auth_middleware_1 = require("../auth/auth.middleware"); // Import the middleware
const router = (0, express_1.Router)();
// Apply isAuthenticated for create, update, and delete routes
router.post("/", auth_middleware_1.isAuthenticated, product_controller_1.ProductController.create); // Only admins can create products
router.put("/:id", auth_middleware_1.isAuthenticated, product_controller_1.ProductController.update); // Only admins can update products
router.delete("/:id", auth_middleware_1.isAuthenticated, product_controller_1.ProductController.delete); // Only admins can delete products
// Public access to find all products and find by id
router.get("/", product_controller_1.ProductController.findAll);
router.get("/search", product_controller_1.ProductController.search);
exports.default = router;
