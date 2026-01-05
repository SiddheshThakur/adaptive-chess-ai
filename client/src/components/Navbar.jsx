import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav
        style={{
            padding: "1rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #ddd",
        }}
        >

            <strong>Adaptive Chess AI</strong>

            <div style={{display: "flex", gap: "1rem"}}>
                <Link to = "/">Home</Link>
                <Link to = "/play">Play</Link>
                <Link to = "/about">How It works</Link>
            </div>

        </nav>
    )
}