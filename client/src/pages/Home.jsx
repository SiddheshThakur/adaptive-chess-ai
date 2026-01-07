import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "3rem", maxWidth: "900px", margin: "auto" }}>
      <h1>Adaptive Chess AI</h1>

      <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
        An intelligent chess game where the AI dynamically adapts its difficulty
        based on your playing style and skill level using real-time analysis and
        machine learning.
      </p>

      <button
        onClick={() => navigate("/play")}
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        ▶ Enter Game
      </button>

      <hr style={{ margin: "40px 0" }} />

      <h2>Key Features</h2>

      <ul style={{ fontSize: "16px", lineHeight: "1.8" }}>
        <li>♟️ Play against an AI opponent</li>
        <li>📊 Real-time move analysis</li>
        <li>🧠 AI difficulty adapts automatically</li>
        <li>🤖 Machine learning based skill detection</li>
        <li>⚙️ Built using MERN & TensorFlow.js</li>
      </ul>
    </div>
  );
}
