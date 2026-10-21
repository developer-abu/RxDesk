import { Router } from "express";
import * as chamberController from "../controllers/chamberController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import { createChamberSchema } from "../validations/chamberValidation.js";

const router = Router();

router.use(authenticate);

router.post("/", validateRequest(createChamberSchema), chamberController.handleCreateChamber);
router.get("/", chamberController.handleGetChambers);
router.get("/:chamberId", chamberController.handleGetChamber);

export default router;

