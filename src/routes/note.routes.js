import * as noteController from "../controllers/note.controller.js";
import { Router } from "express";
const router = Router();

router.get("/", verifyToken, noteController.getNotes)

router.post("/", verifyToken, noteController.createNote)

router.put("/", verifyToken, noteController.updateNote)

router.delete("/", verifyToken, noteController.deleteNote)

export default router;