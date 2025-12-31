import { Chess } from "chess.js";

function evaluateBoard(game) {
    const pieceValues = {
        p: 1,
        n: 3,
        b: 3,
        r: 5,
        q: 9,
        k: 0,
    };

    let score = 0;

    game.board().forEach((row) => {
        row.forEach((piece) => {
            if (piece) {
                const value = pieceValues[piece.type];
                score += piece.color === "w" ? value : -value;
            }
        });
    });
    return score;
}

function minimax(game, depth, isMaximizing) {
    if (depth ===0 || game.isGameOver()) {
        return evaluateBoard(game);
    }
    const moves = game.moves();

    if(isMaximizing) {
        let maxEval = -Infinity;
        for(let move of moves) {
            game.move(move);
            const evalScore = minimax(game, depth - 1, false);
            game.undo();
            maxEval = Math.max(maxEval, evalScore);
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let move of moves) {
            game.move(move);
            const evalScore = minimax (game, depth - 1, true);
            game.undo();
            minEval = Math.min(minEval, evalScore);
        }
        return minEval;
    }
}

export function getBestMove(game, depth) {
    let bestMove = null;
    let bestValue = -Infinity;

    for (let move of game.moves()) {
        game.move(move);
        const moveValue = minimax(game, depth - 1, false);
        game.undo();

        if(moveValue > bestValue) {
            bestValue = moveValue;
            bestMove = move;
        }
    }
    return bestMove;
}
