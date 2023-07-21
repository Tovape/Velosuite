import * as ctrlController from "../controllers/ctrl.controller.js";
import { Router } from "express";
import { authorization } from "../middleware/middleware.js";
const router = Router();

router.post("/", authorization,  ctrlController.ctrlSetup)
router.post("/changeTheme", authorization, ctrlController.ctrlThemeChange)
router.post("/changeWeather", authorization, ctrlController.ctrlWeatherChange)
router.post("/changeClock", authorization, ctrlController.ctrlClockChange)
router.post("/changeAccount", authorization, ctrlController.ctrlChangeAccount)

export default router;