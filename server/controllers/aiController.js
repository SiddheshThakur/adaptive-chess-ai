import { Chess } from "chess.js";
import { getBestMove } from "../ai/minimax.js";
import { evaluatePlayerMove } from "../ai/evaluateMove.js";
import { updateDifficulty } from "../ai/difficultyManager.js";
import { loadSkillModel, predictSkill } from "../ai/skillModel.js";


// Load ML model once (singleton)
await loadSkillModel();

export const playerMove = (req, res) => {
  try {
    const { fen, move, stats, difficulty: currentDifficulty } = req.body;
    const { from, to, promotion = "q" } = move || {};

    if (!fen || !from || !to) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1. Reconstruct Game for Validation & Player Move
    const game = new Chess(fen);

    // Store FEN before move for evaluation
    const beforeFen = game.fen();

    // Attempt move
    const moveResult = game.move({ from, to, promotion });

    if (!moveResult) {
      return res.status(400).json({ error: "Illegal move" });
    }

    const playerMoveNotation = moveResult.san;

    // 2. Evaluate Player Move
    // evaluation needs separate instances
    const beforeGame = new Chess(beforeFen);
    const afterGame = new Chess(game.fen());

    const evaluation = evaluatePlayerMove(beforeGame, afterGame);

    // 3. Update Stats
    // default to 0 if undefined (first move)
    let { moves = 0, totalAccuracy = 0, blunders = 0 } = stats || {};

    moves += 1;
    totalAccuracy += evaluation.accuracy;
    if (evaluation.blunder) blunders += 1;

    const avgAccuracy = moves > 0 ? totalAccuracy / moves : 0;

    // 4. Update Difficulty
    const newDifficulty = updateDifficulty(
      { accuracy: avgAccuracy, blunders: blunders },
      currentDifficulty || "easy"
    );

    // 5. AI Move
    let aiMoveNotation = null;

    if (!game.isGameOver()) {
      const depthMap = {
        easy: 2,
        medium: 3,
        hard: 4,
      };

      const d = depthMap[newDifficulty] || 2;

      const aiMove = getBestMove(game, d);
      if (aiMove) {
        const m = game.move(aiMove);
        aiMoveNotation = m ? m.san : null;
      }
    }

    // 6. Predict Skill
    const skill = predictSkill({
      accuracy: avgAccuracy,
      blunders: blunders,
      moves: moves,
    });

    res.json({
      fen: game.fen(),
      stats: {
        moves,
        totalAccuracy,
        accuracy: Math.round(avgAccuracy),
        blunders,
        difficulty: newDifficulty,
        skill,
      },
      moveNotation: aiMoveNotation || playerMoveNotation,
    });

  } catch (error) {
    console.error("Error in playerMove:", error);
    // Return the original FEN so the client can recover
    res.status(500).json({
      error: "Internal Server Error",
      message: "AI failed to calculate move",
      fen: req.body.fen
    });
  }
};

export const resetGame = (req, res) => {
  const game = new Chess();
  res.json({
    fen: game.fen(),
    stats: {
      accuracy: 0,
      blunders: 0,
      difficulty: "easy",
      skill: "Beginner",
      moves: 0,
      totalAccuracy: 0
    }
  });
};
