#!/bin/bash

# Production Startup Script for Backend
# This script sets up and starts the backend server in production mode

echo "🚀 Starting BEM FSRD ISI Backend in Production Mode..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file with production configuration."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --production
fi

# Create uploads directory if it doesn't exist
if [ ! -d "uploads" ]; then
    echo "📁 Creating uploads directory..."
    mkdir -p uploads/{news,gallery,programs,events,organization,hero-slider,chairman,about,avatars,general}
fi

# Create logs directory if it doesn't exist
if [ ! -d "logs" ]; then
    echo "📁 Creating logs directory..."
    mkdir -p logs
fi

# Set NODE_ENV to production
export NODE_ENV=production

# Check if PM2 is installed
if command -v pm2 &> /dev/null; then
    echo "✅ PM2 detected. Starting with PM2..."
    
    # Check if ecosystem.config.js exists
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js --env production
    else
        pm2 start server.js --name "bem-backend" --env production
    fi
    
    echo "✅ Backend started with PM2!"
    echo "📊 Use 'pm2 status' to check status"
    echo "📋 Use 'pm2 logs bem-backend' to view logs"
else
    echo "⚠️  PM2 not found. Starting with node..."
    echo "💡 Install PM2 for better process management: npm install -g pm2"
    node server.js
fi

