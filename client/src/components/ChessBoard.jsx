import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { makePlayerMove, resetGame } from "../services/api";

export default function ChessBoard() {
  const [fen, setFen] = useState("start");
  const [stats, setStats] = useState({
    accuracy: 0,
    blunders: 0,
    difficulty: "easy",
  });

  const onDrop = async (from, to) => {
    try {
      const res = await makePlayerMove(from, to);
      setFen(res.data.fen);
      setStats(res.data.stats);
      return true;
    } catch {
      return false;
    }
  };

  const reset = async () => {
    const res = await resetGame();
    setFen(res.data.fen);
    setStats({ accuracy: 0, blunders: 0, difficulty: "easy" });
  };

  return (
    <div>
      <h4>AI Difficulty: {stats.difficulty}</h4>
      <p>Accuracy: {stats.accuracy}%</p>
      <p>Blunders: {stats.blunders}</p>

      <Chessboard position={fen} onPieceDrop={onDrop} />

      <button onClick={reset} style={{ marginTop: "10px" }}>
        Reset Game
      </button>
    </div>
  );
}
