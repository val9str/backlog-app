@echo off
echo Checking Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo Node.js не найден. Установите Node.js с https://nodejs.org
    pause
    exit /b
)

if not exist node_modules (
    echo Устанавливаю зависимости...
    npm install
)

start http://localhost:3000
node server.js
pause

