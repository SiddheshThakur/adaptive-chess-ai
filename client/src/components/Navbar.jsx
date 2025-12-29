import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "1rem", backgroundColor: "1px solid #ddd" }}>
      <Link to="/">Home</Link>
      <Link to="/play">Play</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}   
