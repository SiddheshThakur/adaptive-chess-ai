import express from "express";
import {
    getGameState,
    makeMove,
    resetGame,
} from "../controllers/gameController.js";

const router = express.Router();

router.get("/state", getGameState);
router.post("/move", makeMove);
router.post("/reset", resetGame);

export default router;