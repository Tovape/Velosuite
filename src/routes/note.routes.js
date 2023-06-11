import * as noteController from "../controllers/note.controller.js";
import { Router } from "express";
const router = Router();

router.get("/", noteController.getNote)

router.post("/", noteController.createNote)

router.put("/:postId", noteController.updateNote)

router.delete("/:postId", noteController.deleteNote)

export default router;