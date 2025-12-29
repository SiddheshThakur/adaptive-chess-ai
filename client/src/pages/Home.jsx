import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div style={{ padding: "2rem"}}>
            <h1>Adaptive Chess AI</h1>
            <p>
                A chess game where the AI adapts its difficulty based on your skill level
                in real time using machine learning.
            </p>

            <button 
            onClick={() => navigate("/play")}
            style={{ padding: "10px 20px", fontSize: "16px" }}
            >
                Play Game
            </button>
        </div>
    )
}