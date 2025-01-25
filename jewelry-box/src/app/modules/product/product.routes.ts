import { Router } from "express";
import { ProductController } from "./product.controller";

const router = Router();

router.post("/", ProductController.create);
router.get("/", ProductController.findAll);
router.get("/:id", ProductController.findById);
router.put("/:id", ProductController.update);
router.delete("/:id", ProductController.delete);

export default router;
