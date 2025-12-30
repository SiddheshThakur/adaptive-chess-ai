import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5001/api",
});

export const getGameState = () => API.get("/game/state");
export const makeMove = (from, to) =>
    API.post("/game/move", { from, to });

export const resetGame = () => API.post("/game/reset");