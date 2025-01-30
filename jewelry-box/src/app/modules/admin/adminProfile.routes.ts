import { Router } from "express";
import { AdminProfileController } from "./adminProfile.controller";
import { isAuthenticated, isAdmin } from "../auth/auth.middleware";

const router = Router();

router.get("/admin/profile", isAuthenticated, isAdmin, AdminProfileController.getProfile);
router.put("/admin/profile", isAuthenticated, isAdmin, AdminProfileController.updateProfile);
export default router;