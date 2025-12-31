import { Chess } from "chess.js";
import { getBestMove } from "../ai/minimax.js";

let game = new Chess();

export const playerMove = (req, res) => {
    const { from, to, difficulty } = req.body;
    
    const move = game.move({ from, to, promotion: "q" });

    if(!move) {
        return res.status(400).json({ error: "Invalid move" });
    }

    //AI move
    if (!game.isGameOver()) {
        const depthMap = {
            easy: 2,
            medium: 3,
            hard: 4,
        };

        const depth = depthMap[difficulty] || 2;
        const aiMove = getBestMove(game, depth);
        if(aiMove) game.move(aiMove);
    }

    res.json({
        fen: game.fen(),
        isGameOver: game.isGameOver(),
    });

};

    export const resetGame = (req, res) => {
        game.reset();
        res.json({fen: game.fen() });
    };