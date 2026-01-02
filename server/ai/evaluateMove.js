import { Chess } from "chess.js";

export function evaluatePlayerMove(gameBefore, gameAfter) {
  const pieceValues = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0,
  };

  function material(game) {
    let score = 0;
    game.board().forEach(row => {
      row.forEach(piece => {
        if (piece) {
          score += piece.color === "w"
            ? pieceValues[piece.type]
            : -pieceValues[piece.type];
        }
      });
    });
    return score;
  }

  const beforeScore = material(gameBefore);
  const afterScore = material(gameAfter);

  const diff = afterScore - beforeScore;

  let result = {
    accuracy: 100,
    blunder: false,
  };

  if (diff < -3) {
    result.accuracy = 30;
    result.blunder = true;
  } else if (diff < -1) {
    result.accuracy = 60;
  } else if (diff < 0) {
    result.accuracy = 80;
  }

  return result;
}
