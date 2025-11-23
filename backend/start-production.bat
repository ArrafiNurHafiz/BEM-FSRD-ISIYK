@echo off
REM Production Startup Script for Backend (Windows)
REM This script sets up and starts the backend server in production mode

echo Starting BEM FSRD ISI Backend in Production Mode...

REM Check if .env file exists
if not exist .env (
    echo Error: .env file not found!
    echo Please create .env file with production configuration.
    exit /b 1
)

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    call npm install --production
)

REM Create uploads directory if it doesn't exist
if not exist uploads (
    echo Creating uploads directory...
    mkdir uploads\news
    mkdir uploads\gallery
    mkdir uploads\programs
    mkdir uploads\events
    mkdir uploads\organization
    mkdir uploads\hero-slider
    mkdir uploads\chairman
    mkdir uploads\about
    mkdir uploads\avatars
    mkdir uploads\general
)

REM Create logs directory if it doesn't exist
if not exist logs (
    echo Creating logs directory...
    mkdir logs
)

REM Set NODE_ENV to production
set NODE_ENV=production

REM Check if PM2 is installed
where pm2 >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo PM2 detected. Starting with PM2...
    
    REM Check if ecosystem.config.js exists
    if exist ecosystem.config.js (
        call pm2 start ecosystem.config.js --env production
    ) else (
        call pm2 start server.js --name "bem-backend" --env production
    )
    
    echo Backend started with PM2!
    echo Use 'pm2 status' to check status
    echo Use 'pm2 logs bem-backend' to view logs
) else (
    echo PM2 not found. Starting with node...
    echo Install PM2 for better process management: npm install -g pm2
    node server.js
)

