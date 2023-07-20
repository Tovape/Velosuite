import * as ctrlController from "../controllers/ctrl.controller.js";
import { Router } from "express";
import { verifyToken } from "../middleware/middleware.js";
const router = Router();

router.post("/", verifyToken,  ctrlController.ctrlSetup)
router.post("/changeTheme", verifyToken, ctrlController.ctrlThemeChange)
router.post("/changeWeather", verifyToken, ctrlController.ctrlWeatherChange)
router.post("/changeClock", verifyToken, ctrlController.ctrlClockChange)

export default router;