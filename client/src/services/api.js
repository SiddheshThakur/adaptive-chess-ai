import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

export const makePlayerMove = (from, to, difficulty) =>
  API.post("/ai/move", { from, to, difficulty });

export const resetGame = () => API.post("/ai/reset");
