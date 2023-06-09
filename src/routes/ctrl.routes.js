import * as ctrlController from "../controllers/ctrl.controller.js";
import { Router } from "express";
const router = Router();

router.post("/", ctrlController.ctrlSetup)
router.post("/changeTheme", ctrlController.ctrlThemeChange)
router.post("/changeWeather", ctrlController.ctrlWeatherChange)

export default router;