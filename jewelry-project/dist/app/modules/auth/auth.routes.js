"use strict";
// import express from 'express';
// import { registerAdmin, adminLogin } from './auth.controller';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// // Admin Registration
// router.post('/register', registerAdmin);
// // Admin Login
// router.post('/login', adminLogin);
// export default router;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../auth/auth.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = express_1.default.Router();
// Public routes
router.post('/register', auth_controller_1.registerUser);
router.post('/admin/register', auth_middleware_1.adminAuthMiddleware, auth_controller_1.registerAdmin);
router.post('/login', auth_controller_1.loginUser);
exports.default = router;
