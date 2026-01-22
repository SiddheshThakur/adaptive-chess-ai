# Adaptive Chess AI

A portfolio project demonstrating an adaptive chess AI using MERN and TensorFlow.js.

## How to Play

### One-Click Start (Windows)
Double-click the `start-game.bat` file in this folder. It will open two windows (Server and Client).

### Manual Start
1. **Server**:
   ```bash
   cd server
   npm install
   npm run dev
   ```
2. **Client**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Architecture
- **Client**: React + Vite (Port 5173)
- **Server**: Node.js + Express (Port 5001)
- **AI**: Minimax algorithm running on the server.

## Troubleshooting
If the game doesn't load or verify connection:
1. Ensure both terminal windows from `start-game.bat` are open.
2. If "AI Disconnected" appears, restart the server.

