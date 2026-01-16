import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { makePlayerMove, resetGame } from "../services/api";
import "./ChessBoard.css";

export default function ChessBoard() {
  const [fen, setFen] = useState("start");
  const [stats, setStats] = useState({
    accuracy: 0,
    blunders: 0,
    difficulty: "easy",
    skill: "Beginner",
    moves: 0,
    totalAccuracy: 0,
  });
  const [thinking, setThinking] = useState(false);
  const [gameOver, setGameOver] = useState(null);
  const [inCheck, setInCheck] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [playerColor, setPlayerColor] = useState("white");
  const [gameStarted, setGameStarted] = useState(false);
  const [moveFrom, setMoveFrom] = useState("");
  const [moveTo, setMoveTo] = useState(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [optionSquares, setOptionSquares] = useState({});

  // Check game status whenever FEN changes
  useEffect(() => {
    if (fen !== "start") {
      const game = new Chess(fen);

      // Check for game over
      if (game.isGameOver()) {
        let result = "";
        if (game.isCheckmate()) {
          const winner = game.turn() === "w" ? "Black" : "White";
          result = `${winner} wins by checkmate! 🎉`;
        } else if (game.isStalemate()) {
          result = "Draw by stalemate! 🤝";
        } else if (game.isThreefoldRepetition()) {
          result = "Draw by threefold repetition! 🤝";
        } else if (game.isInsufficientMaterial()) {
          result = "Draw by insufficient material! 🤝";
        } else {
          result = "Game drawn! 🤝";
        }
        setGameOver(result);
      } else {
        setGameOver(null);
      }

      // Check if in check
      setInCheck(game.inCheck());
    }
  }, [fen]);

  const startGame = async (color) => {
    setPlayerColor(color);
    setGameStarted(true);
    setMoveHistory([]);

    // If player chose black, AI makes first move
    if (color === "black") {
      setThinking(true);
      try {
        const res = await resetGame();
        setFen(res.data.fen);
        setStats({
          accuracy: 0,
          blunders: 0,
          difficulty: "easy",
          skill: "Beginner",
          moves: 0,
          totalAccuracy: 0,
        });
      } catch (e) {
        console.error("Failed to start game", e);
      } finally {
        setThinking(false);
      }
    } else {
      const res = await resetGame();
      setFen(res.data.fen);
      setStats({
        accuracy: 0,
        blunders: 0,
        difficulty: "easy",
        skill: "Beginner",
        moves: 0,
        totalAccuracy: 0,
      });
    }
  };

  function getMoveOptions(square) {
    const game = new Chess(fen);
    const moves = game.moves({
      square,
      verbose: true,
    });

    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares = {};
    moves.forEach((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick(square) {
    if (gameOver || thinking) return;

    const game = new Chess(fen);
    const playerToMove = playerColor === "white" ? "w" : "b";

    if (game.turn() !== playerToMove) return;

    // If no piece selected yet
    if (!moveFrom) {
      const piece = game.get(square);
      if (piece && piece.color === playerToMove) {
        setMoveFrom(square);
        getMoveOptions(square);
      }
      return;
    }

    // If clicking the same square, deselect
    if (square === moveFrom) {
      setMoveFrom("");
      setOptionSquares({});
      return;
    }

    // Try to make the move
    const moves = game.moves({
      square: moveFrom,
      verbose: true,
    });

    const foundMove = moves.find(
      (m) => m.from === moveFrom && m.to === square
    );

    if (!foundMove) {
      // Invalid move, maybe selecting another piece
      const piece = game.get(square);
      if (piece && piece.color === playerToMove) {
        setMoveFrom(square);
        getMoveOptions(square);
      } else {
        setMoveFrom("");
        setOptionSquares({});
      }
      return;
    }

    // Check if it's a pawn promotion
    const piece = game.get(moveFrom);
    if (
      piece.type === "p" &&
      ((piece.color === "w" && square[1] === "8") ||
        (piece.color === "b" && square[1] === "1"))
    ) {
      setMoveTo(square);
      setShowPromotionDialog(true);
      return;
    }

    // Make the move
    makeMove(moveFrom, square);
  }

  async function makeMove(from, to, promotion = "q") {
    setMoveFrom("");
    setOptionSquares({});

    try {
      setThinking(true);
      const res = await makePlayerMove({
        fen,
        move: { from, to, promotion },
        stats,
        difficulty: stats.difficulty
      });

      setFen(res.data.fen);
      setStats(res.data.stats);

      // Add to move history
      if (res.data.moveNotation) {
        setMoveHistory((prev) => [...prev, res.data.moveNotation]);
      }

      return true;
    } catch (e) {
      console.error("Move failed", e);
      // If server returns the original FEN on error, use it to reset
      if (e.response && e.response.data && e.response.data.fen) {
        setFen(e.response.data.fen);
      }
      alert("AI failed to make a move. Please try again.");
      return false;
    } finally {
      setThinking(false);
    }
  }

  function onPieceDrop(sourceSquare, targetSquare) {
    if (gameOver || thinking) return false;

    const game = new Chess(fen);
    const playerToMove = playerColor === "white" ? "w" : "b";

    if (game.turn() !== playerToMove) return false;

    // Check if it's a pawn promotion
    const piece = game.get(sourceSquare);
    if (
      piece &&
      piece.type === "p" &&
      ((piece.color === "w" && targetSquare[1] === "8") ||
        (piece.color === "b" && targetSquare[1] === "1"))
    ) {
      setMoveFrom(sourceSquare);
      setMoveTo(targetSquare);
      setShowPromotionDialog(true);
      return false;
    }

    makeMove(sourceSquare, targetSquare);
    return true;
  }

  function handlePromotion(piece) {
    setShowPromotionDialog(false);
    makeMove(moveFrom, moveTo, piece);
    setMoveTo(null);
  }

  const reset = async () => {
    setGameStarted(false);
    setFen("start");
    setStats({
      accuracy: 0,
      blunders: 0,
      difficulty: "easy",
      skill: "Beginner",
      moves: 0,
      totalAccuracy: 0,
    });
    setGameOver(null);
    setMoveHistory([]);
    setMoveFrom("");
    setOptionSquares({});
  };

  if (!gameStarted) {
    return (
      <div className="chess-container">
        <div className="color-selection">
          <h2>Choose Your Color</h2>
          <div className="color-buttons">
            <button className="color-btn white-btn" onClick={() => startGame("white")}>
              <span className="piece-icon">♔</span>
              Play as White
            </button>
            <button className="color-btn black-btn" onClick={() => startGame("black")}>
              <span className="piece-icon">♚</span>
              Play as Black
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chess-container">
      <div className="game-layout">
        <div className="board-section">
          <div className="status-bar">
            {gameOver ? (
              <div className="game-over-banner">{gameOver}</div>
            ) : inCheck ? (
              <div className="check-banner">⚠️ CHECK!</div>
            ) : thinking ? (
              <div className="thinking-banner">🤔 AI is thinking...</div>
            ) : (
              <div className="turn-banner">
                {playerColor === "white" && fen.includes(" w ") ? "Your turn" :
                  playerColor === "black" && fen.includes(" b ") ? "Your turn" : "AI's turn"}
              </div>
            )}
          </div>

          <div className="board-wrapper">
            <Chessboard
              position={fen}
              onPieceDrop={onPieceDrop}
              onSquareClick={onSquareClick}
              customSquareStyles={optionSquares}
              boardOrientation={playerColor}
              arePiecesDraggable={!thinking && !gameOver}
            />
          </div>

          <div className="game-controls">
            <button onClick={reset} className="control-btn reset-btn">
              🔄 New Game
            </button>
          </div>
        </div>

        <div className="info-section">
          <div className="stats-panel">
            <h3>Player Stats</h3>
            <div className="stat-item">
              <span className="stat-label">Skill Level:</span>
              <span className="stat-value skill">{stats.skill}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Accuracy:</span>
              <span className="stat-value">{stats.accuracy}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Blunders:</span>
              <span className="stat-value">{stats.blunders}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">AI Difficulty:</span>
              <span className="stat-value difficulty">{stats.difficulty}</span>
            </div>
          </div>

          <div className="moves-panel">
            <h3>Move History</h3>
            <div className="moves-list">
              {moveHistory.length === 0 ? (
                <p className="no-moves">No moves yet</p>
              ) : (
                moveHistory.map((move, index) => (
                  <div key={index} className="move-item">
                    <span className="move-number">{Math.floor(index / 2) + 1}.</span>
                    <span className="move-notation">{move}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showPromotionDialog && (
        <div className="promotion-overlay">
          <div className="promotion-dialog">
            <h3>Choose Promotion Piece</h3>
            <div className="promotion-pieces">
              <button onClick={() => handlePromotion("q")} className="promotion-btn">
                {playerColor === "white" ? "♕" : "♛"} Queen
              </button>
              <button onClick={() => handlePromotion("r")} className="promotion-btn">
                {playerColor === "white" ? "♖" : "♜"} Rook
              </button>
              <button onClick={() => handlePromotion("b")} className="promotion-btn">
                {playerColor === "white" ? "♗" : "♝"} Bishop
              </button>
              <button onClick={() => handlePromotion("n")} className="promotion-btn">
                {playerColor === "white" ? "♘" : "♞"} Knight
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
