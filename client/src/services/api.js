import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

export const makePlayerMove = ({ fen, move, stats, difficulty }) =>
  API.post("/ai/move", { fen, move, stats, difficulty });

export const resetGame = () => API.post("/ai/reset");
