import * as noteController from "../controllers/note.controller.js";
import { Router } from "express";
import { verifyToken } from "../middleware/middleware.js";
const router = Router();

router.get("/", noteController.getNote)

router.post("/", verifyToken, noteController.createNote)

router.put("/:postId", verifyToken, noteController.updateNote)

router.delete("/:postId", verifyToken, noteController.deleteNote)

export default router;