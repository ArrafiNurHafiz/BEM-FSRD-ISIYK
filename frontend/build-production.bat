@echo off
REM Production Build Script for Frontend (Windows)
REM This script builds the frontend for production deployment

echo Building BEM FSRD ISI Frontend for Production...

REM Check if .env file exists
if not exist .env (
    echo Warning: .env file not found!
    echo Creating .env file with default values...
    echo VITE_API_URL=http://localhost:5000/api > .env
    echo Please update .env file with production API URL!
)

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

REM Set NODE_ENV to production
set NODE_ENV=production

REM Clean previous build
if exist dist (
    echo Cleaning previous build...
    rmdir /s /q dist
)

REM Build for production
echo Building for production...
call npm run build

REM Check if build was successful
if exist dist (
    echo Build successful!
    echo Build files are in: %CD%\dist
    echo.
    echo Next steps:
    echo 1. Copy dist folder to your web server
    echo 2. Configure web server to serve static files from dist
    echo 3. Configure reverse proxy for /api requests to backend
) else (
    echo Build failed!
    exit /b 1
)

