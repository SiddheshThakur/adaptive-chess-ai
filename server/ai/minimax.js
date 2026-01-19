import { Chess } from "chess.js";

// Piece-square tables for positional evaluation
const pawnTable = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
];

const knightTable = [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
];

const bishopTable = [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
];

const rookTable = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0],
];

const queenTable = [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20],
];

const kingTable = [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20],
];

const pieceSquareTables = {
    p: pawnTable,
    n: knightTable,
    b: bishopTable,
    r: rookTable,
    q: queenTable,
    k: kingTable,
};

function getPieceValue(piece, row, col) {
    const pieceValues = {
        p: 100,
        n: 320,
        b: 330,
        r: 500,
        q: 900,
        k: 20000,
    };

    const baseValue = pieceValues[piece.type];
    const table = pieceSquareTables[piece.type];

    // Flip table for black pieces
    const tableRow = piece.color === "w" ? 7 - row : row;
    const positionValue = table[tableRow][col];

    return piece.color === "w" ? baseValue + positionValue : -(baseValue + positionValue);
}

function evaluateBoard(game) {
    if (game.isCheckmate()) {
        return game.turn() === "w" ? -100000 : 100000;
    }

    if (game.isDraw() || game.isStalemate()) {
        return 0;
    }

    let score = 0;
    const board = game.board();

    // Material and position evaluation
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece) {
                score += getPieceValue(piece, row, col);
            }
        }
    }

    return score;
}

function minimax(game, depth, alpha, beta, isMaximizing) {
    if (depth === 0 || game.isGameOver()) {
        return evaluateBoard(game);
    }

    const moves = game.moves();

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let move of moves) {
            game.move(move);
            const evalScore = minimax(game, depth - 1, alpha, beta, false);
            game.undo();
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) {
                break; // Beta cutoff
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let move of moves) {
            game.move(move);
            const evalScore = minimax(game, depth - 1, alpha, beta, true);
            game.undo();
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) {
                break; // Alpha cutoff
            }
        }
        return minEval;
    }
}

export function getBestMove(game, depth) {
    let bestMove = null;
    // If it's white's turn, we want to Maximize. If black's turn, Minimize.
    const isMaximizingPlayer = game.turn() === 'w';

    let bestValue = isMaximizingPlayer ? -Infinity : Infinity;
    const moves = game.moves();

    // Shuffle moves for variety
    for (let i = moves.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [moves[i], moves[j]] = [moves[j], moves[i]];
    }

    for (let move of moves) {
        game.move(move);
        // If we are maximizing, the next level (opponent) will minimize, so we pass false.
        // If we are minimizing, the next level (opponent) will maximize, so we pass true.
        const moveValue = minimax(game, depth - 1, -Infinity, Infinity, !isMaximizingPlayer);
        game.undo();

        if (isMaximizingPlayer) {
            if (moveValue > bestValue) {
                bestValue = moveValue;
                bestMove = move;
            }
        } else {
            if (moveValue < bestValue) {
                bestValue = moveValue;
                bestMove = move;
            }
        }
    }
    return bestMove;
}

