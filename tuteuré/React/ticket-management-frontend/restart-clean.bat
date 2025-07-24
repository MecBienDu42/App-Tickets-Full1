@echo off
echo Cleaning React application...
echo.
echo Step 1: Stopping any running React processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Step 2: Clearing npm cache...
npm cache clean --force

echo Step 3: Installing dependencies...
npm install

echo Step 4: Starting React application...
echo.
echo ========================================
echo React App Starting Clean
echo ========================================
echo.
echo Open your browser and go to: http://localhost:3000
echo In the browser console, run: localStorage.clear()
echo Then refresh the page to start fresh
echo.
echo Login credentials:
echo Admin: admin@test.com / password
echo Agent: agent@test.com / password
echo.

npm start
