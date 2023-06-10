import { Router } from "express";
import * as authCtrl from "../controllers/auth.controller.js";
import { checkDuplicate } from "../middleware/middleware.js";
const router = Router()

router.post("/signup", [checkDuplicate], authCtrl.signUp)
router.post("/signin", authCtrl.signIn)

export default router;