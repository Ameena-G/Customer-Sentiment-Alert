@echo off
echo ========================================
echo   Starting SentiGuard Full Stack
echo ========================================
echo.
echo Starting Backend in new window...
start "SentiGuard Backend" cmd /k "cd backend && venv\Scripts\activate && python app.py"
timeout /t 5 /nobreak > nul
echo.
echo Starting Frontend in new window...
start "SentiGuard Frontend" cmd /k "cd frontend && npm run dev"
echo.
echo ========================================
echo   Both services are starting!
echo   Backend: http://localhost:8000
echo   Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to close this window...
pause > nul
