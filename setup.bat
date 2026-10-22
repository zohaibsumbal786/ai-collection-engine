@echo off
echo ========================================
echo AI Collection Engine - Setup Script
echo ========================================
echo.

echo [1/5] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install root dependencies
    exit /b 1
)

echo.
echo [2/5] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install backend dependencies
    exit /b 1
)

echo.
echo [3/5] Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install frontend dependencies
    exit /b 1
)

echo.
echo [4/5] Setting up environment files...
cd ..
if not exist backend\.env (
    copy backend\.env.example backend\.env
    echo Created backend\.env - Please configure your API keys
)
if not exist frontend\.env (
    copy frontend\.env.example frontend\.env
    echo Created frontend\.env
)

echo.
echo [5/5] Initializing database...
cd backend
call npm run init-db
if %errorlevel% neq 0 (
    echo Error: Failed to initialize database
    exit /b 1
)

cd ..
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure API keys in backend\.env
echo 2. Start backend: cd backend ^&^& npm run dev
echo 3. Start frontend: cd frontend ^&^& npm start
echo.
echo Default login:
echo   Email: admin@example.com
echo   Password: admin123
echo.
pause
