import { Chess } from "chess.js";
import { getBestMove } from "./ai/minimax.js";

console.log("Starting AI Test...");

// Setup a simple board position where white has a clear move
// White pawn on e2, black pawn on e7. White to move.
const fen = "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2";
const game = new Chess(fen);

console.log("Initial FEN:", game.fen());

try {
    console.log("Calculating best move with depth 2...");
    const bestMove = getBestMove(game, 2);

    if (bestMove) {
        console.log("Best move found:", bestMove);
        console.log("Move details:", JSON.stringify(bestMove));
    } else {
        console.error("No best move found!");
    }

    // Verify game state hasn't been corrupted
    if (game.fen() !== fen) {
        console.error("CRITICAL ERROR: Game state was modified during search!");
        console.error("Expected:", fen);
        console.error("Actual:  ", game.fen());
    } else {
        console.log("SUCCESS: Game state preserved.");
    }

} catch (error) {
    console.error("Test crashed:", error);
}
