export default function About() {
  return (
    <div style={{ padding: "3rem", maxWidth: "900px", margin: "auto" }}>
      <h1>How the Adaptive AI Works</h1>

      <h3>1. Move Analysis</h3>
      <p>
        Every move you play is analyzed by the system to detect mistakes and
        blunders using material evaluation.
      </p>

      <h3>2. Player Statistics</h3>
      <p>
        The game tracks accuracy, blunders, and move count to understand your
        playing behavior over time.
      </p>

      <h3>3. Adaptive Difficulty</h3>
      <p>
        Based on your performance, the AI dynamically adjusts its difficulty
        level during the game instead of using a fixed setting.
      </p>

      <h3>4. Machine Learning</h3>
      <p>
        A TensorFlow.js model classifies your skill level as Beginner,
        Intermediate, or Advanced in real time.
      </p>

      <h3>5. Hybrid AI System</h3>
      <p>
        The project combines classical chess algorithms (minimax) with machine
        learning for intelligent and explainable behavior.
      </p>
    </div>
  );
}
