export function updateDifficulty(stats, currentDifficulty) {
    const { accuracy, blunders} = stats;

    let difficulty = currentDifficulty;

    if (accuracy > 85 && blunders === 0) {
        difficulty = "hard";
    } else if (accuracy > 70) {
        difficulty = "medium";
    } else {
        difficulty = "easy";
    }

    return difficulty;
}