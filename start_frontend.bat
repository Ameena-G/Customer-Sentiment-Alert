@echo off
echo Starting SentiGuard Frontend...
cd frontend
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo.
echo ========================================
echo   SentiGuard Frontend Starting...
echo   URL: http://localhost:3000
echo ========================================
echo.
call npm run dev
