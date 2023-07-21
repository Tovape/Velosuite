import * as noteController from "../controllers/note.controller.js";
import { Router } from "express";
import { authorization } from "../middleware/middleware.js";
const router = Router();

router.get("/", authorization, noteController.getNotes)

router.post("/", authorization, noteController.createNote)

router.put("/", authorization, noteController.updateNote)

router.delete("/", authorization, noteController.deleteNote)

export default router;