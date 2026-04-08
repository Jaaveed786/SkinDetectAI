@echo off
TITLE SkinDetect.AI — Full Stack Launcher
COLOR 0B

echo ==========================================
echo    SkinDetect.AI — Smart Dermatology
echo ==========================================
echo.

:: 1. GLOBAL DEPENDENCY CHECK
echo [1/3] Checking System Prerequisites...

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found! 
    echo Please install Python 3.9+ from https://www.python.org/
    pause
    exit /b
)

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found! 
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b
)

echo [OK] Prerequisites met.
echo.

:: 2. BACKEND SETUP
echo [2/3] Preparing Backend (FastAPI)...
pushd backend

if not exist venv (
    echo [INFO] Creating Python Virtual Environment...
    python -m venv venv
    call venv\Scripts\activate
    echo [INFO] Installing Backend Dependencies...
    pip install -r requirements.txt
) else (
    echo [OK] Backend environment ready.
)

:: Launch Backend in separate window
echo [INFO] Launching Backend Server...
start "SkinDetect Backend" cmd /k "title [SkinDetect] Backend Server && cd /d %~dp0backend && venv\Scripts\activate && python main.py || pause"
popd
echo [OK] Backend initialization triggered.
echo.

:: 3. FRONTEND SETUP
echo [3/3] Preparing Frontend (React/Vite)...
pushd web-app

if not exist node_modules (
    echo [INFO] Installing Frontend Dependencies...
    npm install
) else (
    echo [OK] node_modules detected.
)

:: Launch Frontend in separate window
echo [INFO] Launching Frontend Server...
start "SkinDetect Frontend" cmd /k "title [SkinDetect] Frontend Server && cd /d %~dp0web-app && npm run dev || pause"
popd
echo [OK] Frontend initialization triggered.
echo.

:: FINAL STATUS
echo ==========================================
echo    SYSTEM INITIALIZED SUCCESSFULLY
echo ==========================================
echo.
echo Dashboard: http://localhost:5173/SkinDetectAI/
echo Backend:   http://localhost:8000
echo.
echo IMPORTANT: 
echo - If a server fails to start, its window will remain open for debugging.
echo - Ensure your .env files are configured in both folders.
echo.
echo Press any key to close this launcher (servers will keep running)...
pause >nul
