import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { makePlayerMove, resetGame } from "../services/api";

export default function ChessBoard() {
  const [fen, setFen] = useState("start");
  const [difficulty, setDifficulty] = useState("easy");

  const onDrop = async (from, to) => {
    try {
      const res = await makePlayerMove(from, to, difficulty);
      setFen(res.data.fen);
      return true;
    } catch {
      return false;
    }
  };

  const reset = async () => {
    const res = await resetGame();
    setFen(res.data.fen);
  };

  return (
    <div>
      <label>
        Difficulty:{" "}
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>

      <Chessboard position={fen} onPieceDrop={onDrop} />

      <button onClick={reset} style={{ marginTop: "10px" }}>
        Reset Game
      </button>
    </div>
  );
}
