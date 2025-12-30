import { Chess } from "chess.js";

let game = new Chess();

export const getGameState = (req, res) => {
    res.json({
        fen: game.fen(),
        isGameOver: game.isGameOver(),
        turn: game.turn(),
        
    });
};

export const makeMove = (req, res) => {
    const { from, to} = req.body;

    const move = game.move({ from, to, promotion: "q" });

    if (move === null) {
        return res.status(400).json({ error: "Invalid move" });
    }
    
    res.json({
        fen: game.fen(),
        move,
        isGameOver: game.isGameOver(),
    });        
};

export const resetGame = (req, res) => {
    game.reset();
    res.json({ 
        fen: game.fen(),
        isGameOver: game.isGameOver(),
        turn: game.turn(),
    });
};