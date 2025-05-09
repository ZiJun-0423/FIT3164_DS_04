@echo off
cd frontend/stackblitz
echo Installing frontend dependencies...
call npm install

echo Starting frontend server...
call npm run dev
