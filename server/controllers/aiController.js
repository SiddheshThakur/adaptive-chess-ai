import { Chess } from "chess.js";
import { getBestMove } from "../ai/minimax.js";
import { evaluatePlayerMove } from "../ai/evaluateMove.js";
import { updateDifficulty } from "../ai/difficultyManager.js";
import { loadSkillModel, predictSkill } from "../ai/skillModel.js";

let game = new Chess();

let playerStats = {
  moves: 0,
  totalAccuracy: 0,
  blunders: 0,
};

let difficulty = "easy";

// load ML model once
await loadSkillModel();

export const playerMove = (req, res) => {
  const { from, to } = req.body;

  const beforeMove = new Chess(game.fen());
  const move = game.move({ from, to, promotion: "q" });

  if (!move) {
    return res.status(400).json({ error: "Illegal move" });
  }

  const afterMove = new Chess(game.fen());
  const evaluation = evaluatePlayerMove(beforeMove, afterMove);

  playerStats.moves += 1;
  playerStats.totalAccuracy += evaluation.accuracy;
  if (evaluation.blunder) playerStats.blunders += 1;

  const avgAccuracy =
    playerStats.totalAccuracy / playerStats.moves;

  difficulty = updateDifficulty(
    { accuracy: avgAccuracy, blunders: playerStats.blunders },
    difficulty
  );

  // AI move
  if (!game.isGameOver()) {
    const depthMap = {
      easy: 2,
      medium: 3,
      hard: 4,
    };

    const aiMove = getBestMove(game, depthMap[difficulty]);
    if (aiMove) game.move(aiMove);
  }

  const skill = predictSkill({
    accuracy: avgAccuracy,
    blunders: playerStats.blunders,
    moves: playerStats.moves,
  });

  res.json({
    fen: game.fen(),
    stats: {
      accuracy: Math.round(avgAccuracy),
      blunders: playerStats.blunders,
      difficulty,
      skill,
    },
  });
};

export const resetGame = (req, res) => {
  game.reset();
  playerStats = { moves: 0, totalAccuracy: 0, blunders: 0 };
  difficulty = "easy";
  res.json({ fen: game.fen() });
};
