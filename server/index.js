import express from "express";
import cors from "cors";
import gameRoutes from "./routes/gameRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/game", gameRoutes);

app.get("/", (req, res) => {
  res.send("Adaptive Chess AI backend running");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
