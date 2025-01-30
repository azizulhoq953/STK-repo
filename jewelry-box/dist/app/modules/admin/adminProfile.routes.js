"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminProfile_controller_1 = require("./adminProfile.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const router = (0, express_1.Router)();
router.get("/admin/profile", auth_middleware_1.isAuthenticated, auth_middleware_1.isAdmin, adminProfile_controller_1.AdminProfileController.getProfile);
router.put("/admin/profile", auth_middleware_1.isAuthenticated, auth_middleware_1.isAdmin, adminProfile_controller_1.AdminProfileController.updateProfile);
exports.default = router;
