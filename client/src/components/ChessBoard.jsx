import {useEffect, useState} from "react";
import { Chessboard } from "react-chessboard";
import { getGameState, makeMove, resetGame } from "../services/api";

export default function ChessBoard() {
    const [fen, setFen] = useState("start");
    const[status, setStatus] = useState("");

    useEffect(() => {
        loadGame();

}, []);

const loadGame = async () => {
    const res = await getGameState();
    setFen(res.data.fen);
};

const onDrop = async (sourceSquare, targetSquare) => {
    try {
        const res = await makeMove(sourceSquare, targetSquare);
        setFen(res.data.fen);
        setStatus("");
        return true;
    } catch(err) {
        setStatus("Illegal move")
        return false;
    }
};

return (
    <div>
        <Chessboard position={fen} onPieceDrop={onDrop}/>
        <p style={{ color: "red" }}>{status}</p>
    </div>
);

}