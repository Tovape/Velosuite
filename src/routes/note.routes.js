import * as noteController from "../controllers/note.controller.js";
import { Router } from "express";
const router = Router();

router.get("/", noteController.getNotes)

router.post("/", noteController.createNote)

router.put("/:noteId", noteController.updateNote)

router.delete("/:noteId", noteController.deleteNote)

export default router;