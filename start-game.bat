@echo off
echo Starting Adaptive Chess AI...

echo Starting Server...
start "Chess Server" cmd /k "cd server && npm run dev"

echo Starting Client...
start "Chess Client" cmd /k "cd client && npm run dev"

echo.
echo Game works! 
echo Server running on http://localhost:5001
echo Client running on http://localhost:5173
echo.
echo If windows close immediately, there was an error. Check if 'npm install' was run in both folders.
