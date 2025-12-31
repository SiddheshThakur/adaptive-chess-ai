import express from "express";
import { playerMove, resetGame } from "../controllers/aiController.js";

const router = express.Router();

router.post("/move", playerMove);
router.post("/reset", resetGame);

export default router;
