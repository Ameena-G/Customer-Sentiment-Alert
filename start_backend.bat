@echo off
echo Starting SentiGuard Backend...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
echo Installing dependencies...
pip install -r requirements.txt --quiet
echo.
echo ========================================
echo   SentiGuard Backend Starting...
echo   URL: http://localhost:8000
echo ========================================
echo.
python app.py
