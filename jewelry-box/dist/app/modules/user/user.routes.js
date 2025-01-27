"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
// Register user route
router.post('/register', user_controller_1.UserController.register);
// Login user route
router.post('/login', user_controller_1.UserController.login);
exports.default = router;
