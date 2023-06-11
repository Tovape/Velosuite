import * as ctrlController from "../controllers/ctrl.controller.js";
import { Router } from "express";
const router = Router();

router.get("/", ctrlController.ctrlSetup)

export default router;